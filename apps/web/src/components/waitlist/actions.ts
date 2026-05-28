"use server";

import { headers } from "next/headers";
import { joinWaitlistSchema } from "@zerostack/contracts";
import { supabaseServer } from "@/lib/supabase/server";

export type JoinWaitlistState = { ok: boolean; message: string } | null;

export async function joinWaitlist(
  _prev: JoinWaitlistState,
  formData: FormData,
): Promise<JoinWaitlistState> {
  const parsed = joinWaitlistSchema.safeParse({
    email: formData.get("email"),
    source: (formData.get("source") as string | null) ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email." };
  }

  const supabase = await supabaseServer();
  const userAgent = (await headers()).get("user-agent");

  const { error } = await supabase.from("waitlist").insert({
    email: parsed.data.email,
    source: parsed.data.source ?? null,
    user_agent: userAgent,
  });

  if (error) {
    // 23505 = unique_violation on the lower(email) index.
    if (error.code === "23505") {
      return { ok: true, message: "You're already on the list. We'll be in touch." };
    }
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "You're on the list. Thanks!" };
}
