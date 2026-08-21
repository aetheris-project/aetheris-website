import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, Users, Shield, Zap, BookOpen, Heart } from "lucide-react";
import { SiteHeader } from "@/components/website/SiteHeader";
import { Footer } from "@/components/website/Footer";

const DISCORD_INVITE = "https://discord.gg/6GcfebuT2A";
const SITE_URL = "https://aetheris-web.vercel.app";

export const metadata: Metadata = {
  title: "Join our Discord Community",
  description:
    "Join the Aetheris Discord server for real-time support, community discussions, feature requests, and announcements. Get help from the team and other users running Aetheris in production.",
  keywords: [
    "Aetheris Discord",
    "Aetheris community",
    "Aetheris support",
    "hosting control panel Discord",
    "billing platform community",
    "pterodactyl Discord",
    "proxmox community"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aetheris",
    title: "Join the Aetheris Discord Community",
    description:
      "Real-time support, community discussions, feature requests and announcements for the Aetheris billing and virtualization platform.",
    url: `${SITE_URL}/discord`,
    images: [
      {
        url: `${SITE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: "Aetheris Discord Community"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Aetheris Discord Community",
    description:
      "Real-time support, community discussions, feature requests and announcements for the Aetheris platform.",
    images: [`${SITE_URL}/api/og`]
  },
  alternates: {
    canonical: `${SITE_URL}/discord`
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Aetheris Discord Community",
  description:
    "Join the Aetheris Discord server for real-time support, community discussions, feature requests, and announcements.",
  url: `${SITE_URL}/discord`,
  mainEntity: {
    "@type": "Organization",
    name: "Aetheris",
    url: SITE_URL,
    sameAs: [DISCORD_INVITE]
  },
  potentialAction: {
    "@type": "JoinAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: DISCORD_INVITE,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    },
    result: {
      "@type": "Organization",
      name: "Aetheris Community"
    }
  }
};

const CHANNELS = [
  {
    name: "#general",
    description: "General discussion about Aetheris, hosting, and infrastructure",
    icon: MessageCircle
  },
  {
    name: "#support",
    description: "Get help with installation, configuration, and troubleshooting",
    icon: Shield
  },
  {
    name: "#feature-requests",
    description: "Suggest and vote on new features for the platform",
    icon: Zap
  },
  {
    name: "#announcements",
    description: "Official updates, releases, and important news",
    icon: BookOpen
  },
  {
    name: "#showcase",
    description: "Share your Aetheris setup and deployments with the community",
    icon: Heart
  },
  {
    name: "#development",
    description: "Technical discussions about code, architecture, and integrations",
    icon: Users
  }
];

function DiscordRedirectButton() {
  return (
    <a
      href={DISCORD_INVITE}
      target="_blank"
      rel="noopener noreferrer"
      className="aetheris-btn-primary h-14 px-10 text-[17px] font-bold"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
      Join the Aetheris Discord
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}

export default function DiscordPage() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-grid absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 h-[30rem] w-[52rem] -translate-x-1/2 rounded-full animate-orb glow-accent opacity-70"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 text-center sm:pt-28">
            <Link
              href="/"
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-edge bg-raised/70 px-3 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to home
            </Link>

            <div className="animate-fade-up mt-8">
              <div className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-edge bg-raised/70 px-4 text-xs font-medium text-muted backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
                Free to join - open to everyone
              </div>
              <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-6xl lg:text-7xl">
                Join the <span className="text-gradient">Aetheris community</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
                Get real-time support from the team and other users. Discuss features,
                share your setup, and stay updated with the latest releases.
              </p>
              <div className="mt-10">
                <DiscordRedirectButton />
              </div>
              <p className="mt-4 text-xs text-faint">
                Invite link: discord.gg/6GcfebuT2A
              </p>
            </div>
          </div>
        </section>

        {/* Channels */}
        <section className="border-y border-edge bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="aetheris-kicker">Channels</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
                What you will find inside
              </h2>
              <p className="mt-4 text-pretty leading-7 text-muted">
                Organized channels for every topic - from quick questions to deep technical discussions.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon;
                return (
                  <article
                    key={channel.name}
                    className="aetheris-card aetheris-card-hover p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent shadow-[0_0_24px_-8px_color-mix(in_srgb,rgb(var(--aetheris-accent))_55%,transparent)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-mono text-sm font-semibold">{channel.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{channel.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="relative overflow-hidden border-y border-edge bg-surface">
          <div className="absolute -right-32 top-1/2 h-72 w-72 glow-accent opacity-50" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="aetheris-kicker">Why join</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
                More than just support
              </h2>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Direct access to the team",
                  description:
                    "Get answers from the developers who build Aetheris. No ticket queues, no bots - just real engineers helping you."
                },
                {
                  title: "Community of operators",
                  description:
                    "Connect with other hosting providers and system administrators running Aetheris in production. Share configs, tips and best practices."
                },
                {
                  title: "Early access to features",
                  description:
                    "Be the first to know about new releases, beta features, and upcoming integrations. Shape the roadmap with your feedback."
                }
              ].map((benefit) => (
                <article key={benefit.title} className="aetheris-card aetheris-card-hover p-7">
                  <h3 className="text-lg font-semibold tracking-tight">{benefit.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-muted">{benefit.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-14 text-center">
              <DiscordRedirectButton />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative overflow-hidden border-y border-edge bg-surface">
          <div className="absolute -left-32 top-1/3 h-72 w-72 glow-accent opacity-50" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-6 py-24">
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-12 space-y-3">
              {[
                {
                  question: "Is the Discord server free?",
                  answer:
                    "Yes, the Aetheris Discord server is completely free and open to everyone. Whether you are evaluating the platform or running it in production, you are welcome to join."
                },
                {
                  question: "Do I need to have Aetheris installed to join?",
                  answer:
                    "No. You can join even if you are just evaluating or curious about the platform. The community is open to anyone interested in billing platforms, game server hosting, or virtualization management."
                },
                {
                  question: "What kind of support can I get?",
                  answer:
                    "You can get help with installation, configuration, troubleshooting, integrations, and general questions about the platform. For urgent production issues, email hello@another-horizon.eu."
                },
                {
                  question: "Is there a contribution process?",
                  answer:
                    "Yes. All improvements go through Pull Requests with automated CI checks before manual review. See the Contributing guide in the documentation for details."
                }
              ].map((item) => (
                <details
                  key={item.question}
                  className="aetheris-card group p-6 transition-colors duration-200 open:border-accent/30"
                >
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
      </main>

      <Footer />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
