import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Prefer `SUPABASE_SERVICE_ROLE_KEY` for updates
 * (bypasses RLS). Without it, the anon key is used and `UPDATE` on `orders`
 * must be allowed by an RLS policy in Supabase.
 */
export function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
    );
  }

  const key = service && service.length > 0 ? service : anon;
  return createClient(url, key, { auth: { persistSession: false } });
}
