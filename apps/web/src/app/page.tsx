import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">zerostack</h1>
      <p className="text-muted-foreground">Modern monorepo starter</p>
      <Button>Get started</Button>
    </main>
  );
}
