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

test("PagesワークフローはPRを検証し、PR中はデプロイしない", () => {
  const workflow = readFileSync(
    resolve(process.cwd(), ".github/workflows/deploy-pages.yml"),
    "utf8",
  );

  assert.match(workflow, /pull_request:\s*\r?\n\s+branches:\s*\[main\]/);
  assert.match(
    workflow,
    /- if: github\.event_name != 'pull_request'\s*\r?\n\s+uses: actions\/configure-pages@v5/,
  );
  assert.match(
    workflow,
    /- if: github\.event_name != 'pull_request'\s*\r?\n\s+uses: actions\/upload-pages-artifact@v3/,
  );
  assert.match(workflow, /deploy:\s*\r?\n\s+if: github\.event_name != 'pull_request'/);
  assert.match(workflow, /group: pages-\$\{\{ github\.workflow \}\}-\$\{\{ github\.ref \}\}/);
});
