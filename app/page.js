'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap, ArrowRight, BarChart3, Users, TrendingUp, Shield, Globe, Layers,
  Check, ChevronRight, Star, Menu, X, Activity,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/helpers';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Watch your metrics update live. No refreshes. No delays. Pure signal.',
    color: '#00D4FF',
  },
  {
    icon: Users,
    title: 'User Intelligence',
    desc: 'Understand who your users are, what they do, and where they churn.',
    color: '#00E5A0',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Forecasting',
    desc: 'AI-powered projections that help you plan quarters with confidence.',
    color: '#A78BFA',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II, GDPR-ready infrastructure with end-to-end encryption.',
    color: '#FFB347',
  },
  {
    icon: Globe,
    title: 'Geographic Insights',
    desc: 'See your business from a global lens with country-level breakdowns.',
    color: '#00D4FF',
  },
  {
    icon: Layers,
    title: 'Custom Widgets',
    desc: 'Build the exact dashboard you need. Drag, drop, done.',
    color: '#00E5A0',
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    desc: 'For individuals getting started',
    features: ['5 dashboards', '10K events/mo', 'Basic charts', '7-day retention', 'Email support'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 49,
    desc: 'For growing teams',
    features: ['Unlimited dashboards', '1M events/mo', 'All chart types', '1-year retention', 'Real-time feeds', 'CSV exports', 'Priority support'],
    cta: 'Start Pro trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    desc: 'For large organizations',
    features: ['Everything in Pro', 'Unlimited events', 'Custom integrations', 'SSO/SAML', 'SLA guarantee', 'Dedicated CSM', 'On-prem option'],
    cta: 'Talk to sales',
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen', role: 'CEO, TechFlow Inc', avatar: '👩‍💼',
    text: 'DashPulse replaced 4 different tools we were using. The real-time activity feed alone saves us hours every week.',
    stars: 5,
  },
  {
    name: 'Marcus Rodriguez', role: 'Head of Growth, StartupXYZ', avatar: '👨‍💻',
    text: 'We doubled our conversion rate after understanding exactly where users were dropping off. The cohort analysis is 🔥',
    stars: 5,
  },
  {
    name: 'Priya Sharma', role: 'Data Lead, CloudFirst', avatar: '👩‍🔬',
    text: 'Finally, a dashboard that doesn\'t require a PhD to set up. Beautiful UI and incredibly powerful under the hood.',
    stars: 5,
  },
];

const STATS = [
  { label: 'Businesses', value: '12,400+' },
  { label: 'Events tracked daily', value: '2.4B' },
  { label: 'Uptime SLA', value: '99.99%' },
  { label: 'Data points processed', value: '180TB' },
];

