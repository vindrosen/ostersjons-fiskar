"use client";

/**
 * Sidhuvud – mörkblå list som ligger kvar högst upp vid scroll.
 *
 * Klientkomponent eftersom den behöver veta aktuell rutt (för att markera
 * aktiv länk) och hålla mobilmenyns öppet/stängt-läge.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Avgör om en länk ska markeras som aktiv. "/" matchar bara exakt. */
function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Stäng mobilmenyn vid navigering – annars ligger den kvar över den nya sidan.
  // Justeringen görs under render i stället för i en effekt: React kör om
  // komponenten direkt med det nya värdet, utan att först måla en öppen meny
  // över fel sida. Det är Reacts rekommenderade mönster för att nollställa
  // tillstånd när en prop ändras.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-deep-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-deep-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo tone="light" />

        {/* Navigation för surfplatta och dator. */}
        <nav aria-label="Huvudmeny" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                    isActive(pathname, link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobilmeny"
            aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobilmeny. Renderas bara när den är öppen så att länkarna inte
          ligger kvar i tabbordningen när menyn är stängd. */}
      {menuOpen ? (
        <nav
          id="mobilmeny"
          aria-label="Huvudmeny"
          className="animate-fade-in border-t border-white/10 md:hidden"
        >
          <ul className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(pathname, link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/75 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
