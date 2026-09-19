// The "Nanoleaf Scenes" sidebar page: a strip picker (auto-selected when there's
// only one) wrapping the existing <nanoleaf-scene-card> editor unmodified. HA sets
// hass/narrow/route/panel directly on this element the same way Lovelace sets
// .hass on a card (confirmed live — see the plan's Milestone 1).
import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import { fetchStrips, type StripsResponse } from "./capabilities";
import { describeError } from "./errors";
import type { HomeAssistant } from "./ha-types";
import "./nanoleaf-scene-card";
import type { NanoleafSceneCard } from "./nanoleaf-scene-card";

@customElement("nanoleaf-scene-panel")
export class NanoleafScenePanel extends LitElement {
  @state() private _strips?: StripsResponse["strips"];
  @state() private _selected?: string;
  @state() private _loadError?: string;

  private _hass?: HomeAssistant;
  private _loadStarted = false;
  private _cardRef: Ref<NanoleafSceneCard> = createRef();
  private _cardConfiguredFor?: string;

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._loadStarted) {
      this._loadStarted = true;
      void this._loadStrips();
    }
    this.requestUpdate();
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private async _loadStrips(): Promise<void> {
    if (!this._hass) {
      return;
    }
    try {
      const { strips } = await fetchStrips(this._hass);
      this._strips = strips;
      const ids = Object.keys(strips);
      if (ids.length === 1) {
        this._selected = ids[0];
      }
    } catch (err) {
      this._loadError = describeError(err);
    }
  }

  private _onSelect(entityId: string): void {
    this._selected = entityId || undefined;
  }

  // Keeps the embedded card's .hass/setConfig in sync imperatively — it isn't a
  // reactive property on that element, just like on a real Lovelace dashboard.
  protected updated(): void {
    const card = this._cardRef.value;
    if (!card || !this._selected || !this._hass) {
      return;
    }
    card.hass = this._hass;
    if (this._cardConfiguredFor !== this._selected) {
      card.setConfig({ type: "custom:nanoleaf-scene-card", entity: this._selected });
      this._cardConfiguredFor = this._selected;
    }
  }

  protected render() {
    if (!this._hass) {
      return nothing;
    }
    if (this._loadError) {
      return html`<div class="content"><p class="error">${this._loadError}</p></div>`;
    }
    if (!this._strips) {
      return html`<div class="content"><p>Loading…</p></div>`;
    }

    const ids = Object.keys(this._strips);
    if (ids.length === 0) {
      return html`
        <div class="content">
          <h1>Nanoleaf Scenes</h1>
          <p class="muted">No Nanoleaf LTPDU strips configured yet. Add one under Settings → Devices & Services.</p>
        </div>
      `;
    }

    return html`
      <div class="content">
        <h1>Nanoleaf Scenes</h1>
        ${ids.length > 1
          ? html`
              <label class="field">
                <span>Strip</span>
                <select @change=${(e: Event) => this._onSelect((e.target as HTMLSelectElement).value)}>
                  <option value="" ?selected=${!this._selected}>Select a strip…</option>
                  ${ids.map(
                    (id) =>
                      html`<option value=${id} ?selected=${id === this._selected}>${this._strips![id].name}</option>`
                  )}
                </select>
              </label>
            `
          : nothing}
        ${this._selected ? html`<nanoleaf-scene-card ${ref(this._cardRef)}></nanoleaf-scene-card>` : nothing}
      </div>
    `;
  }

  static styles = css`
    .content {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5em;
      margin: 0 0 16px;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .muted {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-panel": NanoleafScenePanel;
  }
}
