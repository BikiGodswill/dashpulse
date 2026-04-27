"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const params = useSearchParams();
  const { signIn, enterDemoMode, isSupabaseConfigured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    const { error } = await signIn({ email, password });

    if (error) {
      setLoading(false);
      const msg = error.message?.toLowerCase() || "";
      if (
        msg.includes("invalid login") ||
        msg.includes("invalid credentials")
      ) {
        setFormError("Incorrect email or password. Please try again.");
      } else if (msg.includes("email not confirmed")) {
        setFormError(
          "Please verify your email address before signing in. Check your inbox.",
        );
      } else if (msg.includes("not configured")) {
        setFormError(error.message);
      } else {
        setFormError(error.message || "Sign-in failed. Please try again.");
      }
      return;
    }

    toast.success("Welcome back!");

    // Hard navigation: ensures the browser sends the fresh Supabase session
    // cookie with the request so the middleware sees a valid session immediately.
    // client-side router.push() can race ahead of cookie propagation.
    const redirectTo = params.get("redirectTo") || "/dashboard";
    window.location.href = redirectTo;
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setFormError("");
    try {
      enterDemoMode();
      toast.success("Entering demo mode…");
      // Give the cookie a tick to be written before navigating
      await new Promise((r) => setTimeout(r, 200));
      window.location.href = "/dashboard";
    } catch {
      setDemoLoading(false);
      toast.error("Could not start demo mode. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-bg">
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="w-full max-w-sm animate-slide-up relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.3)",
            }}
          >
            <Zap size={20} style={{ color: "#00D4FF" }} />
          </div>
          <div>
            <div
              className="heading-font text-lg"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              DashPulse
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Analytics Pro
            </div>
          </div>
        </div>

        {/* Supabase-not-configured notice */}
        {!isSupabaseConfigured && (
          <div
            className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
            style={{
              background: "rgba(255,179,71,0.1)",
              border: "1px solid rgba(255,179,71,0.3)",
              color: "#FFB347",
            }}
          >
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              Supabase is not configured — email sign-in is unavailable. Use{" "}
              <strong>Demo mode</strong> to explore the dashboard.
            </span>
          </div>
        )}

        {/* Card */}
        <div className="glass-card p-7">
          <h1
            className="heading-font text-2xl mb-1 text-center"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm text-center mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Sign in to your dashboard
          </p>

          {/* Inline error */}
          {formError && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs mb-4 animate-fade-in"
              style={{
                background: "rgba(255,77,109,0.1)",
                border: "1px solid rgba(255,77,109,0.3)",
                color: "#FF4D6D",
              }}
            >
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormError("");
                }}
                required
                disabled={!isSupabaseConfigured}
                placeholder="you@company.com"
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs"
                  style={{ color: "#00D4FF" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormError("");
                  }}
                  required
                  disabled={!isSupabaseConfigured}
                  placeholder="••••••••"
                  className="input-field pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 divider" />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              or
            </span>
            <div className="flex-1 divider" />
          </div>

          {/* Demo button */}
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "#00D4FF",
            }}
            onMouseOver={(e) => {
              if (!demoLoading)
                e.currentTarget.style.background = "rgba(0,212,255,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(0,212,255,0.08)";
            }}
          >
            {demoLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Entering demo…
              </>
            ) : (
              <>🚀 Try Demo — no account needed</>
            )}
          </button>

          <p
            className="text-center text-xs mt-5"
            style={{ color: "var(--text-muted)" }}
          >
            No account?{" "}
            <Link
              href="/auth/register"
              className="font-medium"
              style={{ color: "#00D4FF" }}
            >
              Create one free
            </Link>
          </p>
        </div>

        <p
          className="text-center text-xs mt-4"
          style={{ color: "var(--text-muted)" }}
        >
          By signing in you agree to our{" "}
          <span style={{ color: "#00D4FF" }}>Terms</span> and{" "}
          <span style={{ color: "#00D4FF" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
