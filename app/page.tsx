import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CreditCard,
  Globe,
  LayoutGrid,
  Monitor,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import { SiteHeader } from "@/components/website/SiteHeader";
import { Footer } from "@/components/website/Footer";
import { FAQ_ITEMS } from "@/lib/seo/jsonLd";

const FEATURES = [
  {
    title: "Unified billing engine",
    description:
      "Invoices, subscriptions, proration, dunning and tax in one engine. Replace WHMCS and FOSSBilling with a single billing core wired to Stripe, PayPal and Mollie.",
    icon: CreditCard
  },
  {
    title: "Hypervisor drivers",
    description:
      "One driver interface, five backends. Native Pterodactyl, Proxmox VE, VirtFusion, cPanel/WHM and DirectAdmin drivers with identical lifecycle semantics.",
    icon: Boxes
  },
  {
    title: "Client VNC console",
    description:
      "In-browser console sessions for every server. WebSocket token issuance, clipboard passthrough and power control from the client portal.",
    icon: TerminalSquare
  },
  {
    title: "Dynamic whitelabeling",
    description:
      "Name, logos, accent colors, navigation, email templates and custom domains configured at runtime through the Admin Panel. No rebuilds, ever.",
    icon: Globe
  },
  {
    title: "Total admin control",
    description:
      "Node management, allocation pools, nest and egg targeting, backup policies and per-client resource limits from a single control plane.",
    icon: LayoutGrid
  },
  {
    title: "Enterprise operations",
    description:
      "BullMQ background workers, Redis-backed queues, OpenAPI specifications, SSR rendering and a strict-mode TypeScript codebase.",
    icon: ShieldCheck
  }
];

const INTEGRATIONS = [
  { name: "Pterodactyl", role: "Application and Client API driver" },
  { name: "Proxmox VE", role: "API v2 driver" },
  { name: "VirtFusion", role: "REST API driver" },
  { name: "cPanel / WHM", role: "Hosting account driver" },
  { name: "DirectAdmin", role: "Hosting account driver" },
  { name: "Stripe", role: "Payments" },
  { name: "PayPal", role: "Payments" },
  { name: "Mollie", role: "Payments" },
  { name: "Namecheap", role: "Registrar" },
  { name: "Cloudflare", role: "DNS and registrar" }
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "per month",
    description: "For small providers consolidating billing and Pterodactyl.",
    features: ["Unified billing engine", "Pterodactyl driver", "1 admin seat", "Client portal", "Community support"]
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "per month",
    description: "For managed hosts running multiple hypervisors at scale.",
    features: [
      "All hypervisor drivers",
      "Unlimited seats",
      "Dynamic whitelabeling",
      "VNC console",
      "Priority support and SLA"
    ],
    highlighted: true
  },
  {
    name: "Self-hosted",
    price: "Free",
    period: "MIT-licensed core",
    description: "Run the entire platform on your own infrastructure.",
    features: ["Non-interactive installer", "Systemd workers", "Nginx reverse proxy", "Full OpenAPI spec", "Community support"]
  }
];

