import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, Github, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/website/SiteHeader";
import { Footer } from "@/components/website/Footer";
import { InteractiveDemo } from "@/components/website/InteractiveDemo";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "Interactive preview of the Aetheris control plane: client portal, VNC console, billing engine, node manager, provisioning, whitelabeling and the API/SDK, driven by real React components with mock data."
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-14">
          <Link
            href="/"
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-edge bg-raised/70 px-3 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to home
          </Link>

          <div className="relative mx-auto mt-10 max-w-3xl text-center">
            <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 glow-accent" aria-hidden="true" />
            <p className="relative aetheris-kicker">Interactive preview</p>
            <h1 className="relative mt-3 text-balance text-4xl font-extrabold tracking-tighter sm:text-5xl">
              Aetheris control plane, <span className="text-gradient">live</span>
            </h1>
            <p className="relative mt-5 text-pretty text-base leading-7 text-muted">
              Seven interactive panels organized like the real control plane. In the
              client area you get the VNC console, your servers with power control
              and backups, and the billing engine. The admin area covers node
              management, the provisioning wizard, dynamic whitelabeling with a
              live preview and the API/SDK reference. Every panel is a real React
              component running against a mock data driver that mirrors the
              production API contract, and the whole preview follows the light,
              dark and system themes.
            </p>
          </div>

          <div className="mt-12">
            <InteractiveDemo tall />
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="https://aetheris-docs.vercel.app" className="aetheris-btn-secondary">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Read the documentation
            </Link>
            <Link href="https://aetheris-panel.vercel.app" className="aetheris-btn-primary">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open the live console
            </Link>
            <Link href="https://aetheris-panel.vercel.app/admin" className="aetheris-btn-secondary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Admin panel
            </Link>
            <Link href="https://github.com/aetheris-project/aetheris-app" className="aetheris-btn-secondary">
              <Github className="h-4 w-4" aria-hidden="true" />
              View the source
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
