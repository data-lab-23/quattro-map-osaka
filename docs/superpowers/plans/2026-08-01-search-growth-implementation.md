# クアトロマップ大阪 検索成長施策 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 「クアトロフォルマッジ 大阪」「大阪 クアトロフォルマッジ」で検索する利用者に、公開状態が安定し、独自の確認情報が明確で、Googleが理解しやすい専門サイトを提供する。

**Architecture:** GitHub上の正本を新しい作業ディレクトリへ取得し、SEOメタデータ、構造化データ、サイトマップ、サイト統計を純粋関数へ分離して単体テストする。ページ層はそれらを利用し、トップ・区・ガイド・店舗・運営情報を相互リンクする。静的出力を自動監査してからGitHub Pagesへ公開し、公開URLとSearch Consoleで確認する。

**Tech Stack:** Next.js 16、React 19、TypeScript 5、Node.js 20/24、`node:test`、GitHub Actions、GitHub Pages、Google Search Console、GA4。

## Global Constraints

- OneDrive原本 `C:\Users\arsen\OneDrive\デスクトップ\javascript-study\quattro-map-osaka` は変更しない。
- 正常なGitHub正本を新規取得し、現在の不完全な`.git`を修復・上書きしない。
- 主要検索語は「クアトロフォルマッジ 大阪」「大阪 クアトロフォルマッジ」。
- 未訪問店舗について実食したような表現、独自撮影ではない画像の独自写真表記、根拠のない順位付けを作らない。
- Google Mapsの評価を自サイトが収集した`aggregateRating`として構造化しない。
- 画面に表示されない情報をJSON-LDだけに追加しない。
- 店舗が2件未満または固有価値を説明できない新規分類ページをindex対象として生成しない。
- 静的出力`output: "export"`とGitHub Pagesの`/quattro-map-osaka`ベースパスを維持する。
- 公開前にテスト、lint、型検査、本番build、静的SEO監査をすべて成功させる。

---

### Task 1: GitHub正本と公開障害の基準状態を確立する

**Files:**
- Create in clean clone: `docs/superpowers/specs/2026-08-01-search-growth-design.md`
- Create in clean clone: `docs/superpowers/plans/2026-08-01-search-growth-implementation.md`
- Inspect: `.github/workflows/deploy-pages.yml`
- Inspect: `next.config.ts`

**Interfaces:**
- Consumes: remote `https://github.com/arsenal23vm-netizen/quattro-map-osaka.git` and the approved design/plan documents.
- Produces: a clean named branch `codex/seo-search-growth` with a known baseline test result and reproducible Pages failure evidence.

- [ ] **Step 1: Verify remote access without changing local files**

```powershell
& $git ls-remote https://github.com/arsenal23vm-netizen/quattro-map-osaka.git HEAD refs/heads/main
```

Expected: two refs or one `HEAD` ref with a 40-character commit ID. If authentication is required, inspect the repository through the connected GitHub app before requesting additional credentials.

- [ ] **Step 2: Clone into a new isolated directory and branch**

```powershell
& $git clone https://github.com/arsenal23vm-netizen/quattro-map-osaka.git work/quattro-map-osaka-seo
& $git -C work/quattro-map-osaka-seo switch -c codex/seo-search-growth
```

Expected: the destination did not exist before cloning and the current branch is `codex/seo-search-growth`.

- [ ] **Step 3: Copy only the approved spec and plan into the clean clone**

Copy the two exact Markdown files from the current safe copy. Do not copy `.git`, `node_modules`, `.next*`, `out`, logs, or OneDrive-generated metadata.

- [ ] **Step 4: Restore dependencies and run the baseline checks**

```powershell
if (Get-Command npm -ErrorAction SilentlyContinue) {
  npm ci
  npm run lint
  npm run build
} else {
  pnpm import
  pnpm install --frozen-lockfile --config.dangerouslyAllowAllBuilds=true
  pnpm run lint
  pnpm run build
}
```

