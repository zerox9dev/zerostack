import "server-only";

// Returns the lowercased admin email allowlist from ADMIN_EMAILS env.
// Empty list = nobody is an admin (admin routes will 404).
function adminEmails(): readonly string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}
