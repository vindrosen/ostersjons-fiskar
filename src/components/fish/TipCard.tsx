/**
 * Tips – ett skarpt råd som lyfts fram i sidopanelen.
 */

import { Lightbulb } from "lucide-react";

export function TipCard({ tip }: { tip: string }) {
  return (
    <section
      aria-labelledby="tips-rubrik"
      className="rounded-2xl border border-amber-sea-400/30 bg-amber-sea-200/25 p-5 dark:bg-amber-sea-500/10"
    >
      <h2
        id="tips-rubrik"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <Lightbulb className="h-[18px] w-[18px] text-amber-sea-500" aria-hidden />
        Tips
      </h2>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted">{tip}</p>
    </section>
  );
}
