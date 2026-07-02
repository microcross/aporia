"""Tests for review queue logic."""

from datetime import datetime, timedelta, timezone

from agent.tools.review_queue import check_review_queue


def _days_from_today(days: int) -> str:
    return (datetime.now(timezone.utc).date() + timedelta(days=days)).isoformat()


def _model(**concepts_by_topic):
    topics = {}
    for topic_slug, concepts in concepts_by_topic.items():
        topics[topic_slug] = {
            "name": topic_slug.replace("-", " ").title(),
            "concepts": concepts,
        }
    return {"user_id": "test", "topics": topics}


def test_empty_model_returns_no_reviews():
    assert check_review_queue({"topics": {}}) == []


def test_overdue_concept_is_returned():
    model = _model(quantum={"entanglement": {"name": "Entanglement", "next_review": _days_from_today(-3)}})
    due = check_review_queue(model)
    assert len(due) == 1
    assert due[0]["concept"] == "entanglement"
    assert due[0]["days_overdue"] == 3


def test_due_today_is_included():
    model = _model(quantum={"c": {"next_review": _days_from_today(0)}})
    assert len(check_review_queue(model)) == 1


def test_future_review_is_excluded():
    model = _model(quantum={"c": {"next_review": _days_from_today(5)}})
    assert check_review_queue(model) == []


def test_sorted_most_overdue_first():
    model = _model(
        quantum={
            "a": {"next_review": _days_from_today(-1)},
            "b": {"next_review": _days_from_today(-7)},
            "c": {"next_review": _days_from_today(-3)},
        }
    )
    due = check_review_queue(model)
    assert [d["concept"] for d in due] == ["b", "c", "a"]


def test_topic_filter():
    model = _model(
        quantum={"a": {"next_review": _days_from_today(-1)}},
        biology={"b": {"next_review": _days_from_today(-1)}},
    )
    due = check_review_queue(model, topic="biology")
    assert len(due) == 1
    assert due[0]["topic"] == "biology"


def test_concept_without_next_review_is_skipped():
    model = _model(quantum={"new-concept": {"name": "New", "confidence": "fuzzy"}})
    assert check_review_queue(model) == []


def test_malformed_date_is_skipped():
    model = _model(quantum={"bad": {"next_review": "not-a-date"}})
    assert check_review_queue(model) == []
