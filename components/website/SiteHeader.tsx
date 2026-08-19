"use client";

import Link from "next/link";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";

export function SiteHeader() {
  const { config } = useWhitelabel();

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Primary">
        <Link href="/" className="flex items-center gap-3" aria-label={`${config.brand.name} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-extrabold text-base">
            A
          </span>
          <span className="text-base font-semibold tracking-tight">{config.brand.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {config.navigation
            .filter((item) => !item.cta)
            .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-raised hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2">
          {config.navigation
            .filter((item) => item.cta)
            .map((item) => (
              <Link key={item.label} href={item.href} className="aetheris-btn-primary">
                {item.label}
              </Link>
            ))}
        </div>
      </nav>
    </header>
  );
}