Expected: the clean GitHub remote has no `test` script or committed test files, so do not import tests from OneDrive in Task 1. Record that absence, then use lint and the static build as this revision's existing baseline checks. ESLint exits 0 and the static build creates `out/`. Later tasks create the SEO tests.

- [ ] **Step 5: Record the public failure**

```powershell
Invoke-WebRequest https://arsenal23vm-netizen.github.io/quattro-map-osaka/ -UseBasicParsing
```

Expected before repair: HTTP 404. Save the HTTP status and UTC timestamp in `docs/seo-baseline.md` together with the baseline page/test counts.

If the local PowerShell request fails because this machine cannot acquire Schannel credentials, use the in-app `web.run` tool with `open: [{ ref_id: "https://arsenal23vm-netizen.github.io/quattro-map-osaka/" }]`. Record the tool input and its captured `(404) Not Found` response in `docs/seo-baseline.md`; do not describe it as an unspecified alternate fetch.

- [ ] **Step 6: Commit the clean baseline documentation**

```powershell
git add docs/superpowers docs/seo-baseline.md
git commit -m "docs: define search growth baseline"
```

---

### Task 2: SEOメタデータ生成を純粋関数化する

**Files:**
- Create: `src/lib/seo.test.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `siteName`, `siteDescription`, `siteUrl`, `ogImagePath`.
- Produces: `buildPageMetadata(input: PageMetadataInput): Metadata` and `absoluteUrl(path?: string): string`.

- [ ] **Step 1: Write failing metadata tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, buildPageMetadata } from "./seo";

test("主要語を自然なタイトルとcanonicalへ反映する", () => {
  const metadata = buildPageMetadata({
    title: "大阪のクアトロフォルマッジを探す",
    description: "大阪市内の提供店を確認日・価格・はちみつ・アクセスから比較できます。",
    path: "/",
  });
  assert.equal(metadata.title, "大阪のクアトロフォルマッジを探す");
  assert.deepEqual(metadata.alternates, { canonical: "/" });
  assert.equal(metadata.openGraph?.url, absoluteUrl("/"));
});

test("サブページのcanonicalとOG画像は絶対URLになる", () => {
  const metadata = buildPageMetadata({
    title: "大阪市北区のクアトロフォルマッジ",
    description: "大阪市北区の掲載店を比較します。",
    path: "/osaka/kita",
  });
  assert.deepEqual(metadata.alternates, { canonical: "/osaka/kita" });
  assert.equal(metadata.openGraph?.url, absoluteUrl("/osaka/kita"));
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

```powershell
npx tsx --test src/lib/seo.test.ts
```

Expected: FAIL because `buildPageMetadata` is not exported.

- [ ] **Step 3: Implement the metadata interface**

```ts
import type { Metadata } from "next";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  imagePath = ogImagePath,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName,
      title,
      description,
      url: absoluteUrl(path),
      images: [{ url: absoluteUrl(imagePath), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(imagePath)],
    },
  };
}
```

Set the home metadata title to `大阪のクアトロフォルマッジを探す` and retain the root layout’s Search Console verification, robots directives, and metadata base.

- [ ] **Step 4: Run focused and full checks**

```powershell
npx tsx --test src/lib/seo.test.ts
npm test
npm run lint
```

Expected: both new metadata tests and all existing tests pass; ESLint exits 0.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/seo.ts src/lib/seo.test.ts src/app/layout.tsx src/app/page.tsx
git commit -m "feat: centralize search metadata"
```

---

### Task 3: 構造化データを画面表示と一致させる

**Files:**
- Create: `src/lib/structured-data.ts`
- Create: `src/lib/structured-data.test.ts`
- Modify: `src/app/shops/[slug]/page.tsx`
- Modify: `src/app/osaka/[wardSlug]/page.tsx`

**Interfaces:**
- Consumes: `Shop`, ward name/slug, `absoluteUrl`.
- Produces: `buildRestaurantJsonLd(shop: Shop)`, `buildBreadcrumbJsonLd(items: BreadcrumbItem[])`, and `buildItemListJsonLd(input: ItemListInput)`.

