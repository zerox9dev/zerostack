# Changelog

All notable changes to this project are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Live demo link and a **Deploy with Vercel** button in README.
- Polished `/app` dashboard: sticky topbar, card-styled notes with
  hover affordance, empty state, Textarea for note content, note
  counter in the header.
- Production SEO metadata: title template, OpenGraph + Twitter
  cards, canonical URL via `NEXT_PUBLIC_SITE_URL`, theme-color
  split for light/dark, dynamic OG image rendered on the edge
  (`/opengraph-image`).
- `robots.txt`, `sitemap.xml`, and per-page `noindex` on `/app` and
  `/auth/*` via Next 16 file conventions.
- Centralised site config in `apps/web/src/lib/site.ts` (canonical
  URL fallback chain: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` →
  localhost).
- Husky + lint-staged pre-commit hook: `eslint --fix` on staged
  files plus `pnpm typecheck` across the workspace.
- `docs/` directory with architecture overview and the production
  checklist (previously inline in README).
- `CHANGELOG.md` (this file).

### Changed
- README slimmed down — production checklist moved to
  `docs/production-checklist.md`; a Documentation section links to
  the new docs tree.

### Fixed
- Surface Supabase auth errors on `/login`: the callback route now
  forwards `?error_description=` to the login page and renders a
  friendly alert instead of leaving the user on a blank
  `/auth/callback?error=...` screen. Expired-OTP messages get a
  clear "request a new one" prompt.

### Removed
- Default `create-next-app` SVGs (`file.svg`, `globe.svg`, `next.svg`,
  `vercel.svg`, `window.svg`) from `apps/web/public/`.

## [0.1.0] — 2026-05-29

First usable slice. End-to-end working monorepo starter, live-tested
against a real Supabase project.

### Added
- pnpm + Turborepo monorepo skeleton with shared tsconfig base
  (`@zerostack/config`).
- Next.js 16 web app on the App Router, Tailwind 4, shadcn/ui,
  Roboto via `next/font`.
- Marketing landing page with hero, stack ticker, six feature
  cards, and a numbered quick start.
- Dark mode toggle (`next-themes`, cycles light → dark → system).
- Sticky site nav and footer components.
- `@zerostack/contracts` — Zod schemas for `User`, sign-in input,
  and Note; inferred TypeScript types.
- `@zerostack/supabase` — framework-agnostic SSR client factories
  (`createBrowserClient`, `createServerClient`, `CookieAdapter`) on
  top of `@supabase/ssr`.
- Web wrappers around the Supabase factories with lazy env reads
  so `next build` succeeds without real keys.
- Magic-link auth flow: `/login` Server Action calling
  `signInWithOtp`, `/auth/callback` route handler exchanging the
  PKCE code for a session, `/app` placeholder showing the
  signed-in email.
- Root `src/proxy.ts` (Next 16's renamed middleware convention)
  refreshes the session on every request and redirects
  unauthenticated traffic from `/app/*` to `/login?next=...`.
- Notes CRUD on `/app` via Server Actions (`createNote`,
  `deleteNote`), validated against `createNoteSchema`.
- Example SQL migration `supabase/migrations/20260529000000_init_notes.sql`
  with the `notes` table and explicit per-user RLS policies for
  select / insert / update / delete.
- Permissive placeholder `Database` type in
  `packages/supabase/src/types.ts`; `db:types` script to regenerate
  against a real project ID.
- GitHub Actions CI: typecheck, lint, build on every push and PR
  with placeholder env.
- MIT license and CI/license badges in README.
- README quickstart and bootstrap-only instructions in
  `.docs/SETUP.md` for fresh forks of the template.
- Light + dark README screenshots served via
  `<picture prefers-color-scheme>`.

### Fixed
- Lazy env reads so `next build` doesn't throw on missing
  Supabase keys during page-data collection.
- Move `middleware.ts` into `apps/web/src/` so Next.js with a `src/`
  layout actually loads it.
- Accept numeric ISO offsets in `noteSchema` / `userSchema`
  (`{ offset: true }`) — PostgREST serialises `timestamptz` with
  `+00:00`, which the default Zod datetime parser rejected.
- Drop the pnpm version pin in CI; rely on `packageManager` in
  `package.json` so the workflow and local installs stay in sync.

### Changed
- Migrate from the deprecated `middleware.ts` convention to Next 16's
  `proxy.ts` (file + export rename).
- Replace Geist with Roboto / Roboto Mono.

[Unreleased]: https://github.com/zerox9dev/zerostack/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/zerox9dev/zerostack/releases/tag/v0.1.0
