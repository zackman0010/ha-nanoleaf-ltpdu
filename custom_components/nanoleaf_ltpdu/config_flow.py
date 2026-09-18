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
from homeassistant.data_entry_flow import AbortFlow
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
    DISCOVERY_SIGHTINGS_KEY,
    DOMAIN,
    LOGGER,
    NANOLEAF_BLE_MANUFACTURER_ID,
    PENDING_TOKENS_KEY,
    ZEROCONF_SERVICE_TYPE,
)
from .protocol import coap
from .protocol import device as protocol_device
from .protocol.ble_provision import BleConnectionError, BleProvisionError, BleProvisioner
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
    """The device's own advertised "<model> <label_id>" name — everything before the
    service-type suffix. Not always a MAGRGB strip; other Nanoleaf Essentials devices
    share this same LTPDU zeroconf service under their own model name."""
    return name.split(f".{ZEROCONF_SERVICE_TYPE}")[0]


def _label_id_from_zeroconf_name(name: str) -> str:
    """The label ID is the last space-separated token of the instance name."""
    return _instance_name_from_zeroconf_name(name).rsplit(" ", 1)[-1]


def _label_id_from_ble_name(name: str | None) -> str | None:
    """The BLE local_name has the same '<model> <label_id>' shape as the mDNS
    instance name, just without a service-type suffix to strip."""
    if not name:
        return None
    return name.rsplit(" ", 1)[-1]


