// Resolves the canonical site URL in this order:
//   1. NEXT_PUBLIC_SITE_URL (explicit, stable — set this in prod)
//   2. https://${VERCEL_URL} (auto-set by Vercel on every deployment)
//   3. http://localhost:3000 (local dev fallback)
// All metadata, robots, and sitemap helpers go through this so forks
// only have to change one variable to rebrand the deployment.
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "zerostack",
  title: "zerostack — Next.js + Supabase SaaS starter",
  description:
    "A production-ready Next.js 16 + Supabase monorepo starter. Magic-link auth, Row Level Security, Server Actions CRUD, Zod contracts, and CI — wired up and MIT-licensed.",
  keywords: [
    "Next.js boilerplate",
    "Supabase boilerplate",
    "SaaS starter",
    "Next.js Supabase template",
    "pnpm monorepo",
    "Turborepo starter",
    "shadcn/ui",
    "Tailwind CSS",
    "Server Actions",
    "Row Level Security",
    "TypeScript",
  ],
  author: "zerox9dev",
  githubUrl: "https://github.com/zerox9dev/zerostack",
} as const;
