/**
 * Structured data builders (JSON-LD) for the marketing site.
 * Rendered as <script type="application/ld+json"> blocks in the page shell.
 */

import type { WhitelabelConfig } from "@/lib/config/whitelabel";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aetheris.enterprise";

export interface JsonLdNode {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export function organizationJsonLd(config: WhitelabelConfig): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.brand.name,
    url: SITE_URL,
    logo: `${SITE_URL}${config.brand.logoUrl}`,
    description: config.brand.tagline,
    email: config.contact.email,
    sameAs: [config.contact.twitterUrl, config.contact.supportUrl]
  };
}

export function productJsonLd(config: WhitelabelConfig): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${config.brand.name} Platform`,
    description: config.brand.tagline,
    brand: { "@type": "Brand", name: config.brand.name },
    category: "Billing and Virtualization Management Software",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      url: SITE_URL,
      priceCurrency: "USD",
      price: "0",
      availability: "https://schema.org/InStock"
    },
    aggregateRating: undefined
  };
}

export function softwareApplicationJsonLd(config: WhitelabelConfig): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.brand.name,
    operatingSystem: "Linux, macOS, Windows, Web",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Billing and Infrastructure Management",
    description: config.brand.tagline,
    url: SITE_URL,
    image: `${SITE_URL}${config.seo.ogImage}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      "Unified billing engine",
      "Pterodactyl Application and Client API driver",
      "Proxmox VE and VirtFusion hypervisor drivers",
      "Client VNC console",
      "Dynamic whitelabeling",
      "Stripe, PayPal and Mollie payment orchestration"
    ]
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqJsonLd(faqs: FaqItem[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What does Aetheris replace?",
    answer:
      "Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and VirtFusion into one control plane: one billing engine, one client portal, and one set of hypervisor drivers."
  },
  {
    question: "Which hypervisors and panels does Aetheris integrate with natively?",
    answer:
      "Aetheris ships production drivers for Pterodactyl (Application and Client API), Proxmox VE API v2, VirtFusion REST, cPanel/WHM and DirectAdmin, plus Cloudflare for DNS."
  },
  {
    question: "Can I rebrand Aetheris without touching code?",
    answer:
      "Yes. Platform name, logos, theme variables, navigation, email templates, custom domains and integration modules are all configurable from the Admin Panel and persisted in PostgreSQL with a Redis cache."
  },
  {
    question: "Is Aetheris self-hostable?",
    answer:
      "Yes. The aetheris-app repository ships a non-interactive installer for Ubuntu 22.04 LTS and Debian 12 with PostgreSQL 16, Redis 7, Nginx reverse proxy and Systemd worker units."
  }
];
