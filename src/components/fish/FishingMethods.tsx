/**
 * "Så fångar du …" – spöfiske, mete och nätfiske sida vid sida.
 *
 * För fredade arter (`fishing === null`) renderas ingenting här; sidan visar då
 * `ProtectedNotice` i stället. Att beskriva fångstmetoder för en art som inte
 * får fiskas vore direkt olämpligt.
 */

import { Fish as FishIcon, Grid2x2, Waves, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { formatDepth, formatMeshSize } from "@/lib/labels";
import type { FishingMethods as FishingMethodsData } from "@/types/fish";

interface MethodColumnProps {
  title: string;
  icon: ReactNode;
  /** Punktlistan högst upp i kolumnen. */
  items: string[];
  /** Etikett/värde-par under listan, t.ex. rekommenderat djup. */
  details: { label: string; value: string }[];
  /** Fritext längst ner. */
  tip?: string;
}

/** En metodkolumn. Samma struktur för alla tre metoder – därav en delad komponent. */
function MethodColumn({ title, icon, items, details, tip }: MethodColumnProps) {
  return (
    <div className="flex flex-col">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>

      <ul className="mt-3 space-y-1.5">
        {items.map((item, index) => (
          <li
            // Texten duger inte som nyckel: flera arter har samma formulering
            // i flera betekategorier ("Fungerar inte på braxen"). Listan är
            // statisk, så indexet är en stabil identitet här.
            key={`${index}-${item}`}
            className="flex items-start gap-2 text-sm text-foreground-muted"
          >
            <span
              className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground-subtle"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-xs text-foreground-subtle">{detail.label}</dt>
            <dd className="font-medium text-foreground">{detail.value}</dd>
          </div>
        ))}
      </dl>

      {tip ? (
        <p className="mt-3 text-xs leading-relaxed text-foreground-muted">{tip}</p>
      ) : null}
    </div>
  );
}

interface FishingMethodsProps {
  fishing: FishingMethodsData;
  fishName: string;
}

export function FishingMethods({ fishing, fishName }: FishingMethodsProps) {
  const { spinning, bait, net } = fishing;

  // Spöfiskekolumnen listar de beten som faktiskt är relevanta.
  //
  // Dubbletter tas bort: arter som inte tas på drag har samma mening i flera
  // betekategorier, och att rada upp "Fungerar inte på braxen" fyra gånger
  // säger inte mer än att göra det en gång.
  const lures = Array.from(
    new Set([
      ...spinning.lures.jigs,
      ...spinning.lures.wobblers,
      ...spinning.lures.spinners,
      ...spinning.lures.spoons,
    ]),
  );

  return (
    <Card as="section">
      <CardHeader
        title={`Så fångar du ${fishName.toLowerCase()}`}
        icon={<FishIcon className="h-[18px] w-[18px]" aria-hidden />}
      />
      <CardBody>
        <p className="mb-5 rounded-xl bg-surface-muted p-3.5 text-sm leading-relaxed text-foreground-muted">
          <span className="font-medium text-foreground">Bästa metod: </span>
          {spinning.bestMethod}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <MethodColumn
            title="Spöfiske"
            icon={<FishIcon className="h-4 w-4" aria-hidden />}
            items={lures}
            details={[
              { label: "Rekommenderat djup", value: formatDepth(spinning.depth) },
            ]}
          />

          <MethodColumn
            title="Mete"
            icon={<Waves className="h-4 w-4" aria-hidden />}
            items={bait.baits}
            details={[{ label: "Rekommenderat djup", value: formatDepth(bait.depth) }]}
            tip={bait.tips}
          />

          <MethodColumn
            title="Nätfiske"
            icon={<Grid2x2 className="h-4 w-4" aria-hidden />}
            items={[
              `Maskstorlek ${formatMeshSize(net.meshSizeMm)}`,
              `Bäst årstid: ${net.bestSeason}`,
            ]}
            details={[{ label: "Rekommenderat djup", value: formatDepth(net.depth) }]}
            tip={net.tips}
          />
        </div>

        {/* Utrustningen ligger i en egen rad under kolumnerna i stället för inne
            i spöfiskekolumnen. Texten är lång och gjorde annars den kolumnen
            dubbelt så hög som de andra två. */}
        <div className="mt-6 border-t border-border pt-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            Rekommenderad utrustning
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            {spinning.gear}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
