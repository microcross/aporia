"""search_papers tool — finds research papers via Semantic Scholar."""

import os
import time
from typing import Optional

import requests

SEMANTIC_SCHOLAR_URL = (
    "https://api.semanticscholar.org/graph/v1/paper/search"
)
FIELDS = "title,authors,abstract,citationCount,year,url,externalIds"


class NicheTopicError(Exception):
    pass


class APIError(Exception):
    pass


def _build_headers() -> dict:
    key = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")
    return {"x-api-key": key} if key else {}


def _do_request(params: dict) -> list[dict]:
    headers = _build_headers()
    resp = requests.get(SEMANTIC_SCHOLAR_URL, params=params, headers=headers, timeout=15)
    if resp.status_code == 429:
        raise APIError("Semantic Scholar rate limit hit")
    resp.raise_for_status()
    return resp.json().get("data", [])


def search_papers(
    topic: str,
    level: int,
    limit: int = 5,
    source: str = "semantic_scholar",
) -> list[dict]:
    """
    Search for research papers on a topic.

    level (1-5) is stored in results for caller use but doesn't filter here —
    the agent decides which papers suit the user's level from the returned metadata.

    Raises NicheTopicError if fewer than 3 results have citation_count >= 50.
    Raises APIError after one retry on transient failures.
    """
    params = {
        "query": topic,
        "fields": FIELDS,
        "limit": max(limit, 10),  # fetch more so we can filter
    }

    try:
        data = _do_request(params)
    except APIError:
        raise
    except Exception as exc:
        # Retry once
        time.sleep(1)
        try:
            data = _do_request(params)
        except Exception:
            raise APIError(f"Semantic Scholar API error: {exc}") from exc

    results = []
    for item in data:
        authors = [a.get("name", "") for a in item.get("authors", [])]
        ext_ids = item.get("externalIds") or {}
        arxiv_id = ext_ids.get("ArXiv")
        paper_id = (
            f"arxiv:{arxiv_id}" if arxiv_id else item.get("paperId", "")
        )
        results.append(
            {
                "paper_id": paper_id,
                "title": item.get("title", ""),
                "authors": authors,
                "abstract": item.get("abstract") or "",
                "url": item.get("url") or "",
                "citation_count": item.get("citationCount") or 0,
                "year": item.get("year") or 0,
                "relevance_score": 0.0,  # S2 doesn't expose a score; agent ranks
            }
        )

    # Niche topic check
    high_cited = [r for r in results if r["citation_count"] >= 50]
    if len(high_cited) < 3:
        raise NicheTopicError(
            f"Topic '{topic}' appears niche — fewer than 3 papers with 50+ citations found. "
            "Try broadening the topic or I can attempt a search on a related area."
        )

    # Return top `limit` by citation count as a proxy for quality
    results.sort(key=lambda r: r["citation_count"], reverse=True)
    return results[:limit]
