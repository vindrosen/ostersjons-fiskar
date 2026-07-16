/**
 * Datamodellen för Östersjöns Fiskar.
 *
 * Modellen är medvetet ren och serialiserbar (JSON in, JSON ut) så att dagens
 * lokala JSON-filer i `src/data/fish/` senare kan bytas mot ett riktigt API
 * utan att komponenterna behöver skrivas om. Se `src/lib/fish-repository.ts`.
 *
 * Nycklar lagras som språkneutrala koder (t.ex. `"rovfisk"`, `"best"`) och
 * översätts till text först i presentationslagret via `src/lib/labels.ts`.
 * Det gör datat enkelt att filtrera, sortera och i framtiden översätta.
 */

/** Månad som siffra, 1 = januari … 12 = december. */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Hur bra fisket är en given månad. Används i fiskekalendern. */
export type FishingRating = "low" | "good" | "best";

/** Fiskens roll i ekosystemet – visas som "Typ" på detaljsidan. */
export type FishType = "rovfisk" | "fredfisk" | "plattfisk" | "laxfisk" | "pelagisk";

/** Vattentyp som arten trivs i. En art kan förekomma i flera. */
export type WaterEnvironment = "saltvatten" | "brackvatten" | "sotvatten";

/** Hur vanlig arten är i Östersjön – styr badgen på detaljsidan. */
export type Commonality = "vanlig" | "ganska-vanlig" | "ovanlig";

/** Ett djupintervall i meter. */
export interface DepthRange {
  min: number;
  max: number;
}

/** Ett spann i millimeter, t.ex. maskstorlek på nät. */
export interface MillimeterRange {
  min: number;
  max: number;
}

/** Huvudbilden för en art. Endast en bild per art används i hela appen. */
export interface FishImage {
  /** Sökväg under /public, t.ex. "/images/fisk/gadda.webp". */
  src: string;
  /** Beskrivande alt-text för skärmläsare. */
  alt: string;
}

/** Mått och ålder. Värdena avser vad arten kan uppnå i Östersjöområdet. */
export interface FishSize {
  maxLengthCm: number;
  maxWeightKg: number;
  /** Högsta kända ålder i år. */
  maxAgeYears: number;
  /** Vanlig storlek på fångad fisk – ger mer realistisk förväntan än maxmåtten. */
  typicalLengthCm: DepthRange;
}

/** Var arten lever. */
export interface FishHabitat {
  environments: WaterEnvironment[];
  /** Utbredning i Östersjön, fritext. */
  distribution: string;
  /** Livsmiljö – bottentyp, vegetation, struktur. */
  description: string;
  /** Typiskt djup där arten påträffas. */
  typicalDepth: DepthRange;
}

/** Lekperiod. `months` används för att färga fiskekalendern. */
export interface Spawning {
  /** Läsbar period, t.ex. "Mars–april". */
  period: string;
  months: Month[];
  /** Kort beskrivning av leken. */
  description: string;
}

/** Rekommenderade beten uppdelade per typ, enligt mockupens spöfiskekort. */
export interface LureRecommendations {
  jigs: string[];
  wobblers: string[];
  spinners: string[];
  spoons: string[];
}

/** Spöfiske: kast- och trollingmetoder. */
export interface SpinningMethod {
  bestMethod: string;
  lures: LureRecommendations;
  /** Rekommenderad utrustning – spö, lina, tafs. */
  gear: string;
  depth: DepthRange;
}

/** Mete med naturliga beten. */
export interface BaitMethod {
  baits: string[];
  depth: DepthRange;
  tips: string;
}

/** Nätfiske. Kräver ofta fiskerätt – se `FishRegulations`. */
export interface NetMethod {
  meshSizeMm: MillimeterRange;
  depth: DepthRange;
  bestSeason: string;
  tips: string;
}

/**
 * Fiskemetoder för arten.
 * `null` för fredade arter där fiske inte är tillåtet (t.ex. ål) – då visas
 * en informationsruta i stället för fångsttips.
 */
export interface FishingMethods {
  spinning: SpinningMethod;
  bait: BaitMethod;
  net: NetMethod;
}

/**
 * Vägledande fiskeregler.
 *
 * OBS: Regler skiljer sig mellan län och områden och ändras över tid. Fälten är
 * exempeldata och visas alltid tillsammans med en tydlig brasklapp i gränssnittet.
 * `source` och `updated` finns för att en framtida integration mot Havs- och
 * vattenmyndigheten ska kunna fylla på med spårbara uppgifter.
 */
export interface FishRegulations {
  /** true = arten är fredad, allt riktat fiske är förbjudet. */
  protected: boolean;
  minSizeCm: number | null;
  /** Maxmått (fönsteruttag) där sådant finns. */
  maxSizeCm: number | null;
  /** Högsta antal fiskar per fiskare och dygn. */
  bagLimit: number | null;
  closedSeason: string | null;
  gearRestrictions: string | null;
  /** Kompletterande upplysning som visas under reglerna. */
  note: string | null;
  source: string;
  /** ISO-datum (YYYY-MM-DD) för när uppgifterna senast stämdes av. */
  updated: string;
}

/** En fiskart – motsvarar exakt en JSON-fil i `src/data/fish/`. */
export interface Fish {
  /** URL-vänlig identifierare, matchar filnamnet: `gadda` → `/fiskar/gadda`. */
  slug: string;
  name: string;
  latinName: string;
  /** Vetenskaplig familj, t.ex. "Esocidae". */
  family: string;
  /** Familjens svenska namn, t.ex. "Gäddfiskar". */
  familyName: string;
  type: FishType;
  commonality: Commonality;
  /** Lägre tal = vanligare/populärare. Styr ordningen på startsidan. */
  popularity: number;
  /** Alternativa namn, används för att bredda sökningen. */
  alsoKnownAs: string[];
  /** En mening – används på kort, i sökresultat och som meta description. */
  shortDescription: string;
  /** Fylligare beskrivning på detaljsidan. */
  description: string;
  image: FishImage;
  size: FishSize;
  habitat: FishHabitat;
  /** Föda, t.ex. ["Småfisk", "Kräftdjur"]. */
  diet: string[];
  spawning: Spawning;
  /** Bästa tid på dygnet, t.ex. "Gryning och skymning". */
  bestTimeOfDay: string;
  /** Bästa säsong i klartext, t.ex. "April–oktober". */
  bestSeason: string;
  /** Exakt 12 värden, januari–december. Valideras vid inläsning. */
  calendar: FishingRating[];
  fishing: FishingMethods | null;
  regulations: FishRegulations;
  /** Ett skarpt tips som lyfts fram i sidopanelen. */
  tip: string;
}

/**
 * Lättviktig variant för listor och sök.
 *
 * Startsidan är en serverkomponent som bara skickar denna delmängd till
 * klienten, vilket håller JS-bundlen liten även när artlistan växer.
 */
export interface FishSummary {
  slug: string;
  name: string;
  latinName: string;
  family: string;
  type: FishType;
  commonality: Commonality;
  popularity: number;
  alsoKnownAs: string[];
  shortDescription: string;
  image: FishImage;
}
