"""schedule_review tool — FSRS-based spaced repetition scheduling."""

from datetime import datetime, timezone
from typing import Optional

from fsrs import FSRS, Card, Rating

from agent.tools.user_model import update_user_model


class InvalidRatingError(Exception):
    pass


_RATINGS = {1: Rating.Again, 2: Rating.Hard, 3: Rating.Good, 4: Rating.Easy}

_scheduler = FSRS()


def schedule_review(
    user_id: str,
    topic: str,
    concept: str,
    fsrs_card_state: Optional[dict],
    rating: int,
) -> dict:
    """
    Calculate the next review date for a concept using FSRS.

    fsrs_card_state is the serialized Card dict from a previous review,
    or None for a concept being reviewed for the first time.
    rating: 1=Again, 2=Hard, 3=Good, 4=Easy.

    Persists the updated card state and next_review date to the user model,
    and returns { next_review_date, updated_card_state, interval_days }.
    """
    if rating not in _RATINGS:
        raise InvalidRatingError(f"rating must be 1-4, got {rating!r}")

    card = Card.from_dict(fsrs_card_state) if fsrs_card_state else Card()

    now = datetime.now(timezone.utc)
    result = _scheduler.repeat(card, now)
    updated_card = result[_RATINGS[rating]].card

    next_review_date = updated_card.due.date().isoformat()
    interval_days = max((updated_card.due - now).days, 0)

    update_user_model(
        user_id,
        {
            "topics": {
                topic: {
                    "concepts": {
                        concept: {
                            "fsrs_card_state": updated_card.to_dict(),
                            "next_review": next_review_date,
                            "last_assessed": now.date().isoformat(),
                        }
                    }
                }
            }
        },
    )

    return {
        "next_review_date": next_review_date,
        "updated_card_state": updated_card.to_dict(),
        "interval_days": interval_days,
    }
