import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "#features", label: "Features" },
  { href: "#stack", label: "Stack" },
  { href: "#quickstart", label: "Quick start" },
  { href: "#waitlist", label: "Waitlist" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          zerostack
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/zerox9dev/zerostack"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/app">Open app</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
