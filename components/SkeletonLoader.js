'use client';

import { cn } from '@/lib/helpers';

export function SkeletonCard({ className }) {
  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-6 w-14 rounded-lg" />
      </div>
      <div className="skeleton h-8 w-36 mb-2" />
      <div className="skeleton h-12 w-full rounded-xl mt-4" />
      <div className="skeleton h-3 w-28 mt-3" />
    </div>
  );
}

export function SkeletonChart({ className }) {
  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-7 w-44" />
        </div>
        <div className="skeleton h-8 w-28 rounded-xl" />
      </div>
      <div className="skeleton h-56 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }) {
  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="skeleton h-4 w-36" />
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-3 w-32 mb-2" />
              <div className="skeleton h-3 w-20" />
            </div>
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonFeed({ className }) {
  return (
    <div className={cn('glass-card', className)}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="skeleton h-4 w-28" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="skeleton w-7 h-7 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-3 w-40 mb-2" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="skeleton h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
