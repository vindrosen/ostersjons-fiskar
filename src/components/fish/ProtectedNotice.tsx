/**
 * Varningsruta för arter som inte får fiskas.
 *
 * Ersätter fångsttipsen helt. Den enda "fiskemetod" som är relevant för en
 * fredad art är att låta den vara i fred.
 *
 * Täcker två fall, som skiljer sig juridiskt:
 *
 *   • Fredad art (ålen) – allt fiske efter arten är förbjudet.
 *   • Förbud mot riktat fiske (torsken) – arten är inte fredad, men man får
 *     inte fiska efter den. Bifångst kan vara tillåten att behålla.
 *
 * Skillnaden syns i rubriken; detaljerna står i artens `regulations.note`.
 */

import { Ban } from "lucide-react";
import type { Fish } from "@/types/fish";

export function ProtectedNotice({ fish }: { fish: Fish }) {
  const isProtected = fish.regulations.protected;

  const title = isProtected
    ? `${fish.name} är fredad – allt fiske är förbjudet`
    : `Riktat fritidsfiske efter ${fish.name.toLowerCase()} är förbjudet`;

  return (
    <section
      aria-labelledby="fredad-rubrik"
      className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300">
          <Ban className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2
            id="fredad-rubrik"
            className="text-base font-semibold text-rose-700 dark:text-rose-300"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            {fish.regulations.note}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Därför visar den här sidan inga fångstmetoder eller fisketider.
            Beståndet är hårt trängt – varje fisk som får leva vidare räknas.
          </p>
        </div>
      </div>
    </section>
  );
}
