import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { SITE } from "@/lib/site";
import "./globals.css";

/** Brödtext och gränssnitt – neutral, tät och mycket läsbar på små skärmar. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Antikva som uteslutande används kursivt för latinska artnamn.
 * Ger samma känsla som artnamnen i en tryckt fiskguide.
 *
 * Bara den kursiva stilen laddas: `.latin-name` sätter alltid `font-style:
 * italic`, så den upprätta varianten skulle bara vara en extra nedladdning
 * som ingen ser.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – guide till fisken i Östersjön`,
    // Undersidor sätter bara sitt eget namn och får svansen på köpet.
    template: `%s – ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Östersjön",
    "fiskar",
    "fiskarter",
    "fiske",
    "gädda",
    "abborre",
    "gös",
    "havsöring",
    "fiskeguide",
    "lekperiod",
    "fisketider",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} – guide till fisken i Östersjön`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} – guide till fisken i Östersjön`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  // Matchar headerns marinblå så att mobilens adressfält smälter in.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#081f36" },
    { media: "(prefers-color-scheme: dark)", color: "#061626" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${inter.variable} ${instrumentSerif.variable} h-full`}
      // ThemeScript sätter .dark före hydrering – klassen skiljer sig därför
      // medvetet från serverns markup.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* Hoppa-till-innehåll för tangentbords- och skärmläsaranvändare. */}
        <a
          href="#innehall"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Hoppa till innehållet
        </a>
        <Header />
        <main id="innehall" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
