// A small in-browser animated approximation of each Motion style, driven live by
// the editor's current style/params/colors — never touches the strip (that's what
// the Preview button is for). The visual shape (segments vs. gradient bar, snap vs.
// scatter) is illustrative, not a claim about real device rendering; Speed/Delay's
// timing is not (see speedMs/delayMs below).
//
// Fade/Random/Highlight render as a row of independent segments (each
// CSS-transitions its own background-color on its own schedule); Flow/Stripes
// render as one continuous gradient bar whose position is animated every frame.
// Either way the animation loop reads `params`/`colors` fresh every frame, so a
// slider drag updates the preview immediately with no restart.
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { hsbToHex } from "./color";
import type { SceneColor } from "./capabilities";

const SEGMENT_COUNT = 16;

// duration_seconds = raw_byte / 10 for both Speed and Delay (see FIELD_RANGES in
// services.py for how this was confirmed, including why the range goes to 0xFF
// rather than the 0x58 you might see elsewhere).
function speedMs(params: Record<string, number>): number {
  const raw = params.speed ?? 24;
  return (raw / 10) * 1000;
}

function delayMs(params: Record<string, number>): number {
  const raw = params.delay ?? 0;
  return (raw / 10) * 1000;
}

function pickWeightedColor(palette: SceneColor[], firstColourFrequency: number): SceneColor {
  if (palette.length <= 1) {
    return palette[0];
  }
  if (Math.random() * 100 < firstColourFrequency) {
    return palette[0];
  }
  const rest = palette.slice(1);
  return rest[Math.floor(Math.random() * rest.length)];
}

interface SegmentSchedule {
  nextChangeAt: number;
}

@customElement("nanoleaf-motion-preview")
export class NanoleafMotionPreview extends LitElement {
  @property({ attribute: false }) motionStyle?: string; // capitalized, e.g. "Fade"
  @property({ attribute: false }) params: Record<string, number> = {};
  @property({ attribute: false }) colors: SceneColor[] = [];