> **Baseline constraint:** The remote baseline does not contain `src/app/guides/[guideSlug]/page.tsx` or `src/data/guides.ts`. Guide JSON-LD integration is therefore deferred to Task 6, which must create those route and data files (or an architecture-consistent equivalent) with tests and verification.

- [ ] **Step 1: Write failing structured-data tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { shops } from "@/data/shops";
import { buildBreadcrumbJsonLd, buildRestaurantJsonLd } from "./structured-data";

test("外部Google評価をaggregateRatingとして出力しない", () => {
  const jsonLd = buildRestaurantJsonLd({
    ...shops[0],
    googleRating: 4.5,
    googleReviewCount: 120,
  });
  assert.equal("aggregateRating" in jsonLd, false);
  assert.equal(jsonLd.name, shops[0].name);
  assert.equal(jsonLd.address.streetAddress, shops[0].address);
});

test("パンくずは連番と絶対URLを持つ", () => {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "クアトロマップ大阪", path: "/" },
    { name: "大阪市北区", path: "/osaka/kita" },
  ]);
  assert.deepEqual(jsonLd.itemListElement.map((item) => item.position), [1, 2]);
  assert.match(jsonLd.itemListElement[1].item, /^https:\/\//);
});
```

- [ ] **Step 2: Run and verify red state**

```powershell
npx tsx --test src/lib/structured-data.test.ts
```

Expected: FAIL because `structured-data.ts` does not exist.

- [ ] **Step 3: Implement the builders**

`buildRestaurantJsonLd` must emit only `@context`, `@type: "Restaurant"`, `@id`, `name`, page URL, image when shown, address, optional visible price range, and filtered visible `sameAs` links. It must not emit `aggregateRating`, `review`, cuisine, or coordinates. `buildBreadcrumbJsonLd` must convert `{name, path}` items to consecutive `ListItem` values. `buildItemListJsonLd` must expose only the passed published shops.

- [ ] **Step 4: Replace inline JSON-LD in the existing shop and ward page families**

Import the builders, preserve visible Google rating labels, and remove the inline `aggregateRating` block from the shop page. Add visible breadcrumb navigation matching each `BreadcrumbList`. Defer guide JSON-LD integration until Task 6 creates the missing guide route and data source.

- [ ] **Step 5: Run tests and lint**

```powershell
npx tsx --test src/lib/structured-data.test.ts
npm test
npm run lint
```

Expected: the new policy test proves `aggregateRating` is absent, all tests pass, and lint exits 0.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/structured-data.ts src/lib/structured-data.test.ts src/app/shops src/app/osaka
git commit -m "fix: align restaurant structured data with visible sources"
```

---

### Task 4: 更新日の正確なサイトマップを生成する

**Files:**
- Create: `src/lib/sitemap.ts`
- Create: `src/lib/sitemap.test.ts`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: published shops, wards, guides, and each shop’s `lastVerifiedAt`.
- Produces: `buildSitemap(): MetadataRoute.Sitemap` and `latestVerifiedDate(shops: Shop[]): Date`.

- [ ] **Step 1: Write failing sitemap tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { buildSitemap, latestVerifiedDate } from "./sitemap";
import type { Shop } from "@/types/shop";

test("最終確認日の最大値をサイト更新日として返す", () => {
  const shops = [
    { lastVerifiedAt: "2026-06-01" },
    { lastVerifiedAt: "2026-07-20" },
  ] as Shop[];
  assert.equal(latestVerifiedDate(shops).toISOString(), "2026-07-20T00:00:00.000Z");
});

