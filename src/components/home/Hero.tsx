/**
 * Hero – Östersjön i solnedgång, med titel, ingress och sökfält.
 *
 * Serverkomponent. Sökfältet skickas in som `children` från sidan, vilket gör
 * att hero-sektionen kan förbli helt statisk medan sökfältet är interaktivt.
 */

import Image from "next/image";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

interface HeroProps {
  /** Sökfältet. Placeras under ingressen. */
  children?: ReactNode;
}

export function Hero({ children }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero-ostersjon.webp"
        alt=""
        fill
        // Hero är det första användaren ser – ladda den direkt i stället för lazy.
        priority
        // Bilden är dekorativ; texten ovanpå bär betydelsen.
        aria-hidden
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Toningen mörkar bara den vänstra delen, där texten står. Solnedgången
          till höger lämnas orörd – den är hela poängen med bilden. En jämn
          overlay över hela ytan skulle göra fotot grått och livlöst. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-deep-950/85 via-deep-950/45 to-transparent"
        aria-hidden
      />
      {/* Svag mörkning nedtill ger fäste mot sidans kant utan att äta upp
          solreflexen i vattnet. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep-950/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Östersjöns Fiskar
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
            // Låt ingressen komma in strax efter rubriken.
            style={{ animationDelay: "80ms" }}
          >
            {SITE.description}
          </p>

          {children ? (
            <div
              className="animate-fade-up mt-8 max-w-md"
              style={{ animationDelay: "160ms" }}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
