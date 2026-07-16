"use client";

/**
 * Delat sök- och filtertillstånd för startsidan.
 *
 * Sökfältet ligger inuti hero-bilden medan träfflistan ligger längre ner på
 * sidan. En kontext gör att de två kan dela tillstånd utan att hero-sektionen
 * behöver bli en klientkomponent: serverkomponenter kan renderas som children
 * till den här providern och ändå innehålla klientkomponenter som läser värdet.
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FishType } from "@/types/fish";

/** `"alla"` betyder att typfiltret är avstängt. */
export type TypeFilter = FishType | "alla";

interface FishFilterContextValue {
  query: string;
  setQuery: (query: string) => void;
  type: TypeFilter;
  setType: (type: TypeFilter) => void;
}

const FishFilterContext = createContext<FishFilterContextValue | null>(null);

export function FishFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("alla");

  const value = useMemo(
    () => ({ query, setQuery, type, setType }),
    [query, type],
  );

  return (
    <FishFilterContext.Provider value={value}>{children}</FishFilterContext.Provider>
  );
}

/** Läser sök- och filtertillståndet. Måste anropas inuti <FishFilterProvider>. */
export function useFishFilter(): FishFilterContextValue {
  const context = useContext(FishFilterContext);
  if (!context) {
    throw new Error("useFishFilter måste användas inuti en <FishFilterProvider>.");
  }
  return context;
}
