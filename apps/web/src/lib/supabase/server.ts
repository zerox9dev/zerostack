import { cookies } from "next/headers";
import { createServerClient } from "@zerostack/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    getAll: () => cookieStore.getAll().map(({ name, value }) => ({ name, value })),
    setAll: (toSet) => {
      try {
        for (const { name, value, options } of toSet) {
          cookieStore.set(name, value, options);
        }
      } catch {
        // Called from a Server Component — cookies are read-only there.
        // Middleware refreshes the session, so this is safe to ignore.
      }
    },
  });
}
