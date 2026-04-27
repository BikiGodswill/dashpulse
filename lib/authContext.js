'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, SUPABASE_CONFIGURED } from '@/lib/supabaseClient';

const DEMO_COOKIE = 'dashpulse_demo';

const AuthContext = createContext({
  user: null,
  isDemo: false,
  isSupabaseConfigured: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  enterDemoMode: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Read demo cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      acc[k] = v;
      return acc;
    }, {});

    if (cookies[DEMO_COOKIE] === 'true') {
      setIsDemo(true);
      setUser({ id: 'demo', email: 'demo@dashpulse.io', user_metadata: { full_name: 'Demo User' } });
      setLoading(false);
      return;
    }

    if (!SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    // Real Supabase auth
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  function setDemoCookie(value) {
    if (value) {
      document.cookie = `${DEMO_COOKIE}=true; path=/; max-age=86400; SameSite=Lax`;
    } else {
      document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0`;
    }
  }

  const enterDemoMode = useCallback(() => {
    setDemoCookie(true);
    setIsDemo(true);
    setUser({ id: 'demo', email: 'demo@dashpulse.io', user_metadata: { full_name: 'Demo User' } });
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    if (!SUPABASE_CONFIGURED) {
      return { error: { message: 'Supabase is not configured. Use Demo mode instead.' } };
    }
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.data?.user) setUser(result.data.user);
    return result;
  }, []);

  const signUp = useCallback(async ({ email, password, fullName, company }) => {
    if (!SUPABASE_CONFIGURED) {
      return { error: { message: 'Supabase is not configured. Use Demo mode instead.' } };
    }
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, company },
      },
    });
    return result;
  }, []);

  const signOut = useCallback(async () => {
    if (isDemo) {
      setDemoCookie(false);
      setIsDemo(false);
      setUser(null);
      return;
    }
    if (SUPABASE_CONFIGURED) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, [isDemo]);

  return (
    <AuthContext.Provider value={{
      user,
      isDemo,
      isSupabaseConfigured: SUPABASE_CONFIGURED,
      loading,
      signIn,
      signUp,
      signOut,
      enterDemoMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
