"""
Layer 5: config flow step sequencing, with BleProvisioner/establish_connection/HA's
bluetooth+thread helpers mocked at the boundary — never a real BLE adapter or Thread
network. Config flow instances are driven directly (constructed + `.hass` set, step
methods called and awaited manually, including manually re-invoking a progress step a
second time to simulate what HA's real FlowManager does once the background task
completes) rather than through the full `hass.config_entries.flow.async_init(...)`
machinery — confirmed this works fine for a directly-constructed flow instance (no
`flow_id`/`handler` needed for anything this file checks). See test_coordinator.py's
module docstring for why not the full pytest_homeassistant_custom_component fixture.
"""
from __future__ import annotations

import tempfile
from unittest.mock import AsyncMock, patch

import pytest

from homeassistant.core import HomeAssistant

import custom_components.nanoleaf_ltpdu.config_flow as cf
from custom_components.nanoleaf_ltpdu.const import (
    CONF_AUTH_TOKEN,
    CONF_BLE_ADDRESS,
    CONF_PAIRING_CODE,
    CONF_THREAD_CHANNEL,
    CONF_THREAD_EXTPANID,
    CONF_THREAD_NETWORK_NAME,
    CONF_THREAD_NETWORKKEY,
    CONF_THREAD_PANID,
    PENDING_TOKENS_KEY,
)
from custom_components.nanoleaf_ltpdu.protocol.ble_provision import BleProvisionError, BleProvisioner
from custom_components.nanoleaf_ltpdu.protocol.thread_credentials import ThreadCredentials, build_thread_credentials_tlv


@pytest.fixture
async def hass():
    instance = HomeAssistant(tempfile.mkdtemp())
    yield instance
    await instance.async_stop()


def _make_flow(hass: HomeAssistant) -> cf.NanoleafLtpduConfigFlow:
    flow = cf.NanoleafLtpduConfigFlow()
    flow.hass = hass
    # FlowHandler.context defaults to a CLASS-level {} (shared across every instance
    # that doesn't override it) — the real FlowManager always replaces it with a fresh
    # per-flow dict right after construction; do the same here so mutating
    # self.context in a step (e.g. title_placeholders) can't leak into other tests via
    # the shared class attribute.
    flow.context = {}
    return flow


class _FakeBleDevice:
    address = "AA:BB:CC:DD:EE:FF"


class _FakeBleakClient:
    def __init__(self) -> None:
        self.is_connected = True
        self.disconnect = AsyncMock()


class _FakeServiceInfo:
    def __init__(self, address: str, name: str) -> None:
        self.address = address
        self.name = name
        self.manufacturer_data = {2059: b"NLM0..."}


