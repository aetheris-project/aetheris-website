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
          <svg
            width="44"
            height="44"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ogLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#34D399" }} />
                <stop offset="50%" style={{ stopColor: accent.primary }} />
                <stop offset="100%" style={{ stopColor: accent.strong }} />
              </linearGradient>
            </defs>
            <path
              d="M32 2 L58 17 L58 47 L32 62 L6 47 L6 17 Z"
              fill="none"
              stroke="url(#ogLogoGrad)"
              strokeWidth="3"
            />
            <path
              d="M32 8 L52 20 L52 44 L32 56 L12 44 L12 20 Z"
              fill="url(#ogLogoGrad)"
              opacity="0.15"
            />
            <path
              d="M32 16 L48 48 L43 48 L40 42 L24 42 L21 48 L16 48 Z M27 38 L37 38 L32 24 Z"
              fill="url(#ogLogoGrad)"
            />
            <circle cx="32" cy="8" r="3" fill={accent.primary} />
            <circle cx="10" cy="22" r="2.5" fill={accent.primary} opacity="0.7" />
            <circle cx="54" cy="22" r="2.5" fill={accent.primary} opacity="0.7" />
            <circle cx="10" cy="42" r="2.5" fill={accent.primary} opacity="0.7" />
            <circle cx="54" cy="42" r="2.5" fill={accent.primary} opacity="0.7" />
            <circle cx="32" cy="56" r="3" fill={accent.primary} />
          </svg>
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
