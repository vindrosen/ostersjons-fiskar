/**
 * Optimerar genererade bilder för webben.
 *
 * Pipeline:  assets/generated/  →  public/images/
 *   fisk/*.webp          → public/images/fisk/*.webp     (beskärs + krymps)
 *   hero-ostersjon.webp  → public/images/hero-*.webp     (krymps)
 *
 * Fiskoriginalen är 1536×1024 med mycket tom yta runt motivet. För dem gör
 * skriptet tre saker:
 *
 *   1. Beskär bort den genomskinliga ramen, så att fisken fyller sin ruta i
 *      stället för att sväva som en liten prick mitt i ett stort tomrum.
 *   2. Skalar ner till en rimlig maxbredd (räcker gott för retina i kortens
 *      och detaljsidans storlekar).
 *   3. Komprimerar till WebP med en kvalitet som inte syns på skärm.
 *
 * Hero-bilden är ett foto utan genomskinlighet och ska inte beskäras – den
 * krymps och komprimeras bara.
 *
 * Kör med:  npm run images:optimize
 *
 * Originalen i assets/generated/ är masterfiler och ska sparas – de gör att
 * bilderna kan bearbetas om utan att kosta nya API-anrop.
 */

import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const GENERATED_DIR = path.join(process.cwd(), "assets", "generated");
const SOURCE_DIR = path.join(GENERATED_DIR, "fisk");
const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const TARGET_DIR = path.join(IMAGES_DIR, "fisk");

/** Hero-bildens master respektive mål. */
const HERO_FILE = "hero-ostersjon.webp";
/** Hero visas i full skärmbredd – 2048 px räcker även för stora skärmar. */
const HERO_MAX_WIDTH = 2048;
/** Foton tål hårdare komprimering än illustrationer utan att det syns. */
const HERO_QUALITY = 76;

/** Största bredd i pixlar. Detaljsidans bild visas i högst ~800 CSS-px. */
const MAX_WIDTH = 1400;
/** Största höjd – hindrar höga arter (braxen) från att bli onödigt stora. */
const MAX_HEIGHT = 900;
/** WebP-kvalitet. 82 är visuellt förlustfritt för de här motiven. */
const QUALITY = 82;

/** Formaterar bytes som kilobyte med en decimal. */
function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} kB`;
}

async function optimize(file) {
  const source = path.join(SOURCE_DIR, file);
  const target = path.join(TARGET_DIR, file);

  const before = (await stat(source)).size;

  const output = await sharp(source)
    // Beskär den genomskinliga ramen. Tröskeln är låg eftersom bakgrunden är
    // helt genomskinlig – bara fisken har alfa över noll.
    .trim({ threshold: 5 })
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 90 })
    .toFile(target);

  const saved = Math.round((1 - output.size / before) * 100);
  console.log(
    `  ${file.padEnd(16)} ${String(output.width).padStart(4)}×${String(output.height).padEnd(4)}  ` +
      `${kb(before).padStart(7)} → ${kb(output.size).padStart(6)}  (−${saved} %)`,
  );

  return { before, after: output.size };
}

/** Krymper och komprimerar hero-fotot. Ingen beskärning – bilden är fylld. */
async function optimizeHero() {
  const source = path.join(GENERATED_DIR, HERO_FILE);
  const target = path.join(IMAGES_DIR, HERO_FILE);

  const before = (await stat(source)).size;
  const output = await sharp(source)
    .resize(HERO_MAX_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: HERO_QUALITY, effort: 6 })
    .toFile(target);

  const saved = Math.round((1 - output.size / before) * 100);
  console.log(
    `  ${HERO_FILE.padEnd(16)} ${String(output.width).padStart(4)}×${String(output.height).padEnd(4)}  ` +
      `${kb(before).padStart(7)} → ${kb(output.size).padStart(6)}  (−${saved} %)`,
  );

  return { before, after: output.size };
}

async function main() {
  await mkdir(TARGET_DIR, { recursive: true });

  const files = (await readdir(SOURCE_DIR)).filter((f) => f.endsWith(".webp")).sort();

  if (files.length === 0) {
    console.error(`Inga bilder hittades i ${SOURCE_DIR}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Optimerar ${files.length} fiskbilder + hero\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const { before, after } = await optimize(file);
    totalBefore += before;
    totalAfter += after;
  }

  const hero = await optimizeHero();
  totalBefore += hero.before;
  totalAfter += hero.after;

  console.log(
    `\nTotalt: ${kb(totalBefore)} → ${kb(totalAfter)} ` +
      `(−${Math.round((1 - totalAfter / totalBefore) * 100)} %)`,
  );
}

main();
