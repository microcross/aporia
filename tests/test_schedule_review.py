"""Tests for schedule_review tool."""

from datetime import datetime, timezone
from unittest.mock import patch

import pytest

from agent.tools.schedule_review import schedule_review, InvalidRatingError


def _utc_today():
    return datetime.now(timezone.utc).date().isoformat()


@pytest.fixture
def persisted(monkeypatch):
    """Capture the delta passed to update_user_model instead of writing to disk."""
    captured = {}

    def fake_update(user_id, delta):
        captured["user_id"] = user_id
        captured["delta"] = delta
        return delta

    with patch("agent.tools.schedule_review.update_user_model", side_effect=fake_update):
        yield captured


def test_new_concept_returns_next_review(persisted):
    result = schedule_review("alice", "diffusion-models", "forward-process", None, rating=3)
    assert result["next_review_date"] >= _utc_today()
    assert result["interval_days"] >= 0
    assert result["updated_card_state"]["reps"] == 1


def test_easy_rating_schedules_further_out_than_again(persisted):
    easy = schedule_review("alice", "t", "c", None, rating=4)
    again = schedule_review("alice", "t", "c", None, rating=1)
    assert easy["next_review_date"] > again["next_review_date"]


def test_card_state_round_trips(persisted):
    first = schedule_review("alice", "t", "c", None, rating=3)
    second = schedule_review("alice", "t", "c", first["updated_card_state"], rating=3)
    assert second["updated_card_state"]["reps"] == 2


def test_persists_to_user_model(persisted):
    schedule_review("bob", "quantum", "entanglement", None, rating=3)
    assert persisted["user_id"] == "bob"
    concept = persisted["delta"]["topics"]["quantum"]["concepts"]["entanglement"]
    assert "fsrs_card_state" in concept
    assert concept["next_review"] >= _utc_today()
    assert concept["last_assessed"] == _utc_today()


def test_invalid_rating_raises(persisted):
    with pytest.raises(InvalidRatingError):
        schedule_review("alice", "t", "c", None, rating=5)
    with pytest.raises(InvalidRatingError):
        schedule_review("alice", "t", "c", None, rating=0)