test("サイトマップURLは重複せず店舗詳細を含む", () => {
  const sitemap = buildSitemap();
  const urls = sitemap.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.some((url) => url.includes("/shops/")));
  assert.ok(urls.some((url) => url.endsWith("/about")));
});
```

- [ ] **Step 2: Run and verify red state**

```powershell
npx tsx --test src/lib/sitemap.test.ts
```

Expected: FAIL because the pure sitemap module does not exist.

- [ ] **Step 3: Implement real-date sitemap generation**

Use the latest valid `lastVerifiedAt` for the home, ward, guide, about, submit, and partners pages. Use each shop’s own valid date for its detail page. Omit `priority` because it does not influence Google crawling; retain reasonable `changeFrequency` values for maintainability.

- [ ] **Step 4: Delegate the route to the pure builder**

```ts
import { buildSitemap } from "@/lib/sitemap";
export const dynamic = "force-static";
export default buildSitemap;
```

- [ ] **Step 5: Run tests**

```powershell
npx tsx --test src/lib/sitemap.test.ts
npm test
```

Expected: the latest-date and unique-URL assertions pass together with the full suite.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/sitemap.ts src/lib/sitemap.test.ts src/app/sitemap.ts
git commit -m "fix: generate sitemap from verified dates"
```

---

### Task 5: 運営者・調査方法・サイト統計を公開する

**Files:**
- Create: `src/lib/site-stats.ts`
- Create: `src/lib/site-stats.test.ts`
- Create: `src/app/about/page.tsx`
- Modify: `src/data/site.ts`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: published `Shop[]` and verification statuses.
- Produces: `getSiteStats(shops: Shop[]): SiteStats` with `publishedCount`, `verifiedCount`, and `latestVerifiedAt`.

- [ ] **Step 1: Write failing site-stat tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { getSiteStats } from "./site-stats";
import type { Shop } from "@/types/shop";

test("公開件数・確認済み件数・最新確認日を返す", () => {
  const shops = [
    { published: true, verificationStatus: "verified_official", lastVerifiedAt: "2026-07-20" },
    { published: true, verificationStatus: "needs_confirmation", lastVerifiedAt: "2026-07-01" },
    { published: false, verificationStatus: "verified_review", lastVerifiedAt: "2026-07-25" },
  ] as Shop[];
  assert.deepEqual(getSiteStats(shops), {
    publishedCount: 2,
    verifiedCount: 1,
    latestVerifiedAt: "2026-07-20",
  });
});
```

- [ ] **Step 2: Run and verify red state**

```powershell
npx tsx --test src/lib/site-stats.test.ts
```

Expected: FAIL because `site-stats.ts` does not exist.

- [ ] **Step 3: Implement site statistics**

Filter unpublished shops before all counts and date calculations. Count only `verified_official` and `verified_review` as verified. Return an empty string if no valid date exists.

- [ ] **Step 4: Create the trust page with final copy**

The page must contain these headings and factual statements:

```tsx
<h1>クアトロマップ大阪について</h1>
<h2>このサイトの目的</h2>
<p>大阪でクアトロフォルマッジを食べたい人が、提供店と確認状況を比較しやすくするための個人運営サイトです。</p>
<h2>掲載と確認の方法</h2>
<p>店舗公式サイト、公式メニュー、店舗公式SNS、Google Mapsの所在地情報を確認し、確認日と情報源を記録します。</p>
<h2>確認済みの定義</h2>
<p>「公式情報で確認」は店舗公式のメニュー等で提供を確認できた状態、「実食・投稿で確認」は管理人の訪問記録または提供を示す一次資料を確認できた状態です。</p>
<h2>外部評価の扱い</h2>
<p>Googleの評価と口コミ件数は出典を明示した参考情報です。クアトロマップ大阪が収集した評価ではありません。</p>
<h2>実食レビューとAI利用</h2>
<p>実食レビューは訪問日と内容が揃う場合だけ掲載します。整理や実装にAIを利用しても、未確認情報を実体験として生成しません。</p>
<h2>訂正・更新</h2>
<p>メニューや営業情報は変わるため、訪問前に店舗公式情報をご確認ください。訂正は掲載・修正依頼ページから受け付けます。</p>
```

Add metadata with title `運営者情報・掲載基準` and canonical `/about`.

- [ ] **Step 5: Add discoverable links and home statistics**

Add `{ href: "/about", label: "運営・掲載基準" }` to `navItems`, add an `/about` footer link, and display the three computed statistics near the home introduction. Do not claim that every published shop is confirmed.

- [ ] **Step 6: Run focused and full checks**

```powershell
npx tsx --test src/lib/site-stats.test.ts
npm test
npm run lint
npm run build
```

Expected: tests and lint pass; build output includes `/about` and the existing routes.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/site-stats.ts src/lib/site-stats.test.ts src/app/about src/data/site.ts src/components/site-header.tsx src/components/site-footer.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: publish editorial standards and site evidence"
```

