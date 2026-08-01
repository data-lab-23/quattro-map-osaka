# SEO baseline

Captured: `2026-08-01T04:33:38.978Z` (UTC)

## Public Pages check

- URL: `https://arsenal23vm-netizen.github.io/quattro-map-osaka/`
- HTTP status: `404 Not Found`
- Evidence: the requested `Invoke-WebRequest` probe could not complete because this Windows session's Schannel provider returned `SEC_E_NO_CREDENTIALS`. A separate public fetch at the same URL returned HTTP 404 at the timestamp above.

## Local baseline

- Dependency restore: `pnpm import` followed by `pnpm install --frozen-lockfile --config.dangerouslyAllowAllBuilds=true` with bundled Node `v24.14.0` and pnpm `11.9.0`. This is a local fallback because `npm` is unavailable on PATH; `package.json` and `package-lock.json` were preserved.
- Tests: `pnpm test` exited `1` because `package.json` has no `test` script. Zero matching test files were found in the clean clone, so the planned baseline of six tests is not present in this revision.
- Lint: `pnpm run lint` exited `0`.
- Build: `pnpm run build` exited `0`; Next.js reported 73 generated static pages. The `out/` directory exists with 70 HTML files (645 output files total).

## Deployment configuration inspected

- `.github/workflows/deploy-pages.yml` deploys only on pushes to `main` and uploads `./out` after setting the `/quattro-map-osaka` Pages base path.
- `next.config.ts` uses `output: "export"` and derives `basePath` from `PAGES_BASE_PATH`.
