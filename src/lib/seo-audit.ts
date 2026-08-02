type Attributes = Map<string, string>;

function contentForInspection(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "");
}

function openTags(html: string, tagName: string) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function attributes(tag: string): Attributes {
  const values = new Map<string, string>();
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  const source = tag.replace(/^<\s*[^\s/>]+/, "").replace(/>$/, "");

  for (const match of source.matchAll(attributePattern)) {
    values.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  }

  return values;
}

function hasText(value: string | undefined) {
  return value !== undefined && value.replace(/<[^>]*>/g, "").trim().length !== 0;
}

function canonicalIsWithinProductionSite(canonical: string, expectedCanonicalPrefix: string) {
  try {
    const expected = new URL(expectedCanonicalPrefix);
    const candidate = new URL(canonical);
    const expectedPath = expected.pathname.replace(/\/+$/, "");
    const candidatePath = candidate.pathname;

    return (
      candidate.origin === expected.origin &&
      (candidatePath === expectedPath || candidatePath.startsWith(`${expectedPath}/`))
    );
  } catch {
    return false;
  }
}

function metaTags(html: string) {
  return openTags(contentForInspection(html), "meta").map(attributes);
}

export function canonicalHrefFromHtml(html: string) {
  const canonical = openTags(contentForInspection(html), "link")
    .map(attributes)
    .find((tag) => tag.get("rel")?.toLowerCase().split(/\s+/).includes("canonical"));

  return canonical?.get("href")?.trim();
}

export function isNonIndexableHtml(html: string) {
  return metaTags(html).some((tag) => {
    const name = tag.get("name")?.toLowerCase();
    const content = tag.get("content") ?? "";
    return (name === "robots" || name === "googlebot") && /\bnoindex\b/i.test(content);
  });
}

export function auditHtmlDocument(html: string, expectedCanonicalPrefix: string): string[] {
  const source = contentForInspection(html);
  const errors: string[] = [];
  const htmlTag = openTags(source, "html")[0];
  const htmlLang = htmlTag ? attributes(htmlTag).get("lang") : undefined;
  const title = source.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1];
  const description = metaTags(source).find((tag) => tag.get("name")?.toLowerCase() === "description")?.get("content");
  const canonical = canonicalHrefFromHtml(source);
  const h1Count = openTags(source, "h1").length;

  if (htmlLang?.trim().toLowerCase() !== "ja") errors.push("html lang missing");
  if (!hasText(title)) errors.push("title missing");
  if (!hasText(description)) errors.push("meta description missing");
  if (!canonical) {
    errors.push("canonical missing");
  } else if (!canonicalIsWithinProductionSite(canonical, expectedCanonicalPrefix)) {
    errors.push("canonical outside production site");
  }
  if (h1Count === 0) errors.push("h1 missing");
  if (h1Count > 1) errors.push("multiple h1 elements");

  return errors;
}
