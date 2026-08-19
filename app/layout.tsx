import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { WhitelabelProvider } from "@/lib/theme/WhitelabelProvider";
import { DEFAULT_WHITELABEL } from "@/lib/config/whitelabel";
import {
  faqJsonLd,
  organizationJsonLd,
  productJsonLd,
  softwareApplicationJsonLd,
  FAQ_ITEMS
} from "@/lib/seo/jsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aetheris.enterprise";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_WHITELABEL.seo.defaultTitle,
    template: "%s | Aetheris"
  },
  description: DEFAULT_WHITELABEL.seo.defaultDescription,
  keywords: DEFAULT_WHITELABEL.seo.keywords,
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.ico",
    apple: "/app-icon.png",
    other: {
      rel: "icon",
      type: "image/png",
      url: "/icon.png"
    }
  },
  openGraph: {
    type: "website",
    siteName: DEFAULT_WHITELABEL.brand.name,
    title: DEFAULT_WHITELABEL.seo.defaultTitle,
    description: DEFAULT_WHITELABEL.seo.defaultDescription,
    url: SITE_URL,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: DEFAULT_WHITELABEL.brand.name }]
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_WHITELABEL.seo.defaultTitle,
    description: DEFAULT_WHITELABEL.seo.defaultDescription,
    images: ["/api/og"]
  }
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <WhitelabelProvider>
          {children}
          <JsonLdScript data={organizationJsonLd(DEFAULT_WHITELABEL)} />
          <JsonLdScript data={productJsonLd(DEFAULT_WHITELABEL)} />
          <JsonLdScript data={softwareApplicationJsonLd(DEFAULT_WHITELABEL)} />
          <JsonLdScript data={faqJsonLd(FAQ_ITEMS)} />
        </WhitelabelProvider>
      </body>
    </html>
  );
}
