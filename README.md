# Nanoleaf LTPDU for Home Assistant

A Home Assistant custom integration for Nanoleaf's Thread/BLE **LTPDU** protocol — the
proprietary control protocol used by devices like the SecretLab MagRGB desk light
strips, Nanoleaf Essentials bulbs, and other Nanoleaf "Essentials" products that pair
directly over Bluetooth and are controlled over Thread (CoAP), independent of
Nanoleaf's cloud, the Nanoleaf app, and Apple HomeKit.

This is **not** the same protocol as Nanoleaf's public OpenAPI / WiFi panels (already
covered by the official `nanoleaf` integration and by
[`loebi-ch/nanoleaf`](https://github.com/loebi-ch/nanoleaf)). LTPDU devices don't speak
that API at all — they're Thread-only, and this integration talks to them directly:
X25519 key exchange, AES-128-CTR encrypted CoAP, no cloud round-trip, no app required.

## Why this exists

Controlling these devices through Apple Home (HomeKit-over-Thread) or a Matter bridge
works, but loses Nanoleaf's Motion-based scene system and adds an extra hop. This
integration talks the device's native protocol directly, exposing:

- A standard HA `light` entity (HS color + brightness) with reliable, non-destructive
  state polling.
- Full **scene** support: load an existing on-device scene, save a new one, preview one
  without committing it, and delete one — via HA services, with a
  `get_scene_capabilities` service that exposes the exact motion-style/parameter ranges
  the firmware accepts (intended as the backend for a future custom Lovelace card).
- **In-app onboarding**: pairing a factory-reset device over Bluetooth and pushing it
  your Thread network credentials, entirely inside HA's own config flow — no separate
  script, no Nanoleaf app.

## Supported devices

Confirmed against SecretLab MagRGB desk light strips. The underlying protocol is shared
across Nanoleaf's broader "Essentials" Thread/BLE product line (bulbs, other strips),
but device-matching (BLE manufacturer-data prefix, mDNS service type) has only been
validated against MAGRGB hardware so far — other LTPDU devices likely work but haven't
been tested.

## Installation

### HACS (recommended)

1. HACS → Integrations → ⋮ → Custom repositories → add this repo's URL, category
   "Integration".
2. Install "Nanoleaf LTPDU" from HACS.
3. Restart Home Assistant.

### Manual

Copy `custom_components/nanoleaf_ltpdu/` into your HA config's `custom_components/`
directory, then restart Home Assistant.

## Adding a device

Settings → Devices & Services → Add Integration → "Nanoleaf LTPDU":

- **Add a strip already on your Thread network** — for a device that's already paired
  and joined (manual entry, or auto-detected via mDNS if it's already broadcasting).
- **Add a new (factory-reset) strip via Bluetooth** — full onboarding: scan, pair,
  supply the pairing code printed on the device, then push it your Thread network
  credentials (pulled from HA's own active Thread dataset if available, or entered
  manually).

BLE onboarding requires a Bluetooth adapter (or an
[ESPHome `bluetooth_proxy`](https://esphome.io/components/bluetooth_proxy.html)) in
range of the device — most useful when your HA host itself isn't physically near where
the device lives.

## Known limitations

- On-device scene/effect state isn't readable from the firmware — the currently-active
  scene is tracked optimistically (set on a successful `load_scene` call, restored
  across HA restarts, cleared when you set a color directly) rather than polled.
- BLE device matching currently filters on Nanoleaf's manufacturer-data prefix; this
  hasn't been validated against every Nanoleaf Essentials model, only MAGRGB strips.

## Development

```
python -m pytest tests/ -v
```

All tests are offline — no real hardware, Bluetooth adapter, or HA server required.
