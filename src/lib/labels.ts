/**
 * Översättning från datakoder till svensk text.
 *
 * All text som visas för användaren samlas här i stället för att spridas ut i
 * komponenterna. Det gör datat språkneutralt och en framtida översättning till
 * fler språk blir en fråga om att lägga till en ordlista, inte att ändra JSON.
 */

import type {
  Commonality,
  FishType,
  FishingRating,
  Month,
  WaterEnvironment,
} from "@/types/fish";

/** Månadernas korta namn, indexerade 0–11 (januari först). */
export const MONTH_LABELS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
] as const;

/** Månadernas fullständiga namn, indexerade 0–11. Används i alt-text och aria. */
export const MONTH_LABELS_LONG = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
] as const;

export const FISH_TYPE_LABELS: Record<FishType, string> = {
  rovfisk: "Rovfisk",
  fredfisk: "Fredfisk",
  plattfisk: "Plattfisk",
  laxfisk: "Laxfisk",
  pelagisk: "Pelagisk stimfisk",
};

export const ENVIRONMENT_LABELS: Record<WaterEnvironment, string> = {
  saltvatten: "Saltvatten",
  brackvatten: "Bräckt vatten",
  sotvatten: "Sötvatten",
};

export const COMMONALITY_LABELS: Record<Commonality, string> = {
  vanlig: "Vanlig",
  "ganska-vanlig": "Ganska vanlig",
  ovanlig: "Ovanlig",
};

export const RATING_LABELS: Record<FishingRating, string> = {
  low: "Mindre bra",
  good: "Bra",
  best: "Bäst",
};

/** Formaterar ett djupintervall: `{ min: 0, max: 5 }` → "0–5 meter". */
export function formatDepth(depth: { min: number; max: number }): string {
  return depth.min === depth.max
    ? `${depth.max} meter`
    : `${depth.min}–${depth.max} meter`;
}

/** Formaterar ett längdintervall: `{ min: 20, max: 40 }` → "20–40 cm". */
export function formatLengthRange(range: { min: number; max: number }): string {
  return `${range.min}–${range.max} cm`;
}

/** Formaterar maskstorlek: `{ min: 55, max: 120 }` → "55–120 mm". */
export function formatMeshSize(range: { min: number; max: number }): string {
  return `${range.min}–${range.max} mm`;
}

/**
 * Formaterar vikt med svenskt decimaltecken och utan onödiga nollor.
 * 0.05 → "0,05 kg", 25 → "25 kg".
 */
export function formatWeight(kg: number): string {
  return `${kg.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} kg`;
}

/** Slår ihop flera vattenmiljöer till en läsbar sträng. */
export function formatEnvironments(environments: WaterEnvironment[]): string {
  return environments.map((env) => ENVIRONMENT_LABELS[env]).join(", ");
}

/** Returnerar månadens korta namn för en 1-indexerad månad. */
export function monthShort(month: Month): string {
  return MONTH_LABELS_SHORT[month - 1];
}
