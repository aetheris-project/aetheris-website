import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { WhitelabelProvider } from "@/lib/theme/WhitelabelProvider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
    other: {
      rel: "icon",
      type: "image/svg+xml",
      url: "/icon.svg"
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
        {/* Apply the persisted theme before first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("aetheris-theme")||"dark";var r=t==="system"?((window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark"):t;document.documentElement.setAttribute("data-theme",r);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`
          }}
        />
        <WhitelabelProvider>
          <ThemeProvider>
            {children}
            <JsonLdScript data={organizationJsonLd(DEFAULT_WHITELABEL)} />
            <JsonLdScript data={productJsonLd(DEFAULT_WHITELABEL)} />
            <JsonLdScript data={softwareApplicationJsonLd(DEFAULT_WHITELABEL)} />
            <JsonLdScript data={faqJsonLd(FAQ_ITEMS)} />
          </ThemeProvider>
        </WhitelabelProvider>
      </body>
    </html>
  );
}
