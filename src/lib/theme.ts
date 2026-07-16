/**
 * Temahantering (ljust/mörkt/system).
 *
 * Temat lever egentligen i två externa system: `localStorage` (användarens val)
 * och `matchMedia` (systemets inställning). Sanningen om vad som visas *just nu*
 * är klassen `.dark` på `<html>`, som sätts av `ThemeScript` redan innan sidan
 * målas första gången.
 *
 * Modulen exponerar därför temat som en klassisk extern store med
 * subscribe/getSnapshot, avsedd för Reacts `useSyncExternalStore` (se
 * `useTheme`). Alternativet – att spegla temat i React-state och synka med en
 * effekt – skapar kaskadrenderingar och en blinkande fel ikon vid hydrering.
 *
 * Funktionerna nedan rör `window`/`document` och får bara anropas i webbläsaren.
 */

/** localStorage-nyckel för användarens temaval. */
export const THEME_STORAGE_KEY = "of-theme";

/** Egen händelse som signalerar att temat bytts i den här fliken. */
const THEME_CHANGE_EVENT = "of-theme-change";

/** Användarens val. `"system"` följer operativsystemets inställning. */
export type Theme = "light" | "dark" | "system";

/** Det tema som faktiskt visas – `"system"` är här redan uppslaget. */
export type ResolvedTheme = "light" | "dark";

/** Läser användarens sparade val. Privat läge kan blockera localStorage. */
export function readStoredTheme(): Theme {
  try {
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system";
  } catch {
    return "system";
  }
}

/** Systemets färgpreferens. */
function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Slår upp `"system"` till det tema som faktiskt ska visas. */
export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

/** Speglar temat till DOM:en, vilket byter värde på alla CSS-tokens. */
function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

/** Sparar användarens val, uppdaterar DOM:en och meddelar prenumeranter. */
export function setStoredTheme(theme: Theme): void {
  try {
    if (theme === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Går valet inte att spara gäller det ändå för den här sessionen.
  }

  applyTheme(resolveTheme(theme));
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * Prenumererar på temaändringar: både egna byten och systemets.
 * Returnerar en avregistreringsfunktion, som `useSyncExternalStore` kräver.
 */
export function subscribeToTheme(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  // Systemet ändrar bara vad som ska visas när användaren följer systemet.
  // DOM:en måste uppdateras här, annars speglar `.dark` ett gammalt värde.
  const onSystemChange = () => {
    if (readStoredTheme() === "system") {
      applyTheme(getSystemTheme());
    }
    onChange();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);

  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

/** Vad som visas nu, läst direkt ur DOM:en. */
export function getThemeSnapshot(): ResolvedTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Vad servern renderar. Servern kan omöjligt känna till användarens val, så den
 * antar ljust tema. `useSyncExternalStore` byter till rätt värde direkt efter
 * hydrering – utan att det räknas som en hydreringskrock.
 */
export function getThemeServerSnapshot(): ResolvedTheme {
  return "light";
}
