/**
 * Kort – appens grundläggande ytelement.
 *
 * Mockupens genomgående mönster: rundade hörn, mjuk skugga, tunn kant. All
 * panelyta i appen går genom den här komponenten så att radie, skugga och
 * kantfärg bara definieras på ett ställe.
 */

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Renderande element – t.ex. "section" eller "article" för rätt semantik. */
  as?: ElementType;
  children: ReactNode;
}

export function Card({ as: Component = "div", className, children, ...props }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  title: string;
  /** Valfri ikon till vänster om rubriken. */
  icon?: ReactNode;
  /** Valfritt innehåll längst till höger, t.ex. en länk. */
  action?: ReactNode;
  className?: string;
}

/** Rubrikrad för ett kort, med samma vertikala rytm överallt. */
export function CardHeader({ title, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 px-5 pt-5 pb-3", className)}>
      <h2 className="flex items-center gap-2.5 text-base font-semibold text-foreground">
        {icon ? <span className="text-primary">{icon}</span> : null}
        {title}
      </h2>
      {action}
    </div>
  );
}

/** Innehållsytan i ett kort. */
export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}
