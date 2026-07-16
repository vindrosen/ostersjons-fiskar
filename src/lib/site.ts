/**
 * Sajtövergripande konstanter.
 *
 * Samlade här så att namn, URL och navigation bara finns på ett ställe –
 * de används av metadata, header, footer, sitemap och robots.txt.
 */

export const SITE = {
  name: "Östersjöns Fiskar",
  description:
    "Din kompletta guide till fisken i Östersjön. Lär dig om arterna, deras livsmiljöer, lekperioder och de bästa fisketiderna – art för art.",
  /**
   * Publik bas-URL. Sätts via NEXT_PUBLIC_SITE_URL vid deploy så att
   * canonical-länkar och sitemap pekar rätt i varje miljö.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostersjonsfiskar.se",
} as const;

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
