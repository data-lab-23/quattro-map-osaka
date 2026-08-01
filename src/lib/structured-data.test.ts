import assert from "node:assert/strict";
import test from "node:test";
import { shops } from "@/data/shops";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildRestaurantJsonLd,
} from "./structured-data";

test("restaurant JSON-LD omits Google aggregate ratings and reviews", () => {
  const jsonLd = buildRestaurantJsonLd({
    ...shops[0],
    googleRating: 4.5,
    googleReviewCount: 120,
  });

  assert.equal("aggregateRating" in jsonLd, false);
  assert.equal("review" in jsonLd, false);
  assert.equal(jsonLd.name, shops[0].name);
  assert.equal(jsonLd.address.streetAddress, shops[0].address);
});

test("restaurant JSON-LD omits cuisine and coordinates that the shop page does not render", () => {
  const jsonLd = buildRestaurantJsonLd({
    ...shops[0],
    latitude: 34.7,
    longitude: 135.5,
  });

  assert.equal("servesCuisine" in jsonLd, false);
  assert.equal("geo" in jsonLd, false);
});

test("breadcrumb JSON-LD uses consecutive positions and absolute URLs", () => {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Quattro Map Osaka", path: "/" },
    { name: "Kita Ward", path: "/osaka/kita" },
  ]);

  assert.deepEqual(
    jsonLd.itemListElement.map((item) => item.position),
    [1, 2],
  );
  assert.match(jsonLd.itemListElement[1].item, /^https:\/\//);
});

test("item list JSON-LD excludes unpublished shops", () => {
  const jsonLd = buildItemListJsonLd({
    name: "Published shops",
    shops: [shops[0], { ...shops[1], published: false }],
  });

  assert.equal(jsonLd.numberOfItems, 1);
  assert.deepEqual(jsonLd.itemListElement.map((item) => item.name), [shops[0].name]);
});
