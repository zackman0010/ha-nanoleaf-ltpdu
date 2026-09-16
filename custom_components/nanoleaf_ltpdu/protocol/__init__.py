"""Vendored Nanoleaf LTPDU protocol modules — near-verbatim copies of magrgb/server/*.py.

Wire-format logic (crypto/coap/tlv/ci) is unchanged from the standalone, live-validated
toolkit. device.py, thread_credentials.py, and ble_provision.py have minimal changes
(relative imports, and — for ble_provision.py — accepting an externally-established
BleakClient so the config flow can hand it one from HA's own Bluetooth integration
instead of it opening a second, competing connection). See the project's
`project_magrgb_protocol_reverse_engineering.md` memory for the full reverse-engineering
history behind every module here.
"""
