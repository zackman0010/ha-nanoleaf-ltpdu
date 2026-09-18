// Milestone 1 (per the plan): a minimal live-registration smoke test. Renders the
// configured entity's current state and nothing else — the real scene-editor UI
// (capabilities/library fetch, saved-scene list, editor, save/delete/preview) comes
// in later milestones, once this shell is confirmed loading and rendering in a real
// dashboard via __init__.py's add_extra_js_url registration.
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HomeAssistant, LovelaceCardConfig } from "./ha-types";

@customElement("nanoleaf-scene-card")
export class NanoleafSceneCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: LovelaceCardConfig;

  public static getStubConfig(): LovelaceCardConfig {
    return { type: "custom:nanoleaf-scene-card", entity: "" };
  }

  public setConfig(config: LovelaceCardConfig): void {
    if (!config.entity) {
      throw new Error("nanoleaf-scene-card requires an `entity`");
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 3;
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }
    const entityId = this._config.entity as string;
    const entity = this.hass.states[entityId];
    return html`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${entity
            ? html`<p>${entityId}: <strong>${entity.state}</strong></p>`
            : html`<p>Entity not found: ${entityId}</p>`}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    .content {
      padding: 0 16px 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-card": NanoleafSceneCard;
  }
}

// Registers with HA's "Add Card" picker so the card is discoverable without a
// visual config editor (see the plan's deferred-items list).
interface CustomCardWindow extends Window {
  customCards: Record<string, unknown>[];
}
(window as unknown as CustomCardWindow).customCards ??= [];
(window as unknown as CustomCardWindow).customCards.push({
  type: "nanoleaf-scene-card",
  name: "Nanoleaf Scene Editor",
  description: "Create, preview, and manage Nanoleaf LTPDU scenes.",
});
