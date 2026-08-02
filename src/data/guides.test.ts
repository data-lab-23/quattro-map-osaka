import assert from "node:assert/strict";
import test from "node:test";
import type { Shop } from "@/types/shop";
import { createGuides, getGuidesForShop, getShopsForGuide, type GuideDefinition } from "./guides";

const shop = (overrides: Partial<Shop>): Shop => ({
  id: "shop-id",
  slug: "shop-slug",
  name: "Test Shop",
  city: "osaka",
  ward: "北区",
  wardSlug: "kita",
  address: "大阪市北区1-1",
  verificationStatus: "needs_confirmation",
  honeyStatus: "unknown",
  description: "Test description",
  published: true,
  ...overrides,
});

test("guide matching includes published shops only", () => {
  const guide: GuideDefinition = {
    slug: "lunch",
    title: "ランチのクアトロフォルマッジ",
    description: "ランチ提供ありの掲載店です。",
    kind: "lunch",
  };

  const result = getShopsForGuide(guide, [
    shop({ id: "published", lunchAvailable: true }),
    shop({ id: "unpublished", published: false, lunchAvailable: true }),
    shop({ id: "dinner", lunchAvailable: false }),
  ]);

  assert.deepEqual(result.map(({ id }) => id), ["published"]);
});

test("station guides require two published exact station matches", () => {
  const guides = createGuides([
    shop({ id: "one", nearestStation: "大阪駅" }),
    shop({ id: "two", nearestStation: "大阪駅前" }),
    shop({ id: "three", nearestStation: "大阪駅", published: false }),
    shop({ id: "four", nearestStation: "梅田駅" }),
    shop({ id: "five", nearestStation: "梅田駅" }),
  ]);

  assert.equal(guides.some((guide) => guide.kind === "station" && guide.station === "大阪駅"), false);
  assert.equal(guides.some((guide) => guide.kind === "station" && guide.station === "梅田駅"), true);
});

test("generated guides are non-empty and station matching is exact", () => {
  const source = [
    shop({ id: "a", nearestStation: "梅田駅" }),
    shop({ id: "b", nearestStation: "梅田駅" }),
    shop({ id: "nearby", nearestStation: "梅田駅前" }),
  ];
  const stationGuide = createGuides(source).find((guide) => guide.kind === "station" && guide.station === "梅田駅");

  assert.ok(stationGuide);
  assert.deepEqual(getShopsForGuide(stationGuide, source).map(({ id }) => id), ["a", "b"]);
  assert.ok(createGuides(source).every((guide) => getShopsForGuide(guide, source).length > 0));
});

test("station guide slugs stay stable when an unrelated qualifying station is added", () => {
  const zetaStationShops = [
    shop({ id: "zeta-one", nearestStation: "Zeta Station" }),
    shop({ id: "zeta-two", nearestStation: "Zeta Station" }),
  ];
  const before = createGuides(zetaStationShops).find(
    (guide) => guide.kind === "station" && guide.station === "Zeta Station",
  );
  const after = createGuides([
    ...zetaStationShops,
    shop({ id: "alpha-one", nearestStation: "Alpha Station" }),
    shop({ id: "alpha-two", nearestStation: "Alpha Station" }),
  ]).find((guide) => guide.kind === "station" && guide.station === "Zeta Station");

  assert.ok(before);
  assert.ok(after);
  assert.equal(after.slug, before.slug);
  assert.match(after.slug, /^station-[A-Za-z0-9_-]+$/);
});

test("a shop exposes every applicable purpose and station guide", () => {
  const target = shop({
    id: "target",
    lunchAvailable: true,
    honeyStatus: "available",
    nearestStation: "梅田駅",
  });
  const guides = createGuides([target, shop({ id: "station-peer", nearestStation: "梅田駅" })]);

  assert.deepEqual(
    getGuidesForShop(target, guides).map(({ kind }) => kind),
    ["lunch", "honey", "station"],
  );
});
