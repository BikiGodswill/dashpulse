import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const SUPABASE_CONFIGURED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Lazy singleton — only created when Supabase is configured
let _client = null;

export function getSupabaseClient() {
  if (!SUPABASE_CONFIGURED) return null;
  if (!_client) {
    _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

// Named export for convenience (may be null if not configured)
export const supabase = SUPABASE_CONFIGURED
  ? (() => {
      _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return _client;
    })()
  : null;

