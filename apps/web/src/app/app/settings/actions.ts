"use server";

import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@zerostack/contracts";
import { supabaseServer } from "@/lib/supabase/server";

export type UpdateProfileState = { ok: boolean; message: string } | null;

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get("displayName") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: "Display name must be 80 characters or fewer." };
  }

  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "Not signed in." };

  // Upsert keeps this resilient if the handle_new_user trigger ever
  // fails to fire (e.g. table created after the user signed up).
  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: userData.user.id,
      display_name: parsed.data.displayName,
      updated_at: new Date().toISOString(),
    });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/app/settings");
  return { ok: true, message: "Saved." };
}
