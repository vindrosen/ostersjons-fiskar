/**
 * Kort faktasektion om Östersjön.
 *
 * Mockupen har fyra kort som länkar vidare till karta, väder och fångstdagbok.
 * De funktionerna finns inte i den här versionen, och kort som leder till
 * ingenting är sämre än inga kort alls. I stället ger sektionen den kontext
 * som gör resten av guiden begriplig: varför Östersjön är så speciellt, och
 * varför just de här arterna lever här.
 */

import { Droplets, Fish, Leaf } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface Fact {
  icon: ReactNode;
  title: string;
  body: string;
}

const FACTS: Fact[] = [
  {
    icon: <Droplets className="h-5 w-5" aria-hidden />,
    title: "Ett bräckt innanhav",
    body: "Östersjön är världens största brackvattenhav. Salthalten sjunker från omkring 20 promille i Öresund till nästan sött vatten i Bottenviken – därför möts marina arter som torsk och flundra av sötvattensfiskar som gädda och abborre i samma vik.",
  },
  {
    icon: <Fish className="h-5 w-5" aria-hidden />,
    title: "Få arter, hårt pressade",
    body: "Det bräckta vattnet är påfrestande för nästan alla arter, vilket gör Östersjön artfattigt jämfört med Västerhavet. Varje art bär därför en stor roll i ekosystemet – och blir samtidigt känsligare för övergödning, syrebrist och överfiske.",
  },
  {
    icon: <Leaf className="h-5 w-5" aria-hidden />,
    title: "Fiska ansvarsfullt",
    body: "Följ minimimått och fredningstider, låt de största honorna simma vidare och håll dig borta från lekvikarna under våren. Kroka loss fisk i vattnet när du kan – en fisk som återutsätts varsamt överlever oftast.",
  },
];

export function BalticFacts() {
  return (
    <section
      aria-labelledby="om-ostersjon-rubrik"
      className="border-y border-border bg-background-alt"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2
          id="om-ostersjon-rubrik"
          className="text-2xl font-bold text-foreground sm:text-3xl"
        >
          Om Östersjön
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-foreground-muted">
          Ett hav som varken är sött eller salt – och därför hyser en
          fiskfauna som inte finns någon annanstans.
        </p>

        <ul className="mt-8 grid gap-4 md:grid-cols-3 lg:gap-5">
          {FACTS.map((fact) => (
            <li key={fact.title}>
              <Card as="article" className="h-full p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  {fact.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {fact.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  {fact.body}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
