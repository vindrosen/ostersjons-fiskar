/**
 * Om-sidan: vad guiden är, var datat kommer ifrån och vad den inte är.
 *
 * Sidan finns framför allt av ärlighetsskäl. Reglerna bygger på HaV men är
 * sammanfattade, och en fiskeguide som inte är tydlig med sina begränsningar
 * kan i värsta fall få någon att bryta mot fiskereglerna.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getFishSummaries } from "@/lib/fish-repository";
import {
  REGULATIONS_CHECKED,
  REGULATIONS_LOCAL_URL,
  REGULATIONS_SOURCE_URL,
  SITE,
  absoluteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Om guiden",
  description:
    "Om Östersjöns Fiskar – vad guiden innehåller, var uppgifterna kommer ifrån och hur du använder dem ansvarsfullt.",
  alternates: { canonical: absoluteUrl("/om") },
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
            <strong className="font-semibold text-foreground">Fiskereglerna</strong>{" "}
            – minimimått, maxmått, fångstbegränsningar och fredningstider – bygger
            på Havs- och vattenmyndighetens uppgifter och stämdes av i{" "}
            {REGULATIONS_CHECKED}. De är däremot sammanfattade: guiden återger de
            nationella reglerna, medan lokala fredningsområden och länsvisa
            bestämmelser tillkommer nästan överallt. Reglerna ändras dessutom
            löpande – torskens och laxens har skärpts flera gånger de senaste åren.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Slå därför alltid upp vad som gäller på just din plats innan du
            fiskar. Havs- och vattenmyndigheten hänvisar själv till karttjänsten
            svenskafiskeregler.se för allt som beror på var du står.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            <strong className="font-semibold text-foreground">
              Artbeskrivningarna
            </strong>{" "}
            – utseende, levnadssätt, lekperioder och fisketider – är skrivna för
            den här guiden och bygger på allmänt vedertagen kunskap om arterna,
            med uppgifter från Havs- och vattenmyndigheten och SLU Artdatabanken
            som grund. De är avsedda att ge en korrekt bild av hur fisken lever,
            men guiden är inte en vetenskaplig källa.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={REGULATIONS_LOCAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Slå upp lokala regler på svenskafiskeregler.se
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
            <a
              href={REGULATIONS_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-primary"
            >
              Havs- och vattenmyndigheten om fritidsfiske
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </Card>

        <Card as="section" className="p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Guiden innehåller inte alla arter
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Östersjön hyser betydligt fler fiskarter än de {fish.length} som
            finns här. Guiden tar upp de vanligaste och mest eftersökta arterna,
            plus de invasiva arter som sprider sig i havet. Bland dem som ännu
            saknas finns till exempel skarpsill, nors, lake, siklöja, sarv,
            björkna, ruda, horngädda, tånglake, hornsimpa, rödspätta och piggvar.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Guiden är byggd för att växa: varje art är en egen datafil, så listan
            kan utökas utan att något annat behöver skrivas om.
          </p>
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
              Ål är fredad, och riktat fritidsfiske efter torsk är förbjudet i
              hela Östersjön sedan 2025.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" aria-hidden />
              Invasiva arter är undantaget från allt detta: de ska avlivas och
              får inte släppas tillbaka.
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
