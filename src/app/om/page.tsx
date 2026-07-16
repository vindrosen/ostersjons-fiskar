/**
 * Om-sidan: vad guiden är, var datat kommer ifrån och vad den inte är.
 *
 * Sidan finns framför allt av ärlighetsskäl. Appens innehåll är exempeldata,
 * och en fiskeguide som inte är tydlig med det kan i värsta fall få någon att
 * bryta mot fiskereglerna.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getFishSummaries } from "@/lib/fish-repository";
import { REGULATIONS_SOURCE_URL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om guiden",
  description:
    "Om Östersjöns Fiskar – vad guiden innehåller, var uppgifterna kommer ifrån och hur du använder dem ansvarsfullt.",
  alternates: { canonical: "/om" },
};

export default async function AboutPage() {
  const fish = await getFishSummaries();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Om guiden
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
        {SITE.name} är en guide till de {fish.length} vanligaste fiskarterna i
        Östersjön – deras liv, livsmiljöer, lekperioder och hur man fiskar dem
        ansvarsfullt.
      </p>

      <div className="mt-10 space-y-6">
        <Card as="section" className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Om uppgifterna</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Artbeskrivningarna, måtten och fisketiderna är sammanställda som
            realistisk exempeldata för att visa hur guiden fungerar. De speglar
            hur arterna faktiskt lever i Östersjön, men de är inte hämtade från
            någon officiell databas och ska inte användas som vetenskaplig källa.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            <strong className="font-semibold text-foreground">
              Fiskereglerna är särskilt viktiga att dubbelkolla.
            </strong>{" "}
            Minimimått, fångstbegränsningar och fredningstider skiljer sig mellan
            län och områden och ändras löpande. Uppgifterna i guiden är
            vägledande exempel – aktuella regler hittar du alltid hos Havs- och
            vattenmyndigheten och din länsstyrelse.
          </p>
          <a
            href={REGULATIONS_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Havs- och vattenmyndigheten om fritidsfiske
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </Card>

        <Card as="section" className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Om illustrationerna</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Varje art har en egen illustration i sidoprofil mot vit bakgrund, i
            samma stil genom hela guiden – som plancherna i en klassisk
            fiskbok. Bilderna är AI-genererade och framtagna för att visa
            artens form, färg och kännetecken. De är alltså inte fotografier och
            ska inte användas för artbestämning i tveksamma fall.
          </p>
        </Card>

        <Card as="section" className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Fiska ansvarsfullt</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-foreground-muted">
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" aria-hidden />
              Respektera minimimått, maxmått och fredningstider.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" aria-hidden />
              Låt de största honorna simma vidare – de bär beståndets framtid.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" aria-hidden />
              Håll dig borta från lekvikar och lekbottnar under leken.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" aria-hidden />
              Kroka loss fisken i vattnet när du kan, och lyft aldrig i gälarna.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" aria-hidden />
              Ål är fredad. Torsken i Östersjön är starkt hotad och omfattas av
              stränga begränsningar.
            </li>
          </ul>
        </Card>
      </div>

      <p className="mt-10 text-sm text-foreground-muted">
        <Link href="/fiskar" className="font-semibold text-primary hover:text-primary-hover">
          Utforska alla {fish.length} arter →
        </Link>
      </p>
    </div>
  );
}
