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
  fieldsForStyle,
  type SceneCapabilities,
  type SceneColor,
  type SceneLibraryResponse,
} from "./capabilities";
import { hexToHsb, hsbToHex } from "./color";
import type { HomeAssistant, LovelaceCardConfig } from "./ha-types";
import "./nanoleaf-scene-card-editor";

const DOMAIN = "nanoleaf_ltpdu";
const RESERVED_SCENE_NAME = "Northern Lights";

interface StripSnapshot {
  on: boolean;
  effect?: string;
  hsColor?: [number, number];
  brightness?: number;
}

function fieldLabel(field: string): string {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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

  // Scene editor — in-progress, unsaved. Save flow is a later milestone; this one
  // covers style/param/color editing and manual (button-triggered only — no
  // live/auto preview, per feedback) preview.
  @state() private _editorStyle?: string; // capitalized display name, e.g. "Fade"
  @state() private _editorParams: Record<string, number> = {};
  @state() private _editorColors: SceneColor[] = [];
  @state() private _previewError?: string;

  // The strip's state from just before the first Preview click in the current
  // editing session — set once, restored (and cleared) by Cancel. Not cleared by
  // further edits, since it describes the strip's prior state, not the editor's.
  @state() private _preSnapshot?: StripSnapshot;

  private _hass?: HomeAssistant;
  private _loadStarted = false;

  public static getStubConfig(): LovelaceCardConfig {
    return { type: "custom:nanoleaf-scene-card", entity: "" };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement("nanoleaf-scene-card-editor");
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
      this._resetEditor();
    } catch (err) {
      this._loadError = err instanceof Error ? err.message : String(err);
    }
  }

  // -- scene editor: style/params/colors + live preview -------------------------

  private _defaultParamsForStyle(styleName: string): Record<string, number> {
    const params: Record<string, number> = {};
    for (const [field, range] of fieldsForStyle(this._capabilities!, styleName)) {
      params[field] = Math.round((range.min + range.max) / 2);
    }
    return params;
  }

  private _resetEditor(): void {
    if (!this._capabilities) {
      return;
    }
    const firstStyle = Object.keys(this._capabilities.motion_styles)[0];
    this._editorStyle = firstStyle;
    this._editorParams = this._defaultParamsForStyle(firstStyle);
    this._editorColors = [{ hue: 0, saturation: 100, brightness: 100 }];
  }

  private _loadRecipeIntoEditor(name: string): void {
    const recipe = this._library?.recipes[name];
    if (!recipe) {
      return;
    }
    this._editorStyle = capitalize(recipe.motion_style);
    this._editorParams = { ...recipe.motion_params };
    this._editorColors = recipe.colors.map((c) => ({ ...c }));
  }

  private _onStyleSelect(styleName: string): void {
    this._editorStyle = styleName;
    this._editorParams = this._defaultParamsForStyle(styleName);
  }

  private _onParamInput(field: string, value: number): void {
    this._editorParams = { ...this._editorParams, [field]: value };
  }

  private _onColorInput(index: number, hex: string): void {
    const colors = [...this._editorColors];
    colors[index] = hexToHsb(hex);
    this._editorColors = colors;
  }

  private _addColorSlot(): void {
    const max = this._capabilities?.color_slots.max ?? 7;
    if (this._editorColors.length >= max) {
      return;
    }
    this._editorColors = [...this._editorColors, { hue: 0, saturation: 100, brightness: 100 }];
  }

  private _removeColorSlot(index: number): void {
    const min = this._capabilities?.color_slots.min ?? 1;
    if (this._editorColors.length <= min) {
      return;
    }
    this._editorColors = this._editorColors.filter((_, i) => i !== index);
  }

  private _captureSnapshot(): void {
    const entityId = this._config!.entity as string;
    const entity = this._hass!.states[entityId];
    if (!entity) {
      return;
    }
    this._preSnapshot = {
      on: entity.state === "on",
      effect: entity.attributes.effect as string | undefined,
      hsColor: entity.attributes.hs_color as [number, number] | undefined,
      brightness: entity.attributes.brightness as number | undefined,
    };
  }

  private async _previewNow(): Promise<void> {
    if (!this._hass || !this._editorStyle) {
      return;
    }
    if (!this._preSnapshot) {
      this._captureSnapshot();
    }
    const entityId = this._config!.entity as string;
    try {
      await this._hass.callService(
        DOMAIN,
        "preview_scene",
        {
          motion_style: this._editorStyle.toLowerCase(),
          motion_params: this._editorParams,
          colors: this._editorColors,
        },
        { entity_id: entityId }
      );
      this._previewError = undefined;
    } catch (err) {
      this._previewError = err instanceof Error ? err.message : String(err);
    }
  }

  private async _cancelPreview(): Promise<void> {
    const snapshot = this._preSnapshot;
    if (!snapshot || !this._hass) {
      return;
    }
    const entityId = this._config!.entity as string;
    try {
      if (!snapshot.on) {
        await this._hass.callService("light", "turn_off", { entity_id: entityId });
      } else if (snapshot.effect) {
        await this._hass.callService("light", "turn_on", { entity_id: entityId, effect: snapshot.effect });
      } else {
        const data: Record<string, unknown> = { entity_id: entityId };
        if (snapshot.hsColor) {
          data.hs_color = snapshot.hsColor;
        }
        if (snapshot.brightness !== undefined) {
          data.brightness = snapshot.brightness;
        }
        await this._hass.callService("light", "turn_on", data);
      }
      this._preSnapshot = undefined;
      this._previewError = undefined;
    } catch (err) {
      this._previewError = err instanceof Error ? err.message : String(err);
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
                        <button class="load" @click=${() => this._loadRecipeIntoEditor(name)}>Load into editor</button>
                      </li>
                    `;
                  })}
                </ul>
              `}

          ${this._capabilities ? this._renderEditor() : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderEditor() {
    const caps = this._capabilities!;
    const styleNames = Object.keys(caps.motion_styles);
    const fields = this._editorStyle ? fieldsForStyle(caps, this._editorStyle) : [];
    const colorMax = caps.color_slots.max;
    const colorMin = caps.color_slots.min;

    return html`
      <h3>
        Scene editor
        <button class="load" @click=${() => this._resetEditor()}>New scene</button>
      </h3>
      ${this._previewError ? html`<p class="error">${this._previewError}</p>` : nothing}

      <label class="field">
        <span>Motion style</span>
        <select @change=${(e: Event) => this._onStyleSelect((e.target as HTMLSelectElement).value)}>
          ${styleNames.map(
            (name) => html`<option value=${name} ?selected=${name === this._editorStyle}>${name}</option>`
          )}
        </select>
      </label>

      ${fields.map(([field, range]) => {
        const value = this._editorParams[field] ?? range.min;
        const isToggle = range.max - range.min === 1;
        const note = caps.field_notes[field];
        return html`
          <label class="field">
            <span>${fieldLabel(field)}${note ? html`<span class="muted"> — ${note}</span>` : nothing}</span>
            ${isToggle
              ? html`<input
                  type="checkbox"
                  .checked=${value === range.max}
                  @change=${(e: Event) =>
                    this._onParamInput(field, (e.target as HTMLInputElement).checked ? range.max : range.min)}
                />`
              : html`
                  <input
                    type="range"
                    min=${range.min}
                    max=${range.max}
                    .value=${String(value)}
                    @input=${(e: Event) => this._onParamInput(field, Number((e.target as HTMLInputElement).value))}
                  />
                  <span class="value">${value}</span>
                `}
          </label>
        `;
      })}

      <div class="colors">
        <span>Colors</span>
        <div class="color-slots">
          ${this._editorColors.map(
            (color, index) => html`
              <span class="color-slot">
                <input
                  type="color"
                  .value=${hsbToHex(color)}
                  @input=${(e: Event) => this._onColorInput(index, (e.target as HTMLInputElement).value)}
                />
                ${this._editorColors.length > colorMin
                  ? html`<button class="delete" @click=${() => this._removeColorSlot(index)}>✕</button>`
                  : nothing}
              </span>
            `
          )}
          ${this._editorColors.length < colorMax
            ? html`<button class="add-color" @click=${() => this._addColorSlot()}>+</button>`
            : nothing}
        </div>
      </div>

      <button class="preview" @click=${() => this._previewNow()}>Preview</button>
      ${this._preSnapshot
        ? html`<button class="cancel" @click=${() => this._cancelPreview()}>Cancel preview</button>`
        : nothing}
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
    .load {
      background: none;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 2px 8px;
      margin-left: 8px;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .field > span:first-child {
      flex: 0 0 40%;
    }
    .field input[type="range"] {
      flex: 1;
    }
    .field .value {
      flex: 0 0 2.5em;
      text-align: right;
    }
    .colors {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
    }
    .color-slots {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }
    .color-slot {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .color-slot input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
    }
    .add-color {
      width: 32px;
      height: 32px;
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px;
      background: none;
      cursor: pointer;
      font-size: 1.2em;
      color: var(--primary-text-color);
    }
    .preview {
      margin-top: 8px;
      border: none;
      border-radius: 4px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      padding: 8px 16px;
      cursor: pointer;
    }
    .cancel {
      margin-top: 8px;
      margin-left: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: none;
      color: var(--primary-text-color);
      padding: 8px 16px;
      cursor: pointer;
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
