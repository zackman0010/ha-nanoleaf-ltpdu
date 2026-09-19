"""
Tests for __init__.py's _resolve_strips() — the scene-editor panel's strip picker
data source. Fakes `hass.config_entries` and the entity registry rather than
bootstrapping the real subsystems on a bare hass — see test_config_flow.py's
`_FakeConfigEntries`/`_FakeConfigEntry` for the same established pattern (a bare
`HomeAssistant()` doesn't have a working `hass.config_entries` at all, and the full
`pytest_homeassistant_custom_component` fixture chain is avoided project-wide — see
test_coordinator.py's module docstring for why).
"""
from __future__ import annotations

import tempfile
from unittest.mock import patch

import pytest

from homeassistant.core import HomeAssistant

from custom_components.nanoleaf_ltpdu import _resolve_strips
from custom_components.nanoleaf_ltpdu.const import CONF_LABEL_ID, DOMAIN


@pytest.fixture
async def hass():
    instance = HomeAssistant(tempfile.mkdtemp())
    yield instance
    await instance.async_stop()


class _FakeConfigEntry:
    def __init__(self, label_id: str | None, title: str) -> None:
        # An ignored discovery (e.g. a device already set up via a different
        # integration) is a real config entry with empty data — no label_id.
        self.data = {CONF_LABEL_ID: label_id} if label_id is not None else {}
        self.title = title


class _FakeConfigEntries:
    def __init__(self, entries: list[_FakeConfigEntry]) -> None:
        self._entries = entries

    def async_entries(self, domain: str) -> list[_FakeConfigEntry]:
        return self._entries


class _FakeEntityRegistry:
    """label_id -> entity_id, standing in for the real registry's
    async_get_entity_id("light", DOMAIN, label_id) lookup."""

    def __init__(self, entity_ids_by_label: dict[str, str]) -> None:
        self._entity_ids_by_label = entity_ids_by_label

    def async_get_entity_id(self, domain: str, platform: str, unique_id: str) -> str | None:
        assert (domain, platform) == ("light", DOMAIN)
        return self._entity_ids_by_label.get(unique_id)


def _resolve_with(hass: HomeAssistant, entries: list[_FakeConfigEntry], entity_ids_by_label: dict[str, str]):
    hass.config_entries = _FakeConfigEntries(entries)  # type: ignore[assignment]
    with patch(
        "custom_components.nanoleaf_ltpdu.er.async_get",
        return_value=_FakeEntityRegistry(entity_ids_by_label),
    ):
        return _resolve_strips(hass)


def test_resolve_strips_returns_entity_id_and_title_per_entry(hass: HomeAssistant) -> None:
    entries = [
        _FakeConfigEntry("4SZ5", "SecretLab MagRGB 4SZ5"),
        _FakeConfigEntry("3ZP3", "SecretLab MagRGB 3ZP3"),
    ]
    strips = _resolve_with(hass, entries, {"4SZ5": "light.4sz5", "3ZP3": "light.3zp3"})

    assert strips == {
        "light.4sz5": {"name": "SecretLab MagRGB 4SZ5"},
        "light.3zp3": {"name": "SecretLab MagRGB 3ZP3"},
    }


def test_resolve_strips_omits_entry_with_no_registered_entity(hass: HomeAssistant) -> None:
    entries = [_FakeConfigEntry("AB12", "Not yet set up")]
    assert _resolve_with(hass, entries, {}) == {}


def test_resolve_strips_empty_when_no_config_entries(hass: HomeAssistant) -> None:
    assert _resolve_with(hass, [], {}) == {}


def test_resolve_strips_skips_ignored_entry_with_no_label_id(hass: HomeAssistant) -> None:
    entries = [
        _FakeConfigEntry(None, "A19 Bulb (ignored)"),
        _FakeConfigEntry("4SZ5", "SecretLab MagRGB 4SZ5"),
    ]
    strips = _resolve_with(hass, entries, {"4SZ5": "light.4sz5"})

    assert strips == {"light.4sz5": {"name": "SecretLab MagRGB 4SZ5"}}
