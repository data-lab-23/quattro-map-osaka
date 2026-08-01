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
    const notFound = `<!doctype html><html lang="ja"><head><title>404</title><meta name="description" content="見つかりません。"><meta name="robots" content="noindex"></head><body><h1>404</h1></body></html>`;
    await writeFixture(outDir, {
      "index.html": index,
      "guides/lunch.html": nested,
      "404.html": notFound,
      "robots.txt": "User-agent: *\nAllow: /\n",
      "sitemap.xml": "<urlset />\n",
    });
    const before = await Promise.all(["index.html", "guides/lunch.html", "404.html", "robots.txt", "sitemap.xml"].map((file) => readFile(resolve(outDir, file), "utf8")));

    const result = runVerifier(outDir);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /SEO audit passed: 3 HTML files checked/);
    assert.deepEqual(
      await Promise.all(["index.html", "guides/lunch.html", "404.html", "robots.txt", "sitemap.xml"].map((file) => readFile(resolve(outDir, file), "utf8"))),
      before,
    );
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
