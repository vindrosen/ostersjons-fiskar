/**
 * Detaljsidans huvud: tillbakalänk, namn, latinskt namn, etiketter och storbild.
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { COMMONALITY_LABELS, FISH_TYPE_LABELS } from "@/lib/labels";
import type { Fish } from "@/types/fish";

export function FishHeader({ fish }: { fish: Fish }) {
  return (
    <div className="border-b border-border bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/fiskar"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-primary"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden
          />
          Alla arter
        </Link>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {fish.name}
            </h1>
            <p className="latin-name mt-1.5 text-xl text-foreground-muted sm:text-2xl">
              {fish.latinName}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {fish.regulations.protected ? (
                <Badge tone="warning" icon={<Ban className="h-3.5 w-3.5" aria-hidden />}>
                  Fredad
                </Badge>
              ) : (
                <Badge tone="accent">{COMMONALITY_LABELS[fish.commonality]}</Badge>
              )}
              <Badge tone="sea">{FISH_TYPE_LABELS[fish.type]}</Badge>
              <Badge>{fish.familyName}</Badge>
            </div>

            <p className="mt-5 max-w-prose text-base leading-relaxed text-foreground-muted">
              {fish.shortDescription}
            </p>
          </div>

          {/* Storbilden. Ligger på en ljus platta eftersom illustrationerna är
              genererade mot vit bakgrund. */}
          <div className="fish-plate relative aspect-[3/2] overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
            <Image
              src={fish.image.src}
              alt={fish.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain p-4 sm:p-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
