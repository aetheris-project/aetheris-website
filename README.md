<p align="center">
  <img src="assets/logo.svg" alt="Aetheris Website" width="420" style="filter: drop-shadow(0 8px 32px rgba(16,185,129,0.25))">
</p>

<h1 align="center">Aetheris Website</h1>

<p align="center">
  <strong>Marketing site · Interactive 7-panel product demo · Dynamic SEO</strong>
</p>

<p align="center">
  <a href="https://aetheris-web.vercel.app"><img src="https://img.shields.io/badge/Live%20Site-aetheris--web.vercel.app-059669?style=for-the-badge&logo=vercel&logoColor=white" alt="Live site"></a>
  <a href="https://aetheris-web.vercel.app/demo"><img src="https://img.shields.io/badge/Demo-Interactive%20Preview-F59E0B?style=for-the-badge&logo=react&logoColor=white" alt="Interactive demo"></a>
  <a href="https://aetheris-web.vercel.app/store"><img src="https://img.shields.io/badge/Store-Addons-8B5CF6?style=for-the-badge&logo=shopify" alt="Addon store"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/SSR-SEO%20Ready-10B981?style=flat-square" alt="SSR SEO">
  <img src="https://img.shields.io/badge/Language-12%20langs-10B981?style=flat-square" alt="Languages">
</p>

---

<br>

> Marketing surface and interactive product showcase for the Aetheris
> enterprise billing & virtualization platform.
>
> A 7-panel live interactive **control-panel demo** that mirrors the real
> admin/client UI, powered by real React components running against a mock
> driver that conforms to the production contract. Plus a dynamic
> whitelabel theme provider, full technical SEO stack, a cross-platform
> download section with OS tabs and a contact form.

<br>

## ✨ Features

### 🔬 Interactive 7-Panel Demo

| Panel | Area | What it demonstrates |
|---|---|---|
| 🖥️ **VNC Console** | Client | In-browser console with live boot log, power controls, clipboard passthrough |
| 📡 **My Servers** | Client | Portal-style: power control, live resource gauges, backups, plan summary |
| 💰 **Billing Engine** | Client | MRR chart, revenue per plan, invoice viewer, payment method management |
| 🧭 **Node Manager** | Admin | Multi-region nodes, telemetry gauges, drain/undrain, workload list |
| ⚙️ **Provisioning** | Admin | Template / node / plan wizard with animated deploy stages |
| 💠 **Whitelabel** | Admin | Live branding editor — name, logos, accent color (emerald/indigo/amber), module toggles |
| 🧩 **API & SDK** | Admin | API key rotation UI · cURL example · SDK references · endpoint list |

All panels are real React components typed to the same interfaces the
production drivers use.

### 🎨 Design System

- **Token-driven dark/light/system themes** with runtime accent switching
  (Emerald · Indigo · Amber)
- **Zero layout shifts** — fixed dimensions everywhere, skeleton
  placeholders with matching dimensions, aspect-reserved preview frames
- **Film-grain texture + dual-orb ambient lighting** — premium enterprise feel
- **Staggered card entrance animations + shimmering gradient borders**
- **Glassmorphism header** with 20px backdrop blur
- **12-language live translator** integrated in the navbar

### 🧠 Technical SEO

- Server-Side Rendered **App Router**
- Dynamic `sitemap.ts` + `robots.ts`
- **`@vercel/og`-generated OpenGraph images** per-route
- Full **JSON-LD structured data**: `SoftwareApplication`, `Product`,
  `Organization`, `FAQPage`
- Canonical URLs, OG cards, Twitter summary cards

<br>

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
# Interactive demo at /#demo
# Full-screen demo at /demo
```

Production build:
```bash
npm run build && npm run start
```

The repository is linked to the `aetheris-website` project on Vercel;
pushes to `main` trigger production deployments automatically.

### Configuration

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO | `https://aetheris.enterprise` |
| `NEXT_PUBLIC_WHITELABEL_URL` | Remote whitelabel config (optional) | unset → static JSON |

Branding, navigation and accent defaults live in
[lib/config/whitelabel.json](lib/config/whitelabel.json).

<br>

## 📦 Repository Layout

```text
aetheris-website/
├── app/
│   ├── layout.tsx              # Root layout — Inter font, whitelabel, JSON-LD
│   ├── page.tsx                # Landing page with interactive demo + OS download tabs
│   ├── demo/page.tsx           # Full-screen standalone demo
│   ├── store/page.tsx          # Addon / integration store
│   ├── discord/page.tsx        # Discord redirect
│   ├── globals.css             # Design tokens + accent variables (full Aetheris UI system)
│   ├── sitemap.ts / robots.ts  # Dynamic SEO
│   └── api/
│       ├── contact/route.ts    # Contact form handler
│       └── og/route.tsx        # Dynamic OpenGraph image (@vercel/og, edge runtime)
├── components/website/
│   ├── InteractiveDemo.tsx     # 7-panel live preview frame
│   ├── SiteHeader.tsx          # Glass nav + translator + theme toggle
│   ├── Footer.tsx              # 5-column footer with brand info
│   ├── ThemeToggle.tsx
│   ├── ContactForm.tsx
│   └── demo/                   # Mock driver, typed datasets, 7 React panel components
├── lib/
│   ├── config/whitelabel.{json,ts}   # Brand schema + static defaults
│   ├── theme/WhitelabelProvider.tsx  # Runtime accent injection
│   ├── theme/ThemeProvider.tsx       # Dark/Light/System persistence
│   ├── seo/jsonLd.ts                 # Structured data builders
│   └── utils/cn.ts
├── public/icon.svg · logo.svg · og-image.svg
├── vercel.json                 # Security headers + caching rules
└── package.json / tsconfig.json
```

---

<p align="center">
  <strong>Made with 💚 by <a href="https://github.com/Leo-Galli">Leonardo Galli</a></strong>
</p>

<p align="center">
  <a href="https://github.com/aetheris-project/aetheris-app">App</a>
  ·
  <a href="https://github.com/aetheris-project/aetheris-docs">Docs</a>
  ·
  <a href="https://github.com/aetheris-project/aetheris-installer">Installer</a>
  ·
  <a href="https://discord.gg/6GcfebuT2A">Discord</a>
  ·
  <a href="https://paypal.me/LeonardoGalliITA">Donate</a>
</p>

## 📄 License

Licensed under **GNU Affero General Public License v3.0 (AGPL-3.0)**.
See [LICENSE.md](LICENSE.md).
