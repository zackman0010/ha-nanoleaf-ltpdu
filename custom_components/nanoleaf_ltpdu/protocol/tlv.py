"""
The small TLV encoding libECL uses inside decrypted /nlltpdu and /nlsecure bodies:
repeated tag(2B BE) + len(2B BE) + data(len bytes) entries. Both directions:
`describe()`/`parse()` decode a response body into readable records; `build_set()`/
`build_query()`/`encode()` construct request bodies to send.
"""
from __future__ import annotations

TAG_PATH = 0x0001
TAG_SET = 0x0002       # request: set/query a value
TAG_CURRENT = 0x0003   # response: current value
TAG_PUBKEY = 0x0101
TAG_AUTH_TOKEN = 0x0104
TAG_STATUS = 0x01F1

TAG_NAMES = {
    TAG_PATH: "path",
    TAG_SET: "set",
    TAG_CURRENT: "current",
    TAG_PUBKEY: "pubkey",
    TAG_AUTH_TOKEN: "auth_token",
    TAG_STATUS: "status",
}


def encode(tag: int, value: bytes) -> bytes:
    return tag.to_bytes(2, "big") + len(value).to_bytes(2, "big") + value


def build_set(path: str, value: bytes) -> bytes:
    """[tag=path][tag=set] pair — the normal shape for setting one attribute."""
    return encode(TAG_PATH, path.encode("ascii")) + encode(TAG_SET, value)


def build_query(path: str) -> bytes:
    """A bare path with no value tag — matches the batch-GET request's "di"/"cm" shape."""
    return encode(TAG_PATH, path.encode("ascii"))


def full_state_query() -> bytes:
    """
    Reproduces the exact known-good batch-GET body Desktop sends on every reconnect:
    di (bare) + oo/hu/sa/pb/ct (each with a placeholder set-value, widths as observed:
    oo=1 byte, hu/sa/pb/ct=2 bytes) + cm (bare). The placeholder widths are replicated
    exactly rather than guessed, since it's unconfirmed whether the device cares about
    the width for a query — safest to match the real traffic byte for byte.
    """
    return (
        build_query("di")
        + build_set("lb/0/oo", b"\x00")
        + build_set("lb/0/hu", b"\x00\x00")
        + build_set("lb/0/sa", b"\x00\x00")
        + build_set("lb/0/pb", b"\x00\x00")
        + build_set("lb/0/ct", b"\x00\x00")
        + build_query("lb/0/cm")
    )


def parse(data: bytes) -> list[tuple[int | None, bytes]]:
    """Walk the whole buffer as sequential tag/len/data entries."""
    entries: list[tuple[int | None, bytes]] = []
    pos = 0
    while pos + 4 <= len(data):
        tag = int.from_bytes(data[pos:pos + 2], "big")
        length = int.from_bytes(data[pos + 2:pos + 4], "big")
        pos += 4
        value = data[pos:pos + length]
        pos += length
        entries.append((tag, value))
    if pos != len(data):
        entries.append((None, data[pos:]))  # trailing bytes too short for a header
    return entries


def _format_value(value: bytes):
    if len(value) == 1:
        return value[0]
    if len(value) == 2:
        return int.from_bytes(value, "big")
    return "0x" + value.hex()


def describe(data: bytes) -> list[dict]:
    """
    Groups the raw TLV stream into readable records. A `path` entry immediately
    followed by a `set`/`current` entry becomes one {"path", "op", "value"} record.
    A `path` entry with nothing (or something other than set/current) after it is a
    bare query — e.g. the batch-GET response's leading "di" and trailing "cm" — and
    becomes {"path", "op": "query", "value": None}. Anything else (auth token, status
    ack, an unrecognized tag) becomes its own {"tag", "value"} record.
    """
    entries = parse(data)
    records: list[dict] = []
    i = 0
    while i < len(entries):
        tag, value = entries[i]
        if tag == TAG_PATH:
            path_str = value.decode("ascii", "replace")
            if i + 1 < len(entries) and entries[i + 1][0] in (TAG_SET, TAG_CURRENT):
                next_tag, next_value = entries[i + 1]
                records.append({
                    "path": path_str,
                    "op": TAG_NAMES[next_tag],
                    "value": _format_value(next_value),
                })
                i += 2
                continue
            records.append({"path": path_str, "op": "query", "value": None})
            i += 1
            continue
        name = TAG_NAMES.get(tag, f"0x{tag:04x}") if tag is not None else "trailing"
        records.append({"tag": name, "value": _format_value(value)})
        i += 1
    return records


def get_value(records: list[dict], path: str):
    """Convenience: pull one attribute's value out of a describe()'d response by path."""
    for rec in records:
        if rec.get("path") == path:
            return rec.get("value")
    return None