---

### Task 6: 区・ガイド・店舗ページの内部リンクと固有説明を強化する

**Files:**
- Modify: `src/data/wards.ts`
- Create: `src/data/guides.ts`
- Create: `src/components/Breadcrumbs.tsx`
- Modify: `src/app/osaka/[wardSlug]/page.tsx`
- Create: `src/app/guides/[guideSlug]/page.tsx`
- Modify: `src/app/shops/[slug]/page.tsx`
- Modify: `src/app/globals.css`

**Baseline constraint:** The remote baseline lacks guide data and a guide route. This task must create `src/data/guides.ts` and `src/app/guides/[guideSlug]/page.tsx` (or an architecture-consistent equivalent), then verify their static output.

**Interfaces:**
- Consumes: enhanced ward/guide definitions and published shop relationships.
- Produces: crawlable breadcrumbs, related area/guide links, and user-focused selection notes.

- [ ] **Step 1: Extend ward data with explicit summaries**

Change the ward item type to `{ slug, name, summary }` and use these exact summaries:

```ts
{ slug: "kita", name: "北区", summary: "梅田・大阪駅周辺を中心に、買い物や仕事帰りに立ち寄りやすい掲載店を比較できます。" },
{ slug: "chuo", name: "中央区", summary: "心斎橋・本町・難波周辺を含む中央区で、駅からのアクセスと提供確認状況を比較できます。" },
{ slug: "nishi", name: "西区", summary: "堀江・新町・靱公園周辺を含む西区で、ピッツェリアやイタリアンの掲載店を探せます。" },
{ slug: "fukushima", name: "福島区", summary: "福島駅・新福島駅周辺で、クアトロフォルマッジの提供情報がある店舗を比較できます。" },
{ slug: "tennoji", name: "天王寺区", summary: "天王寺区の掲載店を、最寄り駅、確認日、はちみつやランチ情報から選べます。" },
{ slug: "naniwa", name: "浪速区", summary: "難波・大国町周辺を含む浪速区で、アクセスしやすい掲載店を確認できます。" },
{ slug: "abeno", name: "阿倍野区", summary: "天王寺・阿倍野周辺で、提供状況と店舗公式情報を確認しながら掲載店を探せます。" },
{ slug: "yodogawa", name: "淀川区", summary: "新大阪・十三周辺を含む淀川区で、駅から探しやすい掲載店を比較できます。" },
{ slug: "miyakojima", name: "都島区", summary: "京橋・都島周辺で、クアトロフォルマッジの確認情報がある店舗を探せます。" },
{ slug: "higashiyodogawa", name: "東淀川区", summary: "東淀川区の掲載店を、所在地と提供確認状況から比較できます。" },
{ slug: "joto", name: "城東区", summary: "城東区の掲載店を、最寄り駅、アクセス、確認日とともに確認できます。" },
```

- [ ] **Step 2: Create guide data, route, and matching tests**

Write failing tests in `src/data/guides.test.ts` for guide definitions that include only published matching shops. Then create `src/data/guides.ts` and `src/app/guides/[guideSlug]/page.tsx` (or architecture-consistent equivalents), render only generated non-empty guides, and verify the route is included in the static export.

- [ ] **Step 3: Add a reusable breadcrumb component**

