import Link from "next/link";
import {
  ArrowRight,
  Database,
  FileCode2,
  GitBranch,
  KeyRound,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

const stack = ["Next.js 16", "Supabase", "shadcn/ui", "Tailwind 4", "Zod", "Turborepo", "pnpm"];

const features = [
  {
    icon: KeyRound,
    title: "Auth & Sessions",
    body: "Supabase magic-link sign-in, PKCE callback, and session refresh in the root proxy. Protected /app routes out of the box.",
  },
  {
    icon: ShieldCheck,
    title: "Database with RLS",
    body: "Postgres + per-user Row Level Security on every table. Example notes migration ships with explicit select/insert/update/delete policies.",
  },
  {
    icon: FileCode2,
    title: "Server Actions UI",
    body: "shadcn/ui + Server Actions for CRUD. No client fetch boilerplate, no API routes to maintain, revalidatePath where it matters.",
  },
  {
    icon: Layers,
    title: "Type-safe Contracts",
    body: "Zod schemas in @zerostack/contracts are the single source of truth — types are inferred, never duplicated across web, mobile, and server.",
  },
  {
    icon: GitBranch,
    title: "Monorepo DX",
    body: "pnpm workspaces + Turborepo. One lockfile, filtered commands per package, shared tsconfig base. Mobile app slot ready.",
  },
  {
    icon: Database,
    title: "Production CI",
    body: "GitHub Actions runs typecheck, lint, and build on every push and PR. MIT-licensed, no telemetry, no vendor lock-in beyond Supabase.",
  },
];

const quickstart = [
  { step: 1, title: "Clone the template", code: "npx degit zerox9dev/zerostack my-app" },
  { step: 2, title: "Install deps", code: "cd my-app && pnpm install" },
  {
    step: 3,
    title: "Wire Supabase",
    code: "cp .env.example apps/web/.env.local\n# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  },
  { step: 4, title: "Run it", code: "pnpm dev" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Monorepo SaaS starter
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              The Next.js + Supabase boilerplate, ready to fork.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              zerostack ships a working auth flow, Row-Level-Security schema, and a typed
              CRUD example — wired up across a pnpm + Turborepo monorepo. Clone it, run one
              command, and start building the app instead of the plumbing.
            </p>

            <div className="mt-8 max-w-xl">
              <div className="rounded-lg border bg-muted/30 px-4 py-3 font-mono text-sm">
                <span className="text-muted-foreground">$ </span>
                npx degit zerox9dev/zerostack my-app
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href="#quickstart">
                  Get started <ArrowRight className="ml-1 size-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://github.com/zerox9dev/zerostack">View on GitHub</a>
              </Button>
            </div>

            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              No boilerplate · No config hell · Just ship
            </p>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Built on
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {stack.map((s) => (
                <span key={s} className="font-medium text-foreground/80">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Built for SaaS
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">
              Everything you keep rebuilding, already wired up.
            </h2>

            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex flex-col gap-3 bg-background p-6">
                  <Icon className="size-5 text-foreground/80" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick start */}
        <section id="quickstart">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Quick start
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">
              From zero to a running app in four steps.
            </h2>

            <ol className="mt-10 flex flex-col gap-4">
              {quickstart.map(({ step, title, code }) => (
                <li key={step} className="rounded-lg border p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-mono text-muted-foreground">0{step}</span>
                    <h3 className="font-semibold">{title}</h3>
                  </div>
                  <pre className="mt-3 overflow-x-auto rounded-md bg-muted/40 p-3 font-mono text-sm">
{code}
                  </pre>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href="https://github.com/zerox9dev/zerostack#readme">
                  Read the full README <ArrowRight className="ml-1 size-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app">Try the demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Stay in the loop
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">
              Get a heads-up when new modules ship.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Drop your email — we&apos;ll send a short note when major additions
              (Stripe, teams, mobile) land. No noise.
            </p>
            <div className="mt-6">
              <WaitlistForm source="landing" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
