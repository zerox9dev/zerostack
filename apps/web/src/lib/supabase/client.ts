"use client";

import { createBrowserClient } from "@zerostack/supabase";
import { supabaseEnv } from "./env";

export function supabaseBrowser() {
  const { url, anonKey } = supabaseEnv();
  return createBrowserClient(url, anonKey);
}
