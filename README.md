# Nanoleaf LTPDUv2

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

Nanoleaf's devices speak one of two generations of this protocol — **LTPDUv2** or
**LTPDUv3** — under the same "LTPDU" name, with different encryption
(LTPDUv2: X25519 + AES-128-CTR; LTPDUv3: AES-CCM). This integration implements
**LTPDUv2 only**. LTPDUv3 was identified during protocol analysis but never
implemented here — there's no LTPDUv3 hardware available to test an implementation
against, and shipping untested crypto against a real device's pairing/session flow
isn't worth the risk. If you have a device that turns out to be LTPDUv3, this
integration will not work with it.

The table below is every model confirmed as LTPDUv2 from Nanoleaf's own app source
(a device-classifier function that sorts models into LTPDUv2 vs LTPDUv3 sets). Only
**NL62** (Secretlab MAGRGB) has been validated against real hardware — everything
else is protocol-compatible by the same reverse-engineered crypto/CoAP/BLE-pairing
logic, but untested on real units of those specific models.

| | Model | Product | Type |
|---|---|---|---|
| <img src="docs/images/bulb.svg" width="20"> | NL45 | Essentials Bulb (A19) | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL53 | Essentials BR30 Smart Bulb ¹ | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL54 | Essentials GU10 Smart Bulb ¹ | Bulb |
| <img src="docs/images/lightstrip.svg" width="20"> | NL55 | Essentials Lightstrip | Lightstrip |
| <img src="docs/images/unknown.svg" width="20"> | NL58 | Essentials family — exact product unconfirmed | Unknown |
| <img src="docs/images/secretlab-logo.png" width="60"> | NL62 | Secretlab MAGRGB™ Diffused LED Strip (Smart Lighting Edition), Thread variant — SKU NL62-0003LS-2M — ✅ tested against real hardware | Lightstrip |
| <img src="docs/images/downlight.svg" width="20"> | NL65 | Essentials Downlight — NL65E100 (Matter/Thread) and NL65N100 (4", WiFi+Bluetooth) confirmed variants ¹ | Downlight |
| <img src="docs/images/bulb.svg" width="20"> | NL67 | Essentials Bulb (companion to NL45) ¹ | Bulb |
| <img src="docs/images/lightstrip.svg" width="20"> | NL68 | Essentials Matter Lightstrip ¹ | Lightstrip |
| <img src="docs/images/string-lights.svg" width="20"> | NL71K1 | String Lights ¹ | String Lights |
| <img src="docs/images/string-lights.svg" width="20"> | NL71K2 | String Lights, Holiday variant ¹ | String Lights |
| <img src="docs/images/lightstrip.svg" width="20"> | NL72K1 | Multicolor HD Lightstrip ¹ | Lightstrip |
| <img src="docs/images/lightstrip.svg" width="20"> | NL72K3 | Multicolor Indoor Lightstrip ¹ | Lightstrip |
| <img src="docs/images/floor-lamp.svg" width="20"> | NL72K4 | Floor Lamp ¹ | Floor Lamp |
| <img src="docs/images/rope-light.svg" width="20"> | NL72K6 | Rope Light ¹ | Rope Light |
| <img src="docs/images/secretlab-logo.png" width="60"> | NL72S1 | Secretlab MAGRGB™ Diffused LED Strip — likely the Thread/Matter sibling to NL72S2's confirmed Matter-over-WiFi variant, not directly confirmed ¹ | Lightstrip |
| <img src="docs/images/secretlab-logo.png" width="60"> | NL72S2 | Secretlab MAGRGB™ Diffused LED Strip (Smart Lighting Edition), Matter-over-WiFi variant (released mid-2024) — confirmed SKUs NL72S2N15/N17/E15/E17 ¹ | Lightstrip |
| <img src="docs/images/string-lights.svg" width="20"> | NL73K1 | Outdoor String Lights ¹ | String Lights |
| <img src="docs/images/outdoor-lights.svg" width="20"> | NL73K3 | Permanent Outdoor Lights ¹ | Outdoor Lights |
| <img src="docs/images/bulb.svg" width="20"> | NL75K1 | WiFi Bulb (A19/A60, GU10, or downlight — exact variant unconfirmed) ¹ | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL75K2 | WiFi Bulb (A19/A60, GU10, or downlight — exact variant unconfirmed) ¹ | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL75K3 | WiFi Bulb (A19/A60, GU10, or downlight — exact variant unconfirmed) ¹ | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL75K4 | WiFi Bulb (A19/A60, GU10, or downlight — exact variant unconfirmed) ¹ | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL75K5 | WiFi Bulb (A19/A60, GU10, or downlight — exact variant unconfirmed) ¹ | Bulb |
| <img src="docs/images/bulb.svg" width="20"> | NL75K6 | WiFi Bulb (A19/A60, GU10, or downlight — exact variant unconfirmed) ¹ | Bulb |
| <img src="docs/images/unknown.svg" width="20"> | NL77K1 | Undocumented — too new/niche to be publicly indexed ¹ | Unknown |
| <img src="docs/images/lamp.svg" width="20"> | SQUB01 | Umbra "Cono" portable smart lamp (SmarterIQ × Umbra) ¹ | Lamp |
| <img src="docs/images/lamp.svg" width="20"> | SQUB03 | Umbra "Cup" smart lamp (SmarterIQ × Umbra) ¹ | Lamp |
| <img src="docs/images/bulb.svg" width="20"> | SQCM01 | Caveman Matter & Wi-Fi A19 Smart LED Light Bulb (SmarterIQ × Caveman) — confirmed SKU SQCM01B03 (2-pack/4-pack) ¹ | Bulb |
| <img src="docs/images/downlight.svg" width="20"> | SQCM02 | Caveman Smart Downlight, Matter & Wi-Fi (SmarterIQ × Caveman) ¹ | Downlight |
| <img src="docs/images/monitor-stand.svg" width="20"> | SQFX03 | Nanoleaf × FANTAQI Smart Monitor Stand (SmarterIQ × FANTAQI) ¹ | Monitor Stand |
| <img src="docs/images/unknown.svg" width="20"> | SQFX04 | FANTAQI family — unconfirmed; FANTAQI has at least two other SmarterIQ product lines (SQFX01 EXPO display case, SQFX03 Monitor Stand), but this specific SKU wasn't found in any indexed source ¹ | Unknown |
| <img src="docs/images/secretlab-logo.png" width="60"> | SQSL01 | Secretlab "ErgoArch Light Bar" — unreleased; not listed on Secretlab's or Nanoleaf's sites, known only from Matter-certification filings. Status (still planned vs. cancelled) unknown ¹ | Light Bar |

"SQ" is Nanoleaf's third-party **SmarterIQ** collab-brand line, not a typo. Model →
product names come from public web search, not Nanoleaf documentation — treat
anything marked "unconfirmed" as a best guess.

Icons are generic (emoji-based, by product type) rather than actual product
photography, to avoid using anyone's copyrighted images. The one exception is the
Secretlab wordmark on the Secretlab-branded rows — a public-domain file from
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Transparent_SecretLab_Logo(black_font)(1).png)
(below the threshold of originality for copyright, per that file's own documentation).

### Trademark notice

`custom_components/nanoleaf_ltpdu/brand/icon.png` (shown on this integration's
Home Assistant discovery cards, so they're visually distinguishable from the
official `nanoleaf` integration's own cards) is Nanoleaf's real leaf icon — sourced
unmodified from [home-assistant/brands](https://github.com/home-assistant/brands)'s
own `core_integrations/nanoleaf/` folder, the same repository HA's official
integration itself uses — with an "LTPDUv2" caption band added underneath purely to
tell the two integrations' cards apart. As with every third-party logo in that
repository: this is used for identification purposes only and does not imply
endorsement by, or affiliation with, Nanoleaf. This integration is an independent,
community-built, reverse-engineered client and is not created, maintained, or
endorsed by Nanoleaf.

¹ On firmware ≥ 5.0.0, these models switch the session-key derivation's
domain-separation label to a different (but structurally identical) constant. The
logic to handle this is implemented, but — same as the rest of this table outside
NL62 — untested against a real unit of any of these specific models.

Device-matching (BLE manufacturer-data prefix, mDNS service type) has also only been
validated against MAGRGB hardware — other models in the table above should match
correctly, but that's inferred from the same app source, not independently confirmed
per model.

## Installation

### HACS (recommended)

1. HACS → Integrations → ⋮ → Custom repositories → add this repo's URL, category
   "Integration".
2. Install "Nanoleaf LTPDUv2" from HACS.
3. Restart Home Assistant.

### Manual

Copy `custom_components/nanoleaf_ltpdu/` into your HA config's `custom_components/`
directory, then restart Home Assistant.

## Adding a device

Settings → Devices & Services → Add Integration → "Nanoleaf LTPDUv2":

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
