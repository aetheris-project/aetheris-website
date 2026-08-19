<p align="center">
  <img src="assets/logo.svg" alt="Aetheris Enterprise Platform" width="420">
</p>

<h1 align="center">Aetheris Website</h1>

<p align="center">
  <strong>Marketing site, interactive product demo, dynamic SEO</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/SSR-SEO-green" alt="SSR + SEO">
</p>

---

Marketing site, interactive product demo, dynamic SEO and landing page for the
Aetheris billing and virtualization platform.

## Overview

Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and
VirtFusion into a single enterprise control plane. This repository serves the
public marketing surface of that platform:

- **Interactive live demo** organized like the real control plane: a Client
  area (VNC console, servers, billing) and an Admin area (nodes,
  provisioning, whitelabeling, API/SDK). Every panel is a real React
  component driven by a mock data driver that mirrors the production API
  contract.
- **Dynamic whitelabel theme provider**: platform name, branding, accent
  color (emerald / indigo / amber) and navigation are configured at runtime
  without a rebuild. Dark, light and system themes are persisted per visitor.
- **Full technical SEO**: SSR rendering, dynamic `sitemap.ts`, `robots.ts`,
  OpenGraph image generation and JSON-LD structured data
  (`SoftwareApplication`, `Product`, `Organization`, `FAQPage`).

## Demo panels

| Panel | Area | What it shows |
| --- | --- | --- |
| VNC Console | Client | In-browser console with live boot log, power controls, clipboard |
| My Servers | Client | Portal: power control, resource gauges, backups, plan summary |
| Billing Engine | Client | MRR chart, revenue by plan, invoices with pay, payment method |
| Node Manager | Admin | Nodes across regions, telemetry gauges, drain/undrain, workloads |
| Provisioning | Admin | Template / node / plan wizard with animated deploy stages |
| Whitelabel | Admin | Branding editor with live preview, accent, module toggles |
| API & SDK | Admin | API key rotation, cURL example, SDKs, endpoint reference |

## Tech stack

- Next.js 14 (App Router), React 18, TypeScript (strict mode)
- Tailwind CSS with a CSS-variable accent system
- `@vercel/og` for dynamic OpenGraph images

## Repository layout

```text
aetheris-website/
├── app/
│   ├── layout.tsx            # Root layout: fonts, whitelabel provider, JSON-LD
│   ├── page.tsx              # Landing page with interactive demo
│   ├── sitemap.ts            # Dynamic sitemap from whitelabel navigation
│   ├── robots.ts
│   ├── api/og/route.tsx      # Dynamic OpenGraph image (edge runtime)
│   └── globals.css           # Design tokens and accent variables
├── components/website/
│   ├── InteractiveDemo.tsx   # Live preview frame (7 panels)
│   ├── SiteHeader.tsx
│   ├── Footer.tsx
│   └── demo/                 # Mock driver, datasets and demo panels
├── lib/
│   ├── config/               # Whitelabel schema and static defaults
│   ├── theme/                # WhitelabelProvider (accent injection)
│   ├── seo/                  # JSON-LD structured data builders
│   └── utils/
├── vercel.json               # Security headers and caching
└── package.json
```

## Local development

```bash
npm install
npm run dev
```

The site is available at http://localhost:3000. The interactive demo is on the
homepage at `/#demo` and in full-screen mode at `/demo`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap, robots and metadata | `https://aetheris.enterprise` |
| `NEXT_PUBLIC_WHITELABEL_URL` | Remote whitelabel config endpoint served by `aetheris-app` | unset (static JSON) |

Branding, navigation and accent defaults live in
`lib/config/whitelabel.json`. When `NEXT_PUBLIC_WHITELABEL_URL` is set, the
client merges the remote configuration over the static default at runtime.

## Related repositories

- [aetheris-app](https://github.com/aetheris-project/aetheris-app) - billing
  core, admin control plane and hypervisor drivers
- [aetheris-docs](https://github.com/aetheris-project/aetheris-docs) - wiki,
  installation guides and API specifications

## License

Proprietary enterprise software. See the license agreement distributed with
the organization account.
