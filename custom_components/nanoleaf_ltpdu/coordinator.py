"""DataUpdateCoordinator for a Nanoleaf LTPDU strip, plus the async wrapper around the
blocking, synchronous protocol.device.Device client.

Why wrap instead of rewriting device.py as native asyncio: device.py's socket I/O is
already correct and validated against real hardware (test_against_capture.py) — a
rewrite risks reintroducing that class of bug for no benefit, since
DataUpdateCoordinator polling doesn't need concurrent sockets.
"""
from __future__ import annotations

import asyncio
from functools import partial
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import (
    CONF_AUTH_TOKEN,
    CONF_HOST,
    CONF_PORT,
    DEFAULT_PORT,
    DOMAIN,
    LOGGER,
    MAX_ALLOCATABLE_SCENE_ID,
    MIN_ALLOCATABLE_SCENE_ID,
    RESERVED_SCENE_NAMES,
    UPDATE_INTERVAL,
)
from .protocol import device as protocol_device


class NanoleafLtpduRuntime:
    """Async wrapper serializing every call against one Device's one socket/session.

    The lock is load-bearing, not incidental: SessionCrypto.process() advances a
    stateful AES-CTR keystream, so two overlapping requests (e.g. a poll and a
    service call) would desync it with no visible exception — just silently
    corrupted decrypts from then on.
    """

    def __init__(self, hass: HomeAssistant, dev: protocol_device.Device) -> None:
        self._hass = hass
        self._device = dev
        self._lock = asyncio.Lock()

    async def _call(self, fn, *args: Any, **kwargs: Any) -> Any:
        async with self._lock:
            return await self._hass.async_add_executor_job(partial(fn, *args, **kwargs))

    async def connect(self) -> None:
        await self._call(self._device.connect)

    async def authenticate(self) -> None:
        await self._call(self._device.authenticate)

    async def get_state(self) -> list[dict]:
        return await self._call(self._device.get_state)

    async def set_power(self, on: bool) -> None:
        await self._call(self._device.set_power, on)

    async def set_color(self, hue_degrees: int, saturation_percent: int, brightness_percent: int | None = None) -> None:
        await self._call(self._device.set_color, hue_degrees, saturation_percent, brightness_percent)

    async def preview_scene(self, style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> None:
        await self._call(self._device.preview_scene, style_id, params, colors)

    async def save_scene(self, scene_id: int, style_id: int, params: bytes, colors: list[tuple[int, int, int]]) -> None:
        await self._call(self._device.save_scene, scene_id, style_id, params, colors)

    async def load_scene(self, scene_id: int) -> None:
        await self._call(self._device.load_scene, scene_id)

    async def list_scenes(self) -> list[int]:
        return await self._call(self._device.list_scenes)

    async def get_scene(self, scene_id: int) -> tuple[int, bytes, list[tuple[int, int, int]]]:
        return await self._call(self._device.get_scene, scene_id)

    async def delete_scene(self, scene_id: int) -> None:
        await self._call(self._device.delete_scene, scene_id)

    async def get_current_scene(self) -> int:
        return await self._call(self._device.get_current_scene)

    def close(self) -> None:
        self._device.close()


class NanoleafLtpduCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Polls one strip's state and owns its scene-name registry."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(hass, LOGGER, config_entry=entry, name=DOMAIN, update_interval=UPDATE_INTERVAL)
        self.entry = entry
        self._device = protocol_device.Device(
            entry.data[CONF_HOST],
            entry.data[CONF_AUTH_TOKEN],
            entry.data.get(CONF_PORT, DEFAULT_PORT),
        )
        self.runtime = NanoleafLtpduRuntime(hass, self._device)
        self._connected = False

        # Scene registry is per-config-entry, not shared/global: scene IDs live in each
        # physical strip's own flash, so the same name on two strips is two
        # independently-allocated IDs under the hood.
        self._scene_store: Store[dict[str, Any]] = Store(hass, version=1, key=f"{DOMAIN}_{entry.entry_id}_scenes")
        self.scenes: dict[str, int] = {}

    async def async_load_scene_registry(self) -> None:
        stored = await self._scene_store.async_load()
        if stored is None:
            stored = {"next_id": MIN_ALLOCATABLE_SCENE_ID, "scenes": {}}
        self._scene_registry_data = stored
        # name -> id, reserved factory scenes (e.g. "Northern Lights") first so a
        # user-created scene can never accidentally shadow one.
        self.scenes = {name: sid for sid, name in RESERVED_SCENE_NAMES.items()} | dict(stored["scenes"])

    async def async_allocate_scene_id(self, name: str) -> int:
        """Return the existing ID for `name`, allocating (and persisting) a new one if needed."""
        if name in RESERVED_SCENE_NAMES.values():
            raise ValueError(f"'{name}' is a reserved factory scene name and cannot be (re)saved")
        scenes = self._scene_registry_data["scenes"]
        if name in scenes:
            return scenes[name]
        scene_id = self._scene_registry_data["next_id"]
        if scene_id in RESERVED_SCENE_NAMES or scene_id > MAX_ALLOCATABLE_SCENE_ID:
            raise ValueError(f"scene ID {scene_id} would collide with a reserved factory ID or exceed the allocatable range")
        scenes[name] = scene_id
        self._scene_registry_data["next_id"] = scene_id + 1
        await self._scene_store.async_save(self._scene_registry_data)
        self.scenes[name] = scene_id
        return scene_id

    async def async_assign_scene_id(self, name: str, scene_id: int) -> None:
        """Assign an explicit scene ID to `name`, enforcing the same one-name-per-id
        invariant async_allocate_scene_id maintains for auto-allocated ones. If another
        name currently holds `scene_id`, it's evicted from the registry (its data stays
        on the strip's own flash untouched — just no longer reachable by name)."""
        if name in RESERVED_SCENE_NAMES.values():
            raise ValueError(f"'{name}' is a reserved factory scene name and cannot be (re)saved")
        if scene_id in RESERVED_SCENE_NAMES or not MIN_ALLOCATABLE_SCENE_ID <= scene_id <= MAX_ALLOCATABLE_SCENE_ID:
            raise ValueError(f"scene ID {scene_id} would collide with a reserved factory ID or exceed the allocatable range")
        scenes = self._scene_registry_data["scenes"]
        for other_name, other_id in list(scenes.items()):
            if other_id == scene_id and other_name != name:
                del scenes[other_name]
                self.scenes.pop(other_name, None)
        scenes[name] = scene_id
        self._scene_registry_data["next_id"] = max(self._scene_registry_data["next_id"], scene_id + 1)
        await self._scene_store.async_save(self._scene_registry_data)
        self.scenes[name] = scene_id

    async def async_delete_scene(self, name: str) -> None:
        """Deletes on-device first, then the registry mapping — so a failed device
        delete doesn't leave the registry forgetting a scene that's still on the strip."""
        if name in RESERVED_SCENE_NAMES.values():
            raise ValueError(f"'{name}' is a reserved factory scene and cannot be deleted")
        scenes = self._scene_registry_data["scenes"]
        if name in scenes:
            await self.runtime.delete_scene(scenes[name])
            del scenes[name]
            await self._scene_store.async_save(self._scene_registry_data)
            self.scenes.pop(name, None)

    async def _async_ensure_connected(self) -> None:
        if self._connected:
            return
        await self.runtime.connect()
        await self.runtime.authenticate()
        self._connected = True

    async def _async_update_data(self) -> dict[str, Any]:
        try:
            await self._async_ensure_connected()
            records = await self.runtime.get_state()
            current_scene_id = await self.runtime.get_current_scene()
        except (OSError, protocol_device.DeviceError) as err:
            # Force a fresh handshake next cycle instead of wedging permanently — the
            # strip's session dies on reboot, a Thread topology change, or an HA
            # restart, and DataUpdateCoordinator's own retry/backoff will call us again.
            self._connected = False
            raise UpdateFailed(str(err)) from err
        return {"records": records, "current_scene_id": current_scene_id}
