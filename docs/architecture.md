# Architecture

A short tour of the moving parts. The goal is to explain *why* the
template makes the choices it does — the code itself shows *how*.

## Monorepo layout

```
apps/web              Next.js 16 app — landing, auth, /app dashboard
packages/contracts    Zod schemas + inferred types (single source of truth)
packages/supabase     Supabase client factories + generated DB types
packages/config       Shared tsconfig base
supabase/migrations   SQL migrations (numbered, idempotent)
```

pnpm workspaces hold one lockfile at the root. Turborepo orchestrates
`dev / build / lint / typecheck` and caches results per package so the
steady-state cost of a full check is sub-second.

## Contracts as the source of truth

`@zerostack/contracts` is the one place a data shape is defined. Every
other layer infers from it:

```ts
import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string(),
  createdAt: z.string().datetime({ offset: true }),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema
  .pick({ title: true, content: true })
  .extend({ content: z.string().max(10_000).default("") });
```

- **Server Actions** validate `FormData` against schemas before
  touching the database.
- **React Server Components** parse Supabase rows through `noteSchema`
  before render — Zod is the runtime boundary check between Postgres
  and the UI.
- **Future mobile / server / edge consumers** import the same schemas.
  No drift, no hand-duplicated types.

Database types in `packages/supabase/src/types.ts` are
**generated, never written by hand**: `pnpm db:types`. Until you run
it the file is a permissive placeholder so app code can still compile.

## Auth: Supabase SSR

Three thin factory exports in `@zerostack/supabase`:

- `createBrowserClient(url, anonKey)` — Client Components.
- `createServerClient(url, anonKey, cookies)` — Server Components,
  Server Actions, route handlers.
- The same `createServerClient` is reused for middleware via a
  cookie adapter built from `NextRequest` / `NextResponse`.

The web app wraps these in `apps/web/src/lib/supabase/{client,server,proxy}.ts`,
each calling `supabaseEnv()` lazily so `next build` succeeds without
real keys (CI ships with placeholder env).

Magic-link flow:

```
/login → signInWithOtp (Server Action)
       → Supabase emails a link
       → /auth/callback?code=... (route handler)
       → exchangeCodeForSession
       → redirect to next (/app by default)
```

`src/proxy.ts` (formerly `middleware.ts` — Next 16 renamed the file
convention) runs on every request, refreshes the session via
`supabase.auth.getUser()`, and redirects unauthenticated traffic away
from `/app/*` to `/login?next=...`.

## Database: Row Level Security on every table

The `notes` example sets the pattern. Each table:

1. Has a `user_id uuid references auth.users(id) on delete cascade`.
2. `alter table ... enable row level security`.
3. Explicit policies for `select / insert / update / delete`, all
   gated by `auth.uid() = user_id`.

The anon key the browser uses **can** reach the table, but RLS makes
sure it can only see rows it owns. Server code uses the same key —
there is no service-role bypass in app logic, so a forgotten check
can't accidentally leak data.

A new table without RLS is reachable from the public client. The
Supabase dashboard surfaces this as a red shield in the Table editor;
do not ignore it.

## UI: Server Actions, no API routes

CRUD goes through Server Actions:

```tsx
// apps/web/src/app/app/actions.ts
export async function createNote(_prev, formData) {
  const parsed = createNoteSchema.safeParse({ ... });
  if (!parsed.success) return { ok: false, message: "..." };

  const supabase = await supabaseServer();
  const { error } = await supabase.from("notes").insert({ ... });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/app");
  return { ok: true, message: "Saved." };
}
```

- No `/api/notes` route handler.
- No client `fetch` — the form submits directly to the action.
- `useActionState` on the client wires the result back into the UI.
- `revalidatePath` re-runs the page's Server Components on success.

Forms degrade gracefully without JS because Server Actions are real
HTTP POST endpoints.

## SEO + metadata

Single source for canonical URL in `apps/web/src/lib/site.ts`:

```ts
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
```

- `apps/web/src/app/robots.ts` allows `/`, `/login`, blocks `/app/*`
  and `/auth/*`.
- `apps/web/src/app/sitemap.ts` lists the public surface.
- `apps/web/src/app/opengraph-image.tsx` renders a 1200×630 PNG on the
  edge — no static asset to maintain.
- `/app` and `/auth` layouts set `robots: { index: false }` as belt
  and suspenders.

## CI

`.github/workflows/ci.yml` runs three serial gates on every push and
PR:

1. `pnpm typecheck` — `tsc --noEmit` in every package via turbo.
2. `pnpm lint` — eslint on web.
3. `pnpm build` — `next build` with placeholder Supabase env.

Locally, the same checks fire pre-commit via husky + lint-staged.

## What's deliberately not here

- **No ORM.** Supabase JS + Zod runtime checks are enough for the
  current surface. A heavier ORM is a future call, not a default.
- **No API server.** Server Actions cover everything; if you need a
  separate service later, add it as `apps/api`.
- **No global state library.** RSC + Server Actions handle most of
  what Redux/Zustand were doing five years ago.
- **No tests yet.** The CI gates catch most class-of-bug regressions
  cheaply; targeted Playwright smoke tests are a likely v0.2.
