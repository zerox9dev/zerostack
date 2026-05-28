<!--
Read docs/contributing.md before opening this PR. PRs that bundle
unrelated changes, touch frozen files without rationale, or skip the
checklist below are likely to be closed without review.
-->

## What this changes

One paragraph. What's the diff doing and why now?

## Linked issue

Closes #… (or "no linked issue — trivial fix" / "proposal #…")

## File classes touched

Tick everything that applies. If you tick "frozen", the PR needs
maintainer review (enforced via CODEOWNERS) and a clear reason why
the change can't be done in the fork.

- [ ] **Frozen** — auth, SEO, CI, infrastructure, shipped templates
  (settings/admin/widgets), template migrations. Rationale required
  below.
- [ ] **Customize** — brand/copy that forks override (`site.ts`,
  landing, navbar, footer, README, LICENSE, root `package.json`).
- [ ] **Extend** — examples, new docs, new optional modules.

If you ticked **Frozen**, explain why this can't be a fork-local patch:

> _replace with rationale, or delete this block_

## How I tested

- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm build` (placeholder Supabase env is fine)
- [ ] Manual smoke test in `pnpm dev` (which routes / flows)

If the change touches DB / RLS: explain how you verified policies
behave correctly (e.g. ran the migration against a fresh Supabase
project and tested with two accounts).

## CHANGELOG

- [ ] I added a bullet to `[Unreleased]` in `CHANGELOG.md`, OR
- [ ] This is a docs-only / internal-only change that doesn't need
  a CHANGELOG entry.

## Notes for the reviewer

Anything else worth knowing — design choices, alternatives I rejected,
follow-up work I'm deliberately leaving for later.
