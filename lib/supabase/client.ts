import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function hasSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  if (_client) return _client;
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

// Lazy proxy — `supabase.auth...` works at call time, not import time.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const c = getSupabaseClient();
    if (!c) {
      throw new Error(
        "Supabase client accessed but NEXT_PUBLIC_SUPABASE_URL is not set. Guard with hasSupabase().",
      );
    }
    return Reflect.get(c, prop, receiver);
  },
});
