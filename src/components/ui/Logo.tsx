/**
 * Ordmärke med fiskemblem.
 *
 * Emblemet är ritat för hand i stället för att lånas från ett ikonbibliotek –
 * det är appens identitet och ska se likadant ut i header, footer och favicon.
 */

import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Bara symbolen: en stiliserad fisk i en cirkel.
 *
 * Färgerna är låsta till varumärkespaletten i stället för temats tokens.
 * Emblemet ligger oftast mot den mörkblå headern eller footern, och en cirkel
 * som byter ton med temat skulle tappa kontrast mot fisken i mörkt läge.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Östersjöns Fiskar"
    >
      <circle cx="20" cy="20" r="19" className="fill-sea-500" />
      {/* Fiskkropp i profil, riktad åt vänster – samma håll som artbilderna. */}
      <path
        d="M9 20c3.4-4.6 8.1-6.9 12.4-6.9 3.1 0 5.9 1.2 8.2 3.2l3.4-2.6c.5-.4 1.2 0 1.1.6l-.8 4.4c-.1.4-.1.8 0 1.2l.8 4.4c.1.6-.6 1-1.1.6l-3.4-2.6c-2.3 2-5.1 3.2-8.2 3.2C17.1 26.9 12.4 24.6 9 20Z"
        className="fill-white"
      />
      {/* Öga. */}
      <circle cx="16.4" cy="18.4" r="1.5" className="fill-sea-800" />
      {/* Gällock som antyder rörelse. */}
      <path
        d="M22.5 14.6c-1.4 3.4-1.4 7.4 0 10.8"
        className="stroke-sea-500"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoProps {
  /** Textfärg – headern och footern har mörkblå botten, resten ljus. */
  tone?: "light" | "dark";
  className?: string;
}

/** Klickbart ordmärke som alltid leder till startsidan. */
export function Logo({ tone = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg",
        className,
      )}
    >
      <LogoMark className="h-9 w-9 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5" />
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-foreground",
        )}
      >
        Östersjöns Fiskar
      </span>
    </Link>
  );
}
