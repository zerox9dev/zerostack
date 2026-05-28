"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNote, type CreateNoteState } from "./actions";

export function NoteForm() {
  const [state, action, pending] = useActionState<CreateNoteState, FormData>(createNote, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          placeholder="What's on your mind?"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          rows={3}
          maxLength={10_000}
          placeholder="Optional — write a few lines, or leave it blank."
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        {state && !state.ok ? (
          <span className="text-sm text-red-600">{state.message}</span>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={pending}>
          <Plus className="size-4" />
          {pending ? "Saving…" : "Add note"}
        </Button>
      </div>
    </form>
  );
}
