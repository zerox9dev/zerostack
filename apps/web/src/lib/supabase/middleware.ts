import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@zerostack/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    getAll: () => request.cookies.getAll().map(({ name, value }) => ({ name, value })),
    setAll: (toSet) => {
      for (const { name, value } of toSet) {
        request.cookies.set(name, value);
      }
      response = NextResponse.next({ request });
      for (const { name, value, options } of toSet) {
        response.cookies.set(name, value, options);
      }
    },
  });

  // Touching getUser() refreshes the session cookies via setAll above.
  const { data } = await supabase.auth.getUser();

  return { response, user: data.user };
}
