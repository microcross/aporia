"""User model persistence — get_user_model and update_user_model tools."""

import copy
import json
import os
from datetime import date
from pathlib import Path
from typing import Any

USER_DATA_DIR = os.getenv("USER_DATA_DIR", "./agent/memory/users")

SCHEMA_VERSION = 1


class ValidationError(Exception):
    pass


def _user_path(user_id: str) -> Path:
    safe = "".join(c if c.isalnum() or c in "-_." else "_" for c in user_id)
    return Path(USER_DATA_DIR) / f"{safe}.json"


def _empty_model(user_id: str) -> dict:
    today = date.today().isoformat()
    return {
        "schema_version": SCHEMA_VERSION,
        "user_id": user_id,
        "created": today,
        "last_updated": today,
        "profile": {
            "preferred_explanation_style": None,
            "preferred_session_length": None,
            "learning_velocity": None,
            "notes": "",
        },
        "topics": {},
        "cross_topic_connections": [],
        "total_xp": 0,
        "total_sessions": 0,
        "current_streak": 0,
        "longest_streak": 0,
        "badges": [],
    }


def _deep_merge(base: Any, delta: Any) -> Any:
    """Recursively merge delta into base. Lists are replaced, not appended."""
    if isinstance(base, dict) and isinstance(delta, dict):
        result = copy.deepcopy(base)
        for key, value in delta.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = _deep_merge(result[key], value)
            else:
                result[key] = copy.deepcopy(value)
        return result
    return copy.deepcopy(delta)


def get_user_model(user_id: str) -> dict:
    """
    Load a user's model from disk. Creates a new empty model if not found.

    Returns the full user model dict.
    """
    path = _user_path(user_id)
    if not path.exists():
        return _empty_model(user_id)

    try:
        with path.open("r", encoding="utf-8") as f:
            model = json.load(f)
    except (json.JSONDecodeError, OSError) as exc:
        raise ValidationError(f"Could not read user model for '{user_id}': {exc}") from exc

    # Migrate older models lacking schema_version
    if "schema_version" not in model:
        model["schema_version"] = SCHEMA_VERSION

    return model


def update_user_model(user_id: str, delta: dict) -> dict:
    """
    Deep-merge delta into the existing user model and persist to disk.

    Always updates last_updated to today. Returns the updated model.
    Raises ValidationError if delta is not a dict.
    """
    if not isinstance(delta, dict):
        raise ValidationError("delta must be a dict")

    model = get_user_model(user_id)
    updated = _deep_merge(model, delta)
    updated["last_updated"] = date.today().isoformat()
    updated["user_id"] = user_id  # prevent accidental overwrite

    path = _user_path(user_id)
    path.parent.mkdir(parents=True, exist_ok=True)

    tmp_path = path.with_suffix(".json.tmp")
    try:
        with tmp_path.open("w", encoding="utf-8") as f:
            json.dump(updated, f, indent=2, ensure_ascii=False)
        tmp_path.replace(path)
    except OSError as exc:
        raise ValidationError(f"Could not write user model for '{user_id}': {exc}") from exc

    return updated
