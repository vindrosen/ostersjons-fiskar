/**
 * Varningsruta för invasiva främmande arter.
 *
 * För de här arterna gäller motsatsen till resten av guiden: fisken ska avlivas
 * och får inte släppas tillbaka. Rutan ligger därför överst på detaljsidan, före
 * allt annat innehåll – en läsare som bara skummar sidan måste ändå se den.
 */

import { AlertTriangle } from "lucide-react";
import type { Fish } from "@/types/fish";

export function InvasiveNotice({ fish }: { fish: Fish }) {
  return (
    <section
      aria-labelledby="invasiv-rubrik"
      className="rounded-2xl border border-amber-sea-500/40 bg-amber-sea-200/30 p-5 sm:p-6 dark:bg-amber-sea-500/10"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-sea-500/20 text-amber-sea-500">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 id="invasiv-rubrik" className="text-base font-semibold text-foreground">
            {fish.name} är en invasiv främmande art
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            {fish.regulations.note}
          </p>
          {fish.regulations.mustBeKilled ? (
            <p className="mt-3 rounded-xl bg-surface/70 p-3 text-sm font-medium leading-relaxed text-foreground">
              Fångad {fish.name.toLowerCase()} ska avlivas och får inte släppas
              tillbaka i vattnet. Att sätta ut arten i naturen är förbjudet.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
