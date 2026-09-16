"""
Thread network credential handoff TLV — sent as an ordinary LTPDU command over the
already-established encrypted BLE session from pairing (see ble_provision.py), NOT a
separate handshake. Uses the same 1-byte-tag/1-byte-len sub-block framing as ci.py,
not the outer 2-byte TLV scheme used by device.py. Reverse-engineered from Nanoleaf's
Android app (ThreadNetwork.writeTLVCommandBytes()) — see
project_magrgb_protocol_reverse_engineering.md, "BLE provisioning".

Vendored from magrgb/server/thread_credentials.py, with one addition:
from_operational_dataset_tlv() builds credentials directly from Home Assistant's own
active Thread dataset (as returned by homeassistant.components.thread's dataset store,
a MeshCoP TLV hex string) instead of requiring `ot-ctl dataset active` field values by
hand. See build_thread_credentials_tlv()'s docstring for the PAN-ID byte-order trap
this must NOT pre-apply — it's applied exactly once, here, regardless of which
classmethod built the ThreadCredentials.
"""
from __future__ import annotations

from dataclasses import dataclass


def _block(tag: int, data: bytes) -> bytes:
    return bytes([tag, len(data)]) + data


@dataclass
class ThreadCredentials:
    network_name: str
    channel: int
    pan_id: bytes  # 2 bytes, RAW wire byte order — do not pre-swap (see build_thread_credentials_tlv)
    ext_pan_id: bytes  # 8 bytes
    network_key: bytes  # 16 bytes — the actual Thread master key

    @classmethod
    def from_ot_ctl_dataset(cls, network_name: str, channel: int, panid_hex: str, extpanid_hex: str, networkkey_hex: str) -> "ThreadCredentials":
        """Build straight from `ot-ctl dataset active` field values (as hex strings)."""
        return cls(
            network_name=network_name,
            channel=channel,
            pan_id=bytes.fromhex(panid_hex.replace("0x", "")),
            ext_pan_id=bytes.fromhex(extpanid_hex),
            network_key=bytes.fromhex(networkkey_hex),
        )

    @classmethod
    def from_operational_dataset_tlv(cls, tlv_hex: str) -> "ThreadCredentials":
        """
        Build from Home Assistant's own active Thread dataset, as returned by
        `homeassistant.components.thread`'s dataset store (a raw MeshCoP TLV hex
        string — NOT discrete fields). Parsed via `python_otbr_api.tlv_parser.parse_tlv`.

        Import is local (not at module level) so this module stays importable — and
        from_ot_ctl_dataset() usable — in contexts without python_otbr_api installed
        (e.g. the offline test suite, or the standalone magrgb/server/ CLI tools this
        was vendored from).
        """
        from python_otbr_api.tlv_parser import MeshcopTLVType, parse_tlv

        parsed = parse_tlv(tlv_hex)
        return cls(
            network_name=parsed[MeshcopTLVType.NETWORKNAME].name,
            channel=parsed[MeshcopTLVType.CHANNEL].channel,
            # RAW, unswapped — build_thread_credentials_tlv() below applies the one
            # required swap itself. Swapping here too would double-swap and produce a
            # network the strip silently never joins (see this module's test coverage).
            pan_id=parsed[MeshcopTLVType.PANID].data,
            ext_pan_id=parsed[MeshcopTLVType.EXTPANID].data,
            network_key=parsed[MeshcopTLVType.NETWORKKEY].data,
        )


def build_thread_credentials_tlv(creds: ThreadCredentials) -> bytes:
    pan_id_swapped = bytes([creds.pan_id[1], creds.pan_id[0]])
    inner = (
        _block(1, creds.network_name.encode("utf-8"))
        + _block(2, bytes([creds.channel]))
        + _block(3, pan_id_swapped)
        + _block(4, creds.ext_pan_id)
        + _block(5, creds.network_key)
    )
    return _block(1, b"\x01") + _block(2, inner) + _block(3, b"\x01")
