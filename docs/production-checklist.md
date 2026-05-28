# Production checklist

Quick start gets you running locally. Before pointing real users at a
deployment, work through this list — these are gotchas the dev setup
silently hides.

## Supabase

- **Replace the built-in SMTP.** Supabase's default mailer is for
  development only and rate-limits to ~3–4 emails / hour / address.
  The first time you ask for a magic link in a tight loop you'll hit
  `email rate limit exceeded`. Wire your own SMTP under
  **Project Settings → Authentication → SMTP Settings** —
  [Resend](https://resend.com),
  [Postmark](https://postmarkapp.com), or AWS SES all work; Resend
  has a free tier suitable for low-volume production.
- **Add the production redirect URL.** In **Authentication → URL
  Configuration** add `https://<your-domain>/auth/callback` to
  **Redirect URLs**. Without this Supabase rejects the magic link
  with `redirect_to is not allowed`. Keep
  `http://localhost:3000/auth/callback` in the list so local
  development still works.
- **Set the Site URL** to your canonical production domain. It's
  used as the fallback when emailRedirectTo is omitted.
- **Lengthen / shorten OTP expiry** if needed (default 1 hour). The
  toggle lives next to the redirect URL list.
- **Tune password and signup policies** under **Authentication →
  Providers → Email** if you ever add password sign-in.
- **RLS, every table.** This template enables it on `notes`. Any
  table you add needs `enable row level security` + explicit
  policies before it's reachable from the anon key. The Supabase
  dashboard flags RLS-disabled tables with a red shield.

## Vercel (or your host)

- **`NEXT_PUBLIC_SITE_URL`** — set this explicitly to your
  production domain (e.g. `https://example.com`). Sitemap, robots,
  OG, and canonical metadata all read from it. Unset, the code
  falls back to `https://${VERCEL_URL}`, which changes per
  deployment.
- **`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`** —
  same values as in `.env.local`. Anon key is safe to ship to the
  client; the **service role** key is not — never put it in
  `NEXT_PUBLIC_*`.
- **Custom domain.** Once attached in Vercel, update Supabase Site
  URL and Redirect URLs to match.

## App

- **Regenerate Supabase types** against the real schema:
  `SUPABASE_PROJECT_ID=<id> pnpm --filter @zerostack/supabase db:types`.
  The placeholder accepts any table at compile time; generated types
  catch typos and breaking schema changes.
- **Pick a real `notes` replacement**, or accept the example as a
  reference and delete it before launch. The schema + RLS pattern
  is the asset, not the table itself.
- **Set up monitoring** — Vercel Analytics, Sentry, or whatever you
  prefer. Not wired in by default to avoid forcing a vendor.
