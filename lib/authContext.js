"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getSupabaseClient, SUPABASE_CONFIGURED } from "@/lib/supabaseClient";

const DEMO_COOKIE = "dashpulse_demo";

// ─── helpers ────────────────────────────────────────────────────────
function readDemoCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${DEMO_COOKIE}=true`));
}
function writeDemoCookie(on) {
  if (typeof document === "undefined") return;
  document.cookie = on
    ? `${DEMO_COOKIE}=true; path=/; max-age=86400; SameSite=Lax`
    : `${DEMO_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

const DEMO_USER = {
  id: "demo",
  email: "demo@dashpulse.io",
  user_metadata: { full_name: "Demo User", company: "DashPulse Demo" },
};

// ─── context ────────────────────────────────────────────────────────
const AuthContext = createContext({
  user: null,
  profile: null,
  isDemo: false,
  isSupabaseConfigured: SUPABASE_CONFIGURED,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsConfirmation: false }),
  signOut: async () => {},
  enterDemoMode: () => {},
});

// ─── provider ───────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch extended profile row from public.profiles
  async function fetchProfile(userId) {
    const sb = getSupabaseClient();
    if (!sb) return null;
    const { data } = await sb
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data ?? null;
  }

  useEffect(() => {
    // Demo mode check first
    if (readDemoCookie()) {
      setIsDemo(true);
      setUser(DEMO_USER);
      setProfile({
        full_name: "Demo User",
        email: "demo@dashpulse.io",
        plan: "pro",
      });
      setLoading(false);
      return;
    }

    if (!SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    const sb = getSupabaseClient();

    // Initial session
    sb.auth.getUser().then(async ({ data }) => {
      const u = data?.user ?? null;
      setUser(u);
      if (u) setProfile(await fetchProfile(u.id));
      setLoading(false);
    });

    // Live session changes (login / logout / token refresh)
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setProfile(await fetchProfile(u.id));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── signIn ──────────────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password }) => {
    if (!SUPABASE_CONFIGURED) {
      return {
        error: {
          message:
            "Supabase is not configured. Use Demo mode to explore the dashboard.",
        },
      };
    }

    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    // Set user immediately so context is ready before the redirect
    setUser(data.user);
    if (data.user) setProfile(await fetchProfile(data.user.id));

    return { error: null };
  }, []);

  // ── signUp ──────────────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, fullName, company }) => {
    if (!SUPABASE_CONFIGURED) {
      return {
        error: {
          message:
            "Supabase is not configured. Use Demo mode to explore the dashboard.",
        },
        needsConfirmation: false,
      };
    }

    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || "", company: company || "" },
      },
    });

    if (error) return { error, needsConfirmation: false };

    // If there is no session the project requires email confirmation
    const needsConfirmation = !data.session;

    if (!needsConfirmation && data.user) {
      setUser(data.user);
      setProfile(await fetchProfile(data.user.id));
    }

    return { error: null, needsConfirmation };
  }, []);

  // ── signOut ──────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (isDemo) {
      writeDemoCookie(false);
      setIsDemo(false);
      setUser(null);
      setProfile(null);
      return;
    }
    const sb = getSupabaseClient();
    if (sb) await sb.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [isDemo]);

  // ── enterDemoMode ────────────────────────────────────────────────
  const enterDemoMode = useCallback(() => {
    writeDemoCookie(true);
    setIsDemo(true);
    setUser(DEMO_USER);
    setProfile({
      full_name: "Demo User",
      email: "demo@dashpulse.io",
      plan: "pro",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isDemo,
        isSupabaseConfigured: SUPABASE_CONFIGURED,
        loading,
        signIn,
        signUp,
        signOut,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
