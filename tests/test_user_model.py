"""Tests for user_model tool."""

import json
import pytest
from pathlib import Path

from agent.tools.user_model import get_user_model, update_user_model, ValidationError, _deep_merge


# --- unit tests for deep merge ---

def test_deep_merge_flat():
    base = {"a": 1, "b": 2}
    delta = {"b": 99, "c": 3}
    result = _deep_merge(base, delta)
    assert result == {"a": 1, "b": 99, "c": 3}


def test_deep_merge_nested():
    base = {"profile": {"style": "analogy", "notes": "original"}}
    delta = {"profile": {"notes": "updated"}}
    result = _deep_merge(base, delta)
    assert result["profile"]["style"] == "analogy"
    assert result["profile"]["notes"] == "updated"


def test_deep_merge_list_replaced():
    base = {"badges": ["first_paper"]}
    delta = {"badges": ["first_paper", "level_up"]}
    result = _deep_merge(base, delta)
    assert result["badges"] == ["first_paper", "level_up"]


def test_deep_merge_does_not_mutate_base():
    base = {"a": {"b": 1}}
    _deep_merge(base, {"a": {"b": 2}})
    assert base["a"]["b"] == 1


# --- integration tests using tmp dir ---

@pytest.fixture
def user_dir(tmp_path, monkeypatch):
    monkeypatch.setenv("USER_DATA_DIR", str(tmp_path))
    # Reload to pick up new env var
    import importlib
    import agent.tools.user_model as um
    importlib.reload(um)
    return tmp_path


def _reload_tools(tmp_path, monkeypatch):
    monkeypatch.setenv("USER_DATA_DIR", str(tmp_path))
    import importlib
    import agent.tools.user_model as um
    importlib.reload(um)
    return um


def test_get_user_model_new_user(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    model = um.get_user_model("alice")
    assert model["user_id"] == "alice"
    assert model["total_xp"] == 0
    assert model["topics"] == {}
    assert "schema_version" in model


def test_get_user_model_existing(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    um.update_user_model("bob", {"total_xp": 100})
    model = um.get_user_model("bob")
    assert model["total_xp"] == 100


def test_update_user_model_persists(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    um.update_user_model("carol", {"total_xp": 50, "badges": ["first_paper"]})
    # Simulate fresh load
    path = tmp_path / "carol.json"
    on_disk = json.loads(path.read_text())
    assert on_disk["total_xp"] == 50
    assert "first_paper" in on_disk["badges"]


def test_update_user_model_deep_merge(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    um.update_user_model("dave", {"profile": {"notes": "fast learner"}})
    um.update_user_model("dave", {"profile": {"learning_velocity": "fast"}})
    model = um.get_user_model("dave")
    assert model["profile"]["notes"] == "fast learner"
    assert model["profile"]["learning_velocity"] == "fast"


def test_update_user_model_invalid_delta(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    with pytest.raises(um.ValidationError):
        um.update_user_model("eve", "not a dict")


def test_update_user_model_sets_last_updated(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    result = um.update_user_model("frank", {})
    assert result["last_updated"] is not None


def test_user_id_sanitized(tmp_path, monkeypatch):
    um = _reload_tools(tmp_path, monkeypatch)
    um.update_user_model("user@example.com", {"total_xp": 5})
    # File should exist with sanitized name
    files = list(tmp_path.iterdir())
    assert len(files) == 1
    assert "@" not in files[0].name
