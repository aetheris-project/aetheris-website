"use client";

import { useState } from "react";
import { CreditCard, Monitor, Radio, Server } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWhitelabel } from "@/lib/theme/WhitelabelProvider";
import type { AccentName } from "@/lib/config/whitelabel";
import { VncConsolePanel } from "@/components/website/demo/panels/VncConsolePanel";
import { NodeManagerPanel } from "@/components/website/demo/panels/NodeManagerPanel";
import { BillingEnginePanel } from "@/components/website/demo/panels/BillingEnginePanel";

type DemoTabId = "vnc" | "nodes" | "billing";

const TABS: Array<{ id: DemoTabId; label: string; icon: typeof Monitor }> = [
  { id: "vnc", label: "Client VNC Console", icon: Monitor },
  { id: "nodes", label: "Admin Node Manager", icon: Server },
  { id: "billing", label: "Billing Engine", icon: CreditCard }
];

const ACCENT_SWATCHES: Array<{ id: AccentName; label: string; color: string }> = [
  { id: "emerald", label: "Emerald", color: "#10B981" },
  { id: "indigo", label: "Indigo", color: "#6366F1" },
  { id: "amber", label: "Amber", color: "#F59E0B" }
];

/**
 * InteractiveDemo
 *
 * Live product preview frame. Visitors can switch between the Client VNC
 * Console, Admin Node Manager and Billing Engine, and change the platform
 * accent in real time.
 *
 * The panel host has a fixed height so tab switches never shift layout
 * (CLS = 0). Panels consume the MockDriver, which mirrors the production
 * driver contracts from aetheris-app.
 */
export function InteractiveDemo({ tall = false }: { tall?: boolean }) {
  const { accent, setAccent } = useWhitelabel();
  const [activeTab, setActiveTab] = useState<DemoTabId>("vnc");
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
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-[#141418] to-[#0D0D10]">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-base shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--aetheris-accent)_60%,transparent)]">
              A
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              Control plane preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-1"
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
                      ? "bg-white/[0.08] ring-1 ring-accent/40"
                      : "hover:bg-white/[0.04]"
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

        {/* Tab bar: segmented control */}
        <div className="flex shrink-0 items-center justify-center border-b border-white/[0.06] px-4 py-3">
          <div role="tablist" aria-label="Demo panels" className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-black/30 p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`demo-tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`demo-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-all duration-200 sm:px-4",
                    active
                      ? "border border-white/[0.08] bg-white/[0.06] text-ink shadow-sm"
                      : "border border-transparent text-muted hover:text-ink"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-accent" : "")} aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel host: fixed height, panels layered to guarantee zero layout shift */}
        <div className="relative h-[calc(100%-6.5rem)]">
          <div
            id="demo-panel-vnc"
            role="tabpanel"
            aria-labelledby="demo-tab-vnc"
            className={cn("absolute inset-0", activeTab !== "vnc" && "hidden")}
          >
            <VncConsolePanel expanded={expanded} onToggleExpand={() => setExpanded((value) => !value)} />
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
            id="demo-panel-billing"
            role="tabpanel"
            aria-labelledby="demo-tab-billing"
            className={cn("absolute inset-0", activeTab !== "billing" && "hidden")}
          >
            <BillingEnginePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
