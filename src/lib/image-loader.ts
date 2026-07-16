/**
 * Egen bildladdare för `next/image`.
 *
 * Löser två problem som båda uppstår när sajten publiceras statiskt på GitHub
 * Pages, utan Next.js bildoptimering:
 *
 * 1. **Underkatalogen.** `next/image` lägger inte på `basePath` på bildernas
 *    sökvägar. Utan den här laddaren begär sidan `/images/fisk/gadda.webp` när
 *    filen ligger på `/ostersjons-fiskar/images/fisk/gadda.webp` – och varenda
 *    bild blir en trasig ruta.
 *
 * 2. **Vikten.** Utan optimeringsserver skulle originalbilden serveras till
 *    alla, ungefär 200 kB per fisk. Laddaren pekar i stället ut de varianter
 *    som `npm run images:optimize` genererat i förväg, så webbläsaren kan välja
 *    en storlek som passar skärmen via srcset.
 *
 * Manifestet skrivs av bildskriptet och talar om vilka bredder som faktiskt
 * finns för varje bild – laddaren får aldrig gissa fram en fil som inte finns.
 */

import manifest from "@/data/image-manifest.json";
import { BASE_PATH } from "@/lib/site";

/** Tillgängliga bredder per bildsökväg, stigande. */
const VARIANTS: Record<string, number[]> = manifest;

interface ImageLoaderParams {
  src: string;
  width: number;
}

/**
 * Bygger sökvägen till en variant: "/images/fisk/gadda.webp" + 640
 * → "/images/fisk/gadda-640.webp".
 */
function variantPath(src: string, width: number): string {
  return src.replace(/\.webp$/, `-${width}.webp`);
}

/**
 * Sökvägen till den största varianten av en bild.
 *
 * Behövs för OG- och Twitter-bilder, som anges som färdiga URL:er i metadata
 * och därför aldrig passerar laddaren. Sökvägen i fiskdatat
 * ("/images/fisk/gadda.webp") är bara en nyckel – någon fil med exakt det
 * namnet skrivs inte längre, eftersom pipelinen bara producerar varianter.
 */
export function largestImageVariant(src: string): string {
  const widths = VARIANTS[src];
  if (!widths || widths.length === 0) return src;
  return variantPath(src, widths[widths.length - 1]);
}

export default function imageLoader({ src, width }: ImageLoaderParams): string {
  const widths = VARIANTS[src];

  // Saknas bilden i manifestet är originalet det enda vi vet finns.
  if (!widths || widths.length === 0) {
    return `${BASE_PATH}${src}`;
  }

  // Minsta variant som är minst så bred som efterfrågat; annars den största
  // vi har. Att skala upp en mindre variant vore sämre än att skicka originalet.
  const chosen = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];

  return `${BASE_PATH}${variantPath(src, chosen)}`;
}
