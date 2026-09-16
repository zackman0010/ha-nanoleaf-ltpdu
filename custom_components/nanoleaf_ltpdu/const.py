"""Constants for the Nanoleaf LTPDU integration."""
from __future__ import annotations

import logging
from datetime import timedelta

DOMAIN = "nanoleaf_ltpdu"
LOGGER = logging.getLogger(__package__)

CONF_LABEL_ID = "label_id"  # e.g. "AB12" — printed on the strip's physical label; used as unique_id
CONF_AUTH_TOKEN = "auth_token"  # hex string
CONF_HOST = "host"  # IPv6 address, resolved via zeroconf/mDNS (_ltpdu._udp.local.)
CONF_PORT = "port"

DEFAULT_PORT = 5683
UPDATE_INTERVAL = timedelta(seconds=15)

ZEROCONF_SERVICE_TYPE = "_ltpdu._udp.local."

# Nanoleaf's Bluetooth SIG manufacturer ID, confirmed from real LTPDU advertisements
# this session (magrgb/server/ble_scan.py) — used both for the manifest.json bluetooth
# matcher (Milestone 4) and for filtering bluetooth.async_discovered_service_info().
NANOLEAF_BLE_MANUFACTURER_ID = 2059

# The 4-byte ASCII "NLM0" prefix real captured MAGRGB manufacturer-data payloads
# consistently start with (confirmed from both strips this session's ble_scan.py
# output, e.g. `4e4c4d3001063102...`) — distinct from the user's separate NL45
# chandelier bulbs, whose advertisements start `4e4c3637...` instead. Used as the
# manifest.json bluetooth matcher's manufacturer_data_start so discovery doesn't fire
# for every Nanoleaf device in range, just this protocol family. Confirmed against 2
# real MAGRGB units; not verified across the full 30+ model list this protocol
# otherwise applies to — see the "open questions" note in the plan file.
NANOLEAF_LTPDU_MFG_DATA_PREFIX = [0x4E, 0x4C, 0x4D, 0x30]

# Reserved scene ID built into every device's firmware, never client-allocated —
# see magrgb/server/scenes.py / ci.py.
RESERVED_SCENE_ID_NORTHERN_LIGHTS = 0xFA
RESERVED_SCENE_NAMES = {RESERVED_SCENE_ID_NORTHERN_LIGHTS: "Northern Lights"}

# Client-assigned scene IDs are allocated in this range (matches scenes.py's original
# local-registry behavior — 0 and 0xFA-0xFF are reserved/special).
MIN_ALLOCATABLE_SCENE_ID = 1
MAX_ALLOCATABLE_SCENE_ID = 249

# BLE-onboarding-only config-flow fields (Milestone 4) — not stored in a config entry.
CONF_BLE_ADDRESS = "ble_address"
CONF_PAIRING_CODE = "pairing_code"
CONF_THREAD_NETWORK_NAME = "thread_network_name"
CONF_THREAD_CHANNEL = "thread_channel"
CONF_THREAD_PANID = "thread_panid"
CONF_THREAD_EXTPANID = "thread_extpanid"
CONF_THREAD_NETWORKKEY = "thread_networkkey"

# hass.data key (deliberately separate from DOMAIN's own {entry_id: coordinator} map)
# for auth tokens minted by the BLE onboarding flow, keyed by label_id, so the
# zeroconf-discovery flow that fires moments later (once the newly Thread-joined
# strip's mDNS SRP registration propagates) can skip re-asking for a token it already
# has. Session-lifetime only, never persisted — see config_flow.py.
PENDING_TOKENS_KEY = f"{DOMAIN}_pending_tokens"
