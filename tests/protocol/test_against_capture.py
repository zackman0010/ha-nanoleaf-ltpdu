"""
Offline validation of the protocol package's *request-building* functions against real
captured bytes. No hardware, no HA test harness, no network needed — this checks that
what we'd transmit matches byte-for-byte what's known to have actually been sent, and
— for device.py — that the CoAP method (GET vs POST) is correct for each call, since
sending the wrong one silently applies writes that should have been read-only.
"""
from __future__ import annotations

import sys

from custom_components.nanoleaf_ltpdu.protocol import ci, coap, device, tlv
from custom_components.nanoleaf_ltpdu.protocol.thread_credentials import ThreadCredentials, build_thread_credentials_tlv


def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    sys.exit(1)


def check(name: str, got: bytes, expected_hex: str) -> None:
    expected = bytes.fromhex(expected_hex)
    if got != expected:
        fail(f"{name}: got {got.hex()}, expected {expected_hex}")
    print(f"{name}: OK")


def test_tlv_attribute_sets() -> None:
    # -- tlv.py: plain attribute SETs (successful_capture.pcapng / mitm_capture.jsonl) --
    check("oo set on", tlv.build_set("lb/0/oo", b"\x01"), "000100076c622f302f6f6f0002000101")
    check("oo set off", tlv.build_set("lb/0/oo", b"\x00"), "000100076c622f302f6f6f0002000100")
    check(
        "hu/sa/pb batch set",
        tlv.build_set("lb/0/hu", (241).to_bytes(2, "big"))
        + tlv.build_set("lb/0/sa", (83).to_bytes(2, "big"))
        + tlv.build_set("lb/0/pb", (100).to_bytes(2, "big")),
        "000100076c622f302f68750002000200f1000100076c622f302f7361000200020053000100076c622f302f7062000200020064",
    )
    check(
        "full state query",
        tlv.full_state_query(),
        "000100026469000100076c622f302f6f6f0002000100000100076c622f302f6875000200020000000100076c622f302f7361"
        "000200020000000100076c622f302f7062000200020000000100076c622f302f6374000200020000000100076c622f302f636d",
    )


def test_ci_scene_opcodes() -> None:
    # -- ci.py: scene/effect opcodes, wrapped the way they're always actually sent --
    hsb_test_colors = [(0, 50, 100), (120, 50, 100), (240, 50, 100), (240, 50, 100), (60, 50, 100), (300, 50, 100)]

    check(
        "ci load (trigger, Northern Lights id 0xfa)",
        tlv.build_set("ci", ci.build_load(0xFA)),
        "0001000263690002000507060001fa",
    )
    check(
        "ci write (preview, Fade motion)",
        tlv.build_set("ci", ci.build_write(0x01, bytes.fromhex("180001"), hsb_test_colors)),
        "000100026369000200200701001c0105ff011800010213060032641e32643c32643c32640f32644b3264",
    )
    check(
        "ci save (Stripes motion, scene id 2)",
        tlv.build_set("ci", ci.build_save(2, 0x06, bytes.fromhex("180132"), hsb_test_colors)),
        "000100026369000200200702001c010502061801320213060032641e32643c32643c32640f32644b3264",
    )


def test_coap_build_and_round_trip() -> None:
    # -- coap.py: build() must reproduce a real captured frame's header+options exactly,
    #    given the same message_id/token/payload (successful_capture.pcapng packet 24) --
    frame = coap.build(
        coap.CODE_POST,
        message_id=0x2FB5,
        token=bytes.fromhex("970A"),
        uri_path="nlltpdu",
        payload=bytes.fromhex("14a1d69ab46bb09e3b33501ce8e698df"),
    )
    check("coap.build real-frame reproduction", frame, "42022fb5970ab76e6c6c74706475ff14a1d69ab46bb09e3b33501ce8e698df")

    # -- round-trip sanity: parse(build(...)) recovers everything build() was given --
    parsed = coap.parse(frame)
    assert parsed.code == coap.CODE_POST
    assert parsed.message_id == 0x2FB5
    assert parsed.token == bytes.fromhex("970A")
    assert parsed.uri_path == "nlltpdu"
    assert parsed.payload == bytes.fromhex("14a1d69ab46bb09e3b33501ce8e698df")
    print("coap.build -> coap.parse round-trip: OK")


