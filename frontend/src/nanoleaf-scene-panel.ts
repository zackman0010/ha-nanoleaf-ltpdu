// The "Nanoleaf Scenes" sidebar page: a three-panel layout — strip picker + that
// strip's scene list (panel 1), the scene editor (panel 2, the existing
// <nanoleaf-scene-card> unmodified aside from what it needs to accept a save target),
// and the shared scene library (panel 3). HA sets hass/narrow/route/panel directly on
// this element the same way Lovelace sets .hass on a card (confirmed live — see the
// plan's Milestone 1).
import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import {
  capitalize,
  fetchDeviceScenes,
  fetchLibrary,
  fetchStrips,
  type DeviceScenesResponse,
  type SceneRecipe,
  type SceneLibraryResponse,
  type StripsResponse,
} from "./capabilities";
import { describeError } from "./errors";
import type { HomeAssistant } from "./ha-types";
import "./nanoleaf-scene-card";
import type { NanoleafSceneCard, SceneSavedEventDetail } from "./nanoleaf-scene-card";

const DOMAIN = "nanoleaf_ltpdu";
const RESERVED_SCENE_NAME = "Northern Lights";

interface StripRow {
  name: string;
  sceneId?: number;
  deletable: boolean;
}

@customElement("nanoleaf-scene-panel")
export class NanoleafScenePanel extends LitElement {
  @state() private _strips?: StripsResponse["strips"];
  @state() private _selected?: string;
  @state() private _loadError?: string;
  @state() private _library?: SceneLibraryResponse;

  // Refreshed-from-device scene data, keyed by entity_id — populated only once the
  // user presses "Refresh from strip" for that strip; absent until then.
  @state() private _deviceScenes: Record<string, DeviceScenesResponse> = {};
  @state() private _refreshing = false;
  @state() private _refreshError?: string;
  @state() private _actionError?: string;
  @state() private _loadIntoEditorError?: string;

  // Optimistic UI, keyed by entity_id — save_scene/delete_scene don't force a state
  // push (effect_list can lag ~15s behind), so these keep the strip-1 list accurate
  // immediately rather than waiting for the next poll.
  @state() private _locallySaved: Record<string, Set<string>> = {};
  @state() private _locallyDeleted: Record<string, Set<string>> = {};

