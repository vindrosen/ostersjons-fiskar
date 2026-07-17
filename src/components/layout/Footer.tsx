/**
 * Sidfot – avslutar sidan med samma marinblå som headern.
 *
 * Serverkomponent: helt statiskt innehåll, ingen anledning att skicka JS.
 */

import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-deep-900 text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="text-base font-semibold text-white">{SITE.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Fiskereglerna bygger på Havs- och vattenmyndighetens uppgifter men
              är sammanfattade. Lokala regler tillkommer – kontrollera alltid vad
              som gäller på din plats innan du ger dig ut.
            </p>
          </div>

          <nav aria-label="Sidfot">
            <h2 className="text-sm font-semibold text-white">Utforska</h2>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-xs">
            <h2 className="text-sm font-semibold text-white">Fiska ansvarsfullt</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Respektera minimimått, fredningstider och fredade arter. Återutsätt
              fisk varsamt och ta bara upp det du behöver – då finns det fisk kvar
              i Östersjön även imorgon.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs">
          <p>
            © {year} {SITE.name}. Ett icke-kommersiellt hobbyprojekt – inte en
            officiell källa för fiskeregler.
          </p>
        </div>
      </div>
    </footer>
  );
}
