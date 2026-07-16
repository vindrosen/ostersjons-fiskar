/**
 * Sätter rätt tema innan sidan målas första gången.
 *
 * Utan detta hinner webbläsaren visa den ljusa standardbakgrunden i något
 * hundradels sekund innan React hydrerar och slår på mörkt läge – en vit blixt
 * som är särskilt påtaglig nattetid. Scriptet är avsiktligt litet och körs
 * synkront i <head>.
 */

import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Körs som en självexekverande sträng i webbläsaren. Håll den minimal –
 * allt här blockerar första målningen.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {
    /* Privat läge kan blockera localStorage – ljust tema är en trygg fallback. */
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
