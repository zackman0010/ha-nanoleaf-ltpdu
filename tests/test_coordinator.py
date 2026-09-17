"""
Tests for coordinator.py — NanoleafLtpduRuntime's lock/executor wrapping, the
per-config-entry scene registry, and reconnect-on-failure behavior.

Uses a bare `homeassistant.core.HomeAssistant()` instance plus
`pytest_homeassistant_custom_component.common.MockConfigEntry` directly, not the
`pytest_homeassistant_custom_component` pytest plugin — that plugin's fixture chain
does `import fcntl` unconditionally, a POSIX-only stdlib module unavailable on native
Windows. Bare `HomeAssistant()` + `MockConfigEntry` both work cross-platform, just
without the full HA test harness's entity-registry/state-machine conveniences.
tests/test_light.py takes the same approach.
"""
from __future__ import annotations

import asyncio
import tempfile

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.nanoleaf_ltpdu.const import (
    CONF_AUTH_TOKEN,
    CONF_HOST,
    CONF_LABEL_ID,
    DOMAIN,
    RESERVED_SCENE_NAMES,
)
from custom_components.nanoleaf_ltpdu.coordinator import NanoleafLtpduCoordinator, NanoleafLtpduRuntime
from custom_components.nanoleaf_ltpdu.protocol.device import DeviceError


@pytest.fixture
async def hass():
    """Bare HomeAssistant instance — see module docstring for why not the full fixture."""
    instance = HomeAssistant(tempfile.mkdtemp())
    yield instance
    await instance.async_stop()


@pytest.fixture
def config_entry() -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        unique_id="AB12",
        data={CONF_LABEL_ID: "AB12", CONF_HOST: "::1", CONF_AUTH_TOKEN: "00112233445566778899aabbccddeeff"},  # gitleaks:allow
    )


class _FakeDevice:
    """Stands in for protocol.device.Device — records calls, no real socket I/O."""

    def __init__(self) -> None:
        self.connect_calls = 0
        self.authenticate_calls = 0
        self.get_state_calls = 0
        self.fail_connect_times = 0
        self.call_order: list[str] = []

    def connect(self) -> None:
        self.connect_calls += 1
        self.call_order.append("connect")
        if self.fail_connect_times > 0:
            self.fail_connect_times -= 1
            raise DeviceError("simulated handshake failure")

    def authenticate(self) -> None:
        self.authenticate_calls += 1
        self.call_order.append("authenticate")

    def get_state(self) -> list[dict]:
        self.get_state_calls += 1
        self.call_order.append("get_state")
        return [{"path": "lb/0/oo", "op": "current", "value": 1}]

    def close(self) -> None:
        pass


async def test_runtime_serializes_overlapping_calls_via_lock(hass: HomeAssistant) -> None:
    """Two overlapping calls against one Device must not interleave — see
    coordinator.py's NanoleafLtpduRuntime docstring for why (AES-CTR keystream
    desync risk on a real device, not just a theoretical race)."""
    fake = _FakeDevice()
    runtime = NanoleafLtpduRuntime(hass, fake)  # type: ignore[arg-type]

    order: list[str] = []

    real_get_state = fake.get_state

    def slow_get_state() -> list[dict]:
        order.append("get_state:start")
        result = real_get_state()
        order.append("get_state:end")
        return result

    def fast_authenticate() -> None:
        order.append("authenticate:start")
        order.append("authenticate:end")

    fake.get_state = slow_get_state  # type: ignore[method-assign]
    fake.authenticate = fast_authenticate  # type: ignore[method-assign]

    # Fire both concurrently — without the lock, "authenticate" could interleave
    # between get_state's start and end.
    await asyncio.gather(runtime.get_state(), runtime.authenticate())

    # Whichever ran first, it must fully complete (start AND end adjacent) before the
    # other one's start appears — no interleaving.
    assert order in (
        ["get_state:start", "get_state:end", "authenticate:start", "authenticate:end"],
        ["authenticate:start", "authenticate:end", "get_state:start", "get_state:end"],
    )


async def test_coordinator_reconnects_after_failure(hass: HomeAssistant, config_entry: MockConfigEntry) -> None:
    coordinator = NanoleafLtpduCoordinator(hass, config_entry)
    fake = _FakeDevice()
    fake.fail_connect_times = 1  # first connect() attempt fails, second succeeds
    coordinator._device = fake  # type: ignore[attr-defined]
    coordinator.runtime = NanoleafLtpduRuntime(hass, fake)  # type: ignore[arg-type]

    with pytest.raises(Exception):  # noqa: B017 — UpdateFailed, but we're calling the private method directly
        await coordinator._async_update_data()
    assert coordinator._connected is False
    assert fake.connect_calls == 1
    assert fake.authenticate_calls == 0  # never reached — connect() raised first

    # Next cycle: connect() succeeds this time, authenticate + get_state proceed.
    data = await coordinator._async_update_data()
    assert coordinator._connected is True
    assert fake.connect_calls == 2
    assert fake.authenticate_calls == 1
    assert data == {"records": [{"path": "lb/0/oo", "op": "current", "value": 1}]}


async def test_coordinator_does_not_reconnect_when_already_connected(hass: HomeAssistant, config_entry: MockConfigEntry) -> None:
    coordinator = NanoleafLtpduCoordinator(hass, config_entry)
    fake = _FakeDevice()
    coordinator._device = fake  # type: ignore[attr-defined]
    coordinator.runtime = NanoleafLtpduRuntime(hass, fake)  # type: ignore[arg-type]

    await coordinator._async_update_data()
    await coordinator._async_update_data()
    assert fake.connect_calls == 1  # only the first cycle re-handshakes
    assert fake.authenticate_calls == 1
    assert fake.get_state_calls == 2


async def test_scene_registry_reserved_and_allocated_ids(hass: HomeAssistant, config_entry: MockConfigEntry) -> None:
    coordinator = NanoleafLtpduCoordinator(hass, config_entry)
    await coordinator.async_load_scene_registry()

    # Reserved factory scenes are present from the start, with no allocation call.
    assert coordinator.scenes["Northern Lights"] == next(iter(RESERVED_SCENE_NAMES))

    first_id = await coordinator.async_allocate_scene_id("Sunset")
    second_id = await coordinator.async_allocate_scene_id("Ocean")
    assert first_id == 1
    assert second_id == 2
    assert coordinator.scenes["Sunset"] == 1
    assert coordinator.scenes["Ocean"] == 2

    # Re-allocating an existing name returns the same ID, doesn't consume a new one.
    assert await coordinator.async_allocate_scene_id("Sunset") == 1

    await coordinator.async_delete_scene("Sunset")
    assert "Sunset" not in coordinator.scenes

    with pytest.raises(ValueError):
        await coordinator.async_delete_scene("Northern Lights")  # reserved, not deletable


async def test_scene_registry_persists_across_reload(hass: HomeAssistant, config_entry: MockConfigEntry) -> None:
    coordinator_a = NanoleafLtpduCoordinator(hass, config_entry)
    await coordinator_a.async_load_scene_registry()
    await coordinator_a.async_allocate_scene_id("Sunset")

    coordinator_b = NanoleafLtpduCoordinator(hass, config_entry)
    await coordinator_b.async_load_scene_registry()
    assert coordinator_b.scenes["Sunset"] == 1
