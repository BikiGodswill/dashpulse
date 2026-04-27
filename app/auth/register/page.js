'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap, Eye, EyeOff, ArrowRight, Loader2,
  Check, AlertCircle, Info, CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import toast from 'react-hot-toast';

const BENEFITS = [
  'Real-time analytics dashboard',
  'Unlimited data exports',
  'Custom widget builder',
  'Priority support',
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const len = password.length;
  const level = len >= 12 ? 'strong' : len >= 8 ? 'good' : 'weak';
  const colors = { strong: '#00E5A0', good: '#FFB347', weak: '#FF4D6D' };
  const fill = { strong: 3, good: 2, weak: 1 }[level];
  return (
    <div className="flex items-center gap-2 mt-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{ background: i < fill ? colors[level] : 'rgba(255,255,255,0.08)' }} />
      ))}
      <span className="text-xs capitalize" style={{ color: colors[level] }}>{level}</span>
    </div>
  );
}

export default function RegisterPage() {
  const { signUp, enterDemoMode, isSupabaseConfigured } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [formError, setFormError]     = useState('');
  const [confirmed, setConfirmed]     = useState(false); // email sent, awaiting click

  function update(key) {
    return e => { setForm(f => ({ ...f, [key]: e.target.value })); setFormError(''); };
  }

  // ── Register ──────────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setFormError('');

    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const { error, needsConfirmation } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.name,
      company: form.company,
    });

    setLoading(false);

    if (error) {
      const msg = (error.message ?? '').toLowerCase();
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('unique')) {
        setFormError('An account with this email already exists. Try signing in.');
      } else if (msg.includes('not configured')) {
        setFormError(error.message);
      } else {
        setFormError(error.message || 'Registration failed. Please try again.');
      }
      return;
    }

    if (needsConfirmation) {
      // User must click the confirmation email before they can sign in
      setConfirmed(true);
      toast.success('Account created! Check your email.');
    } else {
      // Email confirmation disabled in Supabase — user is logged in immediately
      toast.success('Account created! Welcome to DashPulse 🎉');
      window.location.href = '/dashboard';
    }
  }

  // ── Demo mode ─────────────────────────────────────────────────────
  async function handleDemo() {
    setDemoLoading(true);
    enterDemoMode();
    toast.success('Loading demo…');
    await new Promise(r => setTimeout(r, 250));
    window.location.href = '/dashboard';
  }

  // ── Email-sent screen ─────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 hero-bg">
        <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
        <div className="w-full max-w-sm animate-slide-up relative z-10">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)' }}>
              <CheckCircle size={32} style={{ color: '#00E5A0' }} />
            </div>
            <h1 className="heading-font text-2xl mb-2"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Check your inbox
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              We sent a confirmation link to{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>.
              Click it to activate your account, then sign in.
            </p>
            <Link href="/auth/login" className="btn-primary w-full justify-center py-3">
              Go to Sign In <ArrowRight size={15} />
            </Link>
            <button onClick={handleDemo}
              className="w-full mt-3 text-sm font-medium py-2"
              style={{ color: '#00D4FF' }}>
              Or try the demo while you wait →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-bg">
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10 animate-slide-up">

        {/* Left pitch */}
        <div className="hidden md:block pt-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <Zap size={20} style={{ color: '#00D4FF' }} />
            </div>
            <div>
              <p className="heading-font text-lg" style={{ color: 'var(--text-primary)' }}>DashPulse</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Analytics Pro</p>
            </div>
          </div>
          <h2 className="heading-font text-3xl mb-3"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Start seeing the full picture
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Join thousands of businesses using DashPulse to understand their data and grow faster.
          </p>
          <div className="space-y-3 mb-8">
            {BENEFITS.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)' }}>
                  <Check size={11} style={{ color: '#00E5A0' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{b}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="text-xs italic" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              "DashPulse transformed how we understand our business. The real-time insights are game-changing."
            </p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#00D4FF' }}>
              — Sarah Chen, CEO at TechFlow
            </p>
          </div>
        </div>

        {/* Right form */}
        <div>
          {!isSupabaseConfigured && (
            <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
              style={{ background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.3)', color: '#FFB347' }}>
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span>Supabase is not configured — account creation is unavailable.
                Use <strong>Demo mode</strong> to explore the full dashboard.</span>
            </div>
          )}

          <div className="glass-card p-7">
            <h1 className="heading-font text-2xl mb-1"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Create account
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Free forever. No credit card required.
            </p>

            {formError && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs mb-4 animate-fade-in"
                style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D' }}>
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p>{formError}</p>
                  {formError.includes('already exists') && (
                    <Link href="/auth/login" className="font-semibold underline mt-1 block">
                      Sign in instead →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {[
                { key: 'name',    label: 'Full Name',            type: 'text',  placeholder: 'Jane Smith',       req: true },
                { key: 'company', label: 'Company (optional)',   type: 'text',  placeholder: 'Acme Corp',         req: false },
                { key: 'email',   label: 'Email Address',        type: 'email', placeholder: 'you@company.com',  req: true },
              ].map(({ key, label, type, placeholder, req }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={update(key)}
                    required={req}
                    disabled={!isSupabaseConfigured}
                    placeholder={placeholder}
                    className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                    autoComplete={type === 'email' ? 'email' : 'off'}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={update('password')}
                    required
                    disabled={!isSupabaseConfigured}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="input-field pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" />Creating account…</>
                  : <>Create Account <ArrowRight size={15} /></>}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 divider" />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
              <div className="flex-1 divider" />
            </div>

            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-70"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}
              onMouseOver={e => { if (!demoLoading) e.currentTarget.style.background = 'rgba(0,212,255,0.15)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; }}
            >
              {demoLoading
                ? <><Loader2 size={15} className="animate-spin" />Loading demo…</>
                : <>🚀 Try Demo — no account needed</>}
            </button>

            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium" style={{ color: '#00D4FF' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
