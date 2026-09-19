// Milestone 1 smoke test (see the plan): confirms what Home Assistant actually sets
// on a panel_custom element before Milestone 2 builds the real strip picker +
// embedded editor on top of it. Not verified against local source (home-assistant-
// frontend isn't installed in this Python-only dev environment) — describe(), not
// JSON.stringify(), because `route`/`panel` may not serialize cleanly.
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

function describe(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value !== "object") return `${typeof value}: ${String(value)}`;
  try {
    return `object, keys: ${Object.keys(value as object).join(", ") || "(none)"}`;
  } catch {
    return `object (${typeof value})`;
  }
}

@customElement("nanoleaf-scene-panel")
export class NanoleafScenePanel extends LitElement {
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) narrow?: boolean;
  @property({ attribute: false }) route?: unknown;
  @property({ attribute: false }) panel?: unknown;

  protected render() {
    return html`
      <div class="content">
        <h1>Nanoleaf Scenes</h1>
        <p>Milestone 1 smoke test — what Home Assistant sets on this element:</p>
        <ul>
          <li><code>hass</code>: ${describe(this.hass)}</li>
          <li><code>narrow</code>: ${describe(this.narrow)}</li>
          <li><code>route</code>: ${describe(this.route)}</li>
          <li><code>panel</code>: ${describe(this.panel)}</li>
        </ul>
      </div>
    `;
  }

  static styles = css`
    .content {
      padding: 16px;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
      color: var(--primary-text-color, #000);
    }
    code {
      background: var(--secondary-background-color, #eee);
      padding: 1px 4px;
      border-radius: 3px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-scene-panel": NanoleafScenePanel;
  }
}
