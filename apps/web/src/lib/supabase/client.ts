"use client";

import { createBrowserClient } from "@zerostack/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export function supabaseBrowser() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
