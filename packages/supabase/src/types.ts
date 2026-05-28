// Placeholder until you run `pnpm --filter @zerostack/supabase db:types`.
// Generated types replace this file; never hand-edit after generation.
//
// The permissive shape below lets app code call `.from(...).select/insert/...`
// without TS errors before a real Supabase project is wired. Runtime safety
// comes from Zod schemas in @zerostack/contracts.

export type Database = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      }
    >;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
