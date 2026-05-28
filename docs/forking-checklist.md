# Forking zerostack for a new product

How to start a new project from this template **while keeping the
ability to pull in upstream improvements later**. If you instead want a
clean cut (no upstream tracking), use `npx degit zerox9dev/zerostack`
and stop reading.

The companion document for the AI agent that will work in your fork is
[`agent-rules.md`](./agent-rules.md). Read both before the first commit.

---

## 1. Clone with upstream tracking

```bash
git clone git@github.com:zerox9dev/zerostack.git acme
cd acme
git remote rename origin upstream
gh repo create acme --private --source=. --remote=origin
git push -u origin main
```

`upstream` points at zerostack; `origin` at your new product repo.
`gh repo create` needs the GitHub CLI; do it manually in the web UI if
you don't have it.

## 2. Enable the `ours` merge driver

```bash
git config merge.ours.driver true
```

This activates `.gitattributes` — files marked `merge=ours` keep your
fork's version on every `git merge upstream/main`. Without this step
the rules in `.gitattributes` are inert and you'll get conflicts in
files you'll never want to share with upstream (README, branding,
`site.ts`).

## 3. Rename the scope

Find/replace across the repo:

- `@zerostack/` → `@<slug>/` (in `package.json`, `tsconfig*.json`, and
  every TS import)
- `zerostack` → `<slug>` in `README.md`, root `package.json` `name`,
  `apps/web/src/lib/site.ts`

Then:

```bash
pnpm install
pnpm typecheck
```

Both must be clean before you commit.

## 4. Create a new Supabase project

**Do not reuse zerostack's project.** One product = one Supabase project
(isolated data, isolated SMTP limits, separate domains).

1. supabase.com → New project (Free tier is fine).
2. Settings → API: copy `Project URL`, `anon` key, `service_role` key.
3. `cp .env.example apps/web/.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose)
   - `ADMIN_EMAILS=you@example.com`
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
4. SQL Editor → run every file in `supabase/migrations/` in chronological
   order.
5. Authentication → URL Configuration → add
   `http://localhost:3000/auth/callback` to **Redirect URLs**.

## 5. Replace the example

The `notes` table and `/app` UI are a reference, not part of your
product. Decide:

- **Build *on top of* it** — fine for a notes-shaped product (tasks,
  bookmarks, journals). Rename and adapt.
- **Replace it** — delete the table from Supabase, delete `noteSchema`
  and `createNoteSchema` from `packages/contracts/src/index.ts`,
  rewrite `apps/web/src/app/app/page.tsx` and the supporting components
  under `apps/web/src/app/app/`. **Keep `settings/`, `admin/`,
  `app-nav.tsx`, and `layout.tsx`** — they're part of the template's
  frozen surface and you'll want their updates.

Document this choice in `docs/agent-rules.md` for your agent so future
work doesn't drift.

## 6. Brand it

Edit:

- `apps/web/src/lib/site.ts` — name, title, description, keywords, author.
- `apps/web/src/app/page.tsx` — landing copy.
- `apps/web/src/components/site-nav.tsx`, `site-footer.tsx` — logo text.
- `README.md` — rewrite for the product, not the template.
- `LICENSE` — update copyright.
- `apps/web/public/favicon.ico` — replace with your favicon.

Run `pnpm dev`, walk through `/`, `/login`, `/app`, `/app/settings`.

## 7. Delete bootstrap-only blocks

- `.docs/SETUP.md` (the deprecated bootstrap doc) — delete.
- `AGENTS.md` — delete the block between
  `<!-- BOOTSTRAP_ONLY_START -->` markers.

## 8. Vercel deploy

Same as zerostack:

1. vercel.com/new → import your `acme` repo.
2. Root directory: `apps/web`.
3. Env vars: every variable from `.env.local` (anon key, service-role
   key, admin emails, site URL).
4. Deploy.
5. Add `https://<your-domain>/auth/callback` to Supabase redirect URLs.

## 9. First product commit

```bash
git add .
git commit -m "chore: bootstrap acme from zerostack"
git push
```

You're now building your product. Forward references to zerostack live
only in `upstream`.

---

## Pulling upstream updates later

When zerostack ships something useful (auth fix, SEO improvement, new
example pattern):

```bash
git fetch upstream
git checkout -b sync-upstream main
git merge upstream/main
```

Expected outcomes per file class:

- **Frozen files** (auth, SEO, CI, infra) — should merge cleanly because
  you didn't touch them.
- **Customize files** — `merge=ours` keeps your version. No conflict.
- **Extend files** — your product code lives here; upstream rarely
  touches it. Conflicts here mean upstream added something in the same
  area, review case-by-case.

Run `pnpm typecheck && pnpm lint && pnpm build` before merging the
sync branch back into `main`. If something broke, fix it on the sync
branch — never break `main`.

If a frozen file conflicts, **read upstream's change first** before
resolving. The merge is usually telling you the contract changed and
your customisation needs updating, not that you should reject the
upstream version.

---

## When this falls apart

The whole upstream-tracking setup is built on **discipline**: the
agent rules in `agent-rules.md` exist precisely to keep you out of
frozen files. If after a few months you find yourself constantly
patching frozen files in the fork:

- Either the boundary is wrong → upstream the change to zerostack
  itself.
- Or you've drifted too far and tracking upstream isn't worth it
  anymore → drop `upstream`, delete this checklist, treat the fork as
  its own product.

Both outcomes are fine. Tracking upstream is a tool, not a religion.
