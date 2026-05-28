import { createServerClient as createSsrServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "./types";

export type CookieToSet = { name: string; value: string; options?: CookieOptions };

export type CookieAdapter = {
  getAll: () => { name: string; value: string }[];
  setAll: (cookies: CookieToSet[]) => void;
};

export function createServerClient(url: string, anonKey: string, cookies: CookieAdapter) {
  return createSsrServerClient<Database>(url, anonKey, { cookies });
}
