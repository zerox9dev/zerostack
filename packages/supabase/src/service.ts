import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service-role client. Bypasses RLS. Server-only — never import from
// a "use client" module or any code path that reaches the browser.
// The persistSession=false guard makes sure the SDK never tries to
// store an auth session for a key that already has full access.
export function createServiceClient(url: string, serviceRoleKey: string) {
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
