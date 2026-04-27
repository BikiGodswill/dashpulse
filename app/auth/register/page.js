'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, ArrowRight, Loader2, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import toast from 'react-hot-toast';

const BENEFITS = [
  'Real-time analytics dashboard',
  'Unlimited data exports',
  'Custom widget builder',
  'Priority support',
];

export default function RegisterPage() {
  const { signUp, enterDemoMode, isSupabaseConfigured } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  function update(key) {
    return e => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setFormError('');
    };
  }

  const strength =
    form.password.length >= 12 ? 'strong'
    : form.password.length >= 8 ? 'good'
    : form.password.length > 0 ? 'weak'
    : null;

  async function handleRegister(e) {
    e.preventDefault();
    setFormError('');

    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.name,
      company: form.company,
    });

    setLoading(false);

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setFormError('An account with this email already exists. Try signing in instead.');
      } else if (msg.includes('not configured')) {
        setFormError(error.message);
      } else {
        setFormError(error.message || 'Registration failed. Please try again.');
      }
      return;
    }

    // Check if email confirmation is required
    const needsConfirmation = !data?.session;

    if (needsConfirmation) {
      // Supabase requires email confirmation
      setSuccess(true);
      toast.success('Account created! Check your email.');
    } else {
      // Auto-confirmed (e.g. "Confirm email" is disabled in Supabase settings)
      toast.success('Account created! Signing you in…');
      window.location.href = '/dashboard';
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    try {
      enterDemoMode();
      toast.success('Entering demo mode…');
      await new Promise(r => setTimeout(r, 200));
      window.location.href = '/dashboard';
    } catch {
      setDemoLoading(false);
      toast.error('Could not start demo mode.');
    }
  }

  // Success screen — user needs to check their email
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 hero-bg">
        <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
        <div className="w-full max-w-sm animate-slide-up relative z-10">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)' }}>
              <CheckCircle size={32} style={{ color: '#00E5A0' }} />
            </div>
            <h1 className="heading-font text-2xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Check your inbox
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              We sent a confirmation link to{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>.
              Click it to activate your account.
            </p>
            <div className="space-y-3">
              <Link href="/auth/login" className="btn-primary w-full justify-center py-3">
                Back to Sign In <ArrowRight size={15} />
              </Link>
              <button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                style={{ color: '#00D4FF' }}
              >
                Or try demo in the meantime →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-bg">
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10 animate-slide-up">
        {/* Left: pitch */}
        <div className="hidden md:block pt-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <Zap size={20} style={{ color: '#00D4FF' }} />
            </div>
            <div>
              <div className="heading-font text-lg" style={{ color: 'var(--text-primary)' }}>DashPulse</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Analytics Pro</div>
            </div>
          </div>

          <h2 className="heading-font text-3xl mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
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

          <div className="p-4 rounded-2xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="text-xs italic" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              "DashPulse transformed how we understand our business. The real-time insights are game-changing."
            </p>
            <p className="text-xs mt-2 font-medium" style={{ color: '#00D4FF' }}>— Sarah Chen, CEO at TechFlow</p>
          </div>
        </div>

        {/* Right: form */}
        <div>
          {!isSupabaseConfigured && (
            <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
              style={{ background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.3)', color: '#FFB347' }}>
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                Supabase is not configured — account creation is unavailable.
                Use <strong>Demo mode</strong> to explore the full dashboard.
              </span>
            </div>
          )}

          <div className="glass-card p-7">
            <h1 className="heading-font text-2xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
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
                  <span>{formError}</span>
                  {formError.includes('already exists') && (
                    <Link href="/auth/login" className="block mt-1 font-semibold underline">
                      Sign in instead →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
                { key: 'company', label: 'Company (optional)', type: 'text', placeholder: 'Acme Corp', required: false },
                { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com', required: true },
              ].map(({ key, label, type, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={update(key)}
                    required={required}
                    disabled={!isSupabaseConfigured}
                    placeholder={placeholder}
                    className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="input-field pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {strength && (
                  <div className="flex items-center gap-2 mt-2">
                    {['weak', 'good', 'strong'].map((s, i) => (
                      <div key={s} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            (strength === 'strong') ? '#00E5A0'
                            : (strength === 'good' && i < 2) ? '#FFB347'
                            : (strength === 'weak' && i === 0) ? '#FF4D6D'
                            : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    ))}
                    <span className="text-xs capitalize"
                      style={{ color: strength === 'strong' ? '#00E5A0' : strength === 'good' ? '#FFB347' : '#FF4D6D' }}>
                      {strength}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                  : <>Create Account <ArrowRight size={15} /></>
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 divider" />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
              <div className="flex-1 divider" />
            </div>

            {/* Demo */}
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: '#00D4FF',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(0,212,255,0.14)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(0,212,255,0.08)'}
            >
              {demoLoading
                ? <><Loader2 size={15} className="animate-spin" /> Entering demo…</>
                : <>🚀 Try Demo — no account needed</>
              }
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
