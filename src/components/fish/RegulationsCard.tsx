/**
 * Fiskeregler – sidopanelens regelkort.
 *
 * Reglerna i appen är exempeldata. Brasklappen och källhänvisningen är därför
 * inte valfria dekorationer utan en del av kortet: den som läser ett minimimått
 * här ska aldrig kunna missa att det måste dubbelkollas mot myndigheten.
 */

import { ExternalLink, Scale } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { FactsTable, type Fact } from "./FactsTable";
import {
  REGULATIONS_DISCLAIMER,
  REGULATIONS_LOCAL_URL,
  REGULATIONS_SOURCE_URL,
} from "@/lib/site";
import type { FishRegulations } from "@/types/fish";

interface RegulationsCardProps {
  regulations: FishRegulations;
}

export function RegulationsCard({ regulations }: RegulationsCardProps) {
  // Bygg bara rader för de regler som faktiskt finns för arten – en tabell full
  // av "–" ser ut som saknad data snarare än som avsaknad av regler.
  const facts: Fact[] = [];

  if (regulations.protected) {
    facts.push({ label: "Status", value: "Fredad – allt fiske förbjudet" });
  }
  if (regulations.minSizeCm !== null) {
    facts.push({ label: "Minimimått", value: `${regulations.minSizeCm} cm` });
  }
  if (regulations.maxSizeCm !== null) {
    facts.push({ label: "Maxmått", value: `${regulations.maxSizeCm} cm` });
  }
  if (regulations.bagLimit !== null) {
    facts.push({
      label: "Max antal/dag",
      value: regulations.bagLimit === 0 ? "Ingen får behållas" : `${regulations.bagLimit} st`,
    });
  }
  if (regulations.closedSeason) {
    facts.push({ label: "Fiskeförbud", value: regulations.closedSeason });
  }
  if (regulations.gearRestrictions) {
    // Kort etikett: kortet står i den smala sidopanelen.
    facts.push({ label: "Redskap", value: regulations.gearRestrictions });
  }

  return (
    <Card as="section">
      <CardHeader
        title="Fiskeregler"
        icon={<Scale className="h-[18px] w-[18px]" aria-hidden />}
      />
      <CardBody>
        {facts.length > 0 ? (
          <FactsTable facts={facts} className="border-t border-border" />
        ) : (
          <p className="text-sm text-foreground-muted">
            Arten har inga egna nationella regler i havet.
          </p>
        )}

        {regulations.note ? (
          <p className="mt-4 rounded-xl bg-surface-muted p-3.5 text-xs leading-relaxed text-foreground-muted">
            {regulations.note}
          </p>
        ) : null}

        <p className="mt-4 text-xs leading-relaxed text-foreground-subtle">
          {REGULATIONS_DISCLAIMER}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {/* Den lokala karttjänsten först: det är den som svarar på frågan
              "vad gäller just där jag står", vilket sammanfattningen inte kan. */}
          <a
            href={REGULATIONS_LOCAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Slå upp lokala regler på svenskafiskeregler.se
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
          <a
            href={REGULATIONS_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-primary"
          >
            Källa: {regulations.source}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
