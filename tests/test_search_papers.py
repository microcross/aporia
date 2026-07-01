"""Tests for search_papers tool."""

from unittest.mock import patch, MagicMock
import pytest

from agent.tools.search_papers import search_papers, NicheTopicError, APIError

FAKE_S2_RESPONSE = {
    "data": [
        {
            "paperId": "abc1",
            "title": "Attention Is All You Need",
            "authors": [{"name": "Vaswani et al."}],
            "abstract": "Transformer architecture paper.",
            "citationCount": 90000,
            "year": 2017,
            "url": "https://arxiv.org/abs/1706.03762",
            "externalIds": {"ArXiv": "1706.03762"},
        },
        {
            "paperId": "abc2",
            "title": "BERT: Pre-training of Deep Bidirectional Transformers",
            "authors": [{"name": "Devlin et al."}],
            "abstract": "BERT paper.",
            "citationCount": 50000,
            "year": 2018,
            "url": "https://arxiv.org/abs/1810.04805",
            "externalIds": {"ArXiv": "1810.04805"},
        },
        {
            "paperId": "abc3",
            "title": "GPT-3: Language Models are Few-Shot Learners",
            "authors": [{"name": "Brown et al."}],
            "abstract": "GPT-3 paper.",
            "citationCount": 30000,
            "year": 2020,
            "url": "https://arxiv.org/abs/2005.14165",
            "externalIds": {"ArXiv": "2005.14165"},
        },
    ]
}

FAKE_NICHE_RESPONSE = {
    "data": [
        {
            "paperId": "x1",
            "title": "Obscure Paper",
            "authors": [],
            "abstract": "",
            "citationCount": 2,
            "year": 2023,
            "url": "",
            "externalIds": {},
        }
    ]
}


def _mock_get(response_json):
    mock_resp = MagicMock()
    mock_resp.json.return_value = response_json
    mock_resp.status_code = 200
    mock_resp.raise_for_status = MagicMock()
    return mock_resp


def test_search_papers_returns_results():
    with patch("agent.tools.search_papers.requests.get", return_value=_mock_get(FAKE_S2_RESPONSE)):
        results = search_papers("transformers", level=3, limit=2)

    assert len(results) == 2
    assert results[0]["citation_count"] >= results[1]["citation_count"]
    assert results[0]["paper_id"] == "arxiv:1706.03762"


def test_search_papers_niche_topic_raises():
    with patch("agent.tools.search_papers.requests.get", return_value=_mock_get(FAKE_NICHE_RESPONSE)):
        with pytest.raises(NicheTopicError):
            search_papers("very obscure niche topic", level=3)


def test_search_papers_includes_required_fields():
    with patch("agent.tools.search_papers.requests.get", return_value=_mock_get(FAKE_S2_RESPONSE)):
        results = search_papers("transformers", level=2)

    required = {"paper_id", "title", "authors", "abstract", "url", "citation_count", "year", "relevance_score"}
    for r in results:
        assert required.issubset(r.keys())