```tsx
import Link from "next/link";

export type BreadcrumbLink = { name: string; path: string };

export function Breadcrumbs({ items }: { items: BreadcrumbLink[] }) {
  return (
    <nav className="breadcrumbs" aria-label="パンくずリスト">
      <ol>{items.map((item) => <li key={item.path}><Link href={item.path}>{item.name}</Link></li>)}</ol>
    </nav>
  );
}
```

- [ ] **Step 4: Make page copy and JSON-LD use the same definitions**

Ward pages must render `ward.summary`. Guide pages must render their existing `description` plus a visible selection note based on `guide.kind`. Shop pages must link to the matching ward and to applicable purpose guides. All page families must render `Breadcrumbs` with the same items passed to `buildBreadcrumbJsonLd`.

- [ ] **Step 5: Keep index scope constrained**

Retain the existing `stationCounts >= 2` condition. Do not add new district, cuisine, or “best” pages. If a generated station guide has no matched published shops during build, exclude it from `guides` rather than outputting an empty page.

- [ ] **Step 6: Run tests and build**

```powershell
npx tsx --test src/data/guides.test.ts
npm test
npm run lint
npm run build
```

Expected: all checks pass, new guide matching tests pass, and all ward/guide/shop static pages generate.

- [ ] **Step 7: Commit**

```powershell
git add src/data/wards.ts src/data/guides.ts src/components/Breadcrumbs.tsx src/app/osaka src/app/guides src/app/shops src/app/globals.css
git commit -m "feat: strengthen local search navigation"
```

---

### Task 7: 静的SEO監査を自動化する

**Files:**
- Create: `src/lib/seo-audit.ts`
- Create: `src/lib/seo-audit.test.ts`
- Create: `scripts/verifySeoBuild.ts`
- Modify: `package.json`
- Modify: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: built `out/` directory and expected base path `/quattro-map-osaka`.
- Produces: `auditHtmlDocument(html: string, expectedCanonicalPrefix: string): string[]` and CLI exit code 0 only when the static artifact passes.

- [ ] **Step 1: Write failing HTML audit tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { auditHtmlDocument } from "./seo-audit";

test("title description canonical h1が揃うHTMLは合格する", () => {
  const html = `<html lang="ja"><head><title>大阪のクアトロフォルマッジを探す</title><meta name="description" content="大阪の提供店を比較できます。"><link rel="canonical" href="https://example.com/quattro-map-osaka/"></head><body><h1>大阪のクアトロフォルマッジを探す</h1></body></html>`;
  assert.deepEqual(auditHtmlDocument(html, "https://example.com/quattro-map-osaka"), []);
});

test("canonicalとh1が欠けるHTMLは明示的なエラーを返す", () => {
  const errors = auditHtmlDocument("<html lang=\"ja\"><head><title>x</title></head><body></body></html>", "https://example.com/quattro-map-osaka");
  assert.ok(errors.includes("canonical missing"));
  assert.ok(errors.includes("h1 missing"));
  assert.ok(errors.includes("meta description missing"));
});
```

- [ ] **Step 2: Run and verify red state**

```powershell
npx tsx --test src/lib/seo-audit.test.ts
```

Expected: FAIL because `seo-audit.ts` does not exist.

- [ ] **Step 3: Implement the document audit**

Use case-insensitive regular expressions to require `lang="ja"`, non-empty title, meta description, canonical starting with the expected production prefix, and exactly one `<h1`. Return stable strings: `html lang missing`, `title missing`, `meta description missing`, `canonical missing`, `canonical outside production site`, `h1 missing`, or `multiple h1 elements`.

- [ ] **Step 4: Implement the static artifact CLI**

The CLI must recursively inspect every `out/**/*.html`, call `auditHtmlDocument`, assert `out/robots.txt` and `out/sitemap.xml` exist, reject duplicate canonical URLs, and print each file/error pair before exiting 1. It must never rewrite the artifact.

- [ ] **Step 5: Add scripts and CI gates**

Add:

```json
"typecheck": "tsc --noEmit",
"verify:seo": "tsx scripts/verifySeoBuild.ts"
```

Update the Pages workflow to run, in this order:

```yaml
- run: npm test
- run: npm run lint
- run: npm run typecheck
- run: npm run build
  env:
    PAGES_BASE_PATH: /quattro-map-osaka
    NEXT_PUBLIC_BASE_PATH: /quattro-map-osaka
    NEXT_PUBLIC_SITE_URL: https://arsenal23vm-netizen.github.io/quattro-map-osaka
    NEXT_PUBLIC_GA_ID: ${{ vars.NEXT_PUBLIC_GA_ID }}
