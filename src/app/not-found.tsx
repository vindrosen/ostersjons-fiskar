/**
 * 404 – visas både för okända rutter och när en art-slug inte finns.
 */

import Link from "next/link";
import { Fish } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center sm:px-6">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Fish className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
        Den här fisken slank undan
      </h1>
      <p className="mt-3 text-base leading-relaxed text-foreground-muted">
        Sidan du letar efter finns inte. Kanske har arten bytt namn, eller så
        blev det ett stavfel i adressen.
      </p>
      <Link
        href="/fiskar"
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Se alla arter
      </Link>
    </div>
  );
}