# The real strips' firmware advertises this brand name mis-cased — corrected here for
# display without touching any other Nanoleaf Essentials device's own advertised name.
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
        # Discovered device's own model name (case-corrected), set by
        # async_step_zeroconf. Used for the entry/device title.
        self._device_name: str | None = None

        # The BleakClient + BleProvisioner are kept alive across multiple flow steps
        # (pairing_code entry, thread_creds_source, possibly manual_thread_creds) —
        # the encrypted session pair() establishes is reused by
        # write_thread_credentials(). See async_remove() for cleanup if the user
        # abandons the flow partway through.
        self._ble_discovered: dict[str, str | None] = {}  # address -> label_id
        self._ble_address: str | None = None
        self._ble_client: BleakClientWithServiceCache | None = None
        self._ble_provisioner: BleProvisioner | None = None
        self._pairing_code: str | None = None
        self._ble_auth_token_hex: str | None = None
        self._thread_creds: ThreadCredentials | None = None
        self._ble_pair_task: asyncio.Task | None = None
        self._ble_push_creds_task: asyncio.Task | None = None
        self._ble_step_error: str | None = None

        # Populated by _async_check_dual_discovery() when both zeroconf and BLE have
        # sighted the same device — {"zeroconf": {...}, "ble": {...}}. See
        # async_step_discovery_choice.
        self._discovery_sightings: dict[str, dict[str, str]] = {}

    async def async_remove(self) -> None:
        """Clean up an open BLE connection if the flow is abandoned mid-onboarding."""
        if self._ble_client is not None and self._ble_client.is_connected:
            await self._ble_client.disconnect()

    async def async_step_zeroconf(self, discovery_info: ZeroconfServiceInfo) -> ConfigFlowResult:
        instance_name = _instance_name_from_zeroconf_name(discovery_info.name)
        label_id = _label_id_from_zeroconf_name(discovery_info.name)
        # raise_on_progress=False: a strip already Thread-joined but not yet added to
        # HA is discoverable via both this zeroconf service and its still-advertising
        # LTPDU BLE broadcast (see async_step_bluetooth) — both paths use the same
        # plain label_id as unique_id. We want the chance to notice that and offer a
        # choice (_async_check_dual_discovery) rather than have HA's default
        # raise_on_progress silently abort whichever fires second.
        await self.async_set_unique_id(label_id, raise_on_progress=False)
        # ZeroconfServiceInfo.ip_address is already the most-recently-updated address
        # that is NOT link-local/unspecified — no manual filtering needed here.
        host = str(discovery_info.ip_address)
        self._abort_if_unique_id_configured(updates={CONF_HOST: host})

        self._discovered_host = host
        self._discovered_port = discovery_info.port or DEFAULT_PORT
        self._label_id = label_id
        self._device_name = _correct_display_name_casing(instance_name)
        self.context["title_placeholders"] = {"name": self._device_name}

        # A strip just onboarded via this integration's own BLE flow stashes its
        # freshly-minted token here before its Thread join propagates to mDNS — skip
        # asking the user for a token they'd have no way to look up themselves, and
        # skip the dual-discovery choice below too (we already know how it was added).
        pending_tokens: dict[str, str] = self.hass.data.get(PENDING_TOKENS_KEY, {})
        if label_id in pending_tokens:
            return await self.async_step_zeroconf_confirm({CONF_AUTH_TOKEN: pending_tokens[label_id]})

        if await self._async_check_dual_discovery(
            label_id, "zeroconf", {"host": host, "port": str(self._discovered_port), "name": self._device_name}
        ):
            return await self.async_step_discovery_choice()
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
        onboarding (a factory-reset strip)."""
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

    # -- BLE onboarding ----------------------------------------------------------------
    #
    # Entry points: async_step_bluetooth (HA's manifest matcher found a strip
    # advertising) or async_step_ble_scan (user chose "Add via BLE" from the
    # async_step_user menu and picks from a live scan). Both converge on
    # async_step_ble_pairing_code once self._ble_address (+ self._label_id, if known)
    # is set.

    async def async_step_bluetooth(self, discovery_info: BluetoothServiceInfoBleak) -> ConfigFlowResult:
        """Triggered automatically when a device matches manifest.json's matcher
        (Nanoleaf mfg ID + the "NLM0" advertisement prefix).

        Each strip has a separate BLE address for HomeKit (stops advertising once set
        up) and one for LTPDU (keeps advertising indefinitely, even after the strip
        joins Thread and starts advertising `_ltpdu._udp.local.` over zeroconf too).
        So an already-configured strip keeps matching this matcher forever —
        re-running the BLE pairing handshake against it would mint a brand new auth
        token as if it were unprovisioned, so bail out before showing a card at all.

        Uses the same plain label_id as async_step_zeroconf's unique_id (falling back
        to an address-based one only when the label_id can't be parsed from the
        advertised name). Rather than letting async_set_unique_id()'s default
        raise_on_progress silently abort whichever of the two discovery sources fires
        second for the same physical device, _async_check_dual_discovery notices that
        case and offers the user an explicit choice instead — see its docstring."""
        self._ble_address = discovery_info.address
        self._label_id = _label_id_from_ble_name(discovery_info.name)

        if self._label_id is not None:
            for entry in self.hass.config_entries.async_entries(DOMAIN):
                if entry.data.get(CONF_LABEL_ID) == self._label_id:
                    return self.async_abort(reason="already_configured")

        unique_id = self._label_id or f"ble_onboarding_{discovery_info.address}"
        await self.async_set_unique_id(unique_id, raise_on_progress=False)
        self._abort_if_unique_id_configured()
        display_name = (
            _correct_display_name_casing(discovery_info.name) if discovery_info.name else discovery_info.address
        )
        self.context["title_placeholders"] = {"name": display_name}

        # Only a label_id-keyed unique_id can collide with a zeroconf sighting of the
        # same physical device — the address-fallback ID (used when the label_id
        # couldn't be parsed from the advertised name) never matches anything zeroconf
        # sets, so there's nothing to offer a choice between.
        if self._label_id is not None and await self._async_check_dual_discovery(
            self._label_id, "ble", {"address": discovery_info.address, "name": display_name}
        ):
            return await self.async_step_discovery_choice()
        return await self.async_step_ble_pairing_code()

    async def _async_check_dual_discovery(self, label_id: str, source: str, sighting: dict[str, str]) -> bool:
        """Record this discovery source's sighting of label_id, and detect whether
        the OTHER source (zeroconf vs. BLE) has already sighted the same physical
        device via a still-in-progress sibling flow.

        Returns False when this is the only/first sighting so far — the caller should
        proceed with its own normal single-path flow, unchanged from before this
        feature existed. Returns True when a sibling flow from the OTHER source is
        already showing its own card — that sibling is aborted here (this flow takes
        over as the sole survivor) and self._discovery_sightings is populated for
        async_step_discovery_choice to read from.

        Also handles the case that matters for correctness, not just UX: a sibling
        flow already in progress from THIS SAME source (e.g. zeroconf re-announcing
        while its own flow is still up) must still self-abort exactly like
        async_set_unique_id's own raise_on_progress would have — otherwise disabling
        raise_on_progress here (needed so BOTH sources get a chance to reach this
        logic at all) would let genuine duplicate discovery events of the same source
        each spawn their own separate card.

        Ordering note: whichever source discovers the device LAST is the one that
        ends up showing the chooser (it's the one that can see both sightings) —
        this resolves correctly regardless of which source happens to fire first.
        If only one source ever fires, this never triggers and nothing changes."""
        all_sightings: dict[str, dict[str, dict[str, str]]] = self.hass.data.setdefault(DISCOVERY_SIGHTINGS_KEY, {})
        sightings_for_device = all_sightings.setdefault(label_id, {})

        sibling_flow_ids = [
            progress["flow_id"]
            for progress in self.hass.config_entries.flow.async_progress_by_handler(
                DOMAIN, include_uninitialized=True, match_context={"unique_id": label_id}
            )
            if progress["flow_id"] != self.flow_id
        ]
        already_seen_by_this_source = source in sightings_for_device
        sightings_for_device[source] = sighting

        if not sibling_flow_ids:
            return False

        if already_seen_by_this_source:
            raise AbortFlow("already_in_progress")

        for flow_id in sibling_flow_ids:
            self.hass.config_entries.flow.async_abort(flow_id)
        self._discovery_sightings = sightings_for_device
        return True

    async def async_step_discovery_choice(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Shown only when _async_check_dual_discovery found the device via both
        zeroconf and BLE. Each menu option sources its data from
        self._discovery_sightings rather than assuming which of self._discovered_host
        / self._ble_address this particular flow instance already has set — this flow
        may have originated from EITHER discovery source (whichever fired last)."""
        return self.async_show_menu(
            step_id="discovery_choice",
            menu_options=["discovery_choice_thread", "discovery_choice_ble"],
        )

    async def async_step_discovery_choice_thread(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        sighting = self._discovery_sightings["zeroconf"]
        self._discovered_host = sighting["host"]
        self._discovered_port = int(sighting["port"])
        self._device_name = sighting["name"]
        return await self.async_step_zeroconf_confirm()

    async def async_step_discovery_choice_ble(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        sighting = self._discovery_sightings["ble"]
        self._ble_address = sighting["address"]
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
        except BleConnectionError as err:
            LOGGER.debug("BLE connection failed for %s: %s", self._ble_address, err)
            self._ble_step_error = "ble_connection_failed"
            return self.async_show_progress_done(next_step_id="ble_pairing_code")
        except BleProvisionError as err:
            LOGGER.debug("BLE pairing failed for %s: %s", self._ble_address, err)
            self._ble_step_error = "ble_pairing_failed"
            return self.async_show_progress_done(next_step_id="ble_pairing_code")
        finally:
            self._ble_pair_task = None
        return self.async_show_progress_done(next_step_id="thread_creds_source")

    async def _async_do_ble_pair(self) -> None:
        """Every exception raised here must end up as a BleProvisionError (or the
        BleConnectionError subclass) — async_step_ble_pair only catches those. Letting
        anything else (e.g. bleak_retry_connector's BleakNotFoundError, or a raw
        TimeoutError from an ESPHome Bluetooth proxy) escape uncaught previously left
        the config flow's step orchestration crashing with an unhandled exception:
        the frontend just spun forever with nothing but a logged error to explain why,
        instead of showing the user a real error and a way to retry."""
        assert self._ble_address is not None
        assert self._pairing_code is not None
        ble_device = bluetooth.async_ble_device_from_address(self.hass, self._ble_address, connectable=True)
        if ble_device is None:
            raise BleConnectionError("device not found — it may be out of range or no longer advertising")
        try:
            self._ble_client = await establish_connection(
                BleakClientWithServiceCache, ble_device, f"{DOMAIN}-{self._ble_address}", max_attempts=3
            )
        except Exception as err:
            raise BleConnectionError(f"could not establish a Bluetooth connection: {err}") from err

        self._ble_provisioner = BleProvisioner(self._ble_address, self._pairing_code, client=self._ble_client)
        try:
            token = await self._ble_provisioner.pair()
        except BleProvisionError:
            raise
        except Exception as err:
            raise BleConnectionError(f"Bluetooth connection lost during pairing: {err}") from err
        self._ble_auth_token_hex = token.hex()

    async def async_step_thread_creds_source(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="thread_creds_source", menu_options=["use_ha_dataset", "manual_thread_creds"])

    async def async_step_use_ha_dataset(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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
        except BleConnectionError as err:
            LOGGER.debug("BLE connection failed pushing Thread credentials to %s: %s", self._ble_address, err)
            self._ble_step_error = "ble_connection_failed"
            return self.async_show_progress_done(next_step_id="thread_creds_source")
        except BleProvisionError:
            self._ble_step_error = "thread_credentials_rejected"
            return self.async_show_progress_done(next_step_id="thread_creds_source")
        finally:
            self._ble_push_creds_task = None
        return self.async_show_progress_done(next_step_id="ble_onboarding_done")

    async def _async_do_push_creds(self) -> None:
        """See _async_do_ble_pair's docstring — same requirement that every exception
        here end up as a BleProvisionError/BleConnectionError, never escape raw."""
        assert self._ble_provisioner is not None
        assert self._thread_creds is not None
        try:
            resp = await self._ble_provisioner.write_thread_credentials(self._thread_creds)
        except BleProvisionError:
            raise
        except Exception as err:
            raise BleConnectionError(f"Bluetooth connection lost while sending Thread credentials: {err}") from err
        if resp.code != 0x44:  # CoAP 2.04 Changed
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
