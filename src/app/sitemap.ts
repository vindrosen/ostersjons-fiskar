/**
 * Sitemap – genereras vid build från samma datakälla som sidorna.
 *
 * Nya arter hamnar automatiskt i sitemap när JSON-filen läggs till; ingen
 * manuell lista att glömma bort.
 */

import type { MetadataRoute } from "next";
import { getAllFishSlugs } from "@/lib/fish-repository";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllFishSlugs();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/fiskar`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/om`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const fishRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE.url}/fiskar/${slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...fishRoutes];
}
