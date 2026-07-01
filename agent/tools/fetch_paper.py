"""fetch_paper tool — retrieves a research paper by arXiv ID, DOI, or URL."""

import re
import xml.etree.ElementTree as ET
from typing import Optional

import requests


class PaywallError(Exception):
    pass


class ParseError(Exception):
    pass


class NotFoundError(Exception):
    pass


ARXIV_API_URL = "https://export.arxiv.org/api/query?id_list={id}"
ARXIV_ID_RE = re.compile(r"(?:arxiv[:\s/])?(\d{4}\.\d{4,5}(?:v\d+)?)", re.IGNORECASE)

# Tags whose text content forms the main article body
_CONTENT_TAGS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "td"}
# Tags that indicate a paywall
_PAYWALL_PHRASES = [
    "purchase access",
    "buy this article",
    "subscribe to read",
    "log in to access",
    "institutional access",
    "full text available to subscribers",
]


def _extract_arxiv_id(url_or_id: str) -> Optional[str]:
    m = ARXIV_ID_RE.search(url_or_id)
    return m.group(1) if m else None


def _fetch_arxiv(arxiv_id: str) -> dict:
    resp = requests.get(ARXIV_API_URL.format(id=arxiv_id), timeout=10)
    resp.raise_for_status()

    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "arxiv": "http://arxiv.org/schemas/atom",
    }
    root = ET.fromstring(resp.text)
    entry = root.find("atom:entry", ns)
    if entry is None:
        raise NotFoundError(f"arXiv paper not found: {arxiv_id}")

    title = (entry.findtext("atom:title", "", ns) or "").strip().replace("\n", " ")
    abstract = (entry.findtext("atom:summary", "", ns) or "").strip()
    published = (entry.findtext("atom:published", "", ns) or "")[:10]

    authors = [
        a.findtext("atom:name", "", ns)
        for a in entry.findall("atom:author", ns)
    ]

    # Build sections from abstract only (full PDF parse is out of scope for Phase 1A)
    sections = [{"heading": "Abstract", "content": abstract}]

    return {
        "paper_id": f"arxiv:{arxiv_id}",
        "title": title,
        "authors": authors,
        "abstract": abstract,
        "sections": sections,
        "full_text": abstract,
        "publication_date": published,
        "source": "arxiv",
    }


def _fetch_url(url: str) -> dict:
    """Scrape a generic URL and extract readable text. Raises PaywallError if detected."""
    try:
        resp = requests.get(
            url,
            timeout=15,
            headers={"User-Agent": "Aporia-Research-Agent/0.1 (educational use)"},
        )
        resp.raise_for_status()
    except requests.HTTPError as exc:
        if exc.response is not None and exc.response.status_code in (401, 403):
            raise PaywallError(f"Access denied for {url} — likely paywalled.") from exc
        raise NotFoundError(f"Could not retrieve {url}: {exc}") from exc

    content_type = resp.headers.get("content-type", "")
    if "html" not in content_type:
        # Return raw text for non-HTML (e.g. plain text papers)
        return {
            "paper_id": url,
            "title": url,
            "authors": [],
            "abstract": "",
            "sections": [{"heading": "Content", "content": resp.text[:50000]}],
            "full_text": resp.text[:50000],
            "publication_date": "",
            "source": "web",
        }

    # Minimal HTML → text extraction without a heavy dependency
    try:
        text = _html_to_text(resp.text)
    except Exception as exc:
        raise ParseError(f"Could not parse HTML from {url}: {exc}") from exc

    lower = text.lower()
    for phrase in _PAYWALL_PHRASES:
        if phrase in lower:
            raise PaywallError(
                f"This page appears to be paywalled ('{phrase}' detected). "
                "I can show you the abstract if available."
            )

    if len(text.strip()) < 200:
        raise ParseError(f"Extracted text from {url} is too short to be useful.")

    # Try to extract a title from <title> tag
    title_match = re.search(r"<title[^>]*>(.*?)</title>", resp.text, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else url

    return {
        "paper_id": url,
        "title": title,
        "authors": [],
        "abstract": "",
        "sections": [{"heading": "Content", "content": text}],
        "full_text": text,
        "publication_date": "",
        "source": "web",
    }


def _html_to_text(html: str) -> str:
    """Extract readable text from HTML by walking tags. No external deps."""
    # Strip scripts and styles first
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", html, flags=re.DOTALL | re.IGNORECASE)
    # Remove all tags, collapse whitespace
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"&#\d+;", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:100000]  # cap at ~100k chars


def fetch_paper(url_or_id: str) -> dict:
    """
    Fetch a research paper by arXiv ID, DOI, or URL.

    Returns a structured dict per the architecture API contract.
    Raises PaywallError, ParseError, or NotFoundError on failure.
    """
    arxiv_id = _extract_arxiv_id(url_or_id)
    if arxiv_id:
        return _fetch_arxiv(arxiv_id)

    # Generic URL fallback for non-arXiv sources
    if url_or_id.startswith(("http://", "https://")):
        return _fetch_url(url_or_id)

    raise NotFoundError(
        f"Could not resolve '{url_or_id}'. "
        "Provide an arXiv ID (e.g. 2305.10601) or a full URL."
    )
