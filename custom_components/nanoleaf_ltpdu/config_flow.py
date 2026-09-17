"""Config flow for the Nanoleaf LTPDU integration.

Two onboarding paths:
1. Zeroconf discovery of an already-Thread-joined strip (async_step_zeroconf), plus a
   manual entry form (async_step_manual) for anyone adding one without discovery
   firing — e.g. on a network where mDNS doesn't reach HA.
2. Full BLE onboarding of a factory-reset strip (async_step_ble_scan onward):
   scan -> pairing code -> pair (BLE, HA's own Bluetooth integration) -> Thread
   credentials (HA's own active dataset, or manual entry) -> push over BLE -> done.
   This flow does NOT create the config entry itself — it stashes the freshly-minted
   auth token in PENDING_TOKENS_KEY and finishes; the strip joining the Thread mesh
   triggers HA's own zeroconf discovery moments later (already watching for
   `_ltpdu._udp.local.`, declared in manifest.json), which picks up the stashed token
   and creates the entry via the existing zeroconf path above. This avoids needing any
   bespoke "wait for mDNS with a timeout" logic here — HA's zeroconf integration
   already does exactly that, indefinitely, as part of its normal operation.
"""
from __future__ import annotations

import asyncio
from typing import Any

import voluptuous as vol
from bleak_retry_connector import BleakClientWithServiceCache, establish_connection

from homeassistant.components import bluetooth
from homeassistant.components.bluetooth import BluetoothServiceInfoBleak
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.service_info.zeroconf import ZeroconfServiceInfo

from .const import (
    CONF_AUTH_TOKEN,
    CONF_BLE_ADDRESS,
    CONF_HOST,
    CONF_LABEL_ID,
    CONF_PAIRING_CODE,
    CONF_PORT,
    CONF_THREAD_CHANNEL,
    CONF_THREAD_EXTPANID,
    CONF_THREAD_NETWORK_NAME,
    CONF_THREAD_NETWORKKEY,
    CONF_THREAD_PANID,
    DEFAULT_PORT,
    DOMAIN,
    LOGGER,
    NANOLEAF_BLE_MANUFACTURER_ID,
    PENDING_TOKENS_KEY,
    ZEROCONF_SERVICE_TYPE,
)
from .protocol import coap
from .protocol import device as protocol_device
from .protocol.ble_provision import BleProvisionError, BleProvisioner
from .protocol.thread_credentials import ThreadCredentials

MANUAL_THREAD_CREDS_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_THREAD_NETWORK_NAME): str,
        vol.Required(CONF_THREAD_CHANNEL): vol.All(int, vol.Range(min=11, max=26)),
        vol.Required(CONF_THREAD_PANID): str,
        vol.Required(CONF_THREAD_EXTPANID): str,
        vol.Required(CONF_THREAD_NETWORKKEY): str,
    }
)

STEP_USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_LABEL_ID): str,
        vol.Required(CONF_HOST): str,
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
        vol.Required(CONF_AUTH_TOKEN): str,
    }
)


def _instance_name_from_zeroconf_name(name: str) -> str:
    """The mDNS instance name is literally the device's own advertised
    "<model> <label_id>" string, e.g. 'SecretLab MagRGB AB12._ltpdu._udp.local.' for a
    MAGRGB strip — but this integration also matches other Nanoleaf "Essentials"
    Thread/BLE devices sharing the same LTPDU protocol (see README), which advertise
    their own different model name here instead. This is everything before the
    service-type suffix."""
    return name.split(f".{ZEROCONF_SERVICE_TYPE}")[0]


def _label_id_from_zeroconf_name(name: str) -> str:
    """The label ID is the last space-separated token of the instance name."""
    return _instance_name_from_zeroconf_name(name).rsplit(" ", 1)[-1]


def _label_id_from_ble_name(name: str | None) -> str | None:
    """The BLE advertised local_name is the same '<model> <label_id>' shape as the
    mDNS instance name (confirmed live this session, ble_scan.py) — same last-space-
    token extraction, no service-type suffix to strip this time."""
    if not name:
        return None
    return name.rsplit(" ", 1)[-1]


