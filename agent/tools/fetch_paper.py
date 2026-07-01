"""fetch_paper tool — retrieves a research paper by arXiv ID, DOI, or URL."""

import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from typing import Optional

import requests


class PaywallError(Exception):
    pass


class ParseError(Exception):
    pass


class NotFoundError(Exception):
    pass


ARXIV_ABSTRACT_URL = "https://export.arxiv.org/abs/{id}"
ARXIV_API_URL = "https://export.arxiv.org/api/query?id_list={id}"
ARXIV_ID_RE = re.compile(r"(?:arxiv[:\s/])?(\d{4}\.\d{4,5}(?:v\d+)?)", re.IGNORECASE)


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


def fetch_paper(url_or_id: str) -> dict:
    """
    Fetch a research paper by arXiv ID, DOI, or URL.

    Returns a structured dict per the architecture API contract.
    Raises PaywallError, ParseError, or NotFoundError on failure.
    """
    arxiv_id = _extract_arxiv_id(url_or_id)
    if arxiv_id:
        return _fetch_arxiv(arxiv_id)

    # Minimal DOI/URL fallback: return NotFoundError for now (Phase 1A scope)
    raise NotFoundError(
        f"Could not resolve '{url_or_id}'. "
        "Currently only arXiv IDs and arXiv URLs are supported."
    )
