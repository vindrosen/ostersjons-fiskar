/**
 * Dataåtkomstlager för fiskarter.
 *
 * Detta är appens enda väg till fiskdata. Komponenter och sidor pratar bara med
 * funktionerna här nere – aldrig direkt med JSON-filerna. Två fördelar:
 *
 * 1. **Nya arter kräver noll kod.** Lägg en JSON-fil i `src/data/fish/` så
 *    hittas den automatiskt, valideras och dyker upp på sajten.
 * 2. **Byte till ett riktigt API blir en isolerad ändring.** Alla funktioner är
 *    redan asynkrona, så när datat en dag kommer från t.ex. Havs- och
 *    vattenmyndigheten eller en egen backend räcker det att byta ut
 *    `loadFishFromDisk()` mot ett `fetch()` – anropande kod är oförändrad.
 *
 * Modulen kör bara på servern (använder `node:fs`). Sidorna är
 * statiskt genererade, så filerna läses vid build – aldrig per request.
 */

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Fish, FishSummary } from "@/types/fish";

/** Katalogen där varje art ligger som en egen JSON-fil. */
const DATA_DIR = path.join(process.cwd(), "src", "data", "fish");

/**
 * Läser och validerar samtliga arter från disk.
 *
 * `cache()` från React gör att filerna läses högst en gång per rendering, även
 * om flera komponenter frågar efter data.
 */
const loadFishFromDisk = cache((): Fish[] => {
  const files = readdirSync(DATA_DIR).filter((file) => file.endsWith(".json"));

  const fish = files.map((file) => {
    const raw = readFileSync(path.join(DATA_DIR, file), "utf-8");

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        `Kunde inte tolka ${file} som JSON: ${(error as Error).message}`,
      );
    }

    return assertValidFish(parsed, file);
  });

  assertUniqueSlugs(fish);

  // Vanligast först – samma ordning som mockupens "Vanliga arter".
  return fish.sort(sortByPopularity);
});

/** Sorterar vanligaste arten först, med namnet som stabil sekundärsortering. */
function sortByPopularity(a: Fish | FishSummary, b: Fish | FishSummary): number {
  return a.popularity - b.popularity || a.name.localeCompare(b.name, "sv");
}

/**
 * Kontrollerar att en JSON-fil har de fält appen kräver.
 *
 * Syftet är att fel upptäcks vid `next build` med ett tydligt meddelande om
 * vilken fil som är trasig, i stället för som en kryptisk krasch i en komponent.
 */
function assertValidFish(value: unknown, file: string): Fish {
  const fish = value as Partial<Fish>;
  const fail = (reason: string): never => {
    throw new Error(`Ogiltig fiskdata i ${file}: ${reason}`);
  };

  if (!fish.slug) fail("fältet 'slug' saknas");
  if (!fish.name) fail("fältet 'name' saknas");
  if (!fish.latinName) fail("fältet 'latinName' saknas");
  if (!fish.image?.src) fail("fältet 'image.src' saknas");
  if (typeof fish.popularity !== "number") fail("fältet 'popularity' måste vara ett tal");

  // Utan 'origin' skulle en invasiv art tyst renderas som vilken inhemsk fisk
  // som helst – utan varning om att den inte får återutsättas.
  if (fish.origin !== "inhemsk" && fish.origin !== "invasiv") {
    fail(`'origin' måste vara "inhemsk" eller "invasiv" (fick "${fish.origin}")`);
  }

  // Kalendern ritas som exakt tolv rutor – fel längd ger tyst trasig layout.
  if (!Array.isArray(fish.calendar) || fish.calendar.length !== 12) {
    fail(`'calendar' måste innehålla exakt 12 värden (fick ${fish.calendar?.length ?? 0})`);
  }

  // Filnamnet är sanningen: /fiskar/<slug> ska alltid matcha <slug>.json.
  const expectedSlug = file.replace(/\.json$/, "");
  if (fish.slug !== expectedSlug) {
    fail(`'slug' är "${fish.slug}" men filen heter "${file}" – de måste stämma överens`);
  }

  return fish as Fish;
}

/** Två arter med samma slug skulle krocka på samma URL. */
function assertUniqueSlugs(fish: Fish[]): void {
  const seen = new Set<string>();
  for (const item of fish) {
    if (seen.has(item.slug)) {
      throw new Error(`Dubblerad slug "${item.slug}" – varje art måste ha en unik slug.`);
    }
    seen.add(item.slug);
  }
}

/** Plockar ut den lätta delmängd som listor och sök behöver. */
function toSummary(fish: Fish): FishSummary {
  return {
    slug: fish.slug,
    name: fish.name,
    latinName: fish.latinName,
    family: fish.family,
    type: fish.type,
    commonality: fish.commonality,
    origin: fish.origin,
    popularity: fish.popularity,
    alsoKnownAs: fish.alsoKnownAs,
    shortDescription: fish.shortDescription,
    image: fish.image,
  };
}

/** Samtliga arter med full data, vanligast först. */
export async function getAllFish(): Promise<Fish[]> {
  return loadFishFromDisk();
}

/** Samtliga arter i lättviktsformat – för startsidan, listor och sök. */
export async function getFishSummaries(): Promise<FishSummary[]> {
  return loadFishFromDisk().map(toSummary);
}

/**
 * De vanligaste arterna, i popularitetsordning.
 * @param limit Antal arter att returnera.
 */
export async function getCommonFish(limit = 12): Promise<FishSummary[]> {
  return (await getFishSummaries()).slice(0, limit);
}

/** En art via sin slug, eller `undefined` om den inte finns. */
export async function getFishBySlug(slug: string): Promise<Fish | undefined> {
  return loadFishFromDisk().find((fish) => fish.slug === slug);
}

/** Alla slugs – används av `generateStaticParams` för att förrendera sidorna. */
export async function getAllFishSlugs(): Promise<string[]> {
  return loadFishFromDisk().map((fish) => fish.slug);
}

/**
 * Invasiva främmande arter, i lättviktsformat.
 *
 * De lyfts fram i en egen sektion på startsidan: en läsare som bara scrollar
 * förbi ska ändå få veta att arterna finns och att de inte får återutsättas.
 */
export async function getInvasiveFish(): Promise<FishSummary[]> {
  return (await getFishSummaries()).filter((fish) => fish.origin === "invasiv");
}

/** Inhemska arter – guidens "vanliga arter". */
export async function getNativeFish(): Promise<FishSummary[]> {
  return (await getFishSummaries()).filter((fish) => fish.origin === "inhemsk");
}
