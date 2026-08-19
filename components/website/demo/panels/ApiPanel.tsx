"use client";

import { useEffect, useState } from "react";
import {
  Braces,
  Check,
  ClipboardCopy,
  Code2,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import {
  DEMO_API_ENDPOINTS,
  type ApiMethod,
  type DemoApiKey
} from "@/components/website/demo/data";
import { Skeleton, useToast } from "@/components/website/demo/ui";

const METHOD_STYLE: Record<ApiMethod, string> = {
  GET: "border-success/30 bg-success/10 text-success",
  POST: "border-accent/30 bg-accent-soft text-accent",
  PATCH: "border-warning/30 bg-warning/10 text-warning",
  DELETE: "border-danger/30 bg-danger/10 text-danger"
};

const SDK_LIST = [
  { name: "TypeScript", version: "v1.4.2", accent: true },
  { name: "Python", version: "v1.2.0", accent: false },
  { name: "Go", version: "v1.0.8", accent: false },
  { name: "REST / OpenAPI 3.1", version: "spec.json", accent: false }
];

/**
 * ApiPanel
 *
 * The developer surface: endpoint reference with auth badges, an API key
 * with rotation, a copyable curl example and the official SDK clients.
 * Mirrors the OpenAPI specification published by aetheris-app.
 */
export function ApiPanel() {
  const [apiKey, setApiKey] = useState<DemoApiKey | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState<"key" | "curl" | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    void mockDriver.getApiKey().then((key) => {
      if (cancelled) return;
      setApiKey(key);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function rotate() {
    if (rotating) return;
    setRotating(true);
    const next = await mockDriver.rotateApiKey();
    setApiKey(next);
    setRevealed(true);
    setRotating(false);
    toast.show("API key rotated. Previous key revoked immediately.", "warning");
  }

  function copy(target: "key" | "curl") {
    setCopied(target);
    setTimeout(() => setCopied(null), 1600);
    toast.show(target === "key" ? "API key copied to clipboard." : "cURL snippet copied to clipboard.", "success");
  }

  const maskedKey = apiKey
    ? `${apiKey.prefix}_${"•".repeat(12)}${apiKey.secret.slice(-4)}`
    : "";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="overflow-y-auto px-4 py-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          {/* API key card */}
          <div className="space-y-4">
            <div className="rounded-xl border border-edge bg-raised/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                  <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                  API key
                </h3>
                <span className="inline-flex h-5 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 text-[10px] font-semibold uppercase tracking-wider text-success">
                  <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
                  Active
                </span>
              </div>

              {loading || apiKey === null ? (
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ) : (
                <>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="flex-1 truncate rounded-lg border border-edge bg-base px-3 py-2.5 font-mono text-[11px] text-accent">
                      {revealed ? `${apiKey.prefix}_${apiKey.secret}` : maskedKey}
                    </code>
                    <button
                      type="button"
                      className="aetheris-btn-ghost h-9 w-9 p-0"
                      aria-label={revealed ? "Hide API key" : "Reveal API key"}
                      onClick={() => setRevealed((value) => !value)}
                    >
                      {revealed ? <Lock className="h-3.5 w-3.5" aria-hidden="true" /> : <Code2 className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      className="aetheris-btn-ghost h-9 w-9 p-0"
                      aria-label="Copy API key"
                      onClick={() => copy("key")}
                    >
                      {copied === "key" ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted">
                    <span>{apiKey.label} - created {apiKey.createdAt}</span>
                    <span>last used {apiKey.lastUsed}</span>
                  </div>
                  <button type="button" className="aetheris-btn-secondary mt-3 h-8 w-full px-3" disabled={rotating} onClick={() => void rotate()}>
                    {rotating ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
                    Rotate key
                  </button>
                </>
              )}
            </div>

            {/* cURL example */}
            <div className="overflow-hidden rounded-xl border border-edge">
              <div className="flex items-center justify-between border-b border-edge bg-raised/40 px-4 py-2.5">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                  <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  Quick start
                </h3>
                <button type="button" className="aetheris-btn-ghost h-7 px-2 text-xs" onClick={() => copy("curl")}>
                  {copied === "curl" ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />}
                  Copy
                </button>
              </div>
              <pre className="overflow-x-auto bg-base p-4 font-mono text-[11px] leading-6 text-muted">
                <code>
                  <span className="text-success">$</span> curl https://api.aetheris.enterprise/v1/servers{"\n"}
                  <span className="text-muted/60">  -H</span> "Authorization: Bearer aet_live_...{"\n"}
                  <span className="text-muted/60">  -H</span> "Content-Type: application/json"{"\n"}
                  {"\n"}
                  <span className="text-faint">{"{"}</span>{"\n"}
                  {"  "}<span className="text-accent">"data"</span>: [{"\n"}
                  {"    {"} <span className="text-accent">"name"</span>: <span className="text-success">"Production-01"</span>, <span className="text-accent">"state"</span>: <span className="text-success">"running"</span> {"}"}{"\n"}
                  {"  ]"}{"\n"}
                  <span className="text-faint">{"}"}</span>
                </code>
              </pre>
            </div>

            {/* SDKs */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <Braces className="h-3.5 w-3.5" aria-hidden="true" />
                Official SDKs
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SDK_LIST.map((sdk) => (
                  <button
                    key={sdk.name}
                    type="button"
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl border border-edge bg-raised/40 px-3 py-2.5 text-left transition-colors duration-150 hover:border-accent/40 hover:bg-raised",
                      sdk.accent && "border-accent/40 bg-accent-soft"
                    )}
                    onClick={() => toast.show(`${sdk.name} client linked to docs (demo).`)}
                  >
                    <span className="text-xs font-medium">{sdk.name}</span>
                    <span className="font-mono text-[10px] text-muted">{sdk.version}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Endpoint reference */}
          <div className="overflow-hidden rounded-xl border border-edge">
            <div className="flex items-center justify-between border-b border-edge bg-raised/40 px-4 py-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
                Endpoint reference
              </h3>
              <span className="font-mono text-[11px] text-faint">api.aetheris.enterprise</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted">
                <tr className="border-b border-edge">
                  <th scope="col" className="px-4 py-2 font-medium">Method</th>
                  <th scope="col" className="px-4 py-2 font-medium">Endpoint</th>
                  <th scope="col" className="hidden px-4 py-2 font-medium lg:table-cell">Description</th>
                  <th scope="col" className="px-4 py-2 text-right font-medium">Auth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {DEMO_API_ENDPOINTS.map((endpoint) => (
                  <tr key={`${endpoint.method}-${endpoint.path}`} className="transition-colors duration-150 hover:bg-raised/50">
                    <td className="px-4 py-2.5">
                      <span className={cn("inline-flex h-6 items-center rounded-md border px-2 font-mono text-[10px] font-bold", METHOD_STYLE[endpoint.method])}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">{endpoint.path}</td>
                    <td className="hidden px-4 py-2.5 text-xs text-muted lg:table-cell">{endpoint.description}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="inline-flex h-6 items-center gap-1 rounded-full border border-edge bg-raised/70 px-2.5 text-[10px] font-medium text-muted">
                        <ShieldCheck className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                        {endpoint.auth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast.node}
    </div>
  );
}
