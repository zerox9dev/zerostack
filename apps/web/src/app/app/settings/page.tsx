import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminEmail } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { AppNav } from "../app-nav";
import { signOut } from "../actions";
import { ProfileForm } from "./profile-form";

type ProfileRow = { display_name: string | null };

export default async function SettingsPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const showAdmin = isAdminEmail(userData.user.email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", userData.user.id)
    .maybeSingle<ProfileRow>();

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav email={userData.user.email ?? ""} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
            <Link href="/app">
              <ArrowLeft className="size-4" />
              Back to notes
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your account preferences. Changes are private to you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>How you appear inside the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm initialDisplayName={profile?.display_name ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>The email tied to this session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userData.user.email}</p>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>

        {showAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
              <CardDescription>Internal dashboards. Visible only to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/app/admin">
                  <Shield className="size-4" />
                  Open admin
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
