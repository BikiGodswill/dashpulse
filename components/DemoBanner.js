'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { FlaskConical, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DemoBanner() {
  const { isDemo, signOut } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemo || dismissed) return null;

  async function handleExit() {
    await signOut();
    toast.success('Demo session ended');
    window.location.href = '/';
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs font-medium flex-shrink-0"
      style={{
        background: 'linear-gradient(90deg, rgba(167,139,250,0.15), rgba(0,212,255,0.12))',
        borderBottom: '1px solid rgba(167,139,250,0.25)',
        color: '#A78BFA',
      }}>
      <div className="flex items-center gap-2">
        <FlaskConical size={13} />
        <span>
          <strong>Demo Mode</strong> — all data is simulated. Nothing is saved.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <a href="/auth/register"
          className="flex items-center gap-1 font-semibold hover:text-white transition-colors">
          Create a real account <ArrowRight size={11} />
        </a>
        <button onClick={() => setDismissed(true)}
          className="opacity-60 hover:opacity-100 transition-opacity" title="Dismiss">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
