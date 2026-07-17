/**
 * Startsidan: hero med sök, de vanligaste arterna och fakta om Östersjön.
 *
 * Serverkomponent som läser artdatat vid build. Endast den lätta
 * sammanfattningen skickas vidare till klienten – full artdata hämtas först på
 * respektive detaljsida.
 */

import { Hero } from "@/components/home/Hero";
import { SearchField } from "@/components/home/SearchField";
import { FishResults } from "@/components/home/FishResults";
import { FishFilterProvider } from "@/components/home/FishFilterProvider";
import { BalticFacts } from "@/components/home/BalticFacts";
import { InvasiveSection } from "@/components/home/InvasiveSection";
import { getFishSummaries, getInvasiveFish } from "@/lib/fish-repository";

/** Antal arter som visas innan användaren klickar sig vidare till alla arter. */
const COMMON_FISH_COUNT = 12;

export default async function HomePage() {
  // Rutnätet får alla arter så att sökningen hittar även de invasiva. Eftersom
  // de sorteras sist syns bara de vanligaste arterna innan man söker.
  const fish = await getFishSummaries();
  const invasive = await getInvasiveFish();

  return (
    // Providern omsluter både hero och träfflista så att sökfältet i heron kan
    // styra rutnätet längre ner. Hero är fortfarande en serverkomponent – den
    // skickas in som children och renderas på servern.
    <FishFilterProvider>
      <Hero>
        <SearchField />
      </Hero>

      <FishResults
        fish={fish}
        title="Vanliga arter"
        initialLimit={COMMON_FISH_COUNT}
        showAllHref="/fiskar"
      />

      <InvasiveSection fish={invasive} />

      <BalticFacts />
    </FishFilterProvider>
  );
}
