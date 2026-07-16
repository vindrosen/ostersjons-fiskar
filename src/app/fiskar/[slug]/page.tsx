/**
 * Detaljsida för en fiskart: /fiskar/gadda
 *
 * Alla artsidor förrenderas vid build via `generateStaticParams`, vilket ger
 * statiska HTML-sidor utan serveranrop och därmed mycket snabb laddning.
 *
 * Mockupen visar innehållet i flikar (Översikt, Fiskeinfo, Utbredning …). Här
 * ligger allt i stället i en enda scrollbar sida med tydliga rubriker. Skälet
 * är tredelat: sökmotorer indexerar allt innehåll i stället för bara första
 * fliken, mobilanvändare slipper leta bland flikar, och en läsare kan svepa
 * igenom hela arten i ett svep. Sidopanelen håller reglerna synliga hela vägen.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { FishHeader } from "@/components/fish/FishHeader";
import { FactsTable, type Fact } from "@/components/fish/FactsTable";
import { QuickFacts } from "@/components/fish/QuickFacts";
import { FishingCalendar } from "@/components/fish/FishingCalendar";
import { FishingMethods } from "@/components/fish/FishingMethods";
import { ProtectedNotice } from "@/components/fish/ProtectedNotice";
import { RegulationsCard } from "@/components/fish/RegulationsCard";
import { TipCard } from "@/components/fish/TipCard";
import { getAllFishSlugs, getFishBySlug } from "@/lib/fish-repository";
import {
  FISH_TYPE_LABELS,
  formatDepth,
  formatEnvironments,
  formatLengthRange,
  formatWeight,
} from "@/lib/labels";
import { SITE, absoluteUrl } from "@/lib/site";
import { largestImageVariant } from "@/lib/image-loader";
import { BookOpen, Waves } from "lucide-react";

interface FishPageProps {
  params: Promise<{ slug: string }>;
}

/** Förrenderar en sida per art vid build. */
export async function generateStaticParams() {
  const slugs = await getAllFishSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FishPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fish = await getFishBySlug(slug);

  if (!fish) {
    return { title: "Arten hittades inte" };
  }

  const title = `${fish.name} (${fish.latinName})`;
  // Absoluta URL:er genomgående: en naken sökväg som "/fiskar/gadda" skulle
  // tolkas mot domänroten och tappa underkatalogen sajten ligger i.
  const pageUrl = absoluteUrl(`/fiskar/${fish.slug}`);
  const imageUrl = absoluteUrl(largestImageVariant(fish.image.src));

  return {
    title,
    description: fish.shortDescription,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      title,
      description: fish.shortDescription,
      url: pageUrl,
      images: [{ url: imageUrl, alt: fish.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fish.shortDescription,
      images: [imageUrl],
    },
  };
}

export default async function FishPage({ params }: FishPageProps) {
  const { slug } = await params;
  const fish = await getFishBySlug(slug);

  if (!fish) {
    notFound();
  }

  const facts: Fact[] = [
    { label: "Familj", value: `${fish.family} (${fish.familyName})` },
    { label: "Typ", value: FISH_TYPE_LABELS[fish.type] },
    { label: "Maxlängd", value: `${fish.size.maxLengthCm} cm` },
    { label: "Maxvikt", value: formatWeight(fish.size.maxWeightKg) },
    { label: "Vanlig storlek", value: formatLengthRange(fish.size.typicalLengthCm) },
    { label: "Livslängd", value: `Upp till ${fish.size.maxAgeYears} år` },
    { label: "Miljö", value: formatEnvironments(fish.habitat.environments) },
    { label: "Typiskt djup", value: formatDepth(fish.habitat.typicalDepth) },
  ];

  /**
   * Strukturerad data hjälper sökmotorer förstå att sidan handlar om en
   * specifik art. Schema.org saknar en fisktyp, så artikelformatet är den
   * närmaste rimliga beskrivningen.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${fish.name} (${fish.latinName})`,
    description: fish.shortDescription,
    image: absoluteUrl(largestImageVariant(fish.image.src)),
    about: {
      "@type": "Thing",
      name: fish.name,
      alternateName: fish.latinName,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FishHeader fish={fish} />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_20rem] lg:gap-8 lg:px-8">
        {/* Huvudspalt */}
        <div className="space-y-6">
          <Card as="section">
            <CardHeader
              title={`Om ${fish.name.toLowerCase()}`}
              icon={<BookOpen className="h-[18px] w-[18px]" aria-hidden />}
            />
            <CardBody>
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                <FactsTable facts={facts} className="border-t border-border" />
                <div className="space-y-5">
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {fish.description}
                  </p>
                  <QuickFacts fish={fish} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card as="section">
            <CardHeader
              title="Utbredning och livsmiljö"
              icon={<Waves className="h-[18px] w-[18px]" aria-hidden />}
            />
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  Utbredning
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                  {fish.habitat.distribution}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  Livsmiljö
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                  {fish.habitat.description}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  Lek
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                  {fish.spawning.description}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Fredade arter får en varning i stället för fisketider och metoder. */}
          {fish.fishing ? (
            <>
              <FishingCalendar
                calendar={fish.calendar}
                spawningMonths={fish.spawning.months}
                fishName={fish.name}
              />
              <FishingMethods fishing={fish.fishing} fishName={fish.name} />
            </>
          ) : (
            <ProtectedNotice fish={fish} />
          )}
        </div>

        {/* Sidopanel. Klistrad på stora skärmar så att reglerna följer med. */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <RegulationsCard regulations={fish.regulations} />
          <TipCard tip={fish.tip} />
        </aside>
      </div>
    </article>
  );
}
