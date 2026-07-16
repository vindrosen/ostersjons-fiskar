/**
 * Alla arter – hela beståndet med sök och filter, utan hero.
 */

import type { Metadata } from "next";
import { FishResults } from "@/components/home/FishResults";
import { FishFilterProvider } from "@/components/home/FishFilterProvider";
import { SearchField } from "@/components/home/SearchField";
import { getFishSummaries } from "@/lib/fish-repository";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alla arter",
  description:
    "Alla fiskarter i guiden till Östersjön – sök på svenskt eller latinskt namn och filtrera på fisktyp.",
  alternates: { canonical: absoluteUrl("/fiskar") },
};

export default async function FishListPage() {
  const fish = await getFishSummaries();

  return (
    <FishFilterProvider>
      <div className="border-b border-border bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Alla arter
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted">
            Guidens {fish.length} arter, sorterade med de vanligaste först. Sök
            på svenskt eller latinskt namn – eller filtrera på fisktyp.
          </p>
          <div className="mt-7 max-w-md">
            <SearchField />
          </div>
        </div>
      </div>

      {/* Här finns ingen hero, så rutnätets första rad syns direkt – de bilderna
          tjänar på att laddas utan lazy. */}
      <FishResults fish={fish} title="Arter" eagerImageCount={4} />
    </FishFilterProvider>
  );
}
