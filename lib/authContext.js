'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabaseClient, SUPABASE_CONFIGURED } from '@/lib/supabaseClient';

const AuthContext = createContext({
  user: null,
  profile: null,
  isSupabaseConfigured: SUPABASE_CONFIGURED,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsConfirmation: false }),
  signOut: async () => {},
});

// Use maybeSingle() — returns null instead of error when row is missing
// Wrapped in try/catch so a missing table never hangs the app
async function fetchProfile(userId) {
  try {
    const sb = getSupabaseClient();
    if (!sb) return null;
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    const sb = getSupabaseClient();

    // Resolve the initial session — always finishes fast
    sb.auth.getUser().then(async ({ data }) => {
      const u = data?.user ?? null;
      setUser(u);
      setLoading(false); // ← unblock the UI immediately
      if (u) {
        // Load profile in the background — doesn't block anything
        fetchProfile(u.id).then(p => setProfile(p));
      }
    });

    // Keep user state in sync with token refreshes / sign-outs in other tabs
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u.id).then(p => setProfile(p));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── signIn ──────────────────────────────────────────────────────
  // Returns immediately after Supabase confirms credentials.
  // Does NOT wait for fetchProfile — that would cause the loading-forever bug.
  const signIn = useCallback(async ({ email, password }) => {
    if (!SUPABASE_CONFIGURED) {
      return { error: { message: 'Supabase is not configured. Add your credentials to .env.local.' } };
    }
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return { error: error ?? null };
  }, []);

  // ── signUp ──────────────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, fullName, company }) => {
    if (!SUPABASE_CONFIGURED) {
      return {
        error: { message: 'Supabase is not configured. Add your credentials to .env.local.' },
        needsConfirmation: false,
      };
    }
    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '', company: company || '' } },
    });
    if (error) return { error, needsConfirmation: false };
    // needsConfirmation = true when Supabase requires email verification
    return { error: null, needsConfirmation: !data.session };
  }, []);

  // ── signOut ──────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const sb = getSupabaseClient();
    if (sb) await sb.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, profile,
      isSupabaseConfigured: SUPABASE_CONFIGURED,
      loading,
      signIn, signUp, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
