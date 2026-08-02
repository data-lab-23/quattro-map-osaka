import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, buildPageMetadata, siteUrl } from "./seo";

test("既定の本番URLは現在のGitHub Pages所有者を使う", () => {
  assert.equal(siteUrl, "https://data-lab-23.github.io/quattro-map-osaka");
});

test("ホームページを一貫したタイトルとcanonicalへ導く", () => {
  const metadata = buildPageMetadata({
    title: "大阪のクアトロフォルマッジを探す",
    description:
      "大阪市内のクアトロフォルマッジ提供店を地域・評価・口コミ・アクセスから比較できます。",
    path: "/",
    absoluteTitle: true,
  });

  assert.deepEqual(metadata.title, { absolute: "大阪のクアトロフォルマッジを探す" });
  assert.deepEqual(metadata.alternates, { canonical: "/" });
  assert.equal(metadata.openGraph?.url, absoluteUrl("/"));
});

test("サブページのcanonicalとOG画像は絶対URLになる", () => {
  const metadata = buildPageMetadata({
    title: "大阪市北区のクアトロフォルマッジ",
    description: "大阪市北区の候補店の詳細を比較します。",
    path: "/osaka/kita",
  });

  assert.deepEqual(metadata.alternates, { canonical: "/osaka/kita" });
  assert.equal(metadata.openGraph?.url, absoluteUrl("/osaka/kita"));
});
