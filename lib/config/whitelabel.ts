/**
 * Aetheris whitelabel configuration schema.
 *
 * The Admin Panel in aetheris-app persists an instance of this shape in
 * PostgreSQL (with a Redis cache) and serves it from /api/whitelabel. The
 * website consumes either the static JSON shipped in this repository
 * (lib/config/whitelabel.json) or the remote endpoint referenced by
 * NEXT_PUBLIC_WHITELABEL_URL.
 *
 * Every field is configurable at runtime without a rebuild.
 */

export type AccentName = "emerald" | "indigo" | "amber";

export interface WhitelabelTheme {
  /** Primary accent token. Maps to --aetheris-accent via data-accent. */
  accent: AccentName;
  /** Border radius scale in pixels applied to cards and buttons. */
  radius: number;
  /** Font stack override; empty string falls back to Inter. */
  fontFamily: string;
}

export interface WhitelabelNavigationItem {
  label: string;
  href: string;
  /** When true the link is rendered as a primary CTA button. */
  cta: boolean;
}

export interface WhitelabelBrand {
  name: string;
  tagline: string;
  logoUrl: string;
  logoDarkUrl: string;
  /** Custom domain routed by the platform edge (admin-configurable). */
  domain: string;
}

export interface WhitelabelContact {
  email: string;
  supportUrl: string;
  twitterUrl: string;
}

export interface WhitelabelSeo {
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  keywords: string[];
}

export interface WhitelabelModules {
  billing: boolean;
  vncConsole: boolean;
  pterodactyl: boolean;
  proxmox: boolean;
  virtfusion: boolean;
  registrars: boolean;
}

export interface WhitelabelConfig {
  brand: WhitelabelBrand;
  theme: WhitelabelTheme;
  navigation: WhitelabelNavigationItem[];
  contact: WhitelabelContact;
  seo: WhitelabelSeo;
  modules: WhitelabelModules;
  /** Arbitrary integration module flags consumed by the app repo. */
  integrations: Record<string, boolean>;
}

export const DEFAULT_WHITELABEL: WhitelabelConfig = {
  brand: {
    name: "Aetheris",
    tagline: "Billing and virtualization control panel for the enterprise",
    logoUrl: "/icon.svg",
    logoDarkUrl: "/icon.svg",
    domain: "aetheris-web.vercel.app"
  },
  theme: {
    accent: "emerald",
    radius: 10,
    fontFamily: ""
  },
  navigation: [
    { label: "Product", href: "#product", cta: false },
    { label: "Live Demo", href: "/demo", cta: false },
    { label: "Store", href: "/store", cta: false },
    { label: "Integrations", href: "#integrations", cta: false },
    { label: "Contact", href: "#contact", cta: false },
    { label: "Documentation", href: "https://aetheris-docs.vercel.app", cta: false },
    { label: "Open Console", href: "https://aetheris-panel.vercel.app", cta: true }
  ],
  contact: {
    email: "hello@another-horizon.eu",
    supportUrl: "https://aetheris-docs.vercel.app/en/wiki/troubleshooting",
    twitterUrl: "https://x.com/aetheris"
  },
  seo: {
    defaultTitle: "Aetheris - Billing and Virtualization Control Panel",
    defaultDescription:
      "Aetheris unifies WHMCS, FOSSBilling, Pterodactyl, Proxmox VE and VirtFusion into a single enterprise billing and virtualization management platform.",
    ogImage: "/api/og",
    keywords: [
      "billing platform",
      "virtualization management",
      "pterodactyl panel",
      "proxmox ve",
      "whmcs alternative"
    ]
  },
  modules: {
    billing: true,
    vncConsole: true,
    pterodactyl: true,
    proxmox: true,
    virtfusion: true,
    registrars: true
  },
  integrations: {
    stripe: true,
    paypal: true,
    mollie: true,
    namecheap: true,
    cloudflare: true,
    cpanel: true,
    directadmin: true
  }
};
