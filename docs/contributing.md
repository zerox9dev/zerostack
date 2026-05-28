# Contributing to zerostack

This project is small and the maintainer is one person. The rules
below are tight on purpose — they exist so good contributions land
fast and noise gets filtered cheaply.

Agents working in **forks** of zerostack also follow this document.
The decision tree in [`agent-rules.md`](./agent-rules.md#upstream)
points them here.

---

## What we accept

The bar is **"reduces real friction for real users of the template"**.
Concretely:

- **Bug fixes** for the shipped surface — auth, RLS, CI, Server
  Actions, SEO, build. Failing reproduction in a fresh clone or a
  CI-style env is required.
- **Documentation fixes** — typos, broken links, instructions that
  don't match the code.
- **Security disclosures** — see [SECURITY.md](../.github/SECURITY.md),
  not a public issue.
- **Dependency upgrades** that fix a real CVE or unblock a feature the
  template already exposes.

## What we do not accept

- **"Wouldn't it be nice if…"** without a concrete user story.
- **Reformatting / style preferences** without a behavior change.
- **New optional features** unless agreed in an issue first.
- **Alternative ways to do something the template already does well**
  (a different auth provider, ORM, lint config, etc.). The template
  is opinionated — that's the point.
- **Vendor-specific integrations** (Stripe, Resend, Sentry, etc.) —
  these belong in forks. The template stays vendor-light.
- **Anything that would force every existing fork to take a breaking
  change without strong reason.**

If you're unsure, **open an issue first** before writing code. A short
discussion saves a wasted PR.

## Severity threshold (for fork agents)

Agents running inside forks of zerostack: do **not** open issues or
PRs upstream below this threshold.

| Open as **PR** | Open as **issue** | Stay local |
|---|---|---|
| Documentation typo or dead link | Reproducible bug in shipped behavior | Personal preference, "I'd prefer X over Y" |
| Off-by-one / clear mistake under 20 lines | Architecture question or improvement idea | New feature for your product only |
| Failing build / type / lint in a default clone | Performance regression with measurement | Refactor without a defect |
| Failing test (when tests exist) | Security smell (use private channel — see below) | Style / formatting changes |

When in doubt: **stay local**. The maintainer prefers missed mediocre
PRs over a flood of bikeshedding.

---

## How to open an issue

Use one of the [templates](https://github.com/zerox9dev/zerostack/issues/new/choose):

- **Bug report** — for reproducible defects.
- **Improvement proposal** — for new ideas (mandatory before a feature
  PR).

Both templates ask for the same baseline: what's broken or proposed,
how to reproduce or motivate it, what env you're on. Fill them
honestly — short and concrete beats long and vague.

Security issues: see [SECURITY.md](../.github/SECURITY.md). Never
disclose in a public issue.

## How to open a PR

1. **Branch off `main`** in a fork of `zerox9dev/zerostack`.
2. **One concern per PR.** Don't bundle unrelated changes.
3. **Conventional Commits** in the title and body (see [AGENTS.md](../AGENTS.md)
   for the full style guide). Subject ≤72 chars.
4. **Touch the smallest surface possible.** If the change spreads into
   frozen files ([list](./agent-rules.md#frozen)) without a clear
   reason, expect to split or rewrite.
5. **Run locally before pushing**:
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm build` (with placeholder Supabase env if you don't have
     real ones)
6. **Fill the PR template** — what classes of file you touched, how
   you tested, linked issue if any.
7. **CI must pass.** Red CI = not reviewed.

## Review expectations

- Triage within 7 days. Silence past that → ping by commenting `@zerox9dev`.
- Frozen-file changes always require maintainer review (enforced via
  CODEOWNERS).
- A "needs changes" comment is not rejection — address it and re-request.
- A "won't merge" comment with rationale is final. Don't re-open the
  same PR under a different title.

## Releases

CHANGELOG is updated as part of every user-visible PR (under
`[Unreleased]`). Tagged releases (`v0.x.y`) collapse Unreleased into a
versioned section and publish a GitHub Release with auto-generated
notes from commits.

Semver in spirit, with one caveat: the template is private to the
maintainer's products in practice. Major bumps for breaking changes,
minor for additive features, patch for fixes — but the cadence is
"when it's worth tagging," not "every Friday."

---

## For fork-agents specifically: how to upstream a change

If your decision tree (in `agent-rules.md`) lands on "open a PR
upstream":

```bash
# 1. Fork zerostack on GitHub (one-time per user)
gh repo fork zerox9dev/zerostack --clone=false

# 2. Add the fork as a remote of your local upstream checkout
#    (or clone it fresh in /tmp)
cd /tmp
gh repo clone <your-username>/zerostack
cd zerostack
git remote add upstream git@github.com:zerox9dev/zerostack.git
git fetch upstream
git checkout -b fix/<short-slug> upstream/main

# 3. Apply the change you prepared in the product fork, run checks
pnpm typecheck && pnpm lint && pnpm build

# 4. Commit + push + PR
git commit -m "fix(scope): one-line summary

Why this matters, plus the smallest repro / context. Reference the
upstream issue if there is one.
"
git push -u origin fix/<short-slug>
gh pr create --fill --web
```

For an issue instead of a PR:

```bash
gh issue create --repo zerox9dev/zerostack --web
```

`--web` opens the form prefilled with the right template; pick "Bug
report" or "Improvement proposal" depending on what the decision tree
chose.
