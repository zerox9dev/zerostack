import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "./actions";

export function AppNav({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          zerostack
        </Link>
        <div className="flex items-center gap-1">
          <span className="mr-2 hidden text-sm text-muted-foreground sm:inline">{email}</span>
          <ThemeToggle />
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
