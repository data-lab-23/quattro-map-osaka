import type { MetadataRoute } from "next";
import { shops } from "@/data/shops";
import { wards } from "@/data/wards";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const lastModified = new Date("2026-07-11T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/submit"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const wardRoutes: MetadataRoute.Sitemap = wards.map((ward) => ({
    url: absoluteUrl(`/osaka/${ward.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const shopRoutes: MetadataRoute.Sitemap = shops
    .filter((shop) => shop.published)
    .map((shop) => ({
      url: absoluteUrl(`/shops/${shop.slug}`),
      lastModified: shop.lastVerifiedAt ? new Date(shop.lastVerifiedAt) : lastModified,
      changeFrequency: "monthly",
      priority: shop.verificationStatus.startsWith("verified") ? 0.85 : 0.7,
    }));

  return [...staticRoutes, ...wardRoutes, ...shopRoutes];
}
