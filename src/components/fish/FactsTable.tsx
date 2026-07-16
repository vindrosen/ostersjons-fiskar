/**
 * Faktatabell – artens mätbara egenskaper.
 *
 * En definitionslista snarare än en <table>: det här är namn/värde-par, inte
 * rader och kolumner med korsreferenser, och en <dl> läses upp korrekt av
 * skärmläsare utan att kräva rubrikceller.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface Fact {
  label: string;
  value: ReactNode;
}

interface FactsTableProps {
  facts: Fact[];
  className?: string;
}

export function FactsTable({ facts, className }: FactsTableProps) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="grid grid-cols-[minmax(6rem,38%)_1fr] gap-4 py-3 text-sm"
        >
          {/* Långa etiketter ("Redskapsbegränsning") måste kunna brytas – i den
              smala sidopanelen svämmar de annars över in i värdekolumnen. */}
          <dt className="hyphens-auto break-words text-foreground-muted">{fact.label}</dt>
          <dd className="break-words font-medium text-foreground">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
