// get_scene_capabilities / get_scene_library fetch + the casing/intersection
// helpers the rest of the card needs around them. See the plan's "Confirmed
// backend API" section for the exact shapes this mirrors.
import type { HomeAssistant } from "./ha-types";

export interface MotionStyleInfo {
  style_id: number;
  param_fields: string[];
}

export interface FieldRange {
  min: number;
  max: number;
}

export interface SceneCapabilities {
  motion_styles: Record<string, MotionStyleInfo>; // keys capitalized, e.g. "Fade"
  field_ranges: Record<string, FieldRange>; // flat — NOT split per style
  field_notes: Record<string, string>;
  color_slots: FieldRange;
  color_field_ranges: Record<string, FieldRange>;
  scene_id_range: FieldRange; // valid explicit IDs for save_scene's optional scene_id
}

export interface SceneColor {
  hue: number;
  saturation: number;
  brightness: number;
}

export interface SceneRecipe {
  motion_style: string; // lowercase — the exact shape save_scene's service call takes
  motion_params: Record<string, number>;
  colors: SceneColor[];
}

export interface SceneLibraryResponse {
  recipes: Record<string, SceneRecipe>;
}

export interface StripInfo {
  name: string;
}

export interface StripsResponse {
  strips: Record<string, StripInfo>; // keyed by entity_id
}

export interface DeviceScene {
  name: string | null; // null when the strip has a scene at this ID this integration has no registered name for
  motion_style: string; // lowercase
  motion_params: Record<string, number>;
  colors: SceneColor[];
}

export interface DeviceScenesResponse {
  scenes: Record<string, DeviceScene>; // keyed by scene ID (as a string)
  current_scene_id: number | null;
}

const DOMAIN = "nanoleaf_ltpdu";

async function callServiceWithResponse<T>(
  hass: HomeAssistant,
  service: string,
  serviceData: Record<string, unknown> = {},
  target?: Record<string, unknown>
): Promise<T> {
  const result = await hass.connection.sendMessagePromise<{ response: T }>({
    type: "call_service",
    domain: DOMAIN,
    service,
    service_data: serviceData,
    ...(target ? { target } : {}),
    return_response: true,
  });
  return result.response;
}

export function fetchCapabilities(hass: HomeAssistant): Promise<SceneCapabilities> {
  return callServiceWithResponse<SceneCapabilities>(hass, "get_scene_capabilities");
}

export function fetchLibrary(hass: HomeAssistant): Promise<SceneLibraryResponse> {
  return callServiceWithResponse<SceneLibraryResponse>(hass, "get_scene_library");
}

export function fetchStrips(hass: HomeAssistant): Promise<StripsResponse> {
  return callServiceWithResponse<StripsResponse>(hass, "list_strips");
}

// Reads every scene actually stored on the strip's own flash (an LTPDU round trip per
// scene) rather than the locally-known name registry — see light.py's
// async_list_device_scenes. Unlike the domain-level services above, this is an
// *entity*-targeted service — HA wraps its response as {entity_id: response} (to
// cover multi-entity targets), even though this call only ever targets one.
export async function fetchDeviceScenes(hass: HomeAssistant, entityId: string): Promise<DeviceScenesResponse> {
  const byEntity = await callServiceWithResponse<Record<string, DeviceScenesResponse>>(
    hass,
    "list_device_scenes",
    {},
    { entity_id: entityId }
  );
  return byEntity[entityId];
}

/** get_scene_capabilities' field_ranges is global/flat across every motion style —
 * intersect it with one style's own param_fields to know which fields (and in
 * what order) actually apply to that style. */
export function fieldsForStyle(caps: SceneCapabilities, styleName: string): [string, FieldRange][] {
  const fields = caps.motion_styles[styleName]?.param_fields ?? [];
  return fields.map((field) => [field, caps.field_ranges[field]]);
}

/** save_scene/preview_scene's motion_style field only accepts lowercase
 * (fade|random|highlight|flow|stripes); get_scene_capabilities' keys and every
 * motion name in this protocol family are a single capitalized word, so this
 * transform is exact, not a guess. */
export function capitalize(styleName: string): string {
  return styleName.charAt(0).toUpperCase() + styleName.slice(1).toLowerCase();
}
