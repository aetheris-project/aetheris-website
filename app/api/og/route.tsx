import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { DEFAULT_WHITELABEL, type AccentName } from "@/lib/config/whitelabel";

export const runtime = "edge";

const ACCENTS: Record<AccentName, { primary: string; strong: string }> = {
  emerald: { primary: "#10B981", strong: "#059669" },
  indigo: { primary: "#6366F1", strong: "#4F46E5" },
  amber: { primary: "#F59E0B", strong: "#D97706" }
};

const SIZE = { width: 1200, height: 630 };

/**
 * Dynamic OpenGraph image generator.
 * Renders a branded 1200x630 card with the whitelabel accent.
 * Cache headers are set in vercel.json for this route.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") ?? DEFAULT_WHITELABEL.seo.defaultTitle;
  const description =
    searchParams.get("description") ?? DEFAULT_WHITELABEL.brand.tagline;
  const requestedAccent = searchParams.get("accent") as AccentName | null;
  const accent = requestedAccent && ACCENTS[requestedAccent] ? ACCENTS[requestedAccent] : ACCENTS[DEFAULT_WHITELABEL.theme.accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090B",
          color: "#FAFAFA",
          padding: "64px 72px",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: accent.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: "#09090B"
            }}
          >
            A
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {DEFAULT_WHITELABEL.brand.name}
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#A1A1AA",
              border: "1px solid #27272A",
              borderRadius: 999,
              padding: "6px 14px"
            }}
          >
            Enterprise Platform
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 26, color: "#A1A1AA", lineHeight: 1.5, maxWidth: 820 }}>
            {description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {(["Billing", "Pterodactyl", "Proxmox", "VirtFusion", "VNC Console"] as const).map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 16,
                  color: "#D4D4D8",
                  border: "1px solid #27272A",
                  backgroundColor: "#18181B",
                  borderRadius: 999,
                  padding: "8px 16px"
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: accent.primary }} />
            <div style={{ fontSize: 18, color: "#A1A1AA" }}>aetheris.enterprise</div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
