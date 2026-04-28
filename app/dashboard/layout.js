'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  // Client-side route guard — runs after the browser Supabase client
  // has already set the session, so there's no cookie-timing race.
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login';
    }
  }, [user, loading]);

  // Show a full-screen loader while the session is being resolved
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(0,212,255,0.15)',
              border: '1px solid rgba(0,212,255,0.3)',
            }}
          >
            <Loader2 size={22} className="animate-spin" style={{ color: '#00D4FF' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  // Not logged in — useEffect will redirect; render nothing in the meantime
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: 'var(--bg-primary)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
