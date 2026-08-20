import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CreditCard,
  Download,
  Github,
  Gift,
  Package,
  ShieldCheck,
  TerminalSquare,
  Zap
} from "lucide-react";
import { SiteHeader } from "@/components/website/SiteHeader";
import { Footer } from "@/components/website/Footer";
import snapshotStore from "@/lib/config/addons-store.json";

type StoreEntry = {
  id: string;
  name: string;
  category: string;
  version: string;
  author: { name: string; github: string };
  license: string;
  description: string;
  state?: string;
  pr?: number;
  installations?: number;
};

const ADDON_BASE_URL = "https://github.com/aetheris-project/aetheris-addons";
const REGISTRY_URL =
  "https://raw.githubusercontent.com/aetheris-project/aetheris-addons/main/store.json";

/**
 * Load the store registry. The source of truth is the addons repository
 * store.json (every entry is an accepted pull request); the bundled snapshot
 * is the offline/build-time fallback when the fetch fails.
 */
async function loadStore(): Promise<StoreEntry[]> {
  try {
    const response = await fetch(REGISTRY_URL, {
      next: { revalidate: 3600 } // re-check the registry hourly
    });
    if (response.ok) {
      const data = (await response.json()) as { addons?: StoreEntry[] };
      if (Array.isArray(data.addons) && data.addons.length > 0) {
        return data.addons;
      }
    }
  } catch (cause) {
    console.error("[aetheris] store registry fetch failed, using snapshot", cause);
  }
  return snapshotStore.addons as StoreEntry[];
}

const CATEGORY_META: Record<
  string,
  { label: string; icon: typeof CreditCard; description: string }
> = {

  "payment-gateway": {
    label: "Payment gateway",
    icon: CreditCard,
    description: "Accept payments through additional processors."
  },
  notification: {
    label: "Notification",
    icon: Zap,
    description: "Deliver platform alerts to external services."
  },
  storage: {
    label: "Storage",
    icon: Boxes,
    description: "Object storage for backups and artifacts."
  },
  utility: {
    label: "Utility",
    icon: TerminalSquare,
    description: "Reusable helpers for the control panel."
  },
  panel: {
    label: "Panel",
    icon: Package,
    description: "Admin panel UI extensions."
  }
};

export const metadata = {
  title: "Integration Store",
  description:
    "Free, ready-made integrations for the Aetheris platform: payment gateways, notification channels and utilities. Every entry is an accepted pull request."
};

export default async function StorePage() {
  const addons = await loadStore();

  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 h-[30rem] w-[52rem] -translate-x-1/2 rounded-full glow-accent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-24 text-center sm:pt-28">
            <div className="animate-fade-up">
              <div className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-edge bg-raised/70 px-4 text-xs font-medium text-muted backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                {addons.length} integrations - all free
              </div>
              <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-6xl">
                The Aetheris <span className="text-gradient">integration store</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
                Payment gateways, notification channels and utilities that plug
                straight into your control panel. Every entry is a community
                contribution accepted through pull request review.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`${ADDON_BASE_URL}/blob/main/CONTRIBUTING.md`}
                  className="aetheris-btn-primary h-12 px-7 text-[15px]"
                >
                  Contribute an integration
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link href="/demo" className="aetheris-btn-secondary h-12 px-7 text-[15px]">
                  Explore the platform demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-y border-edge bg-surface">
          <div className="mx-auto grid max-w-7xl gap-px px-6 py-8 sm:grid-cols-3">
            {Object.entries(CATEGORY_META).map(([key, meta]) => {
              const Icon = meta.icon;
              if (!addons.some((addon) => addon.category === key)) return null;
              return (
                <div key={key} className="flex items-start gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">{meta.label}</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">{meta.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Addon grid */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {addons.map((addon) => {
              const meta = CATEGORY_META[addon.category] ?? CATEGORY_META.utility;
              const Icon = meta.icon;
              return (
                <article
                  key={addon.id}
                  className="aetheris-card aetheris-card-hover flex flex-col p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="inline-flex h-6 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                      <Gift className="h-3 w-3" aria-hidden="true" />
                      Free
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight">{addon.name}</h3>
                  <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-faint">
                    {meta.label} - v{addon.version}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">{addon.description}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-edge pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-faint">
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      {addon.author.github}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-6 items-center gap-1 rounded-full border border-edge bg-raised/70 px-2.5 text-[10px] font-medium text-muted"
                        title={`Accepted via pull request #${addon.pr}`}
                      >
                        <BadgeCheck className="h-3 w-3 text-success" aria-hidden="true" />
                        PR #{addon.pr}
                      </span>
                      <a
                        href={`${ADDON_BASE_URL}/tree/main/addons/${addon.id}`}
                        className="aetheris-btn-primary h-8 px-3.5 text-xs"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        Get
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Contribution flow */}
          <div className="mt-16 rounded-3xl border border-edge bg-surface p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="aetheris-kicker">How the store works</p>
                <h2 className="mt-4 text-balance text-2xl font-bold tracking-tighter sm:text-3xl">
                  Every integration starts as a pull request
                </h2>
                <p className="mt-4 text-pretty leading-7 text-muted">
                  Build a module against the typed contracts, open a pull request
                  in the addons repository, and after review it is merged and
                  published here - free for every Aetheris deployment.
                </p>
                <a
                  href={`${ADDON_BASE_URL}/blob/main/CONTRIBUTING.md`}
                  className="aetheris-btn-secondary mt-6"
                >
                  Read the contributing guide
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="grid gap-3">
                {[
                  {
                    step: "01",
                    title: "Build",
                    description: "Implement a PaymentGateway, NotificationChannel or StorageDriver contract."
                  },
                  {
                    step: "02",
                    title: "Submit",
                    description: "Open a pull request in aetheris-addons with manifest and tests."
                  },
                  {
                    step: "03",
                    title: "Published",
                    description: "After review and merge, the module appears in the store for everyone."
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 rounded-2xl border border-edge bg-raised/40 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent-soft font-mono text-xs font-bold text-accent">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-sm font-semibold tracking-tight">{item.title}</div>
                      <div className="mt-1 text-xs leading-5 text-muted">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust band */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Reviewed before publish",
                description: "Manifest, contracts and tests are validated by CI and a maintainer."
              },
              {
                icon: Gift,
                title: "Free forever",
                description: "All store integrations are released under the Aetheris License v1.0 and free to use."
              },
              {
                icon: Zap,
                title: "Plug and play",
                description: "Configure environment variables and enable the module from the admin panel."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="aetheris-card p-6">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
