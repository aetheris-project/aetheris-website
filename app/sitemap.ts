import type { MetadataRoute } from "next";
import { DEFAULT_WHITELABEL } from "@/lib/config/whitelabel";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aetheris.enterprise";

/**
 * Dynamic sitemap. Route entries are derived from the whitelabel navigation
 * plus the canonical static pages, so new marketing pages added through the
 * Admin Panel are picked up without a rebuild.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/demo", priority: 0.9, changeFrequency: "monthly" },
    { path: "/#product", priority: 0.8, changeFrequency: "monthly" },
    { path: "/#integrations", priority: 0.7, changeFrequency: "monthly" },
    { path: "/#pricing", priority: 0.7, changeFrequency: "monthly" }
  ];

  // Whitelabel navigation links pointing at same-origin paths.
  const navRoutes = DEFAULT_WHITELABEL.navigation
    .filter((item) => item.href.startsWith("/") && !item.href.startsWith("//"))
    .map((item) => ({ path: item.href, priority: 0.5, changeFrequency: "monthly" as const }));

  const routes = [...staticRoutes, ...navRoutes].filter(
    (route, index, all) => all.findIndex((candidate) => candidate.path === route.path) === index
  );

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "/" : route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
