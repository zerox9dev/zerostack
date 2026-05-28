"use server";

import { submitFeedbackSchema } from "@zerostack/contracts";
import { supabaseServer } from "@/lib/supabase/server";

export type FeedbackState = { ok: boolean; message: string } | null;

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const parsed = submitFeedbackSchema.safeParse({
    message: formData.get("message"),
    page: (formData.get("page") as string | null) ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "Not signed in." };

  const { error } = await supabase.from("feedback").insert({
    user_id: userData.user.id,
    message: parsed.data.message,
    page: parsed.data.page ?? null,
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Thanks — we read every one." };
}
