/**
 * Badge – liten statusetikett, t.ex. "Vanlig" eller "Fredad".
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "accent" | "sea" | "neutral" | "warning";

const TONE_STYLES: Record<BadgeTone, string> = {
  accent: "bg-accent-soft text-accent border-accent/25",
  sea: "bg-primary-soft text-primary border-primary/25",
  neutral: "bg-surface-muted text-foreground-muted border-border",
  // Röd/rostton reserverad för fredade arter – ska sticka ut mot paletten.
  warning: "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, tone = "neutral", icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        TONE_STYLES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
