import { createBrowserClient as createSsrBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createBrowserClient(url: string, anonKey: string) {
  return createSsrBrowserClient<Database>(url, anonKey);
}
