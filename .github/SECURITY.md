# Security policy

## Reporting a vulnerability

**Do not file a public issue for security problems.** Use GitHub
private vulnerability reporting:

➡️ https://github.com/zerox9dev/zerostack/security/advisories/new

The form lets you describe the issue, attach a proof of concept, and
chat with the maintainer without exposing the problem to the public
issue tracker.

If GitHub advisories are unavailable, open a regular issue titled
`security: contact request` (no details) and the maintainer will
follow up through a private channel. Acknowledgement within 7 days;
chase with a follow-up if I miss that window.

## What counts as a vulnerability in this template

The template ships auth, RLS-backed data access, a public landing
with email capture, and an admin route protected by an
allowlist. Take these seriously:

- A way to read or write `notes`, `profiles`, `waitlist`, or
  `feedback` rows you don't own through the anon client.
- A way to reach `/app/admin` without being on the `ADMIN_EMAILS`
  allowlist.
- Magic-link or PKCE flow flaws (replay, redirect-URL confusion,
  session fixation).
- A way to make the server leak `SUPABASE_SERVICE_ROLE_KEY` to the
  browser bundle.
- Anything that bypasses the husky / CI guards in a way that lets a
  malicious dep slip through.

Take these seriously but **not** "security":

- A misconfigured Supabase project (e.g. RLS disabled on a fork's
  custom table) — that's a fork-level operations issue, document it
  in `docs/production-checklist.md` instead.
- Public information being public (the OG endpoint, robots.txt,
  sitemap.xml).
- Missing security headers you'd add via Vercel config — not the
  template's job to ship those for you.

## What I do on receipt

1. Acknowledge within 7 days.
2. Triage privately — confirm reproduction, scope, severity.
3. Patch on a private branch. CI runs.
4. Coordinate disclosure with you (CVE if applicable). Default
   embargo: 30 days from triage, or whenever the patch ships to a
   tagged release, whichever is later.
5. Credit you in the release notes unless you ask otherwise.

## Supported versions

Only `main` is actively patched. Older tags receive fixes only if a
forking project is known to depend on them.
