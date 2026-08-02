import assert from "node:assert/strict";
import test from "node:test";
import { shops } from "@/data/shops";
import { createGuides } from "@/data/guides";
import { absoluteUrl } from "@/lib/seo";
import { buildSitemap, buildSitemapFromData, latestVerifiedDate } from "./sitemap";
import type { Shop } from "@/types/shop";

const shopFixture = (overrides: Partial<Shop>): Shop => ({
  id: "shop-id",
  slug: "shop-slug",
  name: "Test Shop",
  city: "osaka",
  ward: "Kita",
  wardSlug: "kita",
  address: "1 Test Street",
  verificationStatus: "verified_official",
  honeyStatus: "unknown",
  description: "Test description",
  published: true,
  ...overrides,
});

test("latestVerifiedDate returns the latest valid verification date", () => {
  const shops = [
    { lastVerifiedAt: "not-a-date" },
    { lastVerifiedAt: "2026-06-01" },
    { lastVerifiedAt: "2026-02-30" },
    { lastVerifiedAt: "2026-07-20" },
  ] as Shop[];

  assert.equal(latestVerifiedDate(shops).toISOString(), "2026-07-20T00:00:00.000Z");
});

test("latestVerifiedDate excludes impossible calendar dates", () => {
  const shops = [
    shopFixture({ slug: "impossible", lastVerifiedAt: "2026-02-30" }),
    shopFixture({ slug: "valid", lastVerifiedAt: "2026-03-01" }),
  ];

  assert.equal(latestVerifiedDate(shops).toISOString(), "2026-03-01T00:00:00.000Z");
});

test("buildSitemap emits unique current URLs without priority", () => {
  const sitemap = buildSitemap();
  const urls = sitemap.map((entry) => String(entry.url));

  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes(absoluteUrl("/about")));
  assert.ok(urls.includes(absoluteUrl("/submit")));
  assert.ok(urls.some((url) => url.includes("/shops/")));
  assert.ok(urls.some((url) => url.includes("/guides/")));
  assert.ok(sitemap.every((entry) => !("priority" in entry)));
});

test("buildSitemapFromData includes non-empty guide URLs with the shared latest date", () => {
  const sourceShops = [
    shopFixture({ slug: "lunch", lunchAvailable: true, lastVerifiedAt: "2026-06-01" }),
    shopFixture({ slug: "station-peer", nearestStation: "梅田駅", lastVerifiedAt: "2026-07-20" }),
    shopFixture({ slug: "station-target", nearestStation: "梅田駅", lastVerifiedAt: "2026-06-02" }),
  ];
  const sourceGuides = createGuides(sourceShops);
  const sitemap = buildSitemapFromData(sourceShops, [], sourceGuides);
  const guideEntry = sitemap.find((entry) => String(entry.url) === absoluteUrl("/guides/lunch"));

  assert.ok(guideEntry);
  assert.equal(new Date(guideEntry.lastModified!).toISOString(), "2026-07-20T00:00:00.000Z");
});

test("buildSitemap uses each published shop's verified date for its detail URL", () => {
  const sitemap = buildSitemap();

  for (const shop of shops.filter((shop) => shop.published)) {
    const entry = sitemap.find((candidate) => String(candidate.url) === absoluteUrl(`/shops/${shop.slug}`));

    assert.ok(entry, `missing sitemap entry for ${shop.slug}`);
    assert.equal(new Date(entry.lastModified!).toISOString(), new Date(shop.lastVerifiedAt!).toISOString());
  }
});

test("buildSitemapFromData excludes unpublished shops from URLs and shared dates", () => {
  const sitemap = buildSitemapFromData(
    [
      shopFixture({ slug: "published", lastVerifiedAt: "2026-07-20" }),
      shopFixture({ slug: "unpublished", published: false, lastVerifiedAt: "2026-12-01" }),
    ],
    [],
  );

  assert.equal(
    new Date(sitemap.find((entry) => String(entry.url) === absoluteUrl("/"))!.lastModified!).toISOString(),
    "2026-07-20T00:00:00.000Z",
  );
  assert.equal(sitemap.some((entry) => String(entry.url) === absoluteUrl("/shops/unpublished")), false);
});

test("buildSitemapFromData keeps each detail date separate from the shared latest date", () => {
  const sitemap = buildSitemapFromData(
    [
      shopFixture({ slug: "earlier", lastVerifiedAt: "2026-06-01" }),
      shopFixture({ slug: "latest", lastVerifiedAt: "2026-07-20" }),
    ],
    [],
  );

  assert.equal(
    new Date(sitemap.find((entry) => String(entry.url) === absoluteUrl("/"))!.lastModified!).toISOString(),
    "2026-07-20T00:00:00.000Z",
  );
  assert.equal(
    new Date(sitemap.find((entry) => String(entry.url) === absoluteUrl("/shops/earlier"))!.lastModified!).toISOString(),
    "2026-06-01T00:00:00.000Z",
  );
});

test("buildSitemapFromData omits invalid shop verification dates from detail entries", () => {
  const sitemap = buildSitemapFromData(
    [
      shopFixture({ slug: "invalid", lastVerifiedAt: "2026-02-30" }),
      shopFixture({ slug: "valid", lastVerifiedAt: "2026-07-20" }),
    ],
    [],
  );

  assert.equal(
    sitemap.find((entry) => String(entry.url) === absoluteUrl("/shops/invalid"))!.lastModified,
    undefined,
  );
});
