# zerostack

[![CI](https://github.com/zerox9dev/zerostack/actions/workflows/ci.yml/badge.svg)](https://github.com/zerox9dev/zerostack/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A modern, scalable monorepo starter. React everywhere, managed backend, agent-friendly.

## Stack
- **Monorepo** — pnpm workspaces + Turborepo
- **Web** — Next.js 16 (App Router), Tailwind 4, shadcn/ui
- **Contracts** — Zod schemas + inferred types, shared across the repo (single source of truth)
- **Backend** — Supabase (Postgres, auth, storage, realtime, RLS)
- **Mobile** — Expo (planned)

## Structure
```
apps/
  web/             Next.js app (landing + magic-link auth + /app dashboard)
packages/
  contracts/       Zod schemas + types — source of truth
  supabase/        Supabase client + generated DB types
  config/          shared tsconfig base
supabase/
  migrations/      SQL migrations (notes table + RLS as the starting example)
AGENTS.md          instructions for AI agents
```

## What works out of the box
- Magic-link auth (`/login` → email → `/auth/callback` → `/app`)
- Session refresh + protected routes via root `middleware.ts`
- Example `notes` table with per-user RLS and a full CRUD UI on `/app`
- Server Actions everywhere; client input validated against `@zerostack/contracts`

## Requirements
- Node.js 22+
- pnpm 11+
- A Supabase project (free tier is fine)

## Quick start

1. **Install deps**
   ```bash
   pnpm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com), then in
   **Settings → API** copy the project URL and the `anon` public key.

3. **Configure env**
   ```bash
   cp .env.example apps/web/.env.local
   # fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

4. **Apply the example migration.** Either:
   - Open `supabase/migrations/20260529000000_init_notes.sql` and paste it into
     the Supabase **SQL Editor**, or
   - Install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
     and run `supabase link --project-ref <id> && supabase db push`.

5. **Allow the auth callback.** In Supabase **Authentication → URL Configuration**,
   add `http://localhost:3000/auth/callback` to **Redirect URLs**.

6. **(Optional) generate DB types** — replaces the permissive placeholder in
   `packages/supabase/src/types.ts` with types matching your real schema:
   ```bash
   SUPABASE_PROJECT_ID=<id> pnpm --filter @zerostack/supabase db:types
   ```

7. **Run it**
   ```bash
   pnpm dev          # web on http://localhost:3000
   ```
   Go to `/app`, you'll be redirected to `/login`, enter your email, click the
   link in the inbox, and land on the notes dashboard.

## Scripts (from root)
- `pnpm dev` — run all apps in dev
- `pnpm build` — build all
- `pnpm lint` — lint all
- `pnpm typecheck` — type-check all
- `pnpm --filter <name> <cmd>` — target one package

## For AI agents
Read [AGENTS.md](./AGENTS.md) before working in this repo.

## License
[MIT](./LICENSE)
