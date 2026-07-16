import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Slår ihop klassnamn villkorligt och löser krockar mellan Tailwind-klasser.
 *
 * `clsx` hanterar villkoren, `twMerge` ser till att den sist angivna klassen
 * vinner när två klasser styr samma sak. Det gör att en komponent kan ha
 * vettiga standardklasser som anropande kod kan skriva över via `className`:
 *
 * ```ts
 * cn("px-4 py-2", "px-6") // → "py-2 px-6"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
