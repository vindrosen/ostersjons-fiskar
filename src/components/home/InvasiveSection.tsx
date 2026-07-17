/**
 * Invasiva främmande arter – egen sektion på startsidan.
 *
 * Serverkomponent, medvetet utanför sök- och filterlistan. De här arterna hör
 * inte hemma bland "vanliga arter" man bläddrar för nöjes skull: de kräver en
 * annan handling än allt annat i guiden, och behöver sin egen ram och
 * förklaring. De finns fortfarande med i sökningen och på /fiskar.
 */

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { FishCard } from "./FishCard";
import type { FishSummary } from "@/types/fish";

interface InvasiveSectionProps {
  fish: FishSummary[];
}

export function InvasiveSection({ fish }: InvasiveSectionProps) {
  if (fish.length === 0) return null;

  return (
    <section
      aria-labelledby="invasiva-rubrik"
      className="border-t border-border bg-background-alt"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-sea-500/20 text-amber-sea-500">
            <AlertTriangle className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div>
            <h2
              id="invasiva-rubrik"
              className="text-2xl font-bold text-foreground sm:text-3xl"
            >
              Invasiva arter
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground-muted">
              Arter som inte hör hemma i Östersjön och som konkurrerar ut de som
              gör det. De står på Sveriges nationella förteckning över invasiva
              främmande arter, som gäller sedan 15 maj 2026:{" "}
              <strong className="font-semibold text-foreground">
                fisk som fångas ska avlivas och får inte släppas tillbaka.
              </strong>{" "}
              Rapportera gärna fynd – de hjälper till att kartlägga spridningen.
            </p>
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {fish.map((item) => (
            <li key={item.slug}>
              <FishCard fish={item} />
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm">
          <Link
            href="https://www.havochvatten.se/arter-och-livsmiljoer/invasiva-frammande-arter.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Läs mer om invasiva arter hos Havs- och vattenmyndigheten
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </p>
      </div>
    </section>
  );
}
