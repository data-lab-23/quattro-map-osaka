import assert from "node:assert/strict";
import test from "node:test";
import { getSiteStats } from "./site-stats";
import type { Shop } from "@/types/shop";

const shopFixture = (overrides: Partial<Shop>): Shop => ({
  id: "shop-id",
  slug: "shop-slug",
  name: "Test Shop",
  city: "osaka",
  ward: "Kita",
  wardSlug: "kita",
  address: "1 Test Street",
  verificationStatus: "needs_confirmation",
  honeyStatus: "unknown",
  description: "Test description",
  published: true,
  ...overrides,
});

test("returns published, verified, and latest verification counts from published shops", () => {
  const shops = [
    shopFixture({ verificationStatus: "verified_official", lastVerifiedAt: "2026-07-20" }),
    shopFixture({ slug: "needs-confirmation", lastVerifiedAt: "2026-07-01" }),
    shopFixture({ slug: "reviewed", published: false, verificationStatus: "verified_review", lastVerifiedAt: "2026-07-25" }),
  ];

  assert.deepEqual(getSiteStats(shops), {
    publishedCount: 2,
    verifiedCount: 1,
    latestVerifiedAt: "2026-07-20",
  });
});

test("counts both verified statuses and excludes all other statuses", () => {
  const shops = [
    shopFixture({ verificationStatus: "verified_official" }),
    shopFixture({ slug: "reviewed", verificationStatus: "verified_review" }),
    shopFixture({ slug: "needs-confirmation", verificationStatus: "needs_confirmation" }),
    shopFixture({ slug: "discontinued", verificationStatus: "possibly_discontinued" }),
  ];

  assert.equal(getSiteStats(shops).verifiedCount, 2);
});

test("uses only strict calendar dates from published shops and falls back to an empty date", () => {
  const shopsWithValidDate = [
    shopFixture({ lastVerifiedAt: "2026-02-30" }),
    shopFixture({ slug: "leap-day", lastVerifiedAt: "2024-02-29" }),
    shopFixture({ slug: "unpublished-later", published: false, lastVerifiedAt: "2026-12-01" }),
  ];
  const shopsWithoutValidDates = [
    shopFixture({ lastVerifiedAt: "2026-02-30" }),
    shopFixture({ slug: "wrong-format", lastVerifiedAt: "2026/07/20" }),
    shopFixture({ slug: "unpublished-valid", published: false, lastVerifiedAt: "2026-07-20" }),
  ];

  assert.equal(getSiteStats(shopsWithValidDate).latestVerifiedAt, "2024-02-29");
  assert.equal(getSiteStats(shopsWithoutValidDates).latestVerifiedAt, "");
});
