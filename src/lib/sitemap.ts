import type { MetadataRoute } from "next";
import { shops } from "@/data/shops";
import { wards } from "@/data/wards";
import { absoluteUrl } from "@/lib/seo";
import type { Shop } from "@/types/shop";

function verifiedDate(lastVerifiedAt: string | undefined): Date | undefined {
  const match = lastVerifiedAt?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? date
    : undefined;
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

export function buildSitemapFromData(
  sourceShops: Shop[],
  sourceWards: ReadonlyArray<{ slug: string }>,
): MetadataRoute.Sitemap {
  const publishedShops = sourceShops.filter((shop) => shop.published);
  const sharedLastModified = latestVerifiedDate(publishedShops);
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: sharedLastModified, changeFrequency: "weekly" },
    { url: absoluteUrl("/about"), lastModified: sharedLastModified, changeFrequency: "monthly" },
    { url: absoluteUrl("/privacy"), lastModified: sharedLastModified, changeFrequency: "yearly" },
    { url: absoluteUrl("/submit"), lastModified: sharedLastModified, changeFrequency: "monthly" },
    ...sourceWards.map((ward) => ({
      url: absoluteUrl(`/osaka/${ward.slug}`),
      lastModified: sharedLastModified,
      changeFrequency: "weekly" as const,
    })),
    ...publishedShops.map((shop) => ({
      url: absoluteUrl(`/shops/${shop.slug}`),
      lastModified: verifiedDate(shop.lastVerifiedAt),
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

export function buildSitemap(): MetadataRoute.Sitemap {
  return buildSitemapFromData(shops, wards);
}
