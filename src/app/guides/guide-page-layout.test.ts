import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const guidePage = resolve(dirname(fileURLToPath(import.meta.url)), "[guideSlug]", "page.tsx");

test("guide page relies on the root layout main landmark", async () => {
  const source = await readFile(guidePage, "utf8");

  assert.doesNotMatch(source, /<main\b/);
  assert.doesNotMatch(source, /<\/main>/);
});
