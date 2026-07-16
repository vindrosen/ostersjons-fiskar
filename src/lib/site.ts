/**
 * Sajtövergripande konstanter.
 *
 * Samlade här så att namn, URL och navigation bara finns på ett ställe –
 * de används av metadata, header, footer, sitemap och robots.txt.
 */

/**
 * Underkatalog som sajten ligger i, utan avslutande snedstreck.
 *
 * Tom sträng lokalt och på ett eget domännamn. På GitHub Pages projektsidor
 * ligger sajten i en underkatalog med repots namn (`/ostersjons-fiskar`), och
 * då måste både Next.js och våra egna absoluta URL:er känna till prefixet.
 *
 * Värdet sätts vid build via NEXT_PUBLIC_BASE_PATH – se next.config.ts och
 * .github/workflows/deploy.yml.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE = {
  name: "Östersjöns Fiskar",
  description:
    "Din kompletta guide till fisken i Östersjön. Lär dig om arterna, deras livsmiljöer, lekperioder och de bästa fisketiderna – art för art.",
  /**
   * Publik bas-URL inklusive eventuell underkatalog, utan avslutande snedstreck.
   * Sätts via NEXT_PUBLIC_SITE_URL vid deploy så att canonical-länkar, OG-bilder
   * och sitemap pekar rätt i varje miljö.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://vindrosen.github.io/ostersjons-fiskar",
} as const;

/**
 * Bygger en absolut URL till en sökväg i sajten.
 *
 * Använd alltid denna för canonical-länkar, OG-bilder och sitemap – aldrig en
 * naken sökväg. En sökväg som börjar med "/" tolkas nämligen som roten på
 * domänen och tappar underkatalogen: `/bild.webp` mot basen
 * `https://vindrosen.github.io/ostersjons-fiskar` blir
 * `https://vindrosen.github.io/bild.webp`, vilket är fel sajt.
 *
 * @param path Sökväg som börjar med "/", t.ex. "/fiskar/gadda".
 */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path}`;
}

/** Huvudnavigationen. Endast rutter som faktiskt finns ligger här. */
export const NAV_LINKS = [
  { href: "/", label: "Start" },
  { href: "/fiskar", label: "Alla arter" },
  { href: "/om", label: "Om" },
] as const;

/**
 * Brasklapp för fiskeregler.
 *
 * Reglerna i appen är exempeldata och skiljer sig mellan områden. Texten visas
 * överallt där regler presenteras – den ska aldrig kunna glömmas bort på en sida.
 */
export const REGULATIONS_DISCLAIMER =
  "Uppgifterna är vägledande exempeldata. Fiskeregler skiljer sig mellan områden och ändras över tid – kontrollera alltid aktuella regler hos Havs- och vattenmyndigheten och din länsstyrelse innan du fiskar.";

/** Källa som reglerna hänvisar till. */
export const REGULATIONS_SOURCE_URL = "https://www.havochvatten.se/fritidsfiske";
