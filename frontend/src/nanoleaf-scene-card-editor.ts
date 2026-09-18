// Visual config editor for the main card — lets the user pick an entity via HA's
// own built-in <ha-entity-picker> (globally registered by the frontend, no import
// needed) instead of typing YAML. Registered via NanoleafSceneCard's static
// getConfigElement().
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HomeAssistant, LovelaceCardConfig } from "./ha-types";

@customElement("nanoleaf-scene-card-editor")
export class NanoleafSceneCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: LovelaceCardConfig;

  public setConfig(config: LovelaceCardConfig): void {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }
    return html`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this._config.entity ?? ""}
        .includeDomains=${["light"]}
        label="Entity"
        allow-custom-entity
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>
    `;
  }

  private _entityChanged(ev: CustomEvent<{ value: string }>): void {
    const newConfig = { ...this._config, entity: ev.detail.value };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig }, bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-card-editor": NanoleafSceneCardEditor;
  }
}
