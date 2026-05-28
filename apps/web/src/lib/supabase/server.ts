import { cookies } from "next/headers";
import { createServerClient } from "@zerostack/supabase";
import { supabaseEnv } from "./env";

export async function supabaseServer() {
  const { url, anonKey } = supabaseEnv();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
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
