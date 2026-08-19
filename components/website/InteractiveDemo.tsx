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

const ACCENT_SWATCHES: Array<{ id: AccentName; color: string }> = [
  { id: "emerald", color: "#10B981" },
  { id: "indigo", color: "#6366F1" },
  { id: "amber", color: "#F59E0B" }
];

/**
 * InteractiveDemo
 *
 * Live product preview frame for the marketing landing page. Visitors can
 * switch between the Client VNC Console, Admin Node Manager and Billing
 * Engine, and change the platform accent in real time.
 *
 * Every panel is a real React component consuming the MockDriver, which
 * mirrors the production driver contracts from aetheris-app. The content
 * area has a fixed height so tab switches never shift layout (CLS = 0).
 */
export function InteractiveDemo() {
  const { accent, setAccent, config } = useWhitelabel();
  const [activeTab, setActiveTab] = useState<DemoTabId>("vnc");
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-edge bg-surface shadow-2xl shadow-black/60 transition-[height] duration-300",
        expanded ? "h-[680px]" : "h-[560px]"
      )}
      style={{ borderRadius: `calc(var(--aetheris-radius, 10px) * 1.2)` }}
      aria-label="Aetheris interactive product demo"
    >
      {/* Window chrome */}
      <div className="flex h-12 items-center justify-between border-b border-edge bg-raised px-4">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-edge" />
          <span className="h-3 w-3 rounded-full bg-edge" />
          <span className="h-3 w-3 rounded-full bg-edge" />
        </div>

        <div className="flex items-center gap-2.5">
          <Radio className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span className="hidden text-xs font-medium text-muted sm:block">
            Aetheris Control Plane - live preview
          </span>
          <span className="inline-flex h-5 items-center rounded-full border border-accent/40 bg-accent-soft px-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
            Live
          </span>
        </div>

        {/* Dynamic accent switcher */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Platform accent color">
          {ACCENT_SWATCHES.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              onClick={() => setAccent(swatch.id)}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border transition-transform hover:scale-110",
                accent === swatch.id ? "border-ink/60" : "border-transparent"
              )}
              style={{ backgroundColor: swatch.color }}
              aria-label={`Switch accent to ${swatch.id}`}
              aria-pressed={accent === swatch.id}
              title={`${swatch.id} accent`}
            />
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div role="tablist" aria-label="Demo panels" className="flex items-center gap-1 border-b border-edge px-3 pt-2">
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
                "relative flex h-10 items-center gap-2 rounded-t-lg px-4 text-sm font-medium transition-colors",
                active ? "text-ink" : "text-muted hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              {active && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent" aria-hidden="true" />
              )}
            </button>
          );
        })}
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

      <p className="sr-only">
        Interactive preview of {config.brand.name}. Use the tabs to switch between the client VNC console,
        the admin node manager and the billing engine.
      </p>
    </div>
  );
}
