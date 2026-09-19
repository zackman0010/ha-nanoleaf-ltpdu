// The Nanoleaf scene editor itself: style/param/color/name editing, button-triggered
// preview with cancel-restores, and save. Retired as a user-facing Lovelace card (see
// nanoleaf-scene-panel.ts) but kept as this internal building block — the panel embeds
// it via setConfig({entity})/`.hass` exactly like Lovelace would, plus a public
// loadRecipe() the panel calls to preload a scene from either the strip or the shared
// library. The "saved on this device" and "scene library" lists it used to render live
// one level up, in the panel, since both now need to be visible alongside the editor
// rather than above it.
import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  fetchCapabilities,
  fieldsForStyle,
  type SceneCapabilities,
  type SceneColor,
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

export interface EditorRecipe {
  name: string;
  motionStyle: string; // capitalized display name, e.g. "Fade"
  motionParams: Record<string, number>;
  colors: SceneColor[];
  sceneId?: number; // present for a scene loaded from a strip; absent for a library-only recipe
}

export interface SceneSavedEventDetail {
  target: "strip" | "library";
  name: string;
  entityId: string; // captured at dispatch time — this._selected on the panel could
  // have moved on to a different strip by the time an async save resolves.
  recipe: { motion_style: string; motion_params: Record<string, number>; colors: SceneColor[] };
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

// Speed/Delay are raw bytes in 0.1s increments (see FIELD_RANGES in services.py);
// every other numeric field (segment, first_colour_frequency) is a plain 0-100 value.
function formatFieldValue(field: string, value: number): string {
  if (field === "speed" || field === "delay") {
    return `${(value / 10).toFixed(1)}s`;
  }
  return String(value);
}

@customElement("nanoleaf-scene-card")
export class NanoleafSceneCard extends LitElement {
  @state() private _config?: LovelaceCardConfig;
  @state() private _capabilities?: SceneCapabilities;
  @state() private _loadError?: string;

  // Scene editor — in-progress until Save is pressed.
  @state() private _editorStyle?: string; // capitalized display name, e.g. "Fade"
  @state() private _editorParams: Record<string, number> = {};
  @state() private _editorColors: SceneColor[] = [];
  @state() private _editorName = "";
  @state() private _saveTarget: "strip" | "library" = "strip";
  @state() private _saveSceneId?: number;
  @state() private _previewError?: string;
  @state() private _saveError?: string;
  @state() private _saving = false;

  // The strip's state from just before the first Preview click in the current
  // editing session — set once, restored (and cleared) by Cancel. Not cleared by
  // further edits, since it describes the strip's prior state, not the editor's.
  @state() private _preSnapshot?: StripSnapshot;