  private _rafId?: number;
  private _startedAt = 0;
  private _segmentEls: HTMLElement[] = [];
  private _schedule: SegmentSchedule[] = [];
  private _renderedStyle?: string;
  private _fadeIndex = 0;
  private _fadeAdvanceAt = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this._startedAt = performance.now();
    this._tick();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._rafId !== undefined) {
      cancelAnimationFrame(this._rafId);
    }
  }

  protected updated(): void {
    // The underlying markup shape only changes between "row of segments" (Fade/
    // Random/Highlight) and "single gradient bar" (Flow/Stripes) — re-query and
    // reset scheduling only when that shape actually changed, not on every param
    // tweak (which would otherwise restart the animation on every slider drag).
    if (this._renderedStyle !== this.motionStyle) {
      this._renderedStyle = this.motionStyle;
      this._segmentEls = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(".segment") ?? []);
      const now = performance.now();
      this._startedAt = now; // fresh timeline for whichever style just became active
      this._schedule = this._segmentEls.map(() => ({ nextChangeAt: now + Math.random() * 400 }));
      this._fadeIndex = 0;
      this._fadeAdvanceAt = now + speedMs(this.params) + delayMs(this.params);
    }
  }

  private _tick = (): void => {
    this._animate(performance.now());
    this._rafId = requestAnimationFrame(this._tick);
  };

  private _animate(now: number): void {
    if (!this.colors.length) {
      return;
    }
    switch (this.motionStyle) {
      case "Fade":
        this._animateFade(now);
        break;
      case "Random":
        this._animateScatter(now, 0);
        break;
      case "Highlight":
        this._animateScatter(now, this.params.first_colour_frequency ?? 50);
        break;
      case "Flow":
        this._animateGradientScroll(now, /* hardStops */ false);
        break;
      case "Stripes":
        this._animateGradientScroll(now, /* hardStops */ true);
        break;
    }
  }

  // -- Fade: every segment shows the same color, cycling through the palette -----
  private _animateFade(now: number): void {
    const step = speedMs(this.params) + delayMs(this.params);
    const loop = (this.params.loop ?? 1) !== 0;
    if (now >= this._fadeAdvanceAt) {
      const atEnd = this._fadeIndex >= this.colors.length - 1;
      if (!atEnd || loop) {
        this._fadeIndex = (this._fadeIndex + 1) % this.colors.length;
      }
      this._fadeAdvanceAt = now + step;
    }
    const hex = hsbToHex(this.colors[this._fadeIndex]);
    for (const el of this._segmentEls) {
      el.style.transitionDuration = `${speedMs(this.params)}ms`;
      el.style.backgroundColor = hex;
    }
  }

  // -- Random/Highlight: each segment independently jumps to a new palette color -
  private _animateScatter(now: number, firstColourFrequency: number): void {
    const step = speedMs(this.params) + delayMs(this.params);
    this._segmentEls.forEach((el, i) => {
      const sched = this._schedule[i];
      if (!sched || now < sched.nextChangeAt) {
        return;
      }
      const color = pickWeightedColor(this.colors, firstColourFrequency);
      el.style.transitionDuration = `${speedMs(this.params)}ms`;
      el.style.backgroundColor = hsbToHex(color);
      sched.nextChangeAt = now + step;
    });
  }

  // -- Flow/Stripes: one continuous gradient bar, scrolled every frame -----------
  private _animateGradientScroll(now: number, hardStops: boolean): void {
    const bar = this._segmentEls[0]; // single element in this mode, see render()
    if (!bar) {
      return;
    }
    const palette = this.colors.map((c) => hsbToHex(c));
    const stops = hardStops ? this._hardStops(palette) : this._softStops(palette);
    bar.style.backgroundImage = `linear-gradient(90deg, ${stops})`;

    // Stripes: rely on native CSS tiling (background-repeat) for the seamless
    // loop, so Segment can just shrink one tile's size to fit more repeats across
    // the bar — smaller segment = narrower/more-numerous stripes. Flow has no
    // Segment param and no seam-hiding duplicate needed either way since it never
    // tiles; its own trailing duplicate color in _softStops handles the loop point.
    const repeats = hardStops ? this._stripeRepeats() : 1;
    bar.style.backgroundRepeat = hardStops ? "repeat" : "no-repeat";
    bar.style.backgroundSize = `${(palette.length * 100) / repeats}% 100%`;

    const direction = (this.params.direction ?? 0) === 0 ? 1 : -1;
    const cycleMs = speedMs(this.params) * palette.length;
    const loop = (this.params.loop ?? 1) !== 0;
    const elapsed = now - this._startedAt;
    const progress = loop ? (elapsed % cycleMs) / cycleMs : Math.min(elapsed / cycleMs, 1);
    const positionPercent = direction * progress * 100;
    bar.style.backgroundPositionX = `${positionPercent}%`;
  }

  private _stripeRepeats(): number {
    const segment = this.params.segment ?? 50;
    // segment=100 (widest) -> a single pass across the whole bar; segment=0
    // (narrowest) -> several repeats, i.e. thinner/more-numerous stripes.
    // Illustrative scaling, not a claim about a real physical stripe count.
    return Math.max(1, Math.round(1 + ((100 - segment) / 100) * 6));
  }

  private _softStops(palette: string[]): string {
    // Repeat the first color at the end so the loop point is seamless.
    return [...palette, palette[0]].join(", ");
  }

  private _hardStops(palette: string[]): string {
    const bandPercent = 100 / palette.length;
    const stops: string[] = [];
    palette.forEach((color, i) => {
      const start = i * bandPercent;
      const end = start + bandPercent;
      stops.push(`${color} ${start}%`, `${color} ${end}%`);
    });
    return stops.join(", ");
  }

  protected render() {
    const isGradientMode = this.motionStyle === "Flow" || this.motionStyle === "Stripes";
    return isGradientMode
      ? html`<div class="preview-strip"><div class="segment gradient"></div></div>`
      : html`
          <div class="preview-strip">
            ${Array.from({ length: SEGMENT_COUNT }, () => html`<div class="segment"></div>`)}
          </div>
        `;
  }

  static styles = css`
    .preview-strip {
      display: flex;
      height: 36px;
      border-radius: 6px;
      overflow: hidden;
      margin: 8px 0;
    }
    .segment {
      flex: 1;
      background-color: #222;
      transition-property: background-color;
      transition-timing-function: linear;
    }
    .segment.gradient {
      transition-property: none;
      /* background-repeat is set per-frame in JS (Flow: no-repeat, Stripes: repeat) */
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "nanoleaf-motion-preview": NanoleafMotionPreview;
  }
}
