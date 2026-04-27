'use client';

import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { FlaskConical, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DemoBanner() {
  const { isDemo, signOut } = useAuth();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemo || dismissed) return null;

  async function handleExit() {
    await signOut();
    toast.success('Demo session ended');
    router.push('/');
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-xs font-medium"
      style={{
        background: 'linear-gradient(90deg, rgba(167,139,250,0.15), rgba(0,212,255,0.12))',
        borderBottom: '1px solid rgba(167,139,250,0.25)',
        color: '#A78BFA',
      }}
    >
      <div className="flex items-center gap-2">
        <FlaskConical size={13} />
        <span>
          You're in <strong>Demo Mode</strong> — all data is simulated. No changes are saved.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/auth/register')}
          className="flex items-center gap-1 font-semibold transition-colors hover:text-white"
        >
          Create a real account <ArrowRight size={11} />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="opacity-60 hover:opacity-100 transition-opacity"
          title="Dismiss"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
