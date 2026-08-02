import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const currentOwner = "data-lab-23";
const formerOwner = "arsenal23vm-netizen";

test("公開設定と利用者向け文書は現在のGitHub所有者を参照する", () => {
  const activeDeploymentFiles = [
    ".github/workflows/deploy-pages.yml",
    "docs/seo-operations.md",
    "README.md",
    "src/data/shops.ts",
  ];

  for (const relativePath of activeDeploymentFiles) {
    const contents = readFileSync(resolve(process.cwd(), relativePath), "utf8");
    assert.match(contents, new RegExp(currentOwner), `${relativePath} must use the current owner`);
    assert.doesNotMatch(
      contents,
      new RegExp(formerOwner),
      `${relativePath} must not use the former owner`,
    );
  }
});
