"""Constants for the Nanoleaf LTPDU integration."""
from __future__ import annotations

import logging
from datetime import timedelta

DOMAIN = "nanoleaf_ltpdu"
LOGGER = logging.getLogger(__package__)

CONF_LABEL_ID = "label_id"  # printed on the strip's physical label; used as unique_id
CONF_AUTH_TOKEN = "auth_token"  # hex string
CONF_HOST = "host"  # IPv6 address, resolved via zeroconf/mDNS (_ltpdu._udp.local.)
CONF_PORT = "port"

DEFAULT_PORT = 5683
UPDATE_INTERVAL = timedelta(seconds=15)

ZEROCONF_SERVICE_TYPE = "_ltpdu._udp.local."

NANOLEAF_BLE_MANUFACTURER_ID = 2059  # Nanoleaf's Bluetooth SIG manufacturer ID

# ASCII "NLM0" — the manufacturer-data prefix MAGRGB strips advertise, distinct from
# other Nanoleaf Essentials devices on the same protocol (e.g. the A19 bulbs advertise
# a different prefix). Used by manifest.json's bluetooth matcher so discovery doesn't
# fire for every Nanoleaf device in range.
NANOLEAF_LTPDU_MFG_DATA_PREFIX = [0x4E, 0x4C, 0x4D, 0x30]

RESERVED_SCENE_ID_NORTHERN_LIGHTS = 0xFA  # built into firmware, never client-allocated
# 0xFB-0xFE (251-254) are also built into firmware with pre-defined settings, same as
# Northern Lights — valid, loadable scene IDs, just never client-allocated (they can
# still be deleted like any other scene — see coordinator.async_delete_scene — just
# not overwritten/reassigned to a different name).
RESERVED_SCENE_NAMES = {
    RESERVED_SCENE_ID_NORTHERN_LIGHTS: "Northern Lights",
    0xFB: "SecretLab Signature",
    0xFC: "Cloud9",
    0xFD: "Team Liquid",
    0xFE: "Bubble Gum",
}

MIN_ALLOCATABLE_SCENE_ID = 1
MAX_ALLOCATABLE_SCENE_ID = 249

# BLE-onboarding-only config-flow fields — not stored in a config entry.
CONF_BLE_ADDRESS = "ble_address"
CONF_PAIRING_CODE = "pairing_code"
CONF_THREAD_NETWORK_NAME = "thread_network_name"
CONF_THREAD_CHANNEL = "thread_channel"
CONF_THREAD_PANID = "thread_panid"
CONF_THREAD_EXTPANID = "thread_extpanid"
CONF_THREAD_NETWORKKEY = "thread_networkkey"

# Auth tokens minted by BLE onboarding, keyed by label_id, so the zeroconf discovery
# that fires once the strip joins Thread can skip re-asking for a token it already
# has. In-memory only, never persisted.
PENDING_TOKENS_KEY = f"{DOMAIN}_pending_tokens"

# Per-device sightings from each discovery source ("zeroconf"/"ble"), keyed by
# label_id, so whichever source's flow ends up surviving the unique_id dedup (see
# async_step_zeroconf / async_step_bluetooth / _async_check_dual_discovery in
# config_flow.py) can tell whether the OTHER source has also seen this device and
# offer the user a choice, instead of silently picking whichever source happened to
# fire first. In-memory only, never persisted; never pruned, but bounded by the
# number of distinct physical devices ever discovered — negligible.
DISCOVERY_SIGHTINGS_KEY = f"{DOMAIN}_discovery_sightings"

# The shared scene-recipe library (see scene_library.py) — domain-wide, not
# per-config-entry like coordinator.py's scene ID registry. Lives at the hass.data
# root (like PENDING_TOKENS_KEY/DISCOVERY_SIGHTINGS_KEY above), not nested under
# hass.data[DOMAIN], which is keyed by entry_id for coordinators.
SCENE_LIBRARY_KEY = f"{DOMAIN}_scene_library"
