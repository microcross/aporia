"""Tests for fetch_paper tool."""

from unittest.mock import patch, MagicMock
import pytest

from agent.tools.fetch_paper import fetch_paper, NotFoundError, _extract_arxiv_id

FAKE_ARXIV_RESPONSE = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:arxiv="http://arxiv.org/schemas/atom">
  <entry>
    <title>Attention Is All You Need</title>
    <summary>The dominant sequence transduction models are based on complex recurrent...</summary>
    <published>2017-06-12T00:00:00Z</published>
    <author><name>Ashish Vaswani</name></author>
    <author><name>Noam Shazeer</name></author>
  </entry>
</feed>"""


def test_extract_arxiv_id_bare():
    assert _extract_arxiv_id("1706.03762") == "1706.03762"


def test_extract_arxiv_id_with_prefix():
    assert _extract_arxiv_id("arxiv:1706.03762") == "1706.03762"


def test_extract_arxiv_id_url():
    assert _extract_arxiv_id("https://arxiv.org/abs/1706.03762") == "1706.03762"


def test_extract_arxiv_id_none():
    assert _extract_arxiv_id("https://openreview.net/forum?id=abc") is None


def test_fetch_paper_arxiv_success():
    mock_resp = MagicMock()
    mock_resp.text = FAKE_ARXIV_RESPONSE
    mock_resp.raise_for_status = MagicMock()

    with patch("agent.tools.fetch_paper.requests.get", return_value=mock_resp):
        result = fetch_paper("1706.03762")

    assert result["paper_id"] == "arxiv:1706.03762"
    assert result["title"] == "Attention Is All You Need"
    assert "Ashish Vaswani" in result["authors"]
    assert result["source"] == "arxiv"
    assert result["publication_date"] == "2017-06-12"
    assert len(result["sections"]) == 1


def test_fetch_paper_not_found_for_non_arxiv():
    with pytest.raises(NotFoundError):
        fetch_paper("https://openreview.net/forum?id=unknown")