# The real MAGRGB strips' own firmware advertises their model name with this wrong
# capitalization (confirmed live this session, ble_scan.py/mdns capture) — corrected
# here for display so titles read "SecretLab MagRGB" everywhere, without altering the
# advertised name of any other Nanoleaf Essentials device in the same LTPDU family
# (e.g. the A19 bulbs), which isn't ours to "fix".
_DISPLAY_NAME_WORD_CORRECTIONS = {"secretlab": "SecretLab", "magrgb": "MagRGB"}


def _correct_display_name_casing(name: str) -> str:
    return " ".join(_DISPLAY_NAME_WORD_CORRECTIONS.get(word.lower(), word) for word in name.split(" "))


def _try_connect(host: str, port: int, auth_token_hex: str) -> None:
    """Blocking — call via hass.async_add_executor_job(), never directly on the event
    loop. Raises protocol_device.DeviceError / OSError on failure."""
    dev = protocol_device.Device(host, auth_token_hex, port)
    try:
        dev.connect()
        dev.authenticate()
    finally:
        dev.close()


class NanoleafLtpduConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self) -> None:
        self._discovered_host: str | None = None
        self._discovered_port: int = DEFAULT_PORT
        self._label_id: str | None = None
        self._device_name: str | None = None  # e.g. "SecretLab MagRGB AB12" — the
        # discovered device's own model name (case-corrected), set by
        # async_step_zeroconf and used for both the discovery card and the eventual
        # config entry's title so it reflects the actual device, not just this
        # integration's namesake product.

        # BLE onboarding state (Milestone 4). The BleakClient + BleProvisioner are
        # deliberately kept alive across multiple flow steps (pairing_code entry,
        # thread_creds_source, possibly manual_thread_creds) — the encrypted session
        # pair() establishes is reused by write_thread_credentials(), so the same BLE
        # connection must stay open the whole time. See async_remove() for cleanup if
        # the user abandons the flow partway through.
        self._ble_discovered: dict[str, str | None] = {}  # address -> label_id, from the ble_scan step
        self._ble_address: str | None = None
        self._ble_client: BleakClientWithServiceCache | None = None
        self._ble_provisioner: BleProvisioner | None = None
        self._pairing_code: str | None = None
        self._ble_auth_token_hex: str | None = None
        self._thread_creds: ThreadCredentials | None = None
        self._ble_pair_task: asyncio.Task | None = None
        self._ble_push_creds_task: asyncio.Task | None = None
        self._ble_step_error: str | None = None

    async def async_remove(self) -> None:
        """Clean up an open BLE connection if the flow is abandoned mid-onboarding."""
        if self._ble_client is not None and self._ble_client.is_connected:
            await self._ble_client.disconnect()

    async def async_step_zeroconf(self, discovery_info: ZeroconfServiceInfo) -> ConfigFlowResult:
        instance_name = _instance_name_from_zeroconf_name(discovery_info.name)
        label_id = _label_id_from_zeroconf_name(discovery_info.name)
        await self.async_set_unique_id(label_id)
        # ZeroconfServiceInfo.ip_address is already the most-recently-updated address
        # that is NOT link-local/unspecified — no manual filtering needed here.
        host = str(discovery_info.ip_address)
        self._abort_if_unique_id_configured(updates={CONF_HOST: host})

        self._discovered_host = host
        self._discovered_port = discovery_info.port or DEFAULT_PORT
        self._label_id = label_id
        self._device_name = _correct_display_name_casing(instance_name)
        # The suffix is discovery-card wording only — self._device_name (used for the
        # eventual entry/device registry title) stays clean of it. It exists because a
        # strip that's already Thread-joined but not yet added to HA (e.g. set up
        # through Nanoleaf's own app) is discoverable via *both* this zeroconf service
        # and its still-advertising LTPDU BLE broadcast (see async_step_bluetooth) —
        # callers need to tell the two cards apart: this one just needs the strip's
        # existing auth token, the Bluetooth one mints a brand new one.
        self.context["title_placeholders"] = {"name": f"{self._device_name} — found on network"}

        # A strip that was just onboarded via this integration's own BLE flow (below)
        # stashes its freshly-minted token here before its Thread join propagates to
        # mDNS — if that's what just triggered this discovery, skip asking the user
        # for a token they'd have no way to look up themselves.
        pending_tokens: dict[str, str] = self.hass.data.get(PENDING_TOKENS_KEY, {})
        if label_id in pending_tokens:
            return await self.async_step_zeroconf_confirm({CONF_AUTH_TOKEN: pending_tokens[label_id]})
        return await self.async_step_zeroconf_confirm()

    async def async_step_zeroconf_confirm(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            assert self._discovered_host is not None
            assert self._label_id is not None
            try:
                await self.hass.async_add_executor_job(
                    _try_connect, self._discovered_host, self._discovered_port, user_input[CONF_AUTH_TOKEN]
                )
            except (protocol_device.DeviceError, OSError):
                errors["base"] = "cannot_connect"
            else:
                self.hass.data.get(PENDING_TOKENS_KEY, {}).pop(self._label_id, None)
                return self.async_create_entry(
                    title=self._device_name or f"SecretLab MagRGB {self._label_id}",
                    data={
                        CONF_LABEL_ID: self._label_id,
                        CONF_HOST: self._discovered_host,
                        CONF_PORT: self._discovered_port,
                        CONF_AUTH_TOKEN: user_input[CONF_AUTH_TOKEN],
                    },
                )

        return self.async_show_form(
            step_id="zeroconf_confirm",
            data_schema=vol.Schema({vol.Required(CONF_AUTH_TOKEN): str}),
            errors=errors,
            description_placeholders={
                "label_id": self._label_id or "",
                "name": self._device_name or "",
            },
        )

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Entry point from "+ Add Integration": choose manual entry (an
        already-Thread-joined strip whose token you already have) or full BLE
        onboarding (a factory-reset strip — Milestone 4, see the BLE onboarding
        section below)."""
        return self.async_show_menu(step_id="user", menu_options=["manual", "ble_scan"])

    async def async_step_manual(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            await self.async_set_unique_id(user_input[CONF_LABEL_ID])
            self._abort_if_unique_id_configured(updates={CONF_HOST: user_input[CONF_HOST]})
            try:
                await self.hass.async_add_executor_job(
                    _try_connect, user_input[CONF_HOST], user_input[CONF_PORT], user_input[CONF_AUTH_TOKEN]
                )
            except (protocol_device.DeviceError, OSError):
                errors["base"] = "cannot_connect"
            else:
                return self.async_create_entry(
                    title=f"SecretLab MagRGB {user_input[CONF_LABEL_ID]}",
                    data=user_input,
                )

        return self.async_show_form(step_id="manual", data_schema=STEP_USER_SCHEMA, errors=errors)

    # -- BLE onboarding (Milestone 4) -------------------------------------------------
    #
    # Entry points: async_step_bluetooth (HA's manifest matcher found a factory-reset
    # strip advertising) or async_step_ble_scan (user chose "Add via BLE" from the
    # async_step_user menu and picks from a live scan). Both converge on
    # async_step_ble_pairing_code once self._ble_address (+ self._label_id, if known)
    # is set.

    async def async_step_bluetooth(self, discovery_info: BluetoothServiceInfoBleak) -> ConfigFlowResult:
        """Triggered automatically by HA's bluetooth integration when a device
        matching manifest.json's matcher (Nanoleaf mfg ID + the "NLM0" advertisement
        prefix confirmed this session) starts advertising.

        NOT necessarily a factory-reset strip: each strip has a separate BLE address
        for HomeKit (which stops advertising once set up) and one for LTPDU, and the
        LTPDU one keeps advertising indefinitely even after the strip has joined
        Thread and started advertising `_ltpdu._udp.local.` over zeroconf too
        (confirmed live this session). So an already-configured strip will keep
        matching this matcher forever — re-running the BLE pairing handshake against
        it would mint it a brand new auth token as if it were unprovisioned, which is
        never correct for a strip HA already has an entry for. Bail out before
        showing a card at all in that case.

        Namespaced with a "ble_onboarding_" unique_id prefix, distinct from the final
        entry's plain label_id unique_id, since this flow doesn't create an entry
        itself (see module docstring) and BLE addresses rotate on every factory reset
        anyway, so this dedup key has no long-term meaning beyond "don't show two
        discovery cards for the same in-progress advertisement."""
        self._ble_address = discovery_info.address
        self._label_id = _label_id_from_ble_name(discovery_info.name)

        if self._label_id is not None:
            for entry in self.hass.config_entries.async_entries(DOMAIN):
                if entry.data.get(CONF_LABEL_ID) == self._label_id:
                    return self.async_abort(reason="already_configured")

        await self.async_set_unique_id(f"ble_onboarding_{discovery_info.address}")
        self._abort_if_unique_id_configured()
        display_name = (
            _correct_display_name_casing(discovery_info.name) if discovery_info.name else discovery_info.address
        )
        # See the "found on network" suffix in async_step_zeroconf — this is the other
        # half of that same pair of discovery cards, for a strip that's already
        # Thread-joined (e.g. via Nanoleaf's own app) but not yet added to HA.
        self.context["title_placeholders"] = {"name": f"{display_name} — new pairing via Bluetooth"}
        return await self.async_step_ble_pairing_code()

    async def async_step_ble_scan(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._ble_address = user_input[CONF_BLE_ADDRESS]
            self._label_id = self._ble_discovered.get(self._ble_address)
            return await self.async_step_ble_pairing_code()

        self._ble_discovered = {
            info.address: _label_id_from_ble_name(info.name)
            for info in bluetooth.async_discovered_service_info(self.hass, connectable=True)
            if NANOLEAF_BLE_MANUFACTURER_ID in info.manufacturer_data
        }
        if not self._ble_discovered:
            return self.async_show_form(step_id="ble_scan", data_schema=vol.Schema({}), errors={"base": "no_devices_found"})
        choices = {addr: (label or addr) for addr, label in self._ble_discovered.items()}
        return self.async_show_form(
            step_id="ble_scan",
            data_schema=vol.Schema({vol.Required(CONF_BLE_ADDRESS): vol.In(choices)}),
        )

    async def async_step_ble_pairing_code(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if self._ble_step_error:
            errors["base"] = self._ble_step_error
            self._ble_step_error = None
        if user_input is not None:
            self._pairing_code = user_input[CONF_PAIRING_CODE]
            return await self.async_step_ble_pair()
        return self.async_show_form(
            step_id="ble_pairing_code",
            data_schema=vol.Schema({vol.Required(CONF_PAIRING_CODE): str}),
            errors=errors,
            description_placeholders={"label_id": self._label_id or "the strip"},
        )

    async def async_step_ble_pair(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Progress step: connect via HA's shared Bluetooth adapter (never a parallel
        BleakClient — see ble_provision.py's module docstring) and pair. HA's flow
        manager re-invokes this same step once self._ble_pair_task completes; the
        first call creates the task and shows a progress screen, the second call
        collects the result."""
        if self._ble_pair_task is None:
            self._ble_pair_task = self.hass.async_create_task(self._async_do_ble_pair())
            return self.async_show_progress(
                step_id="ble_pair", progress_action="ble_pairing", progress_task=self._ble_pair_task
            )
        try:
            await self._ble_pair_task
        except BleProvisionError as err:
            LOGGER.debug("BLE pairing failed for %s: %s", self._ble_address, err)
            self._ble_step_error = "ble_pairing_failed"
            return self.async_show_progress_done(next_step_id="ble_pairing_code")
        finally:
            self._ble_pair_task = None
        return self.async_show_progress_done(next_step_id="thread_creds_source")

    async def _async_do_ble_pair(self) -> None:
        assert self._ble_address is not None
        assert self._pairing_code is not None
        ble_device = bluetooth.async_ble_device_from_address(self.hass, self._ble_address, connectable=True)
        if ble_device is None:
            raise BleProvisionError("device not found — it may be out of range or no longer advertising")
        self._ble_client = await establish_connection(
            BleakClientWithServiceCache, ble_device, f"{DOMAIN}-{self._ble_address}", max_attempts=3
        )
        self._ble_provisioner = BleProvisioner(self._ble_address, self._pairing_code, client=self._ble_client)
        token = await self._ble_provisioner.pair()
        self._ble_auth_token_hex = token.hex()

    async def async_step_thread_creds_source(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="thread_creds_source", menu_options=["use_ha_dataset", "manual_thread_creds"])

    async def async_step_use_ha_dataset(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Confirmed real and top-level-importable (installed HA 2026.2.3) — see the
        plan file's note resolving what was originally an open question."""
        dataset_tlv_hex: str | None = None
        try:
            from homeassistant.components.thread import async_get_preferred_dataset

            dataset_tlv_hex = await async_get_preferred_dataset(self.hass)
        except ImportError:
            pass  # thread is an after_dependency, not a hard dependency — may not be loaded
        if not dataset_tlv_hex:
            return self.async_abort(reason="no_thread_dataset_available")
        self._thread_creds = ThreadCredentials.from_operational_dataset_tlv(dataset_tlv_hex)
        return await self.async_step_ble_push_creds()

    async def async_step_manual_thread_creds(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                self._thread_creds = ThreadCredentials.from_ot_ctl_dataset(
                    network_name=user_input[CONF_THREAD_NETWORK_NAME],
                    channel=user_input[CONF_THREAD_CHANNEL],
                    panid_hex=user_input[CONF_THREAD_PANID],
                    extpanid_hex=user_input[CONF_THREAD_EXTPANID],
                    networkkey_hex=user_input[CONF_THREAD_NETWORKKEY],
                )
            except ValueError:
                errors["base"] = "invalid_thread_credentials"
            else:
                return await self.async_step_ble_push_creds()
        return self.async_show_form(step_id="manual_thread_creds", data_schema=MANUAL_THREAD_CREDS_SCHEMA, errors=errors)

    async def async_step_ble_push_creds(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._ble_push_creds_task is None:
            self._ble_push_creds_task = self.hass.async_create_task(self._async_do_push_creds())
            return self.async_show_progress(
                step_id="ble_push_creds", progress_action="joining_thread", progress_task=self._ble_push_creds_task
            )
        try:
            await self._ble_push_creds_task
        except BleProvisionError:
            self._ble_step_error = "thread_credentials_rejected"
            return self.async_show_progress_done(next_step_id="thread_creds_source")
        finally:
            self._ble_push_creds_task = None
        return self.async_show_progress_done(next_step_id="ble_onboarding_done")

    async def _async_do_push_creds(self) -> None:
        assert self._ble_provisioner is not None
        assert self._thread_creds is not None
        resp = await self._ble_provisioner.write_thread_credentials(self._thread_creds)
        # 0x44 = CoAP 2.04 Changed — the confirmed-live success code for this exchange
        # (session 5's ble_join_thread.py validation against real hardware).
        if resp.code != 0x44:
            raise BleProvisionError(f"strip rejected Thread credentials (CoAP code {resp.code:#04x})")

    async def async_step_ble_onboarding_done(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Terminal step — does NOT create a config entry. See module docstring: the
        strip joining the Thread mesh triggers HA's own zeroconf discovery shortly
        after, which picks up the token stashed here and creates the entry."""
        if self._ble_client is not None and self._ble_client.is_connected:
            await self._ble_client.disconnect()
        if self._label_id and self._ble_auth_token_hex:
            self.hass.data.setdefault(PENDING_TOKENS_KEY, {})[self._label_id] = self._ble_auth_token_hex
        return self.async_abort(
            reason="ble_onboarding_complete",
            description_placeholders={"label_id": self._label_id or "The strip"},
        )
