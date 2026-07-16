"use client";

/**
 * Knapp som växlar mellan ljust och mörkt tema.
 *
 * Utgår från det tema som faktiskt visas, så ett klick alltid gör det
 * användaren förväntar sig – oavsett om utgångsläget kom från systemet
 * eller ett tidigare val.
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useTheme";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Byt till ljust tema" : "Byt till mörkt tema";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80",
        "transition-colors duration-200 hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
