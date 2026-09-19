// The Nanoleaf scene-editor Lovelace card: capabilities + shared-library fetch, the
// two scene lists (saved on this device — from the entity's own effect_list
// attribute, with activate + delete; and the shared recipe library, browse + "load
// into editor"), and the editor itself (style/param/color/name editing,
// button-triggered preview with cancel-restores, and save).
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
import { describeError } from "./errors";
import type { HomeAssistant, LovelaceCardConfig } from "./ha-types";
import "./motion-preview";

const DOMAIN = "nanoleaf_ltpdu";
const RESERVED_SCENE_NAME = "Northern Lights";

interface StripSnapshot {
  on: boolean;
  effect?: string;
  hsColor?: [number, number];
  brightness?: number;
}

// Nanoleaf Desktop's own real per-style defaults (not guessed — every field of
// every style is covered, so no generic-midpoint fallback is needed).
const STYLE_DEFAULT_PARAMS: Record<string, Record<string, number>> = {
  Fade: { speed: 24, delay: 0, loop: 1 },
  Random: { speed: 24, delay: 0 },
  Highlight: { speed: 24, delay: 15, first_colour_frequency: 80 },
  Flow: { speed: 24, delay: 0, direction: 1, loop: 1 },
  Stripes: { speed: 24, direction: 1, segment: 50 },
};

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

  // Names just saved via this card, shown immediately for the same reason (the
  // symmetric case of _locallyDeleted above).
  @state() private _locallySaved = new Set<string>();

  // Scene editor — in-progress until Save is pressed.
  @state() private _editorStyle?: string; // capitalized display name, e.g. "Fade"
  @state() private _editorParams: Record<string, number> = {};
  @state() private _editorColors: SceneColor[] = [];
  @state() private _editorName = "";
  @state() private _previewError?: string;
  @state() private _saveError?: string;
  @state() private _saving = false;

  // The strip's state from just before the first Preview click in the current
  // editing session — set once, restored (and cleared) by Cancel. Not cleared by
  // further edits, since it describes the strip's prior state, not the editor's.
  @state() private _preSnapshot?: StripSnapshot;

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
      this._resetEditor();
    } catch (err) {
      this._loadError = describeError(err);
    }
  }

  // -- scene editor: style/params/colors + live preview -------------------------

  private _defaultParamsForStyle(styleName: string): Record<string, number> {
    const params: Record<string, number> = {};
    const knownDefaults = STYLE_DEFAULT_PARAMS[styleName] ?? {};
    for (const [field, range] of fieldsForStyle(this._capabilities!, styleName)) {
      params[field] = field in knownDefaults ? knownDefaults[field] : Math.round((range.min + range.max) / 2);
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
    this._editorName = "";
    this._saveError = undefined;
  }

  private _loadRecipeIntoEditor(name: string): void {
    const recipe = this._library?.recipes[name];
    if (!recipe) {
      return;
    }
    this._editorStyle = capitalize(recipe.motion_style);
    this._editorParams = { ...recipe.motion_params };
    this._editorColors = recipe.colors.map((c) => ({ ...c }));
    this._editorName = name;
    this._saveError = undefined;
  }

  private _onNameInput(value: string): void {
    this._editorName = value;
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
      this._previewError = describeError(err);
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
      this._previewError = describeError(err);
    }
  }

  private async _saveScene(): Promise<void> {
    const name = this._editorName.trim();
    if (!this._hass || !this._editorStyle) {
      return;
    }
    if (!name) {
      this._saveError = "Enter a name for the scene.";
      return;
    }
    if (name === RESERVED_SCENE_NAME) {
      this._saveError = `"${RESERVED_SCENE_NAME}" is a reserved factory scene and can't be overwritten.`;
      return;
    }
    const entityId = this._config!.entity as string;
    const motionStyle = this._editorStyle.toLowerCase();
    this._saving = true;
    try {
      await this._hass.callService(
        DOMAIN,
        "save_scene",
        { name, motion_style: motionStyle, motion_params: this._editorParams, colors: this._editorColors },
        { entity_id: entityId }
      );
      this._saveError = undefined;
      // Optimistic updates — save_scene doesn't force a state push (effect_list can
      // lag ~15s) and there's no reason to round-trip get_scene_library just to see
      // the recipe we already know we just wrote.
      this._locallySaved = new Set(this._locallySaved).add(name);
      const restoredFromDelete = new Set(this._locallyDeleted);
      restoredFromDelete.delete(name);
      this._locallyDeleted = restoredFromDelete;
      this._library = {
        recipes: {
          ...this._library?.recipes,
          [name]: { motion_style: motionStyle, motion_params: { ...this._editorParams }, colors: this._editorColors.map((c) => ({ ...c })) },
        },
      };
    } catch (err) {
      this._saveError = describeError(err);
    } finally {
      this._saving = false;
    }
  }

  private async _activateScene(name: string): Promise<void> {
    const entityId = this._config!.entity as string;
    await this._hass!.callService("light", "turn_on", { entity_id: entityId, effect: name });
  }

  private async _deleteScene(name: string): Promise<void> {
    const entityId = this._config!.entity as string;
    this._locallyDeleted = new Set(this._locallyDeleted).add(name);
    const savedRestore = new Set(this._locallySaved);
    const savedWithoutName = new Set(this._locallySaved);
    savedWithoutName.delete(name);
    this._locallySaved = savedWithoutName;
    try {
      await this._hass!.callService(DOMAIN, "delete_scene", { name }, { entity_id: entityId });
    } catch (err) {
      // Roll back the optimistic hide (and any optimistic "just saved" mark) if the
      // delete actually failed.
      const restored = new Set(this._locallyDeleted);
      restored.delete(name);
      this._locallyDeleted = restored;
      this._locallySaved = savedRestore;
      this._loadError = describeError(err);
    }
  }

  private _savedSceneNames(): string[] {
    const entityId = this._config?.entity as string | undefined;
    const entity = entityId ? this._hass?.states[entityId] : undefined;
    const effectList = (entity?.attributes.effect_list as string[] | undefined) ?? [];
    const names = new Set([...effectList, ...this._locallySaved]);
    for (const deleted of this._locallyDeleted) {
      names.delete(deleted);
    }
    return [...names];
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

      <nanoleaf-motion-preview
        .motionStyle=${this._editorStyle}
        .params=${this._editorParams}
        .colors=${this._editorColors}
      ></nanoleaf-motion-preview>
      <p class="muted preview-hint">
        Simulated approximation only — press Preview below to see it on the strip.
      </p>

      <button class="preview" @click=${() => this._previewNow()}>Preview</button>
      ${this._preSnapshot
        ? html`<button class="cancel" @click=${() => this._cancelPreview()}>Cancel preview</button>`
        : nothing}

      <label class="field name-field">
        <span>Name</span>
        <input
          type="text"
          .value=${this._editorName}
          placeholder="Scene name"
          @input=${(e: Event) => this._onNameInput((e.target as HTMLInputElement).value)}
        />
      </label>
      ${this._saveError ? html`<p class="error">${this._saveError}</p>` : nothing}
      <button class="save" ?disabled=${this._saving} @click=${() => this._saveScene()}>
        ${this._saving ? "Saving…" : "Save"}
      </button>
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
    .preview-hint {
      margin: 0 0 8px;
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
    .name-field {
      margin-top: 16px;
    }
    .name-field input[type="text"] {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 1px solid var(--divider-color, #ccc);
      color: var(--primary-text-color);
      font-size: 1em;
      padding: 4px 0;
    }
    .save {
      margin-top: 8px;
      border: none;
      border-radius: 4px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      padding: 8px 16px;
      cursor: pointer;
    }
    .save:disabled {
      opacity: 0.6;
      cursor: default;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-card": NanoleafSceneCard;
  }
}
