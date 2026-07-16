/**
 * Optimerar genererade bilder för webben och bygger responsiva varianter.
 *
 * Pipeline:  assets/generated/  →  public/images/  +  src/data/image-manifest.json
 *   fisk/*.webp          → public/images/fisk/<namn>-<bredd>.webp   (beskärs)
 *   hero-ostersjon.webp  → public/images/hero-ostersjon-<bredd>.webp
 *
 * Fiskoriginalen är 1536×1024 med mycket tom yta runt motivet. För dem gör
 * skriptet fyra saker:
 *
 *   1. Beskär bort den genomskinliga ramen, så att fisken fyller sin ruta i
 *      stället för att sväva som en liten prick mitt i ett stort tomrum.
 *   2. Skalar ner till en rimlig maxbredd.
 *   3. Skriver ut en trappa av bredder, så att en mobil slipper ladda en bild
 *      gjord för en 27-tumsskärm.
 *   4. Komprimerar till WebP med en kvalitet som inte syns på skärm.
 *
 * Hero-bilden är ett foto utan genomskinlighet och ska inte beskäras – den
 * skalas och komprimeras bara.
 *
 * Varianterna behövs eftersom sajten publiceras statiskt på GitHub Pages, utan
 * Next.js bildoptimering: det som inte skapas här finns inte i produktion.
 * `src/lib/image-loader.ts` läser manifestet och väljer rätt variant.
 *
 * Kör med:  npm run images:optimize
 *
 * Originalen i assets/generated/ är masterfiler och ska sparas – de gör att
 * bilderna kan bearbetas om utan att kosta nya API-anrop.
 *
 * OBS: sharp ligger i optionalDependencies och installeras av `npm install`,
 * men inte i CI (som kör `npm ci --omit=optional`). Skriptet är ett lokalt
 * underhållsverktyg – bilderna det producerar är versionshanterade, så bygget
 * behöver aldrig köra det. Se .github/workflows/deploy.yml.
 */

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const GENERATED_DIR = path.join(process.cwd(), "assets", "generated");
const SOURCE_DIR = path.join(GENERATED_DIR, "fisk");
const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const TARGET_DIR = path.join(IMAGES_DIR, "fisk");
const MANIFEST_FILE = path.join(process.cwd(), "src", "data", "image-manifest.json");

/** Hero-bildens masterfil. */
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

/**
 * Bredder att generera.
 *
 * MÅSTE stämma överens med `images.deviceSizes` + `images.imageSizes` i
 * next.config.ts. Next.js frågar bara efter bredder ur de listorna, och
 * laddaren kan bara peka på filer som skapats här – går de isär serveras
 * onödigt stora bilder (eller inga alls).
 */
const WIDTH_LADDER = [256, 384, 640, 1280, 2048];

/** Formaterar bytes som kilobyte. */
function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} kB`;
}

/** "gadda.webp" + 640 → "gadda-640.webp" */
function variantName(file, width) {
  return file.replace(/\.webp$/, `-${width}.webp`);
}

/**
 * Skriver ut varianterna för en redan bearbetad bild.
 *
 * Bredder större än bilden hoppas över – att skala upp ger bara en större fil
 * utan mer detalj. Originalbredden tas alltid med som största variant.
 *
 * @returns Bredderna som faktiskt skapades, stigande.
 */
async function writeVariants(pipeline, sourceWidth, targetDir, file, quality) {
  const widths = WIDTH_LADDER.filter((w) => w < sourceWidth);
  widths.push(sourceWidth);

  let totalBytes = 0;
  for (const width of widths) {
    const output = await pipeline
      .clone()
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality, effort: 6, alphaQuality: 90 })
      .toFile(path.join(targetDir, variantName(file, width)));
    totalBytes += output.size;
  }

  return { widths, totalBytes };
}

async function optimizeFish(file) {
  const source = path.join(SOURCE_DIR, file);
  const before = (await stat(source)).size;

  // Beskär den genomskinliga ramen och skala ner till maxstorlek en gång.
  // Varianterna skalas sedan ur detta resultat.
  const base = sharp(source)
    .trim({ threshold: 5 })
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true });

  const buffer = await base.toBuffer();
  const { width } = await sharp(buffer).metadata();

  const { widths, totalBytes } = await writeVariants(
    sharp(buffer),
    width,
    TARGET_DIR,
    file,
    QUALITY,
  );

  console.log(
    `  ${file.padEnd(16)} ${String(width).padStart(4)} px  ` +
      `${kb(before).padStart(7)} → ${kb(totalBytes).padStart(7)} i ${widths.length} varianter ` +
      `(minsta ${widths[0]} px)`,
  );

  return { before, after: totalBytes, widths };
}

async function optimizeHero() {
  const source = path.join(GENERATED_DIR, HERO_FILE);
  const before = (await stat(source)).size;

  const base = sharp(source).resize(HERO_MAX_WIDTH, null, { withoutEnlargement: true });
  const buffer = await base.toBuffer();
  const { width } = await sharp(buffer).metadata();

  const { widths, totalBytes } = await writeVariants(
    sharp(buffer),
    width,
    IMAGES_DIR,
    HERO_FILE,
    HERO_QUALITY,
  );

  console.log(
    `  ${HERO_FILE.padEnd(16)} ${String(width).padStart(4)} px  ` +
      `${kb(before).padStart(7)} → ${kb(totalBytes).padStart(7)} i ${widths.length} varianter ` +
      `(minsta ${widths[0]} px)`,
  );

  return { before, after: totalBytes, widths };
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

  /** Sökväg (som den skrivs i fiskdatat) → tillgängliga bredder. */
  const manifest = {};
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const { before, after, widths } = await optimizeFish(file);
    manifest[`/images/fisk/${file}`] = widths;
    totalBefore += before;
    totalAfter += after;
  }

  const hero = await optimizeHero();
  manifest[`/images/${HERO_FILE}`] = hero.widths;
  totalBefore += hero.before;
  totalAfter += hero.after;

  // Sorterad nyckelordning håller diffen läsbar mellan körningar.
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST_FILE, `${JSON.stringify(sorted, null, 2)}\n`);

  console.log(
    `\nTotalt: ${kb(totalBefore)} → ${kb(totalAfter)} i alla varianter tillsammans`,
  );
  console.log(`Manifest skrivet: ${path.relative(process.cwd(), MANIFEST_FILE)}`);
}

main();