  private _hass?: HomeAssistant;
  private _loadStarted = false;
  // Which color is being dragged, for the drag-handle-driven reorder — transient
  // interaction state, not worth a re-render of its own.
  private _colorDragFromIndex?: number;

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
      void this._loadCapabilities();
    }
    this.requestUpdate();
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private async _loadCapabilities(): Promise<void> {
    if (!this._hass) {
      return;
    }
    try {
      this._capabilities = await fetchCapabilities(this._hass);
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
    this._saveTarget = "strip";
    this._saveSceneId = undefined;
    this._saveError = undefined;
  }

  // Preloads a scene fetched from a strip (has a sceneId, so re-saving defaults to
  // overwriting it in place) or from the shared library (no sceneId — re-saving
  // defaults to the library too).
  public loadRecipe(recipe: EditorRecipe): void {
    this._editorStyle = recipe.motionStyle;
    this._editorParams = { ...recipe.motionParams };
    this._editorColors = recipe.colors.map((c) => ({ ...c }));
    this._editorName = recipe.name;
    this._saveTarget = recipe.sceneId != null ? "strip" : "library";
    this._saveSceneId = recipe.sceneId;
    this._saveError = undefined;
  }

  private _onNameInput(value: string): void {
    this._editorName = value;
  }

  private _onSaveTargetSelect(target: string): void {
    this._saveTarget = target === "library" ? "library" : "strip";
  }

  private _onSceneIdInput(value: string): void {
    this._saveSceneId = value === "" ? undefined : Number(value);
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

  private _onColorDragStart(e: DragEvent, index: number): void {
    this._colorDragFromIndex = index;
    e.dataTransfer?.setData("text/plain", String(index));
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  private _onColorDrop(e: DragEvent, targetIndex: number): void {
    e.preventDefault();
    const fromIndex = this._colorDragFromIndex;
    this._colorDragFromIndex = undefined;
    if (fromIndex == null || fromIndex === targetIndex) {
      return;
    }
    const colors = [...this._editorColors];
    const [moved] = colors.splice(fromIndex, 1);
    colors.splice(targetIndex, 0, moved);
    this._editorColors = colors;
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
    const idRange = this._capabilities?.scene_id_range;
    if (this._saveTarget === "strip" && this._saveSceneId != null && idRange) {
      if (this._saveSceneId < idRange.min || this._saveSceneId > idRange.max) {
        this._saveError = `Scene ID must be between ${idRange.min} and ${idRange.max}.`;
        return;
      }
    }
    const motionStyle = this._editorStyle.toLowerCase();
    this._saving = true;
    try {
      if (this._saveTarget === "library") {
        await this._hass.callService(DOMAIN, "save_scene_to_library", {
          name,
          motion_style: motionStyle,
          motion_params: this._editorParams,
          colors: this._editorColors,
        });
      } else {
        const entityId = this._config!.entity as string;
        const serviceData: Record<string, unknown> = {
          name,
          motion_style: motionStyle,
          motion_params: this._editorParams,
          colors: this._editorColors,
        };
        if (this._saveSceneId != null) {
          serviceData.scene_id = this._saveSceneId;
        }
        await this._hass.callService(DOMAIN, "save_scene", serviceData, { entity_id: entityId });
      }
      this._saveError = undefined;
      this.dispatchEvent(
        new CustomEvent<SceneSavedEventDetail>("scene-saved", {
          detail: {
            target: this._saveTarget,
            name,
            entityId: this._config!.entity as string,
            recipe: {
              motion_style: motionStyle,
              motion_params: { ...this._editorParams },
              colors: this._editorColors.map((c) => ({ ...c })),
            },
          },
        })
      );
    } catch (err) {
      this._saveError = describeError(err);
    } finally {
      this._saving = false;
    }
  }

  protected render() {
    if (!this._config || !this._hass) {
      return nothing;
    }
    const entityId = this._config.entity as string;
    const entity = this._hass.states[entityId];

    return html`
      <ha-card header="Nanoleaf Scene Editor">
        <div class="content">
          ${!entity ? html`<p class="error">Entity not found: ${entityId}</p>` : nothing}
          ${this._loadError ? html`<p class="error">${this._loadError}</p>` : nothing}
          ${!this._capabilities && !this._loadError ? html`<p>Loading…</p>` : nothing}
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
    const idRange = caps.scene_id_range;

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
                  <span class="value">${formatFieldValue(field, value)}</span>
                `}
          </label>
        `;
      })}

      <div class="colors">
        <span>Colors<span class="muted"> — drag ☰ to reorder</span></span>
        <div class="color-slots">
          ${this._editorColors.map(
            (color, index) => html`
              <input
                type="color"
                .value=${hsbToHex(color)}
                @input=${(e: Event) => this._onColorInput(index, (e.target as HTMLInputElement).value)}
                @dragover=${(e: DragEvent) => e.preventDefault()}
                @drop=${(e: DragEvent) => this._onColorDrop(e, index)}
              />
              <span
                class="drag-handle"
                draggable="true"
                @dragstart=${(e: DragEvent) => this._onColorDragStart(e, index)}
                @dragover=${(e: DragEvent) => e.preventDefault()}
                @drop=${(e: DragEvent) => this._onColorDrop(e, index)}
                >☰</span
              >
              ${this._editorColors.length > colorMin
                ? html`<button
                    class="delete"
                    @click=${() => this._removeColorSlot(index)}
                    @dragover=${(e: DragEvent) => e.preventDefault()}
                    @drop=${(e: DragEvent) => this._onColorDrop(e, index)}
                  >
                    ✕
                  </button>`
                : html`<span
                    class="delete-placeholder"
                    @dragover=${(e: DragEvent) => e.preventDefault()}
                    @drop=${(e: DragEvent) => this._onColorDrop(e, index)}
                  ></span>`}
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

      <label class="field">
        <span>Save to</span>
        <select @change=${(e: Event) => this._onSaveTargetSelect((e.target as HTMLSelectElement).value)}>
          <option value="strip" ?selected=${this._saveTarget === "strip"}>Strip</option>
          <option value="library" ?selected=${this._saveTarget === "library"}>Library</option>
        </select>
      </label>
      ${this._saveTarget === "strip"
        ? html`
            <label class="field">
              <span>Scene ID<span class="muted"> — leave blank to auto-assign</span></span>
              <input
                type="number"
                min=${idRange.min}
                max=${idRange.max}
                placeholder="auto"
                .value=${this._saveSceneId != null ? String(this._saveSceneId) : ""}
                @input=${(e: Event) => this._onSceneIdInput((e.target as HTMLInputElement).value)}
              />
            </label>
          `
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
    .field input[type="number"] {
      flex: 1;
      background: none;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--primary-text-color);
      padding: 4px 8px;
    }
    .field select {
      flex: 1;
    }
    .field .value {
      flex: 0 0 3.5em;
      text-align: right;
    }
    .colors {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 12px 0;
    }
    .color-slots {
      display: grid;
      grid-auto-flow: column;
      grid-template-rows: repeat(3, auto);
      align-items: center;
      justify-items: center;
      gap: 4px 6px;
    }
    .color-slots input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
    }
    .drag-handle {
      cursor: grab;
      color: var(--secondary-text-color);
      line-height: 1;
      user-select: none;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .delete,
    .delete-placeholder {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      min-height: 20px;
    }
    .delete {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
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

  interface HTMLElementEventMap {
    "scene-saved": CustomEvent<SceneSavedEventDetail>;
  }
}
