/**
 * Fiskkort – bild, svenskt namn och latinskt namn.
 *
 * Hela kortet är en länk till artens sida. Bilden ligger på en ljus platta
 * eftersom fiskillustrationerna är genererade mot vit bakgrund.
 */

import Image from "next/image";
import Link from "next/link";
import type { FishSummary } from "@/types/fish";

interface FishCardProps {
  fish: FishSummary;
  /**
   * Sant för de kort som syns direkt när sidan laddas. De laddas ivrigt medan
   * resten av rutnätet lämnas åt lazy loading.
   */
  priority?: boolean;
}

export function FishCard({ fish, priority = false }: FishCardProps) {
  return (
    <article className="group">
      <Link
        href={`/fiskar/${fish.slug}`}
        className="block h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
      >
        <div className="fish-plate relative aspect-[4/3] overflow-hidden">
          <Image
            src={fish.image.src}
            alt={fish.image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
          />
        </div>

        <div className="border-t border-border px-4 py-3.5">
          <h3 className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary">
            {fish.name}
          </h3>
          <p className="latin-name mt-0.5 text-sm text-foreground-muted">
            {fish.latinName}
          </p>
        </div>
      </Link>
    </article>
  );
}
