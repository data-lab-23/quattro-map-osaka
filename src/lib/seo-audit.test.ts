import assert from "node:assert/strict";
import test from "node:test";
import { auditHtmlDocument } from "./seo-audit";

const productionSite = "https://example.com/quattro-map-osaka";

function validHtml(overrides: Partial<{ html: string; title: string; description: string; canonical: string; h1: string }> = {}) {
  const html = overrides.html ?? 'lang="ja"';
  const title = overrides.title ?? "大阪のクアトロフォルマッジ";
  const description = overrides.description ?? "大阪でクアトロフォルマッジを探すための案内です。";
  const canonical = overrides.canonical ?? `${productionSite}/shops/pizza`;
  const h1 = overrides.h1 ?? "大阪のピザ店";

  return `<!doctype html><HTML ${html}><HEAD><TITLE>${title}</TITLE><META content="${description}" NAME="description"><LINK href="${canonical}" rel="canonical"></HEAD><BODY><H1>${h1}</H1></BODY></HTML>`;
}

test("accepts a complete Japanese document despite tag, attribute, and whitespace casing", () => {
  const html = validHtml({
    html: ' LANG = "ja" ',
    title: "  大阪のクアトロフォルマッジ  ",
    description: " 大阪で食べるピザを探す。 ",
  });

  assert.deepEqual(auditHtmlDocument(html, productionSite), []);
});

test("reports each stable error for a document with every required SEO field absent", () => {
  const html = "<html><head></head><body></body></html>";

  assert.deepEqual(auditHtmlDocument(html, productionSite), [
    "html lang missing",
    "title missing",
    "meta description missing",
    "canonical missing",
    "h1 missing",
  ]);
});

test("rejects blank title, blank description, and multiple headings", () => {
  const html = validHtml({
    title: " \n\t ",
    description: "   ",
    h1: "first</H1><h1>second",
  });

  assert.deepEqual(auditHtmlDocument(html, productionSite), [
    "title missing",
    "meta description missing",
    "multiple h1 elements",
  ]);
});

test("rejects a canonical that only shares a textual prefix with the production path", () => {
  const html = validHtml({ canonical: "https://example.com/quattro-map-osaka-guide/page" });

  assert.deepEqual(auditHtmlDocument(html, productionSite), ["canonical outside production site"]);
});

test("does not count h1-like strings inside comments, scripts, or styles", () => {
  const html = validHtml({
    h1: "visible</H1><!-- <h1>comment</h1> --><script>const fake = '<h1>script</h1>';</script><style>.x::before { content: '<h1>style</h1>'; }</style>",
  });

  assert.deepEqual(auditHtmlDocument(html, productionSite), []);
});
