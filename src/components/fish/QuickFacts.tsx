/**
 * Snabbfakta – den gröna rutan från mockupen.
 *
 * Sammanfattar det en fiskare vill veta först: när på året, när på dygnet,
 * när arten leker och vad den äter.
 */

import { Check } from "lucide-react";
import type { Fish } from "@/types/fish";

interface QuickFactsProps {
  fish: Fish;
}

export function QuickFacts({ fish }: QuickFactsProps) {
  const facts = [
    { label: "Bästa säsong", value: fish.bestSeason },
    { label: "Bäst tid på dygnet", value: fish.bestTimeOfDay },
    { label: "Lekperiod", value: fish.spawning.period },
    { label: "Äter", value: fish.diet.join(", ") },
  ];

  return (
    <section
      aria-labelledby="snabbfakta-rubrik"
      className="rounded-2xl border border-accent/20 bg-accent-soft p-5"
    >
      <h2 id="snabbfakta-rubrik" className="text-sm font-semibold text-foreground">
        Snabbfakta
      </h2>
      <ul className="mt-3 space-y-2.5">
        {facts.map((fact) => (
          <li key={fact.label} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span className="text-foreground-muted">
              <span className="font-medium text-foreground">{fact.label}:</span>{" "}
              {fact.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
