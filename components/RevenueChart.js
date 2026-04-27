'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { generateRevenueData } from '@/lib/seedData';
import { formatCurrency } from '@/lib/helpers';
import { TrendingUp } from 'lucide-react';

const RANGES = ['7D', '14D', '30D', '90D'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !p-3 text-xs min-w-[140px]">
      <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: p.color }}>● {p.name}</span>
          <span className="metric-number font-medium" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  const [range, setRange] = useState('30D');
  const [chartType, setChartType] = useState('combo');

  const days = { '7D': 7, '14D': 14, '30D': 30, '90D': 90 }[range];
  const data = useMemo(() => generateRevenueData(days), [days]);

  const total = useMemo(() => data.reduce((s, d) => s + d.revenue, 0), [data]);
  const avg = useMemo(() => Math.round(total / data.length), [total, data.length]);

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} style={{ color: '#00D4FF' }} />
            <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Revenue Overview</h3>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="metric-number text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(total)}
            </span>
            <span className="badge badge-success text-xs">+18.4%</span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Avg {formatCurrency(avg)}/day · {days} day window
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Range selector */}
          <div className="flex p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
                style={range === r
                  ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
                  : { color: 'var(--text-muted)' }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
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
              interval={Math.floor(days / 7)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avg} stroke="rgba(255,179,71,0.3)" strokeDasharray="4 4" />
            <Bar dataKey="revenue" name="Revenue" fill="url(#revenueGrad)" stroke="#00D4FF" strokeWidth={1} radius={[3, 3, 0, 0]} />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#A78BFA"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#00D4FF', opacity: 0.7 }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Actual Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 border-dashed" style={{ borderTop: '2px dashed #A78BFA' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5" style={{ background: 'rgba(255,179,71,0.6)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Daily Avg</span>
        </div>
      </div>
    </div>
  );
}
