import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Cable,
  CreditCard,
  Globe,
  LayoutGrid,
  Monitor,
  Palette,
  ShieldCheck,
  TerminalSquare,
  Workflow
} from "lucide-react";
import { SiteHeader } from "@/components/website/SiteHeader";
import { Footer } from "@/components/website/Footer";
import { InteractiveDemo } from "@/components/website/InteractiveDemo";
import { FAQ_ITEMS } from "@/lib/seo/jsonLd";

const FEATURES = [
  {
    title: "Unified billing engine",
    description:
      "Invoices, subscriptions, proration, dunning and tax in one engine. Replace WHMCS and FOSSBilling with a single billing core wired to Stripe, PayPal and Mollie.",
    icon: CreditCard,
    wide: true
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

const STATS = [
  { value: "5", label: "Native drivers" },
  { value: "3", label: "Payment gateways" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<50ms", label: "API latency" }
];

const STEPS = [
  {
    title: "Connect your infrastructure",
    description:
      "Attach Pterodactyl, Proxmox VE or VirtFusion nodes in minutes. Allocation pools, nests, eggs and per-client limits are configured from the admin control plane.",
    icon: Cable
  },
  {
    title: "Provision and bill automatically",
    description:
      "Clients order servers through the portal. The billing engine prorates, invoices and dunns on schedule while BullMQ workers orchestrate every deployment.",
    icon: Workflow
  },
  {
    title: "White-label and launch",
    description:
      "Publish your own brand: name, logos, accent colors, custom domain and email templates change at runtime with zero rebuilds. Ship your platform today.",
    icon: Palette
  }
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
    <div className="relative mx-auto mt-20 max-w-5xl animate-fade-up" style={{ animationDelay: "180ms" }}>
      <div className="absolute -inset-x-12 -top-12 h-80 glow-accent" aria-hidden="true" />
      <div className="aetheris-frame relative shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
        <div
          className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-[#131317] to-[#0C0C0F]"
          aria-hidden="true"
        >
          {/* Window chrome */}
          <div className="flex h-12 items-center justify-center border-b border-edge">
            <div className="flex items-center gap-2 rounded-lg border border-edge bg-base/40 px-3 py-1 font-mono text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              app.aetheris.enterprise/admin
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-edge p-3 sm:flex">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex h-8 items-center rounded-lg px-3 text-xs transition-colors ${
                    item.active
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-faint"
                  }`}
                >
                  {item.label}
                </div>
              ))}
              <div className="mt-auto rounded-xl border border-edge bg-raised/50 p-3">
                <div className="text-[10px] font-medium uppercase tracking-wider text-faint">Node load</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-raised">
                  <div className="h-full w-2/3 rounded-full bg-accent" />
                </div>
                <div className="mt-1 font-mono text-[10px] text-muted">62%</div>
              </div>
            </div>

            {/* Main panel */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold tracking-tight">Control plane overview</div>
                  <div className="mt-0.5 text-[11px] text-faint">Aggregate state across hypervisors and billing</div>
                </div>
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  <span className="h-1 w-1 animate-pulse-dot rounded-full bg-accent" />
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
                  <div
                    key={stat.label}
                    className="rounded-xl border border-edge bg-raised/50 p-3.5 transition-colors duration-200 hover:border-accent/25"
                  >
                    <div className="text-[10px] font-medium uppercase tracking-wider text-faint">{stat.label}</div>
                    <div className="mt-1 text-lg font-bold tracking-tight">{stat.value}</div>
                    <div className="mt-0.5 text-[10px] text-success">{stat.delta}</div>
                  </div>
                ))}
              </div>

              {/* Revenue chart + server list */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-edge bg-raised/50 p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-faint">
                    Revenue, last 7 days
                  </div>
                  <div className="mt-3 flex h-24 items-end gap-2">
                    {bars.map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-accent/60 transition-colors duration-200 hover:bg-accent"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-edge bg-raised/50 p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-faint">
                    Recently provisioned
                  </div>
                  <div className="mt-3 space-y-2">
                    {[
                      { name: "Production-01", state: "Running" },
                      { name: "Web-02", state: "Running" },
                      { name: "Staging-API", state: "Stopped" }
                    ].map((server) => (
                      <div
                        key={server.name}
                        className="flex items-center justify-between rounded-lg border border-edge px-3 py-2"
                      >
                        <span className="font-mono text-[11px]">{server.name}</span>
                        <span
                          className={`inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-medium uppercase tracking-wider ${
                            server.state === "Running"
                              ? "border-success/30 bg-success/10 text-success"
                              : "border-white/[0.08] bg-white/[0.03] text-faint"
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
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full glow-accent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 text-center sm:pt-32">
            <div className="animate-fade-up">
              <div className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-edge bg-raised/70 px-4 text-xs font-medium text-muted backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                v1.0.0 - billing and virtualization control plane
              </div>
              <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-6xl lg:text-7xl">
                One control plane for <span className="text-gradient">billing, panels</span> and hypervisors
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
                Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox
                VE and VirtFusion into a single platform with total admin control
                and dynamic whitelabeling.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/demo" className="aetheris-btn-primary h-12 px-7 text-[15px]">
                  Explore the live demo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="https://docs.aetheris.enterprise" className="aetheris-btn-secondary h-12 px-7 text-[15px]">
                  Read the documentation
                </Link>
              </div>
            </div>

            <HeroPreview />
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-edge bg-raised/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-10 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-2 text-center">
                <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-faint">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="product" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
          <div className="max-w-2xl">
            <p className="aetheris-kicker">Product</p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
              Everything a hosting business needs
            </h2>
            <p className="mt-4 text-pretty leading-7 text-muted">
              One control plane for billing, panel orchestration and hypervisor
              management, built for operators who run infrastructure at scale.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`aetheris-card aetheris-card-hover p-7 ${
                    feature.wide ? "md:col-span-2 lg:col-span-1 lg:row-span-1" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-muted">{feature.description}</p>
                  {feature.wide && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {["Invoices", "Subscriptions", "Proration", "Dunning", "Tax"].map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex h-7 items-center rounded-full border border-edge bg-raised/70 px-3 text-xs text-muted"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative overflow-hidden border-y border-edge bg-surface">
          <div className="absolute -right-32 top-1/2 h-72 w-72 glow-accent opacity-50" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
            <div className="max-w-2xl">
              <p className="aetheris-kicker">How it works</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
                From bare nodes to a live brand in three steps
              </h2>
              <p className="mt-4 text-pretty leading-7 text-muted">
                No migrations, no rip-and-replace. Aetheris sits on top of the
                infrastructure you already run and turns it into a product.
              </p>
            </div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="aetheris-card aetheris-card-hover p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs text-faint">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live demo */}
        <section id="demo" className="relative overflow-hidden py-24">
          <div className="absolute -top-40 left-1/2 h-[30rem] w-[52rem] -translate-x-1/2 glow-accent" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl scroll-mt-24 px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="aetheris-kicker">Live preview</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
                Explore the control plane <span className="text-gradient">right here</span>
              </h2>
              <p className="mt-4 text-pretty leading-7 text-muted">
                Seven interactive panels covering the client portal, VNC console,
                billing engine, node management, provisioning, whitelabeling and
                the API - every one a real React component running against the
                production driver contract.
              </p>
            </div>
            <div className="mt-12">
              <InteractiveDemo />
            </div>
            <div className="mt-8 text-center">
              <Link href="/demo" className="aetheris-btn-secondary">
                Open the full demo page
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="relative overflow-hidden border-y border-edge bg-surface">
          <div className="absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 glow-accent opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
            <div className="max-w-2xl">
              <p className="aetheris-kicker">Integrations</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
                Native integrations
              </h2>
              <p className="mt-4 text-pretty leading-7 text-muted">
                Production drivers for every panel, hypervisor, gateway and
                registrar in the stack.
              </p>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {INTEGRATIONS.map((integration, index) => (
                <div
                  key={integration.name}
                  className="aetheris-card aetheris-card-hover p-5"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="text-sm font-semibold tracking-tight">{integration.name}</div>
                  <div className="mt-1.5 text-xs leading-5 text-muted">{integration.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
          <div className="max-w-2xl">
            <p className="aetheris-kicker">Pricing</p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">Pricing</h2>
          </div>

          <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.highlighted
                    ? "aetheris-frame shadow-[0_20px_60px_-20px_color-mix(in_srgb,var(--aetheris-accent)_40%,transparent)]"
                    : ""
                }
              >
                <article
                  className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                    plan.highlighted
                      ? "border-transparent bg-gradient-to-b from-surface to-raised"
                      : "aetheris-card"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#09090B]">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-base font-semibold tracking-tight">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tighter">{plan.price}</span>
                    <span className="text-sm text-faint">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{plan.description}</p>
                  <ul className="mt-7 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-soft text-accent">
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                          </svg>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="relative overflow-hidden border-y border-edge bg-surface">
          <div className="absolute -right-32 top-1/3 h-72 w-72 glow-accent opacity-50" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl scroll-mt-24 px-6 py-24">
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-12 space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details key={item.question} className="aetheris-card group p-6 transition-colors duration-200 open:border-accent/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold tracking-tight">
                    {item.question}
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge bg-raised/70 text-muted transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div
            className="absolute -bottom-28 left-1/2 h-80 w-[40rem] -translate-x-1/2 glow-accent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-6 py-28 text-center">
            <p className="aetheris-kicker">Get started</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-extrabold tracking-tighter sm:text-5xl">
              See the control plane <span className="text-gradient">in action</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty leading-7 text-muted">
              Try the client VNC console, the admin node manager and the billing
              engine in a live, interactive preview.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/demo" className="aetheris-btn-primary h-12 px-7 text-[15px]">
                Open the live demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="https://github.com/aetheris-project/aetheris-app" className="aetheris-btn-secondary h-12 px-7 text-[15px]">
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
