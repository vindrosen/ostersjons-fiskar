"use client";

/**
 * Läser och byter tema.
 *
 * Ingen provider behövs: temat är ett externt tillstånd (DOM + localStorage +
 * systemets inställning), och `useSyncExternalStore` är Reacts avsedda väg att
 * prenumerera på just sådant. Det ger rätt värde direkt vid hydrering utan
 * varken kaskadrenderingar eller en `mounted`-flagga.
 */

import { useCallback, useSyncExternalStore } from "react";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setStoredTheme,
  subscribeToTheme,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

interface UseThemeResult {
  /** Det tema som visas just nu. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export function useTheme(): UseThemeResult {
  const resolvedTheme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const setTheme = useCallback((theme: Theme) => setStoredTheme(theme), []);

  return { resolvedTheme, setTheme };
}
