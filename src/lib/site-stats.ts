import type { Shop } from "@/types/shop";

export type SiteStats = {
  publishedCount: number;
  verifiedCount: number;
  latestVerifiedAt: string;
};

const verifiedStatuses = new Set(["verified_official", "verified_review"]);

function isValidDate(value: string | undefined): value is string {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function getSiteStats(shops: Shop[]): SiteStats {
  const publishedShops = shops.filter((shop) => shop.published);
  const validDates = publishedShops
    .map((shop) => shop.lastVerifiedAt)
    .filter(isValidDate);

  return {
    publishedCount: publishedShops.length,
    verifiedCount: publishedShops.filter((shop) => verifiedStatuses.has(shop.verificationStatus)).length,
    latestVerifiedAt: validDates.sort().at(-1) ?? "",
  };
}