function AnimatedCounter({ end, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.round(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 border-b backdrop-blur-md"
        style={{ background: 'rgba(8,12,20,0.8)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <Zap size={15} style={{ color: '#00D4FF' }} />
          </div>
          <span className="heading-font text-sm" style={{ letterSpacing: '-0.01em' }}>DashPulse</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {['Features', 'Pricing', 'Docs', 'Blog'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden md:inline-flex btn-ghost text-sm">Sign in</Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Get started <ArrowRight size={14} />
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden btn-ghost h-9 w-9 p-0 justify-center">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16 animate-fade-in"
          style={{ background: 'rgba(8,12,20,0.98)', backdropFilter: 'blur(10px)' }}>
          <div className="flex flex-col items-center gap-6 pt-12">
            {['Features', 'Pricing', 'Docs', 'Blog'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
                {item}
              </a>
            ))}
            <Link href="/auth/login" className="btn-ghost" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link href="/auth/register" className="btn-primary" onClick={() => setMobileOpen(false)}>Get started free</Link>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden hero-bg">
        <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00D4FF' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00D4FF' }} />
            Now with real-time Supabase subscriptions
          </div>

          <h1 className="heading-font text-5xl sm:text-6xl lg:text-7xl mb-6 leading-none"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Analytics that actually{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #00E5A0 50%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              move the needle
            </span>
          </h1>

          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            DashPulse gives you real-time visibility into revenue, users, and engagement —
            all in one premium dashboard that actually looks good.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register" className="btn-primary text-base px-7 py-3.5 gap-2.5 animate-glow">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-ghost text-base px-6 py-3.5 gap-2">
              <Activity size={16} />
              Live demo
            </Link>
          </div>

          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            No credit card required · 14-day Pro trial included
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="glass-card p-3 animate-float" style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.1)' }}>
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 border-b mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              {['#FF4D6D', '#FFB347', '#00E5A0'].map(c => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
              <div className="flex-1 mx-4 h-5 rounded-md flex items-center px-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>app.dashpulse.io/dashboard</span>
              </div>
            </div>

            {/* Preview grid */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { label: 'Revenue', val: '$284K', c: '#00D4FF', change: '+18.4%' },
                { label: 'Users', val: '12.8K', c: '#00E5A0', change: '+7.2%' },
                { label: 'MRR', val: '$94.2K', c: '#A78BFA', change: '+23.1%' },
                { label: 'Conversion', val: '3.84%', c: '#FFB347', change: '-0.3%' },
              ].map(({ label, val, c, change }) => (
                <div key={label} className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '4px' }}>{label}</p>
                  <p className="metric-number font-semibold" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{val}</p>
                  <p style={{ color: c, fontSize: '9px', marginTop: '2px' }}>{change}</p>
                </div>
              ))}
            </div>

            {/* Fake chart bars */}
            <div className="h-32 rounded-xl p-3 flex items-end gap-1"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: `${20 + Math.random() * 70}%`,
                    background: i === 29
                      ? '#00D4FF'
                      : `rgba(0,212,255,${0.2 + Math.random() * 0.3})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -left-4 top-1/3 glass-card px-3 py-2 hidden lg:flex items-center gap-2 animate-slide-in-left">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E5A0' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>1,247 live users</span>
          </div>
          <div className="absolute -right-4 bottom-1/3 glass-card px-3 py-2 hidden lg:flex items-center gap-2"
            style={{ animationDelay: '0.3s' }}>
            <TrendingUp size={13} style={{ color: '#00D4FF' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>+$4,280 today</span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 border-y" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ label, value }) => (
            <div key={label}>
              <div className="heading-font text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-info mb-4">Features</span>
            <h2 className="heading-font text-4xl mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Everything you need to understand your business
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              From real-time event streams to cohort retention — DashPulse has the analytics primitives that ambitious companies need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="heading-font text-base mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color }}>
                  Learn more <ChevronRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.03), transparent)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-success mb-4">Pricing</span>
            <h2 className="heading-font text-4xl mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Simple, transparent pricing
            </h2>
            {/* Annual toggle */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative w-12 h-6 rounded-full transition-all"
                style={{ background: annual ? '#00D4FF' : 'rgba(255,255,255,0.1)' }}>
                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ transform: annual ? 'translateX(24px)' : 'translateX(0)' }} />
              </button>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Annual <span className="badge badge-success ml-1">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {PLANS.map(({ name, price, desc, features, cta, highlight }) => {
              const displayPrice = annual && price > 0 ? Math.round(price * 0.8) : price;
              return (
                <div key={name} className={`glass-card p-6 relative ${highlight ? 'border-glow' : ''}`}
                  style={highlight ? {
                    boxShadow: '0 0 40px rgba(0,212,255,0.15)',
                    borderColor: 'rgba(0,212,255,0.3)',
                  } : {}}>
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="badge badge-info px-4 py-1.5 text-xs font-semibold">Most Popular</span>
                    </div>
                  )}
                  <h3 className="heading-font text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{name}</h3>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="heading-font text-4xl" style={{ color: 'var(--text-primary)' }}>
                      {displayPrice === 0 ? 'Free' : `$${displayPrice}`}
                    </span>
                    {displayPrice > 0 && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>}
                  </div>
                  <Link href="/auth/register"
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold mb-6 transition-all duration-200 ${highlight ? 'btn-primary' : 'btn-ghost'}`}>
                    {cta} <ArrowRight size={14} />
                  </Link>
                  <div className="space-y-2.5">
                    {features.map(f => (
                      <div key={f} className="flex items-center gap-2.5">
                        <Check size={13} style={{ color: highlight ? '#00D4FF' : '#00E5A0', flexShrink: 0 }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-warning mb-4">Testimonials</span>
            <h2 className="heading-font text-4xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Loved by analytics teams
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(({ name, role, avatar, text, stars }) => (
              <div key={name} className="glass-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={13} fill="#FFB347" style={{ color: '#FFB347' }} />
                  ))}
                </div>
                <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{avatar}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
            <h2 className="heading-font text-4xl mb-4 relative" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Ready to see your data clearly?
            </h2>
            <p className="text-base mb-8 relative" style={{ color: 'var(--text-secondary)' }}>
              Join 12,400+ businesses using DashPulse to make faster, smarter decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5 gap-2">
                Start for free <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="btn-ghost text-base px-8 py-3.5 gap-2">
                <Activity size={16} /> See live demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
                  <Zap size={13} style={{ color: '#00D4FF' }} />
                </div>
                <span className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>DashPulse</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Premium analytics for modern businesses. Real-time data, beautiful dashboards, actionable insights.
              </p>
            </div>
            {[
              { label: 'Product', items: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { label: 'Company', items: ['About', 'Blog', 'Careers', 'Press'] },
              { label: 'Legal', items: ['Privacy', 'Terms', 'Security', 'GDPR'] },
            ].map(({ label, items }) => (
              <div key={label}>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{label}</p>
                {items.map(item => (
                  <a key={item} href="#" className="block text-xs mb-2 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseOver={e => e.target.style.color = 'var(--text-secondary)'}
                    onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                  >
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © 2024 DashPulse Analytics. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Built with Next.js · Supabase · Tailwind · Recharts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
