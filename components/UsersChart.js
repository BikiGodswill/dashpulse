'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { generateUserData } from '@/lib/seedData';
import { formatNumber, Users } from '@/lib/helpers';
import { Users as UsersIcon, UserPlus, UserMinus, Activity } from 'lucide-react';

const RANGES = ['7D', '30D', '90D'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !p-3 text-xs min-w-[150px]">
      <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: p.color }}>● {p.name}</span>
          <span className="metric-number font-medium" style={{ color: 'var(--text-primary)' }}>
            {Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function UsersChart() {
  const [range, setRange] = useState('30D');
  const [liveCount, setLiveCount] = useState(1247);

  const days = { '7D': 7, '30D': 30, '90D': 90 }[range];
  const data = useMemo(() => generateUserData(days), [days]);

  // Simulate real-time user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor((Math.random() - 0.4) * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latestData = data[data.length - 1] || {};
  const prevData = data[data.length - 8] || {};
  const change = ((latestData.active - prevData.active) / (prevData.active || 1)) * 100;

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UsersIcon size={16} style={{ color: '#00E5A0' }} />
            <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Active Users</h3>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="metric-number text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {(latestData.active || 0).toLocaleString()}
            </span>
            <span className={`badge ${change >= 0 ? 'badge-success' : 'badge-danger'} text-xs`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Live counter */}
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E5A0' }} />
            <span className="text-xs font-medium" style={{ color: '#00E5A0' }}>Live</span>
          </div>
          <div className="metric-number text-lg font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
            {liveCount.toLocaleString()}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>online now</p>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'New', value: latestData.new || 0, icon: UserPlus, color: '#00E5A0' },
          { label: 'Churned', value: latestData.churned || 0, icon: UserMinus, color: '#FF4D6D' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
            <Icon size={13} style={{ color }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <p className="metric-number text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Range tabs */}
      <div className="flex p-0.5 rounded-lg mb-4 w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
        {RANGES.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
            style={range === r
              ? { background: 'rgba(0,229,160,0.15)', color: '#00E5A0' }
              : { color: 'var(--text-muted)' }
            }
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00E5A0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(days / 6)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="active" name="Active" stroke="#00E5A0" strokeWidth={2}
              fill="url(#activeGrad)" dot={false} />
            <Area type="monotone" dataKey="new" name="New" stroke="#00D4FF" strokeWidth={1.5}
              fill="url(#newGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
