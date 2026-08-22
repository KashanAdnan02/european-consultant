export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";

export const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in your environment."
    );
  }
}
