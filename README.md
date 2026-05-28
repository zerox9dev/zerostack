# zerostack

A modern, scalable monorepo starter. React everywhere, managed backend, agent-friendly.

## Stack
- **Monorepo** — pnpm workspaces + Turborepo
- **Web** — Next.js 16 (App Router), Tailwind 4, shadcn/ui
- **Contracts** — Zod schemas + inferred types, shared across the repo (single source of truth)
- **Backend** — Supabase (Postgres, auth, storage, realtime, RLS)
- **Mobile** — Expo (planned)

## Structure
apps/
web/            Next.js app (web + landing)
packages/
contracts/      Zod schemas + types — source of truth
supabase/       Supabase client + generated DB types
config/         shared tsconfig base
supabase/         migrations, edge functions (to be added)
AGENTS.md         instructions for AI agents

## Requirements
- Node.js 22+
- pnpm 11+

## Quick start
```bash
pnpm install
pnpm dev          # web on http://localhost:3000
```

## Scripts (from root)
- `pnpm dev` — run all apps in dev
- `pnpm build` — build all
- `pnpm lint` — lint all
- `pnpm typecheck` — type-check all
- `pnpm --filter <name> <cmd>` — target one package

## Supabase
The Supabase client is scaffolded in `packages/supabase` but not yet connected.
When you create a project, copy `.env.example`, fill the keys, then generate DB types:
```bash
pnpm supabase gen types typescript --project-id <id> > packages/supabase/src/types.ts
```

## For AI agents
Read [AGENTS.md](./AGENTS.md) before working in this repo.
