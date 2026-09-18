// Milestone 2 (per the plan): capabilities + library fetch, and the two read-only
// lists — scenes saved on this device (from the entity's own effect_list attribute,
// with activate + delete) and the shared scene library (browse only; "load into
// editor" arrives with the editor itself in Milestone 3).
import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  capitalize,
  fetchCapabilities,
  fetchLibrary,
  type SceneCapabilities,
  type SceneLibraryResponse,
} from "./capabilities";
import type { HomeAssistant, LovelaceCardConfig } from "./ha-types";

const DOMAIN = "nanoleaf_ltpdu";
const RESERVED_SCENE_NAME = "Northern Lights";

@customElement("nanoleaf-scene-card")
export class NanoleafSceneCard extends LitElement {
  @state() private _config?: LovelaceCardConfig;
  @state() private _capabilities?: SceneCapabilities;
  @state() private _library?: SceneLibraryResponse;
  @state() private _loadError?: string;

  // Scenes just deleted via this card, hidden immediately rather than waiting for
  // the entity's effect_list attribute to catch up (save_scene/delete_scene don't
  // force a state push — see the plan's "Confirmed backend API" section).
  @state() private _locallyDeleted = new Set<string>();

  private _hass?: HomeAssistant;
  private _loadStarted = false;

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
    return 6;
  }

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._loadStarted) {
      this._loadStarted = true;
      void this._loadCapabilitiesAndLibrary();
    }
    this.requestUpdate();
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private async _loadCapabilitiesAndLibrary(): Promise<void> {
    if (!this._hass) {
      return;
    }
    try {
      const [capabilities, library] = await Promise.all([
        fetchCapabilities(this._hass),
        fetchLibrary(this._hass),
      ]);
      this._capabilities = capabilities;
      this._library = library;
    } catch (err) {
      this._loadError = err instanceof Error ? err.message : String(err);
    }
  }

  private async _activateScene(name: string): Promise<void> {
    const entityId = this._config!.entity as string;
    await this._hass!.callService("light", "turn_on", { entity_id: entityId, effect: name });
  }

  private async _deleteScene(name: string): Promise<void> {
    const entityId = this._config!.entity as string;
    this._locallyDeleted = new Set(this._locallyDeleted).add(name);
    try {
      await this._hass!.callService(DOMAIN, "delete_scene", { name }, { entity_id: entityId });
    } catch (err) {
      // Roll back the optimistic hide if the delete actually failed.
      const restored = new Set(this._locallyDeleted);
      restored.delete(name);
      this._locallyDeleted = restored;
      this._loadError = err instanceof Error ? err.message : String(err);
    }
  }

  private _savedSceneNames(): string[] {
    const entityId = this._config?.entity as string | undefined;
    const entity = entityId ? this._hass?.states[entityId] : undefined;
    const effectList = (entity?.attributes.effect_list as string[] | undefined) ?? [];
    return effectList.filter((name) => !this._locallyDeleted.has(name));
  }

  protected render() {
    if (!this._config || !this._hass) {
      return nothing;
    }
    const entityId = this._config.entity as string;
    const entity = this._hass.states[entityId];
    const savedNames = this._savedSceneNames();
    const recipeNames = this._library ? Object.keys(this._library.recipes) : [];

    return html`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${!entity ? html`<p class="error">Entity not found: ${entityId}</p>` : nothing}
          ${this._loadError ? html`<p class="error">${this._loadError}</p>` : nothing}
          ${!this._capabilities && !this._loadError ? html`<p>Loading…</p>` : nothing}

          <h3>Saved on this device</h3>
          ${savedNames.length === 0
            ? html`<p class="muted">No scenes saved yet.</p>`
            : html`
                <ul class="scene-list">
                  ${savedNames.map(
                    (name) => html`
                      <li>
                        <button class="scene-name" @click=${() => this._activateScene(name)}>${name}</button>
                        ${name === RESERVED_SCENE_NAME
                          ? nothing
                          : html`<button class="delete" @click=${() => this._deleteScene(name)}>✕</button>`}
                      </li>
                    `
                  )}
                </ul>
              `}

          <h3>Scene library</h3>
          ${recipeNames.length === 0
            ? html`<p class="muted">No scene recipes saved anywhere yet.</p>`
            : html`
                <ul class="scene-list">
                  ${recipeNames.map((name) => {
                    const recipe = this._library!.recipes[name];
                    const onThisDevice = savedNames.includes(name);
                    return html`
                      <li>
                        <span class="scene-name">${name}</span>
                        <span class="muted">(${capitalize(recipe.motion_style)}${onThisDevice ? " · on this device" : ""})</span>
                      </li>
                    `;
                  })}
                </ul>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    .content {
      padding: 0 16px 16px;
    }
    h3 {
      margin: 16px 0 8px;
      font-size: 1em;
    }
    .scene-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .scene-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
    }
    .scene-name {
      background: none;
      border: none;
      color: var(--primary-text-color);
      font-size: 1em;
      text-align: left;
      cursor: pointer;
      padding: 0;
    }
    button.scene-name:hover {
      text-decoration: underline;
    }
    .delete {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
    }
    .muted {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-card": NanoleafSceneCard;
  }
}

interface CustomCardWindow extends Window {
  customCards: Record<string, unknown>[];
}
(window as unknown as CustomCardWindow).customCards ??= [];
(window as unknown as CustomCardWindow).customCards.push({
  type: "nanoleaf-scene-card",
  name: "Nanoleaf Scene Editor",
  description: "Create, preview, and manage Nanoleaf LTPDU scenes.",
});
