'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { incomeBreakdown } from '@/lib/seedData';
import { formatCurrency } from '@/lib/helpers';
import { DollarSign } from 'lucide-react';

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontFamily="DM Mono" fontWeight={500}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="glass-card !p-3 text-xs min-w-[160px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span style={{ color: 'var(--text-muted)' }}>Revenue</span>
        <span className="metric-number font-medium" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(d.value)}
        </span>
      </div>
      <div className="flex justify-between gap-4 mt-1">
        <span style={{ color: 'var(--text-muted)' }}>Share</span>
        <span className="metric-number font-medium" style={{ color: d.color }}>{d.percent}%</span>
      </div>
    </div>
  );
}

export default function IncomeChart() {
  const total = useMemo(() => incomeBreakdown.reduce((s, d) => s + d.value, 0), []);

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <DollarSign size={16} style={{ color: '#A78BFA' }} />
        <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Income Breakdown</h3>
      </div>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Revenue by source · Current month</p>

      {/* Donut chart */}
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={incomeBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {incomeBreakdown.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
          <p className="metric-number text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2.5">
        {incomeBreakdown.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
            <span className="metric-number text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(d.value)}
            </span>
            <span className="text-xs w-8 text-right" style={{ color: d.color }}>{d.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
