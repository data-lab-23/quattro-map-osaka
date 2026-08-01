# Task 5 verification report

## TDD evidence

- RED: `src/lib/site-stats.test.ts` was added before `src/lib/site-stats.ts`.
- The normal focused runner could not start because `tsx` calls `node:os.userInfo()` and this sandbox returned `uv_os_get_passwd ENOMEM`. The TypeScript RED check then failed specifically with `TS2307: Cannot find module './site-stats'`.
- GREEN: the focused tests were compiled with the project TypeScript configuration and executed with `node --test`. The exact temporary fallback commands were `./node_modules/.bin/tsc.cmd -p work/site-stats-test/tsconfig.json` and `node --test work/site-stats-test/compiled/lib/site-stats.test.js`; all three passed:
  - published filtering, verified count, and latest date;
  - both accepted verification statuses only;
  - strict calendar-date validation and empty-date fallback.

## Final checks

- `pnpm test`: passed with the reversible Task 4 Windows preload. The exact PowerShell command was `$env:NODE_OPTIONS = "--require=C:\Users\arsen\Documents\Codex\2026-08-01\a\work\node-windows-userinfo-shim.cjs"; pnpm test`; exit code 0, 16 tests passed, 0 failed. The preload exists outside the repository, was applied only to that command process, and was not committed.
- Focused `site-stats` command: `$env:NODE_OPTIONS = "--require=C:\Users\arsen\Documents\Codex\2026-08-01\a\work\node-windows-userinfo-shim.cjs"; ./node_modules/.bin/tsx.cmd --test src/lib/site-stats.test.ts`; exit code 0, 3 tests passed, 0 failed.
- `tsc --noEmit`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed. Next generated 74 static pages and listed `○ /about` with the existing home, ward, shop, privacy, robots, sitemap, and submit routes.
- `git diff --check`: passed with no output.
- Responsive inspection: at `max-width: 560px`, the header now uses automatic height and wrapping navigation; the site-stat cards use one column and allow long values to wrap. This prevents the additional navigation item and `YYYY-MM-DD` date from overflowing narrow phones.

## Scope

- `/about` uses the approved Japanese editorial copy, metadata title `運営者情報・掲載基準`, and canonical `/about`.
- Header navigation and footer expose `運営・掲載基準`.
- The home page derives published count, verified count, and latest valid verification date from shop data without claiming all listings are verified.
- The untracked `pnpm-lock.yaml` was not changed or staged.
