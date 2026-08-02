import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsxCli = resolve(repositoryRoot, "node_modules", "tsx", "dist", "cli.mjs");
const verifier = resolve(repositoryRoot, "scripts", "verifySeoBuild.ts");
const productionSite = "https://example.com/quattro-map-osaka";

function page(canonical: string, extraHead = "") {
  return `<!doctype html><html lang="ja"><head><title>大阪のピザ</title><meta name="description" content="大阪で食べるピザを探す。"><link rel="canonical" href="${canonical}">${extraHead}</head><body><h1>大阪のピザ</h1></body></html>`;
}

function noindexPage(canonical?: string) {
  const canonicalTag = canonical ? `<link rel="canonical" href="${canonical}">` : "";
  return `<!doctype html><html lang="ja"><head><title>Noindex page</title><meta name="description" content="A complete noindex fixture."><meta name="robots" content="noindex">${canonicalTag}</head><body><h1>Noindex page</h1></body></html>`;
}

async function writeFixture(root: string, files: Record<string, string>) {
  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      const path = resolve(root, relativePath);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, "utf8");
    }),
  );
}

function runVerifier(outDir: string) {
  return spawnSync(process.execPath, [tsxCli, verifier, outDir], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: productionSite },
  });
}

test("recursively audits a build, accepts a noindex framework error page, and leaves files untouched", async () => {
  const outDir = await mkdtemp(resolve(tmpdir(), "seo-audit-"));
  try {
    const index = page(`${productionSite}/`);
    const nested = page(`${productionSite}/guides/lunch`);
    const notFound = noindexPage();
    await writeFixture(outDir, {
      "index.html": index,
      "guides/lunch.html": nested,
      "404.html": notFound,
      "_not-found.html": notFound,
      "robots.txt": "User-agent: *\nAllow: /\n",
      "sitemap.xml": "<urlset />\n",
    });
    const trackedFiles = ["index.html", "guides/lunch.html", "404.html", "_not-found.html", "robots.txt", "sitemap.xml"];
    const before = await Promise.all(trackedFiles.map((file) => readFile(resolve(outDir, file), "utf8")));

    const result = runVerifier(outDir);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /SEO audit passed: 4 HTML files checked/);
    assert.deepEqual(
      await Promise.all(trackedFiles.map((file) => readFile(resolve(outDir, file), "utf8"))),
      before,
    );
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test("rejects an indexable page whose canonical does not match its output route", async () => {
  const outDir = await mkdtemp(resolve(tmpdir(), "seo-audit-"));
  try {
    await writeFixture(outDir, {
      "index.html": page(`${productionSite}/`),
      "guides/lunch.html": page(`${productionSite}/guides/dinner`),
      "nested/index.html": page(`${productionSite}/nested/wrong`),
      "robots.txt": "User-agent: *\nAllow: /\n",
      "sitemap.xml": "<urlset />\n",
    });

    const result = runVerifier(outDir);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /guides[\\/]lunch\.html: canonical does not match output route: expected https:\/\/example\.com\/quattro-map-osaka\/guides\/lunch, got https:\/\/example\.com\/quattro-map-osaka\/guides\/dinner/);
    assert.match(result.stderr, /nested[\\/]index\.html: canonical does not match output route: expected https:\/\/example\.com\/quattro-map-osaka\/nested, got https:\/\/example\.com\/quattro-map-osaka\/nested\/wrong/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test("keeps canonical and duplicate-canonical errors for ordinary noindex pages", async () => {
  const outDir = await mkdtemp(resolve(tmpdir(), "seo-audit-"));
  try {
    await writeFixture(outDir, {
      "index.html": page(`${productionSite}/shared`),
      "ordinary-noindex.html": noindexPage(`${productionSite}/shared`),
      "missing-noindex.html": noindexPage(),
      "outside-noindex.html": noindexPage("https://example.com/quattro-map-osaka-other"),
      "nested/404.html": noindexPage(),
      "robots.txt": "User-agent: *\nAllow: /\n",
      "sitemap.xml": "<urlset />\n",
    });

    const result = runVerifier(outDir);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /ordinary-noindex\.html: duplicate canonical/);
    assert.match(result.stderr, /index\.html: duplicate canonical/);
    assert.match(result.stderr, /missing-noindex\.html: canonical missing/);
    assert.match(result.stderr, /outside-noindex\.html: canonical outside production site/);
    assert.match(result.stderr, /nested[\\/]404\.html: canonical missing/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test("rejects crawl artifact paths that are directories", async () => {
  const outDir = await mkdtemp(resolve(tmpdir(), "seo-audit-"));
  try {
    await writeFixture(outDir, { "index.html": page(`${productionSite}/`) });
    await Promise.all([mkdir(resolve(outDir, "robots.txt")), mkdir(resolve(outDir, "sitemap.xml"))]);

    const result = runVerifier(outDir);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /robots\.txt: robots\.txt missing/);
    assert.match(result.stderr, /sitemap\.xml: sitemap\.xml missing/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test("prints actionable errors for missing crawl files and duplicate canonicals", async () => {
  const outDir = await mkdtemp(resolve(tmpdir(), "seo-audit-"));
  try {
    await writeFixture(outDir, {
      "index.html": page(`${productionSite}/same`),
      "nested/duplicate.html": page(`${productionSite}/same`),
    });

    const result = runVerifier(outDir);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /robots\.txt missing/);
    assert.match(result.stderr, /sitemap\.xml missing/);
    assert.match(result.stderr, /duplicate canonical: https:\/\/example\.com\/quattro-map-osaka\/same/);
    assert.match(result.stderr, /index\.html: duplicate canonical/);
    assert.match(result.stderr, /nested[\\/]duplicate\.html: duplicate canonical/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
