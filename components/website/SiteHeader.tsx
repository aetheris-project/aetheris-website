"use client";

import Link from "next/link";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";

export function SiteHeader() {
  const { config } = useWhitelabel();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-base/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        aria-label="Primary"
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${config.brand.name} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-base shadow-[0_0_20px_-4px_color-mix(in_srgb,var(--aetheris-accent)_70%,transparent)] transition-transform duration-200 group-hover:scale-105">
            A
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{config.brand.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {config.navigation
            .filter((item) => !item.cta)
            .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2">
          {config.navigation
            .filter((item) => item.cta)
            .map((item) => (
              <Link key={item.label} href={item.href} className="aetheris-btn-primary h-9 px-4">
                {item.label}
              </Link>
            ))}
        </div>
      </nav>
    </header>
  );
}