function HeroPreview() {
  const navItems = [
    { label: "Overview", active: true },
    { label: "Nodes", active: false },
    { label: "Servers", active: false },
    { label: "Billing", active: false },
    { label: "Whitelabel", active: false }
  ];

  const bars = [42, 58, 36, 74, 52, 88, 64];

  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div
        className="absolute -inset-x-10 -top-10 h-72 rounded-full bg-accent/15 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="relative overflow-hidden rounded-2xl border border-edge bg-surface shadow-2xl shadow-black/50"
        aria-hidden="true"
      >
        {/* Window chrome */}
        <div className="flex h-11 items-center justify-between border-b border-edge bg-raised px-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-edge" />
            <span className="h-3 w-3 rounded-full bg-edge" />
            <span className="h-3 w-3 rounded-full bg-edge" />
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-edge bg-base px-3 py-1 font-mono text-[11px] text-muted sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            app.aetheris.enterprise/admin
          </div>
          <div className="w-16" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-edge p-3 sm:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex h-8 items-center rounded-lg px-3 text-xs ${
                  item.active ? "bg-accent-soft font-medium text-accent" : "text-muted"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div className="flex-1 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Control plane overview</div>
                <div className="mt-0.5 text-[11px] text-muted">Aggregate state across hypervisors and billing</div>
              </div>
              <span className="inline-flex h-6 items-center rounded-full border border-accent/40 bg-accent-soft px-2.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                Live
              </span>
            </div>

            {/* Stat cards */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Running servers", value: "1,284", delta: "+12 this week" },
                { label: "Monthly revenue", value: "$48,210", delta: "+3.2% vs last cycle" },
                { label: "Managed nodes", value: "4", delta: "3 regions online" }
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-edge bg-base p-3.5">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted">{stat.label}</div>
                  <div className="mt-1 text-lg font-bold tracking-tight">{stat.value}</div>
                  <div className="mt-0.5 text-[10px] text-success">{stat.delta}</div>
                </div>
              ))}
            </div>

            {/* Revenue chart + server list */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-edge bg-base p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
                  Revenue, last 7 days
                </div>
                <div className="mt-3 flex h-24 items-end gap-2">
                  {bars.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-md bg-accent/70 transition-colors hover:bg-accent"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-edge bg-base p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
                  Recently provisioned
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { name: "Production-01", state: "Running" },
                    { name: "Web-02", state: "Running" },
                    { name: "Staging-API", state: "Stopped" }
                  ].map((server) => (
                    <div key={server.name} className="flex items-center justify-between rounded-lg border border-edge px-3 py-2">
                      <span className="font-mono text-[11px]">{server.name}</span>
                      <span
                        className={`inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-medium uppercase tracking-wider ${
                          server.state === "Running"
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-edge bg-raised text-muted"
                        }`}
                      >
                        {server.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-edge">
          <div
            className="hero-grid absolute inset-0"
            aria-hidden="true"
          />
          <div
            className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 text-center">
            <div className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-edge bg-surface px-4 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
              v1.0.0 - Billing and virtualization control plane
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              One control plane for billing, panels and hypervisors
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-7 text-muted">
              Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox
              VE and VirtFusion into a single platform with total admin control
              and dynamic whitelabeling.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/demo" className="aetheris-btn-primary h-11 px-6 text-base">
                Explore the live demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="https://docs.aetheris.enterprise" className="aetheris-btn-secondary h-11 px-6 text-base">
                Read the documentation
              </Link>
            </div>

            <HeroPreview />
          </div>
        </section>

        {/* Replaces strip */}
        <section className="border-b border-edge bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted">
              Replaces
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {["WHMCS", "FOSSBilling", "Pterodactyl Panel", "Proxmox VE", "VirtFusion"].map((name) => (
                <span key={name} className="text-sm font-semibold text-ink/80">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="product" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Product</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything a hosting business needs
            </h2>
            <p className="mt-4 text-pretty text-muted">
              One control plane for billing, panel orchestration and hypervisor
              management, built for operators who run infrastructure at scale.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="aetheris-card group p-6 transition-colors hover:border-accent/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="border-y border-edge bg-surface">
          <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Integrations</p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Native integrations
              </h2>
              <p className="mt-4 text-pretty text-muted">
                Production drivers for every panel, hypervisor, gateway and
                registrar in the stack.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {INTEGRATIONS.map((integration) => (
                <div
                  key={integration.name}
                  className="aetheris-card p-5 transition-colors hover:border-accent/40"
                >
                  <div className="text-sm font-semibold">{integration.name}</div>
                  <div className="mt-1 text-xs leading-5 text-muted">{integration.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Pricing</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`aetheris-card p-6 ${
                  plan.highlighted ? "border-accent/60 ring-1 ring-accent/30" : ""
                }`}
              >
                <h3 className="text-base font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{plan.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y border-edge bg-surface">
          <div className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details key={item.question} className="aetheris-card group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                    {item.question}
                    <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div
            className="absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See the control plane in action</h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-muted">
              Try the client VNC console, the admin node manager and the billing
              engine in a live, interactive preview.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/demo" className="aetheris-btn-primary h-11 px-6 text-base">
                Open the live demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="https://github.com/aetheris-project/aetheris-app" className="aetheris-btn-secondary h-11 px-6 text-base">
                <Monitor className="h-4 w-4" aria-hidden="true" />
                Get the source
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
