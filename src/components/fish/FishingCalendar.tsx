/**
 * Fiskekalender – tolv månader med fiskekvalitet och lekperiod.
 *
 * Färgen visar hur bra fisket är; en markering under stapeln visar lekperioden.
 * Färg används alltså aldrig som enda informationsbärare: varje månad har också
 * en synlig etikett och en `title`/aria-text som säger samma sak i klartext,
 * vilket gör kalendern begriplig även med nedsatt färgseende.
 */

import { CalendarDays, Egg } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { MONTH_LABELS_LONG, MONTH_LABELS_SHORT, RATING_LABELS } from "@/lib/labels";
import { cn } from "@/lib/cn";
import type { FishingRating, Month } from "@/types/fish";

interface FishingCalendarProps {
  /** Tolv värden, januari–december. */
  calendar: FishingRating[];
  /** Månader då arten leker, 1-indexerade. */
  spawningMonths: Month[];
  /** Artens namn – används i kalenderns beskrivning. */
  fishName: string;
}

/** Stapelfärg per betyg. Grön = bäst, bärnsten = bra, blek = mindre bra. */
const RATING_BAR: Record<FishingRating, string> = {
  low: "bg-sand-200 dark:bg-sea-800",
  good: "bg-amber-sea-400",
  best: "bg-kelp-500",
};

/** Höjd per betyg – ger kalendern en avläsbar siluett även i gråskala. */
const RATING_HEIGHT: Record<FishingRating, string> = {
  low: "h-2.5",
  good: "h-5",
  best: "h-8",
};

/** Färgprick i förklaringen. */
const RATING_DOT: Record<FishingRating, string> = {
  low: "bg-sand-300 dark:bg-sea-700",
  good: "bg-amber-sea-400",
  best: "bg-kelp-500",
};

export function FishingCalendar({
  calendar,
  spawningMonths,
  fishName,
}: FishingCalendarProps) {
  const spawning = new Set<number>(spawningMonths);

  return (
    <Card as="section">
      <CardHeader
        title="Bästa fisketider"
        icon={<CalendarDays className="h-[18px] w-[18px]" aria-hidden />}
      />
      <CardBody>
        <ol className="flex items-end gap-1 sm:gap-1.5">
          {calendar.map((rating, index) => {
            const month = index + 1;
            const isSpawning = spawning.has(month);
            const description = `${MONTH_LABELS_LONG[index]}: ${RATING_LABELS[rating].toLowerCase()}${
              isSpawning ? ", lekperiod" : ""
            }`;

            return (
              <li key={month} className="flex flex-1 flex-col items-center gap-1.5">
                {/* Stapeln växer uppåt från en gemensam baslinje. */}
                <div
                  className="flex h-8 w-full items-end"
                  title={description}
                  aria-hidden
                >
                  <div
                    className={cn(
                      "w-full rounded-md transition-all duration-500 ease-[var(--ease-out-soft)]",
                      RATING_BAR[rating],
                      RATING_HEIGHT[rating],
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "text-[11px] font-medium",
                    rating === "best" ? "text-foreground" : "text-foreground-subtle",
                  )}
                >
                  {MONTH_LABELS_SHORT[index]}
                </span>

                {/* Lekmarkering: en tunn stapel under månadsnamnet. */}
                <span
                  className={cn(
                    "h-1 w-full rounded-full",
                    isSpawning ? "bg-primary" : "bg-transparent",
                  )}
                  aria-hidden
                />

                {/* Klartext för skärmläsare – ersätter färgkodningen. */}
                <span className="sr-only">{description}</span>
              </li>
            );
          })}
        </ol>

        {/* Förklaring. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-foreground-muted">
          {(Object.keys(RATING_LABELS) as FishingRating[]).map((rating) => (
            <span key={rating} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", RATING_DOT[rating])} aria-hidden />
              {RATING_LABELS[rating]}
            </span>
          ))}
          {spawningMonths.length > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-4 rounded-full bg-primary" aria-hidden />
              Lekperiod
            </span>
          ) : null}
        </div>

        {spawningMonths.length === 0 ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-muted p-3 text-xs leading-relaxed text-foreground-muted">
            <Egg className="mt-0.5 h-4 w-4 shrink-0 text-foreground-subtle" aria-hidden />
            {fishName} leker inte i Östersjön, så ingen lekperiod är markerad i
            kalendern.
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
