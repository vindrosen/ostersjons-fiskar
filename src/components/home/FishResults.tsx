"use client";

/**
 * Träfflista med typfilter.
 *
 * Delas av startsidan (som visar ett urval med en länk till alla arter) och
 * sidan /fiskar (som visar hela beståndet). Sökordet kommer från
 * `FishFilterProvider` och skrivs av sökfältet uppe i hero-sektionen.
 */

import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { useMemo } from "react";
import { FishCard } from "./FishCard";
import { RESULTS_ANCHOR_ID } from "./SearchField";
import { useFishFilter } from "./FishFilterProvider";
import { availableTypes, filterByType, searchFish } from "@/lib/search";
import { FISH_TYPE_LABELS } from "@/lib/labels";
import { cn } from "@/lib/cn";
import type { FishSummary } from "@/types/fish";

interface FishResultsProps {
  fish: FishSummary[];
  /** Rubrik ovanför rutnätet. */
  title: string;
  /**
   * Hur många arter som visas innan användaren klickar vidare. Utelämnas på
   * sidan som ska visa alla arter.
   */
  initialLimit?: number;
  /** Länkmål för "Visa alla arter". Visas bara när `initialLimit` kapar listan. */
  showAllHref?: string;
  /**
   * Antal kort vars bilder ska laddas direkt i stället för lazy.
   *
   * Sätt bara detta när rutnätet faktiskt syns utan att användaren scrollar.
   * På startsidan ligger korten under en skärmhög hero – där skulle förladdade
   * kortbilder bara konkurrera med hero-bilden, som är sidans LCP-element.
   */
  eagerImageCount?: number;
}

export function FishResults({
  fish,
  title,
  initialLimit,
  showAllHref,
  eagerImageCount = 0,
}: FishResultsProps) {
  const { query, type, setType } = useFishFilter();

  const matches = useMemo(
    () => filterByType(searchFish(fish, query), type),
    [fish, query, type],
  );

  const types = useMemo(() => availableTypes(fish), [fish]);

  // Ett aktivt sök eller filter ska alltid visa alla träffar – annars skulle
  // en art kunna filtreras fram men ändå ligga dold bakom "Visa alla arter".
  const isFiltering = query.trim().length > 0 || type !== "alla";
  const limit = isFiltering ? undefined : initialLimit;
  const visible = limit ? matches.slice(0, limit) : matches;
  const hasHidden = Boolean(showAllHref && limit && matches.length > limit);

  return (
    <section
      id={RESULTS_ANCHOR_ID}
      aria-labelledby="arter-rubrik"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="arter-rubrik" className="text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-foreground-muted" aria-live="polite">
            {query.trim()
              ? `${matches.length} ${matches.length === 1 ? "träff" : "träffar"} för ”${query.trim()}”`
              : `${matches.length} ${matches.length === 1 ? "art" : "arter"} i guiden`}
          </p>
        </div>

        {/* Typfilter. En radiogrupp snarare än knappar – bara ett val i taget. */}
        <div
          role="radiogroup"
          aria-label="Filtrera på fisktyp"
          className="flex flex-wrap gap-2"
        >
          {(["alla", ...types] as const).map((option) => {
            const active = type === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setType(option)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {option === "alla" ? "Alla" : FISH_TYPE_LABELS[option]}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {visible.map((item, index) => (
            <li key={item.slug}>
              <FishCard fish={item} priority={index < eagerImageCount} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-foreground-subtle" aria-hidden />
          <p className="mt-4 text-base font-semibold text-foreground">
            Inga arter matchar din sökning
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-foreground-muted">
            Prova ett annat ord, sök på det latinska namnet eller nollställ
            filtret för att se alla arter.
          </p>
        </div>
      )}

      {hasHidden ? (
        <div className="mt-10 flex justify-center">
          <Link
            href={showAllHref!}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
          >
            Visa alla {fish.length} arter
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
