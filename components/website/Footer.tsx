"use client";

import Link from "next/link";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";

export function Footer() {
  const { config } = useWhitelabel();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-edge bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-extrabold text-base">
              A
            </span>
            <span className="text-base font-semibold tracking-tight">{config.brand.name}</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">{config.brand.tagline}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Platform</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/demo" className="text-muted transition-colors hover:text-ink">Live demo</Link></li>
            <li><Link href="#product" className="text-muted transition-colors hover:text-ink">Features</Link></li>
            <li><Link href="#integrations" className="text-muted transition-colors hover:text-ink">Integrations</Link></li>
            <li><Link href="#pricing" className="text-muted transition-colors hover:text-ink">Pricing</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Resources</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="https://docs.aetheris.enterprise" className="text-muted transition-colors hover:text-ink">Documentation</Link></li>
            <li><Link href="https://status.aetheris.enterprise" className="text-muted transition-colors hover:text-ink">Status</Link></li>
            <li><Link href={`mailto:${config.contact.email}`} className="text-muted transition-colors hover:text-ink">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {year} {config.brand.name}. All rights reserved.
          </p>
          <p>
            Billing and virtualization control plane for the enterprise.
          </p>
        </div>
      </div>
    </footer>
  );
}
