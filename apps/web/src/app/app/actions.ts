"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNoteSchema } from "@zerostack/contracts";
import { supabaseServer } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

export type CreateNoteState = { ok: boolean; message: string } | null;

export async function createNote(_prev: CreateNoteState, formData: FormData): Promise<CreateNoteState> {
  const parsed = createNoteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: "Title is required (max 200 chars)." };
  }

  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "Not signed in." };

  const { error } = await supabase.from("notes").insert({
    user_id: userData.user.id,
    title: parsed.data.title,
    content: parsed.data.content,
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/app");
  return { ok: true, message: "Saved." };
}

export async function deleteNote(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await supabaseServer();
  // RLS guarantees only the owner can delete; no extra check needed.
  await supabase.from("notes").delete().eq("id", id);
  revalidatePath("/app");
}
