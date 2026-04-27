'use client';

import { geoData } from '@/lib/seedData';
import { formatCurrency, formatNumber } from '@/lib/helpers';
import { Globe } from 'lucide-react';

export default function GeoWidget() {
  const maxUsers = Math.max(...geoData.map(d => d.users));

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <Globe size={16} style={{ color: '#00D4FF' }} />
        <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Top Countries</h3>
      </div>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Users & Revenue by geography</p>

      <div className="space-y-3">
        {geoData.map((d, i) => (
          <div key={d.country}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{d.flag}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{d.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="metric-number text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {formatNumber(d.users)} users
                </span>
                <span className="metric-number text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(d.revenue)}
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(d.users / maxUsers) * 100}%`,
                  background: i === 0
                    ? 'linear-gradient(90deg, #00D4FF, #00E5A0)'
                    : i === 1
                      ? 'linear-gradient(90deg, #A78BFA, #00D4FF)'
                      : `rgba(0, 212, 255, ${0.7 - i * 0.07})`,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
