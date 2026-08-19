import Link from "next/link";
import { SiteHeader } from "@/components/website/SiteHeader";
import { Footer } from "@/components/website/Footer";
import { InteractiveDemo } from "@/components/website/InteractiveDemo";
import { FAQ_ITEMS } from "@/lib/seo/jsonLd";

const FEATURES = [
  {
    title: "Unified billing engine",
    description:
      "Invoices, subscriptions, proration, dunning and tax in one engine. Replace WHMCS and FOSSBilling with a single billing core backed by Stripe, PayPal and Mollie."
  },
  {
    title: "Hypervisor drivers",
    description:
      "One driver interface, five backends. Native Pterodactyl, Proxmox VE, VirtFusion, cPanel/WHM and DirectAdmin drivers with identical lifecycle semantics."
  },
  {
    title: "Client VNC console",
    description:
      "In-browser console sessions for every server. WebSocket token issuance, clipboard passthrough and power control from the client portal."
  },
  {
    title: "Dynamic whitelabeling",
    description:
      "Name, logos, accent colors, navigation, email templates and custom domains configured at runtime through the Admin Panel. No rebuilds, ever."
  },
  {
    title: "Total admin control",
    description:
      "Node management, allocation pools, nest and egg targeting, backup policies and per-client resource limits from a single control plane."
  },
  {
    title: "Enterprise operations",
    description:
      "BullMQ background workers, Redis-backed queues, OpenAPI specifications, SSR rendering and a strict-mode TypeScript codebase."
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-edge">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 text-center">
            <div className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-edge bg-surface px-4 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
              v1.0.0 - Billing and virtualization control plane
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              One control plane for billing, panels and hypervisors
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-7 text-muted">
              Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE
              and VirtFusion into a single high-performance platform with total
              admin control and dynamic whitelabeling.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="#demo" className="aetheris-btn-primary h-11 px-6 text-base">
                Explore the live demo
              </Link>
              <Link href="https://docs.aetheris.enterprise" className="aetheris-btn-secondary h-11 px-6 text-base">
                Read the documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Live demo */}
        <section id="demo" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Interactive product demo</h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted">
              Switch between the client VNC console, the admin node manager and the
              billing engine. Every panel is a real React component driven by a
              mock data driver.
            </p>
          </div>
          <InteractiveDemo />
        </section>

        {/* Features */}
        <section id="product" className="border-y border-edge bg-surface">
          <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything a hosting business needs</h2>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <article key={feature.title} className="aetheris-card p-6">
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Native integrations</h2>
          <p className="mt-3 max-w-2xl text-pretty text-muted">
            Production drivers for every panel, hypervisor, gateway and registrar
            in the stack.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INTEGRATIONS.map((integration) => (
              <div key={integration.name} className="aetheris-card p-5">
                <div className="text-sm font-semibold">{integration.name}</div>
                <div className="mt-1 text-xs leading-5 text-muted">{integration.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-y border-edge bg-surface">
          <div className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <article
                  key={plan.name}
                  className={`aetheris-card p-6 ${plan.highlighted ? "border-accent/60 ring-1 ring-accent/30" : ""}`}
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
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
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
        </section>

        {/* CTA */}
        <section className="border-t border-edge">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Deploy the platform today</h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-muted">
              Clone the repositories, run the bootstrap script, and follow the
              installation guide for a production deployment on your own hardware.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="https://github.com/aetheris-enterprise/aetheris-app" className="aetheris-btn-primary h-11 px-6 text-base">
                Get the source
              </Link>
              <Link href="https://docs.aetheris.enterprise" className="aetheris-btn-secondary h-11 px-6 text-base">
                Installation guide
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