- run: npm run verify:seo
  env:
    NEXT_PUBLIC_SITE_URL: https://arsenal23vm-netizen.github.io/quattro-map-osaka
```

- [ ] **Step 6: Run all local gates with production environment**

```powershell
$env:PAGES_BASE_PATH='/quattro-map-osaka'
$env:NEXT_PUBLIC_BASE_PATH='/quattro-map-osaka'
$env:NEXT_PUBLIC_SITE_URL='https://arsenal23vm-netizen.github.io/quattro-map-osaka'
npm test
npm run lint
npm run typecheck
npm run build
npm run verify:seo
```

Expected: all commands exit 0 and the audit reports the number of checked HTML files.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/seo-audit.ts src/lib/seo-audit.test.ts scripts/verifySeoBuild.ts package.json package-lock.json .github/workflows/deploy-pages.yml
git commit -m "ci: verify production SEO artifact"
```

---

### Task 8: 計測手順を固定し、GitHub Pagesへ公開する

**Files:**
- Create: `docs/seo-operations.md`

**Interfaces:**
- Consumes: green branch, GitHub Pages environment, Search Console property, optional repository variable `NEXT_PUBLIC_GA_ID`.
- Produces: published site, recorded deployment URL/check, and a repeatable 28-day measurement procedure.

- [ ] **Step 1: Write the operations document**

Document these exact recurring checks:

1. Every content update records source URL and `lastVerifiedAt`.
2. Run `npm test`, `npm run lint`, `npm run typecheck`, production `npm run build`, and `npm run verify:seo`.
3. After deploy, verify `/`, `/about/`, one ward, one guide, one shop, `/robots.txt`, and `/sitemap.xml` return 200.
4. In Search Console, submit `https://arsenal23vm-netizen.github.io/quattro-map-osaka/sitemap.xml`.
5. Inspect the home URL and request indexing after material changes.
6. Every 28 days record clicks, impressions, CTR, and average position for the two primary queries plus index coverage errors.
7. Add real visit notes only when visit date and original summary are both present.

- [ ] **Step 2: Run the complete verification suite fresh**

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run verify:seo
git status --short
git diff --check
```

Expected: all commands exit 0, `git diff --check` prints nothing, and only the intended plan changes are present.

- [ ] **Step 3: Push the branch and open a draft pull request**

```powershell
git push -u origin codex/seo-search-growth
```

Open a draft PR against `main` summarizing the user-visible changes, tests, Pages recovery plan, structured-data policy change, and Search Console follow-up.

- [ ] **Step 4: Merge only after user approval and green GitHub checks**

Do not bypass or force-push. After merge, wait for the `Deploy Quattro Map Osaka to GitHub Pages` workflow to succeed.

- [ ] **Step 5: Verify production HTTP and assets**

Request the seven URLs from Step 1 and at least one CSS, JavaScript, and image asset referenced by the home page. Expected: HTTP 200 for every request, production canonicals, and no redirect to a 404 page.

- [ ] **Step 6: Complete Search Console follow-up**

Using the user’s authenticated browser session, submit the sitemap and request indexing for the home, `/about/`, one ward, and one verified shop. Record the submission date in `docs/seo-baseline.md`; do not claim ranking improvement until Search Console has post-deployment data.

- [ ] **Step 7: Commit the operations guide if it was not part of the PR already**

```powershell
git add docs/seo-operations.md docs/seo-baseline.md
git commit -m "docs: add SEO measurement runbook"
git push
```
