import { redirect } from "next/navigation";
import { noteSchema, type Note } from "@zerostack/contracts";
import { Button } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { deleteNote, signOut } from "./actions";
import { NoteForm } from "./note-form";

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
};

function toNote(row: NoteRow): Note {
  return noteSchema.parse({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  });
}

export default async function AppPage() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: rows, error } = await supabase
    .from("notes")
    .select("id, user_id, title, content, created_at")
    .order("created_at", { ascending: false })
    .returns<NoteRow[]>();

  const notes = rows?.map(toNote) ?? [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your notes</h1>
          <p className="text-sm text-muted-foreground">{userData.user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">Sign out</Button>
        </form>
      </header>

      <NoteForm />

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ul className="flex flex-col gap-3">
        {notes.length === 0 && !error && (
          <li className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No notes yet. Add your first above.
          </li>
        )}
        {notes.map((note) => (
          <li key={note.id} className="flex items-start justify-between gap-3 rounded-lg border p-4">
            <div className="min-w-0">
              <p className="font-medium">{note.title}</p>
              {note.content && <p className="mt-1 text-sm text-muted-foreground">{note.content}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <Button type="submit" variant="ghost" size="sm">Delete</Button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
