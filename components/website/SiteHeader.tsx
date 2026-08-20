"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";
import { ThemeToggle } from "@/components/website/ThemeToggle";

export function SiteHeader() {
  const { config } = useWhitelabel();
  const [open, setOpen] = useState(false);

  const navItems = config.navigation.filter((item) => !item.cta);
  const ctaItems = config.navigation.filter((item) => item.cta);

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-base/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6"
        aria-label="Primary"
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${config.brand.name} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-base shadow-[0_0_20px_-4px_color-mix(in_srgb,var(--aetheris-accent)_70%,transparent)] transition-transform duration-200 group-hover:scale-105">
            <img
              src={config.brand.logoUrl}
              alt=""
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{config.brand.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:flex" />
          {ctaItems.map((item) => (
            <Link key={item.label} href={item.href} className="aetheris-btn-primary hidden h-9 px-4 sm:inline-flex">
              {item.label}
            </Link>
          ))}
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-raised/70 text-muted transition-colors hover:text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-edge bg-base/95 px-6 py-4 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            {ctaItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="aetheris-btn-primary mt-2 h-10"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg border border-edge bg-raised/50 px-3.5 py-2.5">
              <span className="text-sm text-muted">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
