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
    logo: `${SITE_URL}/logo.svg`,
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
    license: `${SITE_URL}/#license`,
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
    image: `${SITE_URL}/logo.svg`,
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
    ],
    license: `${SITE_URL}/#license`
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
    question: "Is there a hosted (SaaS) version of Aetheris?",
    answer:
      "No. Aetheris has no hosted solution: every deployment runs on your own infrastructure. You choose between a fully self-hosted install or a custom semi self-hosted proposal where we operate and maintain the platform while you keep control of your data and servers."
  },
  {
    question: "Is Aetheris self-hostable?",
    answer:
      "Yes. The aetheris-app repository ships a non-interactive installer for Ubuntu 22.04 LTS and Debian 12 with PostgreSQL 16, Redis 7, Nginx reverse proxy and Systemd worker units. Docker images are also provided for all operating systems, including Windows."
  },
  {
    question: "Can I donate to support the project?",
    answer:
      "Yes, donations are welcome. You can support the project with a PayPal donation at https://paypal.me/LeonardoGalliITA - every contribution helps keep the platform free and self-hosted."
  },
  {
    question: "What license is Aetheris released under?",
    answer:
      "Aetheris is released under the GNU Affero General Public License v3.0 (AGPL-3.0). You may use, study, modify and redistribute it for any purpose, provided that any distributed or network-served modified version keeps the license, preserves the copyright notice of the original author (Leonardo Galli / Leo-Galli) and releases its source code under AGPL-3.0."
  },
  {
    question: "Can I whitelabel Aetheris if the license requires attribution?",
    answer:
      "Yes. Whitelabeling is a built-in product feature that rebrands the interface of your own deployed instance, and is fully supported. The attribution requirement of AGPL-3.0 applies to redistributed copies and derivative works: if you share or serve a copy of the software over a network, the copyright notice of the original author (Leonardo Galli / Leo-Galli) must be kept and the source of the modified version must be made available."
  }
];
