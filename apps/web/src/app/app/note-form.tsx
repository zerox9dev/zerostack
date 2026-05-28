"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNote, type CreateNoteState } from "./actions";

export function NoteForm() {
  const [state, action, pending] = useActionState<CreateNoteState, FormData>(createNote, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required maxLength={200} placeholder="New note" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="content">Content</Label>
        <Input id="content" name="content" placeholder="Optional" />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add note"}
        </Button>
        {state && !state.ok && <span className="text-sm text-red-600">{state.message}</span>}
      </div>
    </form>
  );
}