  private _hass?: HomeAssistant;
  private _loadStarted = false;
  private _cardRef: Ref<NanoleafSceneCard> = createRef();
  private _cardConfiguredFor?: string;

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._loadStarted) {
      this._loadStarted = true;
      void this._loadStripsAndLibrary();
    }
    this.requestUpdate();
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private async _loadStripsAndLibrary(): Promise<void> {
    if (!this._hass) {
      return;
    }
    try {
      const [{ strips }, library] = await Promise.all([fetchStrips(this._hass), fetchLibrary(this._hass)]);
      this._strips = strips;
      this._library = library;
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
    this._refreshError = undefined;
    this._actionError = undefined;
    this._loadIntoEditorError = undefined;
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

  // -- panel 1: strip picker + that strip's scenes -------------------------------

  private _knownSceneNames(entityId: string): string[] {
    const entity = this._hass?.states[entityId];
    const effectList = (entity?.attributes.effect_list as string[] | undefined) ?? [];
    const names = new Set([...effectList, ...(this._locallySaved[entityId] ?? [])]);
    for (const deleted of this._locallyDeleted[entityId] ?? []) {
      names.delete(deleted);
    }
    return [...names];
  }

  private async _refreshFromStrip(): Promise<void> {
    if (!this._hass || !this._selected) {
      return;
    }
    const entityId = this._selected;
    this._refreshing = true;
    this._refreshError = undefined;
    try {
      // The backend also records every scene's full recipe in the shared library
      // (see light.py's async_list_device_scenes) — re-fetch it here too, or panel
      // 3 and the library-fallback path in _loadRowIntoEditor would keep showing
      // this._library's pre-refresh snapshot until the next page load.
      const [deviceScenes, library] = await Promise.all([
        fetchDeviceScenes(this._hass, entityId),
        fetchLibrary(this._hass),
      ]);
      this._deviceScenes = { ...this._deviceScenes, [entityId]: deviceScenes };
      this._library = library;
    } catch (err) {
      this._refreshError = describeError(err);
    } finally {
      this._refreshing = false;
    }
  }

  private async _activateScene(entityId: string, name: string): Promise<void> {
    if (!this._hass) {
      return;
    }
    try {
      await this._hass.callService("light", "turn_on", { entity_id: entityId, effect: name });
      this._actionError = undefined;
    } catch (err) {
      this._actionError = describeError(err);
    }
  }

  private async _deleteScene(entityId: string, name: string): Promise<void> {
    if (!this._hass) {
      return;
    }
    const deletedBefore = new Set(this._locallyDeleted[entityId] ?? []);
    this._locallyDeleted = { ...this._locallyDeleted, [entityId]: new Set(deletedBefore).add(name) };
    const savedBefore = new Set(this._locallySaved[entityId] ?? []);
    const savedWithout = new Set(savedBefore);
    savedWithout.delete(name);
    this._locallySaved = { ...this._locallySaved, [entityId]: savedWithout };
    try {
      await this._hass.callService(DOMAIN, "delete_scene", { name }, { entity_id: entityId });
      this._actionError = undefined;
      this._invalidateDeviceScenes(entityId);
    } catch (err) {
      // Roll back the optimistic hide if the delete actually failed.
      this._locallyDeleted = { ...this._locallyDeleted, [entityId]: deletedBefore };
      this._locallySaved = { ...this._locallySaved, [entityId]: savedBefore };
      this._actionError = describeError(err);
    }
  }

  private _loadRowIntoEditor(row: StripRow): void {
    this._loadIntoEditorError = undefined;
    const entityId = this._selected;
    if (!entityId) {
      return;
    }
    if (row.sceneId != null) {
      const scene = this._deviceScenes[entityId]?.scenes[String(row.sceneId)];
      if (scene) {
        this._cardRef.value?.loadRecipe({
          name: row.name,
          motionStyle: capitalize(scene.motion_style),
          motionParams: scene.motion_params,
          colors: scene.colors,
          sceneId: row.sceneId,
        });
        return;
      }
    }
    const recipe = this._library?.recipes[row.name];
    if (recipe) {
      this._loadLibraryRecipeIntoEditor(row.name, recipe);
      return;
    }
    this._loadIntoEditorError = `Refresh from strip to load "${row.name}" into the editor.`;
  }

  private _renderStripPanel() {
    const entityId = this._selected;
    if (!entityId) {
      return html`<h2>Scenes on strip</h2><p class="muted">Select a strip.</p>`;
    }
    const refreshed = this._deviceScenes[entityId];
    const rows: StripRow[] = refreshed
      ? Object.entries(refreshed.scenes).map(([idStr, scene]) => ({
          name: scene.name ?? `Unknown Scene ${idStr}`,
          sceneId: Number(idStr),
          deletable: scene.name != null && scene.name !== RESERVED_SCENE_NAME,
        }))
      : this._knownSceneNames(entityId).map((name) => ({ name, deletable: name !== RESERVED_SCENE_NAME }));

    return html`
      <h2>
        Scenes on strip
        <button class="load" ?disabled=${this._refreshing} @click=${() => this._refreshFromStrip()}>
          ${this._refreshing ? "Refreshing…" : "Refresh from strip"}
        </button>
      </h2>
      ${this._refreshError ? html`<p class="error">${this._refreshError}</p>` : nothing}
      ${this._actionError ? html`<p class="error">${this._actionError}</p>` : nothing}
      ${this._loadIntoEditorError ? html`<p class="error">${this._loadIntoEditorError}</p>` : nothing}
      ${rows.length === 0
        ? html`<p class="muted">No scenes saved yet.</p>`
        : html`
            <ul class="scene-list">
              ${rows.map(
                (row) => html`
                  <li>
                    <button class="scene-name" @click=${() => this._loadRowIntoEditor(row)}>${row.name}</button>
                    ${row.deletable
                      ? html`
                          <button class="activate" title="Activate" @click=${() => this._activateScene(entityId, row.name)}>▶</button>
                          <button class="delete" title="Delete" @click=${() => this._deleteScene(entityId, row.name)}>✕</button>
                        `
                      : nothing}
                  </li>
                `
              )}
            </ul>
          `}
    `;
  }

  // -- panel 3: shared scene library ----------------------------------------------

  private _loadLibraryRecipeIntoEditor(name: string, recipe: SceneRecipe): void {
    this._cardRef.value?.loadRecipe({
      name,
      motionStyle: capitalize(recipe.motion_style),
      motionParams: recipe.motion_params,
      colors: recipe.colors,
    });
  }

  private _renderLibraryPanel() {
    const recipeNames = this._library ? Object.keys(this._library.recipes) : [];
    return html`
      <h2>Scene library</h2>
      ${recipeNames.length === 0
        ? html`<p class="muted">No scene recipes saved anywhere yet.</p>`
        : html`
            <ul class="scene-list">
              ${recipeNames.map((name) => {
                const recipe = this._library!.recipes[name];
                return html`
                  <li>
                    <button class="scene-name" @click=${() => this._loadLibraryRecipeIntoEditor(name, recipe)}>${name}</button>
                    <span class="muted">(${capitalize(recipe.motion_style)})</span>
                  </li>
                `;
              })}
            </ul>
          `}
    `;
  }

  // A refreshed-from-device snapshot is a point-in-time read — once any write happens
  // for that strip (a save or a delete), drop it rather than try to patch it, and fall
  // back to the live effect_list + optimistic sets until the user refreshes again.
  private _invalidateDeviceScenes(entityId: string): void {
    if (!(entityId in this._deviceScenes)) {
      return;
    }
    const rest = { ...this._deviceScenes };
    delete rest[entityId];
    this._deviceScenes = rest;
  }

  // -- scene-saved: patches whichever of panel 1 / panel 3's lists the save affects --

  private _onSceneSaved(e: CustomEvent<SceneSavedEventDetail>): void {
    const { target, name, entityId, recipe } = e.detail;
    // A strip save also records the recipe as a library template (see light.py's
    // async_save_scene), so the library list always picks up the new/updated name.
    this._library = { recipes: { ...this._library?.recipes, [name]: recipe } };
    if (target === "strip") {
      const saved = new Set(this._locallySaved[entityId] ?? []).add(name);
      this._locallySaved = { ...this._locallySaved, [entityId]: saved };
      const deleted = new Set(this._locallyDeleted[entityId] ?? []);
      deleted.delete(name);
      this._locallyDeleted = { ...this._locallyDeleted, [entityId]: deleted };
      this._invalidateDeviceScenes(entityId);
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
        <div class="panels">
          <section class="panel">${this._renderStripPanel()}</section>
          <section class="panel">
            ${this._selected
              ? html`<nanoleaf-scene-card
                  ${ref(this._cardRef)}
                  @scene-saved=${(e: CustomEvent<SceneSavedEventDetail>) => this._onSceneSaved(e)}
                ></nanoleaf-scene-card>`
              : html`<p class="muted">Select a strip to begin.</p>`}
          </section>
          <section class="panel">${this._renderLibraryPanel()}</section>
        </div>
      </div>
    `;
  }

  static styles = css`
    .content {
      padding: 16px;
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5em;
      margin: 0 0 16px;
    }
    h2 {
      font-size: 1.1em;
      margin: 0 0 8px;
    }
    .panels {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      align-items: start;
      gap: 16px;
      margin-top: 16px;
    }
    .panel {
      min-width: 0;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .field select {
      flex: 1;
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
    .load:disabled {
      opacity: 0.6;
      cursor: default;
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
      flex: 1;
      overflow-wrap: anywhere;
    }
    button.scene-name:hover {
      text-decoration: underline;
    }
    .activate {
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      margin-left: 8px;
    }
    .delete {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      margin-left: 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-panel": NanoleafScenePanel;
  }
}
