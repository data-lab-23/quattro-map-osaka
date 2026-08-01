import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative } from "node:path";
import {
  auditHtmlDocument,
  canonicalHrefFromHtml,
  isNonIndexableHtml,
} from "../src/lib/seo-audit";

type AuditError = { file: string; error: string };

async function htmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.isFile() && entry.name.toLowerCase().endsWith(".html") ? [path] : [];
    }),
  );

  return files.flat().sort();
}

async function isFile(path: string) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

function isFrameworkErrorArtifact(relativeFile: string) {
  const normalizedFile = relativeFile.replace(/\\/g, "/");
  return normalizedFile === "404.html" || normalizedFile === "_not-found.html";
}

export async function verifySeoBuild(
  outDirectory = resolve(process.cwd(), "out"),
  expectedCanonicalPrefix = process.env.NEXT_PUBLIC_SITE_URL,
) {
  const errors: AuditError[] = [];

  if (!expectedCanonicalPrefix) {
    return { errors: [{ file: "environment", error: "NEXT_PUBLIC_SITE_URL missing" }], htmlFileCount: 0 };
  }

  let files: string[];
  try {
    files = await htmlFiles(outDirectory);
  } catch {
    return { errors: [{ file: "out", error: "build output missing" }], htmlFileCount: 0 };
  }

  for (const crawlFile of ["robots.txt", "sitemap.xml"]) {
    if (!(await isFile(resolve(outDirectory, crawlFile)))) {
      errors.push({ file: crawlFile, error: `${crawlFile} missing` });
    }
  }

  const canonicalFiles = new Map<string, string[]>();
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const fileErrors = auditHtmlDocument(html, expectedCanonicalPrefix);
    const relativeFile = relative(outDirectory, file);
    const frameworkNoindexErrorArtifact =
      isFrameworkErrorArtifact(relativeFile) && isNonIndexableHtml(html);
    const visibleErrors = frameworkNoindexErrorArtifact
      ? fileErrors.filter((error) => error !== "canonical missing" && error !== "canonical outside production site")
      : fileErrors;

    for (const error of visibleErrors) errors.push({ file: relativeFile, error });

    const canonical = canonicalHrefFromHtml(html);
    if (canonical && !frameworkNoindexErrorArtifact) {
      canonicalFiles.set(canonical, [...(canonicalFiles.get(canonical) ?? []), relativeFile]);
    }
  }

  for (const [canonical, filesWithCanonical] of canonicalFiles) {
    if (filesWithCanonical.length > 1) {
      for (const file of filesWithCanonical) {
        errors.push({ file, error: `duplicate canonical: ${canonical}` });
      }
    }
  }

  return { errors, htmlFileCount: files.length };
}

async function main() {
  const outDirectory = process.argv[2] ? resolve(process.argv[2]) : resolve(process.cwd(), "out");
  const result = await verifySeoBuild(outDirectory);

  if (result.errors.length > 0) {
    for (const { file, error } of result.errors) console.error(`${file}: ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`SEO audit passed: ${result.htmlFileCount} HTML files checked`);
}

main().catch((error: unknown) => {
  console.error(`seo audit failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
