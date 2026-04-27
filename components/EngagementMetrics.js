'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Tooltip,
} from 'recharts';
import { Clock, MousePointerClick, ArrowUpRight, RefreshCw, Star, Activity } from 'lucide-react';
import { engagementMetrics } from '@/lib/seedData';

const radarData = [
  { metric: 'Session', value: 78 },
  { metric: 'Retention', value: 67 },
  { metric: 'CTR', value: 42 },
  { metric: 'NPS', value: 72 },
  { metric: 'Bounce', value: 100 - 28.4 },
  { metric: 'Pages', value: (4.2 / 8) * 100 },
];

const metricCards = [
  { label: 'Avg Session', value: engagementMetrics.avgSessionTime, icon: Clock, color: '#00D4FF', change: 8.2 },
  { label: 'Bounce Rate', value: `${engagementMetrics.bounceRate}%`, icon: ArrowUpRight, color: '#FF4D6D', change: -3.1 },
  { label: 'Click Rate', value: `${engagementMetrics.clickThroughRate}%`, icon: MousePointerClick, color: '#00E5A0', change: 12.4 },
  { label: 'Return Rate', value: `${engagementMetrics.returnVisitorRate}%`, icon: RefreshCw, color: '#A78BFA', change: 5.7 },
  { label: 'NPS Score', value: engagementMetrics.nps, icon: Star, color: '#FFB347', change: 4.0 },
  { label: 'Pages/Session', value: engagementMetrics.pagesPerSession, icon: Activity, color: '#00D4FF', change: 1.8 },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !p-2 text-xs">
      <span style={{ color: 'var(--text-primary)' }}>{payload[0]?.payload?.metric}: </span>
      <span className="font-semibold" style={{ color: '#00D4FF' }}>{Math.round(payload[0]?.value)}%</span>
    </div>
  );
}

export default function EngagementMetrics() {
  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Activity size={16} style={{ color: '#FFB347' }} />
        <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Engagement Metrics</h3>
      </div>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Performance overview · Last 30 days</p>

      {/* Radar chart */}
      <div className="h-52 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.07)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans' }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#FFB347"
              fill="#FFB347"
              fillOpacity={0.12}
              strokeWidth={1.5}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-3 gap-2">
        {metricCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{ background: `${color}0D`, border: `1px solid ${color}20` }}>
            <div className="flex items-center justify-between mb-1">
              <Icon size={11} style={{ color }} />
              <span className={`text-xs font-semibold ${change >= 0 ? '' : ''}`}
                style={{ color: change >= 0 ? '#00E5A0' : '#FF4D6D', fontSize: '9px' }}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
            </div>
            <p className="metric-number text-sm font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
              {value}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '9px', marginTop: '2px' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
