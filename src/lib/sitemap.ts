import type { MetadataRoute } from "next";
import { shops } from "@/data/shops";
import { wards } from "@/data/wards";
import { absoluteUrl } from "@/lib/seo";
import type { Shop } from "@/types/shop";

function verifiedDate(lastVerifiedAt: string | undefined): Date | undefined {
  if (!lastVerifiedAt) return undefined;

  const date = new Date(lastVerifiedAt);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

export function latestVerifiedDate(shops: Shop[]): Date {
  const dates = shops
    .map((shop) => verifiedDate(shop.lastVerifiedAt))
    .filter((date): date is Date => Boolean(date));

  if (dates.length === 0) {
    throw new Error("At least one published shop must have a valid lastVerifiedAt date");
  }

  return new Date(Math.max(...dates.map((date) => date.valueOf())));
}

export function buildSitemap(): MetadataRoute.Sitemap {
  const publishedShops = shops.filter((shop) => shop.published);
  const sharedLastModified = latestVerifiedDate(publishedShops);
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: sharedLastModified, changeFrequency: "weekly" },
    { url: absoluteUrl("/about"), lastModified: sharedLastModified, changeFrequency: "monthly" },
    { url: absoluteUrl("/privacy"), lastModified: sharedLastModified, changeFrequency: "yearly" },
    { url: absoluteUrl("/submit"), lastModified: sharedLastModified, changeFrequency: "monthly" },
    ...wards.map((ward) => ({
      url: absoluteUrl(`/osaka/${ward.slug}`),
      lastModified: sharedLastModified,
      changeFrequency: "weekly" as const,
    })),
    ...publishedShops.map((shop) => ({
      url: absoluteUrl(`/shops/${shop.slug}`),
      lastModified: verifiedDate(shop.lastVerifiedAt) ?? sharedLastModified,
      changeFrequency: "monthly" as const,
    })),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    const url = String(entry.url);
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
