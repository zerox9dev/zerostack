import "server-only";

import { createServiceClient } from "@zerostack/supabase";
import { supabaseEnv } from "./env";

function requiredServiceKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("Missing required env var: SUPABASE_SERVICE_ROLE_KEY");
  return value;
}

// Bypasses RLS. Only call from server components, server actions, or
// route handlers. The `server-only` import above turns a misuse from
// a runtime leak into a build-time error.
export function supabaseService() {
  const { url } = supabaseEnv();
  return createServiceClient(url, requiredServiceKey());
}
