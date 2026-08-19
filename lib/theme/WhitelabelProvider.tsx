"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_WHITELABEL, type AccentName, type WhitelabelConfig } from "@/lib/config/whitelabel";

interface WhitelabelContextValue {
  config: WhitelabelConfig;
  accent: AccentName;
  setAccent: (accent: AccentName) => void;
  /** True until a remote config has been fetched (client-side only). */
  isRemote: boolean;
}

const WhitelabelContext = createContext<WhitelabelContextValue | null>(null);

const ACCENTS: AccentName[] = ["emerald", "indigo", "amber"];

function isAccentName(value: unknown): value is AccentName {
  return typeof value === "string" && (ACCENTS as string[]).includes(value);
}

function isWhitelabelConfig(value: unknown): value is WhitelabelConfig {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<WhitelabelConfig>;
  return (
    typeof candidate.brand === "object" &&
    candidate.brand !== null &&
    typeof candidate.theme === "object" &&
    candidate.theme !== null &&
    isAccentName(candidate.theme?.accent)
  );
}

/** Deep-merge the remote payload over the static defaults. */
function mergeConfig(base: WhitelabelConfig, overlay: Partial<WhitelabelConfig>): WhitelabelConfig {
  return {
    ...base,
    ...overlay,
    brand: { ...base.brand, ...overlay.brand },
    theme: { ...base.theme, ...overlay.theme },
    contact: { ...base.contact, ...overlay.contact },
    seo: { ...base.seo, ...overlay.seo },
    modules: { ...base.modules, ...overlay.modules },
    navigation: overlay.navigation ?? base.navigation,
    integrations: { ...base.integrations, ...overlay.integrations }
  };
}

/**
 * WhitelabelProvider
 *
 * Applies the whitelabel configuration to the document root:
 *   - Sets [data-accent] so the CSS variable blocks in globals.css activate.
 *   - Sets --aetheris-radius and font-family overrides.
 *   - Merges a remote config (NEXT_PUBLIC_WHITELABEL_URL) when present.
 *
 * The static JSON is the SSR-safe default, so the first paint is never
 * dependent on a network request (CLS stays zero).
 */
export function WhitelabelProvider({
  children,
  initialConfig = DEFAULT_WHITELABEL
}: {
  children: ReactNode;
  initialConfig?: WhitelabelConfig;
}) {
  const [config, setConfig] = useState<WhitelabelConfig>(initialConfig);
  const [accent, setAccent] = useState<AccentName>(initialConfig.theme.accent);
  const [isRemote, setIsRemote] = useState(false);

  // Load the remote whitelabel configuration when configured.
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_WHITELABEL_URL;
    if (!endpoint) return;

    let cancelled = false;
    fetch(endpoint, { next: { revalidate: 300 } })
      .then((response) => {
        if (!response.ok) throw new Error(`whitelabel endpoint returned ${response.status}`);
        return response.json();
      })
      .then((payload: unknown) => {
        if (cancelled) return;
        if (isWhitelabelConfig(payload)) {
          setConfig((current) => mergeConfig(current, payload));
          if (isAccentName(payload.theme?.accent)) setAccent(payload.theme.accent);
        }
        setIsRemote(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("[aetheris] whitelabel fetch failed, using static config", error);
        setIsRemote(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply accent + theme tokens to the document root. Runs on every change,
  // including the first client paint, to reflect SSR-defaulted accents.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-accent", accent);
    if (config.theme.radius > 0) {
      root.style.setProperty("--aetheris-radius", `${config.theme.radius}px`);
    }
    if (config.theme.fontFamily) {
      root.style.setProperty("--font-inter", config.theme.fontFamily);
    }
  }, [accent, config.theme.fontFamily, config.theme.radius]);

  const value = useMemo<WhitelabelContextValue>(
    () => ({ config, accent, setAccent, isRemote }),
    [config, accent]
  );

  return <WhitelabelContext.Provider value={value}>{children}</WhitelabelContext.Provider>;
}

export function useWhitelabel(): WhitelabelContextValue {
  const context = useContext(WhitelabelContext);
  if (!context) {
    throw new Error("useWhitelabel must be used within a WhitelabelProvider");
  }
  return context;
}
