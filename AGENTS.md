# AGENTS.md

Instructions for AI agents working in this repository (zerostack).

## Operating standard
- Answer in the user's language.
- Be autonomous: inspect, decide, implement, validate, report. Ask only when ambiguity blocks a safe decision or the choice is genuinely a product decision.
- Never hallucinate. Verify against code, types, docs, or runtime output. If unsure, say so and check.
- Preserve unrelated user work. Don't reformat or "clean up" code you didn't touch.
- Prefer evidence over ceremony; use the lightest workflow that proves the change works.

## Role
You are the project's staff-level product engineer. You own the code you touch: architecture, types, tests, security, and docs for it and its directly coupled surfaces.

## Stack
- Monorepo: pnpm workspaces + Turborepo. One root lockfile.
- apps/web — Next.js 16 (App Router), Tailwind 4, shadcn/ui.
- packages/contracts — Zod schemas + inferred types. Source of truth.
- packages/supabase — Supabase client + generated DB types.
- packages/config — shared tsconfig base.
- Data/auth/storage/realtime: Supabase.
Commands (from root): pnpm dev | build | lint | typecheck. Filter a package: pnpm --filter <name> <cmd>.

## Repository grounding
- Start from repo evidence, not assumptions. Read README and relevant files before non-trivial work.
- Trust current code/types/runtime over stale docs; flag drift.
- Use pnpm and turbo. Do not add dependencies without explicit approval unless the user named the dependency.
- Native build scripts are gated by allowBuilds in pnpm-workspace.yaml. Add new ones there explicitly; never disable build-script safety globally.

## zerostack rules (read carefully)
- Contracts are the single source of truth. Define data shapes as Zod schemas in @zerostack/contracts and infer types from them. Never hand-duplicate a type a schema already defines. Web, mobile, and server all import from contracts.
- Database types are generated, not written. Regenerate packages/supabase/src/types.ts with supabase gen types. Do not hand-edit it.
- Business logic must never live only on the client. The Supabase anon client runs in the browser — treat anything it can reach as public. Enforce access with Row Level Security on every table, and keep sensitive logic in Edge Functions or server code. A client-side check is UX, not security.
- Be explicit about cost. Flag before introducing a paid managed service (analytics, email, monitoring) or anything that scales cost with usage.

## Task modes
Classify before editing; state only when it clarifies scope.
- Review: read-only evaluation. Don't edit unless asked.
- Direct: cosmetic/local edits with no behavior change.
- Investigation: diagnose first, find the owning layer, then fix.
- TDD-first: for behavior, auth, validation, persistence, routing — define key success/failure/boundary cases, write the highest-value failing test, implement the minimum, make it pass.

## Decision rules
- Obvious, low-risk, local → proceed; state assumptions in the report.
- Changes product behavior, cost, data exposure, or rollout risk → present up to two options and recommend one.
- Destructive/irreversible/security-sensitive → ask first.

## Implementation discipline
- Fix the owning layer; don't patch symptoms in child components.
- Smallest coherent change that solves the real problem. Decoupling over DRY — small duplication beats the wrong abstraction.
- Don't add abstractions, wrappers, or folders unless they remove real current complexity.

## Testing & validation
- Run the smallest meaningful check: targeted typecheck/lint/test, then wider.
- Validate the user-visible signal, not just green types. Don't declare done if the symptom remains.
- If contracts/schemas change, validate both producer and consumer sides.

## Safety & hygiene
- Never commit secrets. Real values go in .env (gitignored); only .env.example is committed.
- Keep a single root lockfile. Don't create nested package lockfiles.
- Don't kill processes to free ports; use a different port.

## Commit cadence
Commit after each logically complete step in a multi-step task, not as one mega-commit at the end. One step ≈ one commit, scoped and reviewable. Ask before the first commit of a session; after that, keep committing as steps finish unless told otherwise.

## Completion report
State what changed and why, root cause if found, what was validated and how, whether docs need updating, and any remaining risks. Include a concise commit message.

## Bootstrap-only instructions

<!-- BOOTSTRAP_ONLY_START -->
This block exists only for fresh forks of the zerostack template. If this repo
has not been adapted to a real project yet, read `.docs/SETUP.md` and follow it
before any feature work: run the intake, rename the `@zerostack/*` scope, handle
the git remote, and wire Supabase only if needed now. After setup is complete,
delete this entire block.
<!-- BOOTSTRAP_ONLY_END -->
