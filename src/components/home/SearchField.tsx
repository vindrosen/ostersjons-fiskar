"use client";

/**
 * Sökfält för fiskarter.
 *
 * Skriver till den delade filterkontexten och rullar ner till träfflistan när
 * användaren skickar formuläret – annars kan träffarna hamna utanför skärmen
 * på mobil, där hero-bilden tar upp hela vyn.
 */

import { Search, X } from "lucide-react";
import { useFishFilter } from "./FishFilterProvider";
import { cn } from "@/lib/cn";

/** Id på sektionen som formuläret rullar till. Måste matcha träfflistan. */
export const RESULTS_ANCHOR_ID = "arter";

export function SearchField({ className }: { className?: string }) {
  const { query, setQuery } = useFishFilter();

  const scrollToResults = () => {
    document.getElementById(RESULTS_ANCHOR_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        scrollToResults();
      }}
      className={cn("relative", className)}
    >
      <label htmlFor="sok-fisk" className="sr-only">
        Sök bland Östersjöns fiskarter
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-subtle"
        aria-hidden
      />
      <input
        id="sok-fisk"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        // Kort nog att rymmas utan att kapas mitt i ett ord på 375 px skärm.
        placeholder="Sök fisk – t.ex. gädda"
        autoComplete="off"
        className={cn(
          "w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-12",
          "text-base text-foreground placeholder:text-foreground-subtle",
          "shadow-[var(--shadow-card)] transition-shadow duration-200",
          "focus:shadow-[var(--shadow-card-hover)] focus:outline-none",
          // Webbläsarens egna kryss i type="search" krockar med vårt – dölj det.
          "[&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Rensa sökningen"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
