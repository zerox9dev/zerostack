import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isAdminEmail } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";
import { AppNav } from "../app-nav";

type WaitlistRow = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

type FeedbackRow = {
  id: string;
  user_id: string;
  message: string;
  page: string | null;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  if (!isAdminEmail(userData.user.email)) notFound();

  const service = supabaseService();

  const [{ data: waitlistRows }, { data: feedbackRows }] = await Promise.all([
    service
      .from("waitlist")
      .select("id, email, source, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<WaitlistRow[]>(),
    service
      .from("feedback")
      .select("id, user_id, message, page, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<FeedbackRow[]>(),
  ]);

  const waitlist = waitlistRows ?? [];
  const feedback = feedbackRows ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav email={userData.user.email ?? ""} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
            <Link href="/app">
              <ArrowLeft className="size-4" />
              Back to notes
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reads via the service-role key. Visible only to emails in
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">ADMIN_EMAILS</code>.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Waitlist</CardTitle>
            <CardDescription>
              {waitlist.length === 0
                ? "No signups yet."
                : `${waitlist.length} most recent ${waitlist.length === 1 ? "entry" : "entries"}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {waitlist.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Signed up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlist.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.email}</TableCell>
                      <TableCell className="text-muted-foreground">{row.source ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(row.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              {feedback.length === 0
                ? "No feedback yet."
                : `${feedback.length} most recent ${feedback.length === 1 ? "message" : "messages"}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="max-w-md whitespace-pre-wrap">{row.message}</TableCell>
                      <TableCell className="text-muted-foreground">{row.page ?? "—"}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(row.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
