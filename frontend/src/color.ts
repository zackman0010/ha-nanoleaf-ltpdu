// HSB (hue 0-360, saturation 0-100, brightness 0-100 — exactly the device's own
// model, i.e. HSV) <-> RGB hex conversion for the native <input type="color">
// picker, which only speaks RGB. Exact, not approximate: HSB *is* HSV, so this is a
// standard color-space conversion, not a lossy approximation of the device's model.

export interface Hsb {
  hue: number;
  saturation: number;
  brightness: number;
}

export function hsbToHex({ hue, saturation, brightness }: Hsb): string {
  const s = saturation / 100;
  const v = brightness / 100;
  const c = v * s;
  const hp = (((hue % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let [r1, g1, b1] = [0, 0, 0];
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = v - c;
  const toByte = (n: number) => Math.round((n + m) * 255);
  const hex = (n: number) => toByte(n).toString(16).padStart(2, "0");
  return `#${hex(r1)}${hex(g1)}${hex(b1)}`;
}

export function hexToHsb(hex: string): Hsb {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;

  const saturation = max === 0 ? 0 : delta / max;
  const brightness = max;

  return {
    hue: Math.round(hue),
    saturation: Math.round(saturation * 100),
    brightness: Math.round(brightness * 100),
  };
}
