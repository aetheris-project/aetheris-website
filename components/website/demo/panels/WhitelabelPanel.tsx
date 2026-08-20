"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe, Image, Link2, Palette, Save, Tag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";
import type { AccentName } from "@/lib/config/whitelabel";
import { useToast } from "@/components/website/demo/ui";

const ACCENT_SWATCHES: Array<{ id: AccentName; label: string; color: string }> = [
  { id: "emerald", label: "Emerald", color: "#10B981" },
  { id: "indigo", label: "Indigo", color: "#6366F1" },
  { id: "amber", label: "Amber", color: "#F59E0B" }
];

const MODULES = [
  { id: "billing", label: "Billing engine", description: "Invoices, subscriptions and dunning" },
  { id: "vncConsole", label: "VNC console", description: "In-browser server console" },
  { id: "pterodactyl", label: "Pterodactyl driver", description: "Application and Client API" },
  { id: "proxmox", label: "Proxmox VE driver", description: "API v2 hypervisor bridge" },
  { id: "virtfusion", label: "VirtFusion driver", description: "REST hypervisor bridge" },
  { id: "registrars", label: "Domain registration", description: "Namecheap and Cloudflare" }
];

function Toggle({ on, label }: { on: boolean; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200",
        on ? "border-accent/50 bg-accent" : "border-edge bg-raised"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200",
          on ? "translate-x-[1.05rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

/**
 * WhitelabelPanel
 *
 * The dynamic whitelabeling editor. Changes to the brand name, tagline,
 * domain, accent and module toggles are reflected immediately in the live
 * preview on the right - the same mechanism the Admin Panel uses to publish
 * a rebranded platform with zero rebuilds.
 */
export function WhitelabelPanel() {
  const { config, setAccent } = useWhitelabel();
  const [name, setName] = useState(config.brand.name);
  const [tagline, setTagline] = useState(config.brand.tagline);
  const [domain, setDomain] = useState(config.brand.domain);
  const [logoUrl, setLogoUrl] = useState(config.brand.logoUrl);
  const [modules, setModules] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((module) => [module.id, true]))
  );
  const [saved, setSaved] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  function save() {
    setSaved(true);
    setPublishedAt(new Date().toTimeString().slice(0, 8));
    toast.show("Whitelabel configuration published. No rebuild required.", "success");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(false), 1800);
  }

  const previewInitials = (name.trim() || "A").charAt(0).toUpperCase();
  const showLogo = Boolean(logoUrl.trim()) && logoUrl.trim() !== "/logo.svg";

  return (
    <div className="grid h-full grid-cols-1 overflow-y-auto lg:grid-cols-[1.05fr_1fr] lg:overflow-hidden">
      {/* Editor */}
      <div className="overflow-y-auto border-b border-edge lg:border-b-0 lg:border-r">
        <div className="border-b border-edge px-4 py-3">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
            <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            Platform branding
          </h3>
        </div>

        <div className="space-y-5 px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Tag className="h-3 w-3" aria-hidden="true" />
                Brand name
              </span>
              <input
                type="text"
                className="aetheris-input mt-1.5"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your brand"
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Globe className="h-3 w-3" aria-hidden="true" />
                Custom domain
              </span>
              <input
                type="text"
                className="aetheris-input mt-1.5"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="panel.example.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-muted">Tagline</span>
            <input
              type="text"
              className="aetheris-input mt-1.5"
              value={tagline}
              onChange={(event) => setTagline(event.target.value)}
              placeholder="One line describing your platform"
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <Image className="h-3 w-3" aria-hidden="true" />
              Logo URL
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              {showLogo ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-lg border border-edge bg-raised object-contain p-1"
                  onError={() => setLogoUrl("/logo.svg")}
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-extrabold text-base">
                  {previewInitials}
                </span>
              )}
              <input
                type="text"
                className="aetheris-input"
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                placeholder="/logo.svg"
              />
            </div>
          </label>

          <div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">Accent color</span>
            <div className="mt-2 flex items-center gap-2">
              {ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setAccent(swatch.id)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150",
                    config.theme.accent === swatch.id
                      ? "border-accent/60 ring-1 ring-accent/40"
                      : "border-edge hover:border-accent/40"
                  )}
                  style={{ backgroundColor: swatch.color }}
                  aria-label={`Set accent to ${swatch.label}`}
                  aria-pressed={config.theme.accent === swatch.id}
                  title={`${swatch.label} accent`}
                >
                  {config.theme.accent === swatch.id && (
                    <Check className="h-4 w-4 text-white drop-shadow" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <Link2 className="h-3 w-3" aria-hidden="true" />
              Enabled modules
            </span>
            <div className="mt-2 space-y-2">
              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-edge bg-raised/40 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-medium">{module.label}</div>
                    <div className="truncate text-[11px] text-muted">{module.description}</div>
                  </div>
                  <Toggle
                    on={modules[module.id]}
                    label={`Toggle ${module.label}`}
                    />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-edge pt-4">
            <span className="font-mono text-[11px] text-faint">
              {publishedAt ? `published ${publishedAt}` : "/api/whitelabel"}
            </span>
            <button type="button" className={cn("aetheris-btn-primary h-9 px-4", saved && "ring-2 ring-accent/40")} onClick={save}>
              {saved ? <Check className="h-4 w-4" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              {saved ? "Published" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="flex flex-col overflow-hidden bg-base/40">
        <div className="border-b border-edge px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Live preview</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-sm animate-fade-up rounded-2xl border border-edge bg-surface shadow-2xl shadow-base/50">
            {/* Client portal header */}
            <div className="flex h-14 items-center justify-between border-b border-edge px-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-base">
                  {previewInitials}
                </span>
                <span className="text-sm font-semibold tracking-tight">{name || "Your brand"}</span>
              </div>
              <span className="aetheris-btn-primary h-7 px-3 text-xs">Sign in</span>
            </div>

            {/* Portal hero */}
            <div className="border-b border-edge p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">Client portal</div>
              <h4 className="mt-1.5 text-lg font-bold leading-tight tracking-tight">
                {tagline || "Your platform tagline"}
              </h4>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-edge bg-raised/50 px-3 py-2">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
                <span className="font-mono text-[11px] text-muted">{domain || "panel.example.com"}</span>
              </div>
            </div>

            {/* Portal cards */}
            <div className="space-y-2.5 p-4">
              {[
                { label: "Running servers", value: "3", tone: "text-ink", module: "vncConsole" },
                { label: "Monthly spend", value: "$56/mo", tone: "text-accent", module: "billing" },
                { label: "Open invoices", value: "$89", tone: "text-warning", module: "billing" }
              ].map((stat) => {
                const disabled = !modules[stat.module];
                return (
                  <div
                    key={stat.label}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3.5 py-3 transition-opacity duration-200",
                      disabled ? "border-edge bg-raised/20 opacity-40" : "border-edge bg-raised/40"
                    )}
                  >
                    <span className="text-xs text-muted">{stat.label}</span>
                    <span className={cn("font-mono text-sm font-semibold", disabled ? "text-faint" : stat.tone)}>{disabled ? "- - -" : stat.value}</span>
                  </div>
                );
              })}

              <div className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent-soft px-3.5 py-3">
                <span className="text-xs font-medium">Whitelabel config</span>
                <span className="inline-flex h-5 items-center rounded-full border border-success/30 bg-success/10 px-2 text-[10px] font-semibold uppercase tracking-wider text-success">
                  Live
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(modules)
                  .filter(([, enabled]) => enabled)
                  .map(([id]) => (
                    <span key={id} className="inline-flex h-5 items-center rounded-full border border-edge bg-raised/70 px-2 text-[10px] text-muted">
                      {id.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.node}
    </div>
  );
}
