'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/helpers';

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
];

export default function DateRangeFilter({ value = '30days', onChange }) {
  const [open, setOpen] = useState(false);
  const current = PRESETS.find(p => p.value === value) || PRESETS[2];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost text-xs gap-2 h-9"
      >
        <Calendar size={13} />
        {current.label}
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 w-44 glass-card py-1.5 z-30 animate-fade-in"
          onMouseLeave={() => setOpen(false)}
        >
          {PRESETS.map(p => (
            <button
              key={p.value}
              onClick={() => { onChange?.(p.value); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-xs transition-colors"
              style={{
                color: value === p.value ? '#00D4FF' : 'var(--text-secondary)',
                background: value === p.value ? 'rgba(0,212,255,0.06)' : 'transparent',
              }}
              onMouseOver={e => { if (value !== p.value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseOut={e => { if (value !== p.value) e.currentTarget.style.background = 'transparent'; }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
