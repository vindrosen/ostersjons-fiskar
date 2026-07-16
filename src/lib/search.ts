/**
 * Sök och filtrering av arter.
 *
 * Ren logik utan React – körs på klienten i `FishExplorer` men är avsiktligt
 * fristående så att den kan enhetstestas eller återanvändas på servern.
 */

import type { FishSummary, FishType } from "@/types/fish";

/**
 * Kombinerande diakritiska tecken, dvs. accenter och ringar som efter
 * NFD-normalisering ligger som egna tecken efter sin bokstav ("ä" → "a" + "¨").
 * `\p{Mn}` = Unicode-kategorin "Mark, nonspacing".
 */
const COMBINING_MARKS = /\p{Mn}/gu;

/**
 * Normaliserar text för sökning: gemener utan diakritiska tecken.
 *
 * Gör att "gadda" hittar "Gädda" och "oring" hittar "Havsöring" – många skriver
 * inte å, ä och ö när de söker snabbt.
 */
export function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "");
}

/**
 * Filtrerar arter på fritext. Matchar svenskt namn, latinskt namn,
 * alternativa namn och familj.
 *
 * @param fish Arter att söka bland.
 * @param query Användarens sökord. Tom sträng returnerar allt.
 */
export function searchFish(fish: FishSummary[], query: string): FishSummary[] {
  const needle = normalize(query.trim());
  if (!needle) return fish;

  return fish.filter((item) => {
    const haystack = normalize(
      [item.name, item.latinName, item.family, ...item.alsoKnownAs].join(" "),
    );
    return haystack.includes(needle);
  });
}

/** Filtrerar på fisktyp. `"alla"` stänger av filtret. */
export function filterByType(
  fish: FishSummary[],
  type: FishType | "alla",
): FishSummary[] {
  return type === "alla" ? fish : fish.filter((item) => item.type === type);
}

/** De fisktyper som faktiskt förekommer i datat, i den ordning de ska visas. */
export function availableTypes(fish: FishSummary[]): FishType[] {
  const order: FishType[] = ["rovfisk", "fredfisk", "laxfisk", "plattfisk", "pelagisk"];
  const present = new Set(fish.map((item) => item.type));
  return order.filter((type) => present.has(type));
}