def test_device_get_state_uses_coap_get_and_set_uses_post() -> None:
    # -- device.py: get_state() MUST use CoAP GET, everything else MUST use POST --
    # (regression test: sending the "full state query" as POST instead of GET makes
    # the firmware apply the embedded placeholder-zero SETs as real writes, silently
    # zeroing oo/hu/sa/pb.)
    class _FakeSession:
        def process(self, data: bytes) -> bytes:
            return data

    calls: list[int] = []

    dev = device.Device("::1", "00")
    dev.session = _FakeSession()

    def fake_request(uri_path: str, payload: bytes, code: int = coap.CODE_POST):
        calls.append(code)
        return coap.CoapMessage(1, coap.TYPE_ACK, 0x44, 0, b"", {}, b"", 0)

    dev._request = fake_request  # type: ignore[method-assign]

    dev.get_state()
    if calls != [coap.CODE_GET]:
        fail(f"get_state() must send CoAP GET ({coap.CODE_GET}), sent code={calls}")
    print("device.get_state() uses CoAP GET: OK")

    calls.clear()
    dev.set("lb/0/oo", b"\x01")
    if calls != [coap.CODE_POST]:
        fail(f"set() must send CoAP POST ({coap.CODE_POST}), sent code={calls}")
    print("device.set() uses CoAP POST: OK")


def test_thread_credentials_pan_id_byte_order_matches_between_both_constructors() -> None:
    """
    thread_credentials.py has two constructors: from_ot_ctl_dataset() (discrete field
    values) and from_operational_dataset_tlv() (HA's own active Thread dataset, a
    MeshCoP TLV hex string via python_otbr_api). build_thread_credentials_tlv() applies
    its OWN PAN-ID byte swap internally, so both constructors must hand it the RAW,
    unswapped PAN ID bytes — pre-swapping in either would double-swap and produce a
    network the strip silently never joins, with no error anywhere in the chain. This
    test builds the same logical network both ways and asserts byte-identical output.

    Values below are a synthetic, made-up Thread dataset — the test only checks that
    both constructors agree on PAN-ID byte order for the same logical network, which
    doesn't depend on the values being a real network's credentials.
    """
    from python_otbr_api.tlv_parser import Channel, MeshcopTLVItem, MeshcopTLVType, NetworkName, encode_tlv

    network_name = "ExampleThreadNet"
    channel = 25
    panid_hex = "1234"
    extpanid_hex = "1122334455667788"
    networkkey_hex = "00112233445566778899aabbccddeeff"  # gitleaks:allow

    via_ot_ctl = ThreadCredentials.from_ot_ctl_dataset(
        network_name=network_name,
        channel=channel,
        panid_hex=panid_hex,
        extpanid_hex=extpanid_hex,
        networkkey_hex=networkkey_hex,
    )

    # Build an equivalent real MeshCoP dataset TLV the way HA's thread/otbr integration
    # would hand it to us, using python_otbr_api's own encoder — not hand-rolled bytes —
    # so this test exercises the real wire shape, not our assumption of it.
    dataset_tlv_hex = encode_tlv(
        {
            MeshcopTLVType.NETWORKNAME: NetworkName(MeshcopTLVType.NETWORKNAME, network_name.encode()),
            MeshcopTLVType.CHANNEL: Channel(MeshcopTLVType.CHANNEL, channel.to_bytes(2, "big")),
            MeshcopTLVType.PANID: MeshcopTLVItem(MeshcopTLVType.PANID, bytes.fromhex(panid_hex)),
            MeshcopTLVType.EXTPANID: MeshcopTLVItem(MeshcopTLVType.EXTPANID, bytes.fromhex(extpanid_hex)),
            MeshcopTLVType.NETWORKKEY: MeshcopTLVItem(MeshcopTLVType.NETWORKKEY, bytes.fromhex(networkkey_hex)),
        }
    )
    via_ha_dataset = ThreadCredentials.from_operational_dataset_tlv(dataset_tlv_hex)

    tlv_from_ot_ctl = build_thread_credentials_tlv(via_ot_ctl)
    tlv_from_ha_dataset = build_thread_credentials_tlv(via_ha_dataset)

    if tlv_from_ot_ctl != tlv_from_ha_dataset:
        fail(
            "PAN-ID byte-order mismatch between from_ot_ctl_dataset() and "
            f"from_operational_dataset_tlv(): {tlv_from_ot_ctl.hex()} != {tlv_from_ha_dataset.hex()} "
            "— check for a double byte-swap in from_operational_dataset_tlv()"
        )
    print("thread_credentials PAN-ID byte order matches between both constructors: OK")


def main() -> None:
    test_tlv_attribute_sets()
    test_ci_scene_opcodes()
    test_coap_build_and_round_trip()
    test_device_get_state_uses_coap_get_and_set_uses_post()
    test_thread_credentials_pan_id_byte_order_matches_between_both_constructors()
    print("\nALL OFFLINE VALIDATIONS PASSED")


if __name__ == "__main__":
    main()
