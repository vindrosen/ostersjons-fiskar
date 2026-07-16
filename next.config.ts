import type { NextConfig } from "next";

/**
 * Underkatalog som sajten ligger i, t.ex. "/ostersjons-fiskar" på en
 * GitHub Pages-projektsida. Tom lokalt. Sätts av deploy-workflowet.
 * Håll i synk med BASE_PATH i src/lib/site.ts, som läser samma variabel.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /**
   * Statisk export till out/ – GitHub Pages serverar bara filer, ingen Node.
   * Appen har inga serverberoenden: all data läses vid build och varje sida
   * förrenderas till HTML.
   */
  output: "export",

  basePath,

  /**
   * Varje sida hamnar i en egen mapp med index.html (/fiskar/gadda/index.html)
   * i stället för gadda.html. Det gör att sidorna kan öppnas direkt på vilken
   * enkel filserver som helst, utan regler för att lägga till ".html".
   */
  trailingSlash: true,

  images: {
    /**
     * Utan Next.js bildoptimering (som kräver en server) måste bilderna vara
     * färdigskalade. Laddaren pekar ut de varianter som npm run images:optimize
     * skapar, och lägger på basePath – vilket next/image inte gör själv.
     */
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",

    /**
     * Bredder som next/image får fråga efter. MÅSTE motsvara WIDTH_LADDER i
     * scripts/optimize-fish-images.mjs – annars efterfrågas storlekar som
     * aldrig genererats.
     */
    imageSizes: [256, 384],
    deviceSizes: [640, 1280, 2048],
  },
};

export default nextConfig;
