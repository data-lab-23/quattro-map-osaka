# SEO baseline

Captured: `2026-08-01T04:43:56.101Z` (UTC)

## Public Pages check

- URL: `https://arsenal23vm-netizen.github.io/quattro-map-osaka/`
- HTTP status: `404 Not Found`
- Primary command attempted: `Invoke-WebRequest https://arsenal23vm-netizen.github.io/quattro-map-osaka/ -UseBasicParsing`
- Primary command output: `接続が切断されました: 受信時に予期しないエラーが発生しました。` (`SEC_E_NO_CREDENTIALS` from this Windows session's Schannel provider), so it did not yield an HTTP status.
- Alternate tool and exact input: `web.run` → `open: [{"ref_id":"https://arsenal23vm-netizen.github.io/quattro-map-osaka/"}]`, `response_length: "short"`.
- Captured alternate-tool response at the timestamp above: `L0: Failed to fetch https://arsenal23vm-netizen.github.io/quattro-map-osaka/: (404) Not Found`.

## Local baseline

- Dependency restore: `pnpm import` followed by `pnpm install --frozen-lockfile --config.dangerouslyAllowAllBuilds=true` with bundled Node `v24.14.0` and pnpm `11.9.0`. This is a local fallback because `npm` is unavailable on PATH; `package.json` and `package-lock.json` were preserved.
- Test-script check: `pnpm test` exited `1` because the GitHub remote's `package.json` has no `test` script. Zero matching test files were found in the clean clone. Task 1 does not import OneDrive tests; later tasks create the SEO tests.
- Existing baseline checks: `pnpm run lint` exited `0`, and `pnpm run build` exited `0`. Next.js reported 73 generated static pages; the `out/` directory exists with 70 HTML files (645 output files total).

## Deployment configuration inspected

- `.github/workflows/deploy-pages.yml` deploys only on pushes to `main` and uploads `./out` after setting the `/quattro-map-osaka` Pages base path.
- `next.config.ts` uses `output: "export"` and derives `basePath` from `PAGES_BASE_PATH`.
