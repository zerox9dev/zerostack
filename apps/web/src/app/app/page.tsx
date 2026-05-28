import { redirect } from "next/navigation";
import { NotebookPen, Trash2 } from "lucide-react";
import { noteSchema, type Note } from "@zerostack/contracts";
import { Button } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { AppNav } from "./app-nav";
import { deleteNote } from "./actions";
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
    <div className="flex min-h-screen flex-col">
      <AppNav email={userData.user.email ?? ""} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your notes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {notes.length === 0
                ? "Nothing here yet."
                : `${notes.length} ${notes.length === 1 ? "note" : "notes"} · only you can see them.`}
            </p>
          </div>
        </div>

        <NoteForm />

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            {error.message}
          </p>
        )}

        <ul className="flex flex-col gap-3">
          {notes.length === 0 && !error && (
            <li className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
              <NotebookPen className="size-8 text-muted-foreground/60" />
              <div>
                <p className="font-medium">No notes yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Use the form above to add your first.</p>
              </div>
            </li>
          )}
          {notes.map((note) => (
            <li
              key={note.id}
              className="group flex items-start justify-between gap-3 rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-border"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{note.title}</p>
                {note.content && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  aria-label="Delete note"
                  className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="size-4" />
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
