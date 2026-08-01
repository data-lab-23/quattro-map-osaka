# SEO operations runbook

This runbook keeps the public GitHub Pages site measurable and recoverable. It does not assert that a deployment, indexing request, or ranking result has succeeded; record those outcomes only after the relevant evidence exists.

## Canonical production target

- Production URL and base path: `https://arsenal23vm-netizen.github.io/quattro-map-osaka`
- Sitemap: `https://arsenal23vm-netizen.github.io/quattro-map-osaka/sitemap.xml`
- Primary queries: `クアトロフォルマッジ 大阪` and `大阪 クアトロフォルマッジ`

## Recurring checks

1. For every content update, record the source URL and `lastVerifiedAt`. Confirm that the visible page and its structured data agree with that source.
2. Before a release, run `npm test`, `npm run lint`, `npm run typecheck`, production `npm run build`, and `npm run verify:seo`.
3. After a successful Pages deployment, confirm that all seven URLs in the HTTP checklist return `200` and that their canonicals remain on the production base path.
4. In the authenticated Search Console property, submit the canonical sitemap URL.
5. Inspect the home URL and request indexing after a material change.
6. Every 28 days, record clicks, impressions, CTR, and average position for both primary queries, plus index coverage errors.
7. Add a visit note only when both the visit date and the original visit summary are present. Do not describe an unvisited shop as visited.

## Pre-release production build checks

Run these commands from the repository root. They use the same Pages base path, canonical URL, and optional GA4 variable contract as `.github/workflows/deploy-pages.yml`.

Windows PowerShell:

```powershell
npm test
npm run lint
npm run typecheck
$env:PAGES_BASE_PATH = "/quattro-map-osaka"
$env:NEXT_PUBLIC_BASE_PATH = "/quattro-map-osaka"
$env:NEXT_PUBLIC_SITE_URL = "https://arsenal23vm-netizen.github.io/quattro-map-osaka"
npm run build
npm run verify:seo
Remove-Item Env:PAGES_BASE_PATH, Env:NEXT_PUBLIC_BASE_PATH, Env:NEXT_PUBLIC_SITE_URL -ErrorAction SilentlyContinue
```

CI-safe shell:

```sh
npm test
npm run lint
npm run typecheck
PAGES_BASE_PATH=/quattro-map-osaka \
NEXT_PUBLIC_BASE_PATH=/quattro-map-osaka \
NEXT_PUBLIC_SITE_URL=https://arsenal23vm-netizen.github.io/quattro-map-osaka \
npm run build
NEXT_PUBLIC_SITE_URL=https://arsenal23vm-netizen.github.io/quattro-map-osaka npm run verify:seo
```

The Pages workflow restores dependencies with `npm ci`, then runs the same test, lint, typecheck, build, and SEO verification gates. It supplies `NEXT_PUBLIC_GA_ID` from the repository variable `NEXT_PUBLIC_GA_ID`; leave analytics unset when that repository variable is not configured rather than placing an ID in source control.

## Post-deploy HTTP and asset checklist

Do this only after the GitHub Pages deployment workflow reports success. The seven required URLs are:

1. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/`
2. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/about/`
3. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/osaka/kita/`
4. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/guides/lunch/`
5. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/shops/7-/`
6. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/robots.txt`
7. `https://arsenal23vm-netizen.github.io/quattro-map-osaka/sitemap.xml`

The shop URL above is a currently published, `verified_official` example. If it is removed or loses that status, replace it with a currently published verified shop and record the substitution.

In addition, check at least one CSS file, JavaScript file, and image URL referenced by the deployed home page. Their hashed asset paths change between builds, so copy the current paths from the deployed home-page HTML rather than reusing an old hash. Every request must return `200`; confirm the HTML canonical uses the production URL and that no request lands on a 404 page.

Windows PowerShell status check:

```powershell
$base = "https://arsenal23vm-netizen.github.io/quattro-map-osaka"
$paths = @("/", "/about/", "/osaka/kita/", "/guides/lunch/", "/shops/7-/", "/robots.txt", "/sitemap.xml")
$paths | ForEach-Object {
  $response = Invoke-WebRequest -Uri "$base$_" -UseBasicParsing
  "{0} {1}" -f $response.StatusCode, $response.BaseResponse.ResponseUri.AbsoluteUri
}
$home = Invoke-WebRequest -Uri "$base/" -UseBasicParsing
$assets = [regex]::Matches($home.Content, '(?:href|src)="(/quattro-map-osaka/(?:_next/[^"?#]+|images/[^"?#]+))') |
  ForEach-Object { $_.Groups[1].Value } |
  Select-Object -Unique
$assets | ForEach-Object {
  $response = Invoke-WebRequest -Uri "https://arsenal23vm-netizen.github.io$_" -UseBasicParsing
  "{0} {1}" -f $response.StatusCode, $response.BaseResponse.ResponseUri.AbsoluteUri
}
```

CI-safe shell status check (replace the three asset paths with paths found in the deployed home HTML):

```sh
base=https://arsenal23vm-netizen.github.io/quattro-map-osaka
for path in / /about/ /osaka/kita/ /guides/lunch/ /shops/7-/ /robots.txt /sitemap.xml; do
  curl --fail --silent --show-error --location --output /dev/null --write-out "%{http_code} $base$path\\n" "$base$path"
done
curl --fail --silent --show-error --location --output /dev/null "$base/_next/static/chunks/CURRENT.css"
curl --fail --silent --show-error --location --output /dev/null "$base/_next/static/chunks/CURRENT.js"
curl --fail --silent --show-error --location --output /dev/null "$base/images/quattro-formaggi-hero.png"
```

## Search Console and 28-day record

In the authenticated property, submit the sitemap above, inspect the home URL, and request indexing for the home page, `/about/`, `/osaka/kita/`, and the selected verified shop after material changes. Record the date and the exact action in `docs/seo-baseline.md`; do not infer success or a ranking change from having submitted a request.

| Period (UTC) | Query | Clicks | Impressions | CTR | Average position | Index coverage errors | Source / notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| YYYY-MM-DD to YYYY-MM-DD | クアトロフォルマッジ 大阪 | pending | pending | pending | pending | pending | Search Console export or screenshot reference |
| YYYY-MM-DD to YYYY-MM-DD | 大阪 クアトロフォルマッジ | pending | pending | pending | pending | pending | Search Console export or screenshot reference |

Use the same 28-day comparison window for each entry. If there is not yet post-deploy Search Console data, leave the metrics pending; do not substitute an estimated ranking. GA4 page views and the configured interaction events can be supplementary evidence, not a replacement for Search Console query data.

## Rollback and escalation

If a production check fails, do not force-push or delete the existing Pages artifact. First preserve the failing URL, timestamp, HTTP status, deployment URL, commit SHA, and GitHub Actions log link. Diagnose the failure from the workflow logs and the locally generated `out/` artifact. Revert the offending commit through the normal reviewed Git workflow, wait for the Pages deployment workflow to succeed, then repeat the seven URL and asset checks.

Escalate a deployment, indexing, canonical, sitemap, coverage, or structured-data failure with the captured evidence to the repository maintainer. Search Console and GitHub write actions must name the target property, branch, and URL before they are performed.
