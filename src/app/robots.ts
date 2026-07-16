/**
 * robots.txt – tillåter indexering och pekar ut sitemap.
 */

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Krävs för `output: "export"`. Utan detta avbryts bygget med
 * "export const dynamic ... not configured on route /robots.txt".
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
