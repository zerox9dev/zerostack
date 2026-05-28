# Bootstrap a new project from zerostack

This template ships as `zerostack` with the npm scope `@zerostack/*`.
When a developer forks it to start a real project, an AI agent should run this
one-time setup before any feature work.

## 1. Intake
Ask the developer, in their language:
- Project name / slug (e.g. `acme`). Used as npm scope and repo name.
- One-line description of what they're building.
- Active surfaces now: `web` only, or `web + mobile`. Mark the rest deferred.
- Does v1 need auth and persistence now? If yes, wire Supabase (step 4).
  If no, leave the Supabase package scaffolded.

## 2. Rename the scope
Replace every `@zerostack/` with `@<slug>/`, and `zerostack` with `<slug>`:
- `package.json` "name" at the root and in every `packages/*` and `apps/*`.
- All source imports (`@zerostack/contracts`, `@zerostack/supabase`, `@zerostack/config`).
- README title and description.
Then run `pnpm install` and confirm `pnpm typecheck` is clean.

## 3. Git remote
- Inspect `git remote -v`. If `origin` points at the zerostack template,
  detach it: `git remote remove origin`.
- Add the developer's own repo as `origin` only when they provide a URL.

## 4. Supabase (only if auth/persistence is needed now)
- Create a Supabase project, copy `.env.example` to `apps/web/.env.local`, fill keys.
- Generate DB types:
  `pnpm supabase gen types typescript --project-id <id> > packages/supabase/src/types.ts`
- Enable Row Level Security on every table.

## 5. Finish
- Rewrite README to describe the real project, not the template.
- Delete the `Bootstrap-only instructions` block from `AGENTS.md` (between the markers).
- Delete this file (`.docs/SETUP.md`).
- Report what was renamed, active vs deferred surfaces, and manual TODOs (e.g. Supabase keys).