async def test_user_step_shows_manual_vs_ble_menu(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    result = await flow.async_step_user()
    assert result["type"].value == "menu"
    assert result["menu_options"] == ["manual", "ble_scan"]


async def test_ble_scan_lists_discovered_devices_filtered_by_manufacturer(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    fake_infos = [
        _FakeServiceInfo("AA:BB:CC:DD:EE:FF", "Secretlab MAGRGB AB12"),
        _FakeServiceInfo("11:22:33:44:55:66", "Some Other BLE Device"),  # no mfg 2059 — filtered client-side too
    ]
    fake_infos[1].manufacturer_data = {76: b"other"}

    with patch.object(cf.bluetooth, "async_discovered_service_info", return_value=fake_infos):
        result = await flow.async_step_ble_scan()

    assert result["type"].value == "form"
    assert result["step_id"] == "ble_scan"
    choices = result["data_schema"].schema[CONF_BLE_ADDRESS].container
    assert "AA:BB:CC:DD:EE:FF" in choices
    assert "11:22:33:44:55:66" not in choices


async def test_ble_scan_with_no_devices_shows_error(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    with patch.object(cf.bluetooth, "async_discovered_service_info", return_value=[]):
        result = await flow.async_step_ble_scan()
    assert result["errors"] == {"base": "no_devices_found"}


async def test_ble_scan_selection_proceeds_to_pairing_code(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_discovered = {"AA:BB:CC:DD:EE:FF": "AB12"}
    result = await flow.async_step_ble_scan({CONF_BLE_ADDRESS: "AA:BB:CC:DD:EE:FF"})
    assert flow._ble_address == "AA:BB:CC:DD:EE:FF"
    assert flow._label_id == "AB12"
    assert result["step_id"] == "ble_pairing_code"


async def test_ble_pair_success_flows_through_to_thread_creds_source(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_address = "AA:BB:CC:DD:EE:FF"
    flow._pairing_code = "12345678"

    fake_client = _FakeBleakClient()
    with (
        patch.object(cf.bluetooth, "async_ble_device_from_address", return_value=_FakeBleDevice()),
        patch.object(cf, "establish_connection", AsyncMock(return_value=fake_client)),
        patch.object(cf.BleProvisioner, "pair", AsyncMock(return_value=bytes.fromhex("deadbeefcafebabe"))),
    ):
        # First call: creates the background task, shows progress.
        progress_result = await flow.async_step_ble_pair()
        assert progress_result["type"].value == "progress"
        assert flow._ble_pair_task is not None

        # Simulate the FlowManager re-invoking the same step once the task is done.
        await flow._ble_pair_task
        done_result = await flow.async_step_ble_pair()

    assert done_result["type"].value == "progress_done"
    assert done_result["step_id"] == "thread_creds_source"
    assert flow._ble_auth_token_hex == "deadbeefcafebabe"
    assert flow._ble_pair_task is None  # cleared after collection


async def test_ble_pair_failure_returns_to_pairing_code_with_error(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_address = "AA:BB:CC:DD:EE:FF"
    flow._pairing_code = "wrong-code"

    with (
        patch.object(cf.bluetooth, "async_ble_device_from_address", return_value=_FakeBleDevice()),
        patch.object(cf, "establish_connection", AsyncMock(return_value=_FakeBleakClient())),
        patch.object(cf.BleProvisioner, "pair", AsyncMock(side_effect=BleProvisionError("bad pairing code"))),
    ):
        await flow.async_step_ble_pair()
        task = flow._ble_pair_task
        with pytest.raises(BleProvisionError):
            await task
        result = await flow.async_step_ble_pair()

    assert result["type"].value == "progress_done"
    assert result["step_id"] == "ble_pairing_code"

    # And re-entering ble_pairing_code now shows the error.
    form = await flow.async_step_ble_pairing_code()
    assert form["errors"] == {"base": "ble_pairing_failed"}


async def test_ble_pair_device_not_found_raises_provision_error(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_address = "AA:BB:CC:DD:EE:FF"
    flow._pairing_code = "12345678"
    with patch.object(cf.bluetooth, "async_ble_device_from_address", return_value=None):
        with pytest.raises(BleProvisionError):
            await flow._async_do_ble_pair()


async def test_manual_thread_creds_builds_credentials_and_proceeds(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_provisioner = object()  # not exercised in this test — push_creds itself is separately tested

    with patch.object(cf.NanoleafLtpduConfigFlow, "async_step_ble_push_creds", AsyncMock(return_value={"stub": True})):
        result = await flow.async_step_manual_thread_creds(
            {
                CONF_THREAD_NETWORK_NAME: "ExampleThreadNet",
                CONF_THREAD_CHANNEL: 25,
                CONF_THREAD_PANID: "1234",
                CONF_THREAD_EXTPANID: "1122334455667788",
                CONF_THREAD_NETWORKKEY: "00112233445566778899aabbccddeeff",
            }
        )
    assert result == {"stub": True}
    assert flow._thread_creds == ThreadCredentials.from_ot_ctl_dataset(
        network_name="ExampleThreadNet",
        channel=25,
        panid_hex="1234",
        extpanid_hex="1122334455667788",
        networkkey_hex="00112233445566778899aabbccddeeff",
    )


async def test_ble_push_creds_success_advances_to_done(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_provisioner = BleProvisioner("AA:BB:CC:DD:EE:FF", "94514965")
    flow._thread_creds = ThreadCredentials.from_ot_ctl_dataset(
        network_name="net", channel=11, panid_hex="1234", extpanid_hex="0011223344556677", networkkey_hex="00" * 16
    )

    class _FakeResp:
        code = 0x44
        payload = b""

    with patch.object(cf.BleProvisioner, "write_thread_credentials", AsyncMock(return_value=_FakeResp())):
        await flow.async_step_ble_push_creds()
        await flow._ble_push_creds_task
        result = await flow.async_step_ble_push_creds()

    assert result["step_id"] == "ble_onboarding_done"


async def test_ble_push_creds_rejected_returns_to_thread_creds_source(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._ble_provisioner = BleProvisioner("AA:BB:CC:DD:EE:FF", "94514965")
    flow._thread_creds = ThreadCredentials.from_ot_ctl_dataset(
        network_name="net", channel=11, panid_hex="1234", extpanid_hex="0011223344556677", networkkey_hex="00" * 16
    )

    class _FakeRejectedResp:
        code = 0x84  # not 0x44 — some non-success CoAP code
        payload = b""

    with patch.object(cf.BleProvisioner, "write_thread_credentials", AsyncMock(return_value=_FakeRejectedResp())):
        await flow.async_step_ble_push_creds()
        task = flow._ble_push_creds_task
        with pytest.raises(BleProvisionError):
            await task
        result = await flow.async_step_ble_push_creds()

    assert result["step_id"] == "thread_creds_source"


async def test_ble_onboarding_done_stashes_token_and_disconnects(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    flow._label_id = "3ZP3"
    flow._ble_auth_token_hex = "deadbeef"
    fake_client = _FakeBleakClient()
    flow._ble_client = fake_client

    result = await flow.async_step_ble_onboarding_done()

    assert result["type"].value == "abort"
    assert result["reason"] == "ble_onboarding_complete"
    assert hass.data[PENDING_TOKENS_KEY]["3ZP3"] == "deadbeef"
    fake_client.disconnect.assert_awaited_once()


def test_correct_display_name_casing_fixes_only_the_magrgb_brand_words() -> None:
    # The real strip's own firmware advertises this wrong-cased — fixed for display.
    assert cf._correct_display_name_casing("Secretlab MAGRGB AB12") == "SecretLab MagRGB AB12"
    # Other Nanoleaf Essentials devices on the same LTPDU protocol advertise their own
    # model name, which isn't ours to rewrite.
    assert cf._correct_display_name_casing("Nanoleaf Essentials A19 XY34") == "Nanoleaf Essentials A19 XY34"


def test_instance_and_label_id_extraction_from_zeroconf_name() -> None:
    name = "Nanoleaf Essentials A19 XY34._ltpdu._udp.local."
    assert cf._instance_name_from_zeroconf_name(name) == "Nanoleaf Essentials A19 XY34"
    assert cf._label_id_from_zeroconf_name(name) == "XY34"


async def test_zeroconf_title_corrects_casing_for_a_magrgb_strip(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)

    class _FakeZeroconfInfo:
        name = "Secretlab MAGRGB AB12._ltpdu._udp.local."
        ip_address = "fd12:3456:789a:1:1111:2222:3333:4444"
        port = 5683

    with (
        patch.object(cf.NanoleafLtpduConfigFlow, "async_set_unique_id", AsyncMock(return_value=None)),
        patch.object(cf.NanoleafLtpduConfigFlow, "_abort_if_unique_id_configured", lambda self, **kw: None),
    ):
        await flow.async_step_zeroconf(_FakeZeroconfInfo())

    assert flow._device_name == "SecretLab MagRGB AB12"
    assert flow.context["title_placeholders"] == {"name": "SecretLab MagRGB AB12"}


async def test_zeroconf_title_uses_the_actual_model_for_a_non_magrgb_device(hass: HomeAssistant) -> None:
    """A discovered device that isn't a MAGRGB strip (e.g. one of the Essentials A19
    bulbs, which share the same LTPDU zeroconf service) must not be mislabeled with
    this integration's namesake product name."""
    flow = _make_flow(hass)

    class _FakeZeroconfInfo:
        name = "Nanoleaf Essentials A19 XY34._ltpdu._udp.local."
        ip_address = "fd12:3456:789a:1:1111:2222:3333:4444"
        port = 5683

    with (
        patch.object(cf.NanoleafLtpduConfigFlow, "async_set_unique_id", AsyncMock(return_value=None)),
        patch.object(cf.NanoleafLtpduConfigFlow, "_abort_if_unique_id_configured", lambda self, **kw: None),
    ):
        await flow.async_step_zeroconf(_FakeZeroconfInfo())

    assert flow._device_name == "Nanoleaf Essentials A19 XY34"
    assert flow.context["title_placeholders"] == {"name": "Nanoleaf Essentials A19 XY34"}


async def test_bluetooth_discovery_title_corrects_casing(hass: HomeAssistant) -> None:
    flow = _make_flow(hass)
    discovery_info = _FakeServiceInfo("AA:BB:CC:DD:EE:FF", "Secretlab MAGRGB AB12")

    with (
        patch.object(cf.NanoleafLtpduConfigFlow, "async_set_unique_id", AsyncMock(return_value=None)),
        patch.object(cf.NanoleafLtpduConfigFlow, "_abort_if_unique_id_configured", lambda self, **kw: None),
        patch.object(cf.NanoleafLtpduConfigFlow, "async_step_ble_pairing_code", AsyncMock(return_value={"stub": True})),
    ):
        await flow.async_step_bluetooth(discovery_info)

    assert flow.context["title_placeholders"] == {"name": "SecretLab MagRGB AB12"}


async def test_zeroconf_with_pending_token_skips_the_form(hass: HomeAssistant) -> None:
    """The whole point of PENDING_TOKENS_KEY: a strip onboarded via BLE moments ago
    shouldn't make the user re-enter a token they already have."""
    hass.data[PENDING_TOKENS_KEY] = {"3ZP3": "deadbeefcafebabe"}
    flow = _make_flow(hass)

    class _FakeZeroconfInfo:
        name = "Secretlab MAGRGB 3ZP3._ltpdu._udp.local."
        ip_address = "fd12:3456:789a:1:1111:2222:3333:4444"
        port = 5683

    # async_set_unique_id/_abort_if_unique_id_configured are HA's own well-tested
    # entry-dedup machinery, requiring a full hass.config_entries manager this file
    # doesn't stand up (see module docstring) — stubbed here so this test isolates
    # what we actually wrote: the pending-token lookup and pre-fill.
    with (
        patch.object(cf.NanoleafLtpduConfigFlow, "async_set_unique_id", AsyncMock(return_value=None)),
        patch.object(cf.NanoleafLtpduConfigFlow, "_abort_if_unique_id_configured", lambda self, **kw: None),
        patch.object(cf, "_try_connect"),
    ):
        result = await flow.async_step_zeroconf(_FakeZeroconfInfo())

    assert result["type"].value == "create_entry"
    assert result["data"][CONF_AUTH_TOKEN] == "deadbeefcafebabe"
    assert "3ZP3" not in hass.data[PENDING_TOKENS_KEY]  # consumed
