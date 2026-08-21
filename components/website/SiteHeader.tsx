"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";
import { ThemeToggle } from "@/components/website/ThemeToggle";
import { LanguageTranslator } from "@/components/website/LanguageTranslator";

export function SiteHeader() {
  const { config } = useWhitelabel();
  const [open, setOpen] = useState(false);

  const navItems = config.navigation.filter((item) => !item.cta);
  const ctaItems = config.navigation.filter((item) => item.cta);

  return (
    <header className="sticky top-0 z-50 border-b border-edge/80 bg-base/65 backdrop-blur-2xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6"
        aria-label="Primary"
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${config.brand.name} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-base shadow-[0_0_24px_-2px_color-mix(in_srgb,rgb(var(--aetheris-accent))_75%,transparent)] ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105">
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
          <LanguageTranslator className="hidden sm:flex" />
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
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-edge bg-raised/50 p-2">
              <div className="flex items-center justify-between rounded-md px-2 py-1.5">
                <span className="text-xs text-muted">Language</span>
                <LanguageTranslator />
              </div>
              <div className="flex items-center justify-between rounded-md px-2 py-1.5">
                <span className="text-xs text-muted">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
