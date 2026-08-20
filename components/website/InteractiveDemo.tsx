"use client";

import { useState } from "react";
import {
  Braces,
  CreditCard,
  Monitor,
  Palette,
  Radio,
  Rocket,
  Server,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";
import type { AccentName } from "@/lib/config/whitelabel";
import { ThemeToggle } from "@/components/website/ThemeToggle";
import { VncConsolePanel } from "@/components/website/demo/panels/VncConsolePanel";
import { NodeManagerPanel } from "@/components/website/demo/panels/NodeManagerPanel";
import { BillingEnginePanel } from "@/components/website/demo/panels/BillingEnginePanel";
import { ProvisioningPanel } from "@/components/website/demo/panels/ProvisioningPanel";
import { ClientPortalPanel } from "@/components/website/demo/panels/ClientPortalPanel";
import { WhitelabelPanel } from "@/components/website/demo/panels/WhitelabelPanel";
import { ApiPanel } from "@/components/website/demo/panels/ApiPanel";

type DemoTabId =
  | "console"
  | "servers"
  | "billing"
  | "nodes"
  | "provision"
  | "whitelabel"
  | "api";

interface DemoTab {
  id: DemoTabId;
  label: string;
  short: string;
  icon: typeof Monitor;
}

const CLIENT_TABS: DemoTab[] = [
  { id: "console", label: "VNC Console", short: "Console", icon: Monitor },
  { id: "servers", label: "My Servers", short: "Servers", icon: Server },
  { id: "billing", label: "Billing Engine", short: "Billing", icon: CreditCard }
];

const ADMIN_TABS: DemoTab[] = [
  { id: "nodes", label: "Node Manager", short: "Nodes", icon: LayoutGrid },
  { id: "provision", label: "Provisioning", short: "Deploy", icon: Rocket },
  { id: "whitelabel", label: "Whitelabel", short: "Brand", icon: Palette },
  { id: "api", label: "API & SDK", short: "API", icon: Braces }
];

const ACCENT_SWATCHES: Array<{ id: AccentName; label: string; color: string }> = [
  { id: "emerald", label: "Emerald", color: "#10B981" },
  { id: "indigo", label: "Indigo", color: "#6366F1" },
  { id: "amber", label: "Amber", color: "#F59E0B" }
];

function NavButton({
  tab,
  active,
  onSelect,
  idPrefix = "demo-tab"
}: {
  tab: DemoTab;
  active: boolean;
  onSelect: () => void;
  idPrefix?: string;
}) {
  const Icon = tab.icon;
  const buttonId = `${idPrefix}-${tab.id}`;
  return (
    <button
      type="button"
      role="tab"
      id={buttonId}
      aria-selected={active}
      aria-controls={`demo-panel-${tab.id}`}
      onClick={onSelect}
      className={cn(
        "relative flex h-9 items-center gap-2 rounded-lg text-sm font-medium transition-all duration-200",
        "px-3.5 sm:px-4",
        active ? "border border-edge bg-raised text-ink shadow-sm" : "border border-transparent text-muted hover:text-ink"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-accent" : "")} aria-hidden="true" />
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.short}</span>
    </button>
  );
}

/**
 * InteractiveDemo
 *
 * Live product preview frame organized like the real control plane:
 * a Client area (VNC console, server portal, billing) and an Admin area
 * (node manager, provisioning, whitelabeling, API/SDK). Visitors can also
 * change the platform accent and flip the light/dark/system theme live.
 *
 * The panel host has a fixed height so tab switches never shift layout
 * (CLS = 0). Panels consume the MockDriver, which mirrors the production
 * driver contracts from aetheris-app.
 */
export function InteractiveDemo({ tall = false }: { tall?: boolean }) {
  const { accent, setAccent } = useWhitelabel();
  const [activeTab, setActiveTab] = useState<DemoTabId>("console");
  const [expanded, setExpanded] = useState(false);

  const frameHeight = expanded || tall ? "h-[720px]" : "h-[560px]";

  return (
    <div
      className={cn(
        "aetheris-frame shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]",
        "transition-[height] duration-300",
        frameHeight
      )}
      aria-label="Aetheris interactive product demo"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-surface to-base">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-edge px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-base shadow-[0_0_16px_-2px_color-mix(in_srgb,rgb(var(--aetheris-accent))_60%,transparent)]">
              A
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              Control plane preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden md:flex" />
            <div
              className="flex items-center gap-1 rounded-lg border border-edge bg-base/40 p-1"
              role="group"
              aria-label="Platform accent color"
            >
              {ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setAccent(swatch.id)}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150",
                    accent === swatch.id
                      ? "bg-raised ring-1 ring-accent/40"
                      : "hover:bg-raised/70"
                  )}
                  style={{ backgroundColor: accent === swatch.id ? swatch.color : "transparent" }}
                  aria-label={`Switch accent to ${swatch.id}`}
                  aria-pressed={accent === swatch.id}
                  title={`${swatch.label} accent`}
                />
              ))}
            </div>
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              <Radio className="h-3 w-3" aria-hidden="true" />
              Live
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar navigation: desktop */}
          <nav
            className="hidden w-56 shrink-0 flex-col border-r border-edge p-2 md:flex"
            aria-label="Demo panels"
          >
            <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-faint">
              Client area
            </div>
            <div className="flex flex-col gap-1" role="tablist" aria-orientation="vertical">
              {CLIENT_TABS.map((tab) => (
                <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onSelect={() => setActiveTab(tab.id)} />
              ))}
            </div>
            <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-faint">
              Admin area
            </div>
            <div className="flex flex-col gap-1" role="tablist" aria-orientation="vertical">
              {ADMIN_TABS.map((tab) => (
                <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onSelect={() => setActiveTab(tab.id)} />
              ))}
            </div>

            <div className="mt-auto rounded-xl border border-edge bg-raised/40 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wider text-faint">Platform status</div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
                All systems operational
              </div>
              <div className="mt-1 font-mono text-[10px] text-faint">p99 latency 38ms</div>
            </div>
          </nav>

          {/* Panel host */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Mobile tab bar: horizontal scroll */}
            <div className="border-b border-edge px-2 py-2 md:hidden">
              <div
                className="flex items-center gap-1 overflow-x-auto pb-0.5"
                role="tablist"
                aria-label="Demo panels"
              >
                {[...CLIENT_TABS, ...ADMIN_TABS].map((tab) => (
                  <NavButton key={tab.id} tab={tab} active={activeTab === tab.id} onSelect={() => setActiveTab(tab.id)} idPrefix="demo-mtab" />
                ))}
              </div>
            </div>

            {/* Fixed-height panel host: panels layered to guarantee zero layout shift */}
            <div className="relative min-h-0 flex-1">
              <div
                id="demo-panel-console"
                role="tabpanel"
                aria-labelledby="demo-tab-console"
                className={cn("absolute inset-0", activeTab !== "console" && "hidden")}
              >
                <VncConsolePanel expanded={expanded} onToggleExpand={() => setExpanded((value) => !value)} />
              </div>
              <div
                id="demo-panel-servers"
                role="tabpanel"
                aria-labelledby="demo-tab-servers"
                className={cn("absolute inset-0", activeTab !== "servers" && "hidden")}
              >
                <ClientPortalPanel />
              </div>
              <div
                id="demo-panel-billing"
                role="tabpanel"
                aria-labelledby="demo-tab-billing"
                className={cn("absolute inset-0", activeTab !== "billing" && "hidden")}
              >
                <BillingEnginePanel />
              </div>
              <div
                id="demo-panel-nodes"
                role="tabpanel"
                aria-labelledby="demo-tab-nodes"
                className={cn("absolute inset-0", activeTab !== "nodes" && "hidden")}
              >
                <NodeManagerPanel />
              </div>
              <div
                id="demo-panel-provision"
                role="tabpanel"
                aria-labelledby="demo-tab-provision"
                className={cn("absolute inset-0", activeTab !== "provision" && "hidden")}
              >
                <ProvisioningPanel />
              </div>
              <div
                id="demo-panel-whitelabel"
                role="tabpanel"
                aria-labelledby="demo-tab-whitelabel"
                className={cn("absolute inset-0", activeTab !== "whitelabel" && "hidden")}
              >
                <WhitelabelPanel />
              </div>
              <div
                id="demo-panel-api"
                role="tabpanel"
                aria-labelledby="demo-tab-api"
                className={cn("absolute inset-0", activeTab !== "api" && "hidden")}
              >
                <ApiPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
