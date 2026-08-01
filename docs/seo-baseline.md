# SEO baseline

This record distinguishes observed evidence from actions that still require a successful production deployment or an authenticated external service.

## Prior public observation

- Captured: `2026-08-01T04:43:56.101Z` (UTC).
- URL: `https://arsenal23vm-netizen.github.io/quattro-map-osaka/`.
- Observed result: `(404) Not Found`.
- The PowerShell request `Invoke-WebRequest https://arsenal23vm-netizen.github.io/quattro-map-osaka/ -UseBasicParsing` could not obtain Windows Schannel credentials (`SEC_E_NO_CREDENTIALS`), so it did not itself return an HTTP status.
- Alternate evidence: `web.run` with `open: [{"ref_id":"https://arsenal23vm-netizen.github.io/quattro-map-osaka/"}]` captured `Failed to fetch https://arsenal23vm-netizen.github.io/quattro-map-osaka/: (404) Not Found` at the timestamp above.

## Branch and base

- Working branch: `codex/seo-search-growth`.
- Current branch head before the Task 8 documentation commit: `4e7ed75` (`fix: scope SEO error artifact exemption`).
- Base branch and commit: `origin/main` at `7c14acc` (`Add Google site verification meta`).
- Ancestry check before the Task 8 documentation commit: `origin/main` is an ancestor of the working branch; the branch was 15 commits ahead and 0 commits behind.

## Local verification summary

- Fresh Task 8 production-equivalent verification passed on `2026-08-01`: `npm test` (31 passing tests), `npm run lint`, `npm run typecheck`, production `npm run build` (89 static routes), and `npm run verify:seo` (86 HTML files audited) each exited `0`.
- `npm ci --dry-run` compatibility passed on `2026-08-01` with exit `0`.
- Final `git diff --check` and `git diff --cached --check` produced no output before the documentation commit.
- The only pre-existing worktree change observed before Task 8 documentation was the unrelated, untracked `pnpm-lock.yaml`; it is not to be committed as part of this task.

## Deployment and Search Console status

- GitHub Pages deployment for this branch: pending; no deployment success is claimed here.
- Production seven-URL and asset checks: pending a successful Pages deployment.
- Search Console access, sitemap submission, URL inspection, and indexing requests: pending authenticated follow-up.
- Search rankings, clicks, impressions, CTR, and average position: no post-deployment data recorded.

## Post-deploy evidence to record

| Field | Value |
| --- | --- |
| Deployment date/time (UTC) | pending |
| Deployment workflow URL and result | pending |
| Deployed commit SHA | pending |
| Seven URL HTTP results and asset results | pending |
| Canonical checks | pending |
| Search Console sitemap submission date | pending |
| URL inspection/indexing request dates and targets | pending |
| First complete 28-day Search Console period and results | pending |
