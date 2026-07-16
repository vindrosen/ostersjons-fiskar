/**
 * Varningsruta för fredade arter.
 *
 * Ersätter fångsttipsen helt. Den enda "fiskemetod" som är relevant för en
 * fredad art är att låta den vara i fred.
 */

import { Ban } from "lucide-react";
import type { Fish } from "@/types/fish";

interface ProtectedNoticeProps {
  fish: Fish;
}

export function ProtectedNotice({ fish }: ProtectedNoticeProps) {
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
            {fish.name} är fredad – allt fiske är förbjudet
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            {fish.regulations.note}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Därför visar den här sidan inga fångstmetoder eller fisketider. Vill
            du hjälpa arten: fiska inte i vatten där den är vanlig under
            vandringstiderna, och rapportera gärna dina observationer till
            berörd myndighet.
          </p>
        </div>
      </div>
    </section>
  );
}
