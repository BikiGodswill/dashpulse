import { createBrowserClient } from '@supabase/ssr';

// These are set in .env.local — Next.js exposes NEXT_PUBLIC_* to the browser
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Singleton browser client — created once and reused
let _client = null;

export function getSupabaseClient() {
  if (!SUPABASE_CONFIGURED) return null;
  if (!_client) {
    _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}
