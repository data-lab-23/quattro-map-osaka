# Task 5 verification report

## TDD evidence

- RED: `src/lib/site-stats.test.ts` was added before `src/lib/site-stats.ts`.
- The normal focused runner could not start because `tsx` calls `node:os.userInfo()` and this sandbox returned `uv_os_get_passwd ENOMEM`. The TypeScript RED check then failed specifically with `TS2307: Cannot find module './site-stats'`.
- GREEN: the focused tests were compiled with the project TypeScript configuration and executed with `node --test`; all three passed:
  - published filtering, verified count, and latest date;
  - both accepted verification statuses only;
  - strict calendar-date validation and empty-date fallback.

## Final checks

- `tsc --noEmit`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed. Next generated 74 static pages and listed `○ /about` with the existing home, ward, shop, privacy, robots, sitemap, and submit routes.
- `git diff --check`: passed with no output.
- `pnpm test`: blocked before loading tests by the same sandbox Node 24 `uv_os_get_passwd ENOMEM` error in `tsx`; this is not a test failure and is documented here for rerun in a normal Node environment.

## Scope

- `/about` uses the approved Japanese editorial copy, metadata title `運営者情報・掲載基準`, and canonical `/about`.
- Header navigation and footer expose `運営・掲載基準`.
- The home page derives published count, verified count, and latest valid verification date from shop data without claiming all listings are verified.
- The untracked `pnpm-lock.yaml` was not changed or staged.
