"use server";

import { headers } from "next/headers";
import { signInSchema } from "@zerostack/contracts";
import { supabaseServer } from "@/lib/supabase/server";

export type SignInState = { ok: boolean; message: string } | null;

export async function signInWithEmail(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const supabase = await supabaseServer();
  const origin = (await headers()).get("origin") ?? "";
  const next = (formData.get("next") as string | null) ?? "/app";

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Check your email for the sign-in link." };
}
