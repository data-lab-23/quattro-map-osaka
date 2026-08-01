import assert from "node:assert/strict";
import test from "node:test";
import { shops } from "@/data/shops";
import { absoluteUrl } from "@/lib/seo";
import { buildSitemap, latestVerifiedDate } from "./sitemap";
import type { Shop } from "@/types/shop";

test("latestVerifiedDate returns the latest valid verification date", () => {
  const shops = [
    { lastVerifiedAt: "not-a-date" },
    { lastVerifiedAt: "2026-06-01" },
    { lastVerifiedAt: "2026-07-20" },
  ] as Shop[];

  assert.equal(latestVerifiedDate(shops).toISOString(), "2026-07-20T00:00:00.000Z");
});

test("buildSitemap emits unique current URLs without priority", () => {
  const sitemap = buildSitemap();
  const urls = sitemap.map((entry) => String(entry.url));

  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes(absoluteUrl("/about")));
  assert.ok(urls.includes(absoluteUrl("/submit")));
  assert.ok(urls.some((url) => url.includes("/shops/")));
  assert.ok(sitemap.every((entry) => !("priority" in entry)));
});

test("buildSitemap uses each published shop's verified date for its detail URL", () => {
  const sitemap = buildSitemap();

  for (const shop of shops.filter((shop) => shop.published)) {
    const entry = sitemap.find((candidate) => String(candidate.url) === absoluteUrl(`/shops/${shop.slug}`));

    assert.ok(entry, `missing sitemap entry for ${shop.slug}`);
    assert.equal(new Date(entry.lastModified!).toISOString(), new Date(shop.lastVerifiedAt!).toISOString());
  }
});
