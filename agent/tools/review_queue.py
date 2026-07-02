"""Review queue logic — surfaces concepts due for spaced review at session start."""

from datetime import datetime, timezone
from typing import Optional


def check_review_queue(user_model: dict, topic: Optional[str] = None) -> list:
    """
    Scan a user model for concepts whose next_review date has passed.

    If topic is given, only that topic is scanned; otherwise all topics.
    Returns a list of due concepts sorted by days overdue (most overdue first):

        [{ topic, topic_name, concept, concept_name, next_review,
           days_overdue, confidence }]
    """
    today = datetime.now(timezone.utc).date()
    due = []

    topics = user_model.get("topics", {})
    if topic is not None:
        topics = {topic: topics[topic]} if topic in topics else {}

    for topic_slug, topic_data in topics.items():
        for concept_slug, concept in topic_data.get("concepts", {}).items():
            next_review = concept.get("next_review")
            if not next_review:
                continue
            try:
                review_date = datetime.fromisoformat(next_review).date()
            except ValueError:
                continue  # malformed date — skip rather than crash session start
            if review_date <= today:
                due.append(
                    {
                        "topic": topic_slug,
                        "topic_name": topic_data.get("name", topic_slug),
                        "concept": concept_slug,
                        "concept_name": concept.get("name", concept_slug),
                        "next_review": next_review,
                        "days_overdue": (today - review_date).days,
                        "confidence": concept.get("confidence"),
                    }
                )

    due.sort(key=lambda d: d["days_overdue"], reverse=True)
    return due
