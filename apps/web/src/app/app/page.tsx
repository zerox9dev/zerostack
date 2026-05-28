import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AppPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">You're in</h1>
          <p className="text-sm text-muted-foreground">Signed in as {data.user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">Sign out</Button>
        </form>
      </div>
    </main>
  );
}
