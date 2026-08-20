"use client";

import Link from "next/link";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Live demo", href: "/demo" },
      { label: "Product", href: "#product" },
      { label: "Integration store", href: "/store" },
      { label: "Contact", href: "#contact" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "https://aetheris-docs.vercel.app" },
      { label: "Installation guide", href: "https://aetheris-docs.vercel.app/en/wiki/installation" },
      { label: "REST API", href: "https://aetheris-docs.vercel.app/en/api/reference" },
      { label: "Status", href: "https://aetheris-panel.vercel.app/admin" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Donate via PayPal", href: "https://paypal.me/LeonardoGalliITA" },
      { label: "Self-hosted or custom", href: "#contact" }
    ]
  }
];

export function Footer() {
  const { config } = useWhitelabel();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent">
              <img src={config.brand.logoUrl} alt="" className="h-6 w-6" width={24} height={24} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">{config.brand.name}</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">{config.brand.tagline}</p>
          <div className="inline-flex h-7 items-center gap-2 rounded-full border border-edge bg-base px-3 text-xs text-muted">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
            All systems operational
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-faint">
              {column.title}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted transition-colors duration-200 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {year} {config.brand.name}. All rights reserved.
          </p>
          <div className="flex flex-col gap-1 text-right sm:items-end">
            <p className="font-mono text-[11px]">
              v1.0.0 - billing and virtualization control plane
            </p>
            <p>
              Licensed under the{" "}
              <Link href="/#license" className="text-muted transition-colors duration-200 hover:text-ink">
                Aetheris License v1.0
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
