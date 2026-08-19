# Aetheris Website

Marketing site, interactive product demo, dynamic SEO and landing page for the
Aetheris billing and virtualization platform.

Production: https://aetheris-website-six.vercel.app

## Overview

Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and
VirtFusion into a single enterprise control plane. This repository serves the
public marketing surface of that platform:

- Interactive live demo where visitors can switch between the Client VNC
  Console, Admin Node Manager and Billing Engine, rendered with real React
  components driven by a mock data driver.
- Dynamic whitelabel theme provider: platform name, branding, accent color
  (emerald / indigo / amber) and navigation are configured at runtime without
  a rebuild.
- Full technical SEO: SSR rendering, dynamic `sitemap.ts`, `robots.ts`,
  OpenGraph image generation and JSON-LD structured data
  (`SoftwareApplication`, `Product`, `Organization`, `FAQPage`).

## Tech stack

- Next.js 14 (App Router), React 18, TypeScript (strict mode)
- Tailwind CSS with a CSS-variable accent system
- `@vercel/og` for dynamic OpenGraph images
- Deployed on Vercel

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
│   ├── InteractiveDemo.tsx   # Live preview frame (VNC / Nodes / Billing)
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
homepage at `/#demo`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap, robots and metadata | `https://aetheris.enterprise` |
| `NEXT_PUBLIC_WHITELABEL_URL` | Remote whitelabel config endpoint served by `aetheris-app` | unset (static JSON) |

Branding, navigation and accent defaults live in
`lib/config/whitelabel.json`. When `NEXT_PUBLIC_WHITELABEL_URL` is set, the
client merges the remote configuration over the static default at runtime.

## Production

```bash
npm run build
npm run start
```

The repository is linked to the `aetheris-website` project on Vercel; pushes to
`main` trigger production deployments automatically.

## Related repositories

- [aetheris-app](https://github.com/aetheris-project/aetheris-app) - billing
  core, admin control plane and hypervisor drivers
- [aetheris-docs](https://github.com/aetheris-project/aetheris-docs) - wiki,
  installation guides and API specifications

## License

Proprietary enterprise software. See the license agreement distributed with
the organization account.
