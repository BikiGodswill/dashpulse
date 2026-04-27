'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { topPages } from '@/lib/seedData';
import { generateRevenueData, generateUserData } from '@/lib/seedData';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/helpers';
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DateRangeFilter from '@/components/DateRangeFilter';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !p-3 text-xs min-w-[140px]">
      <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: p.color }}>● {p.name}</span>
          <span className="metric-number font-medium" style={{ color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');
  const days = { today: 1, '7days': 7, '30days': 30, '90days': 90, week: 7, month: 30 }[dateRange] || 30;

  const revenueData = useMemo(() => generateRevenueData(days), [days]);
  const userData = useMemo(() => generateUserData(days), [days]);

  const cohortData = useMemo(() => [
    { week: 'Week 1', w0: 100, w1: 78, w2: 62, w3: 51, w4: 44 },
    { week: 'Week 2', w0: 100, w1: 81, w2: 67, w3: 55, w4: 48 },
    { week: 'Week 3', w0: 100, w1: 75, w2: 60, w3: 49, w4: 42 },
    { week: 'Week 4', w0: 100, w1: 83, w2: 70, w3: 58, w4: null },
    { week: 'Week 5', w0: 100, w1: 79, w2: 64, w3: null, w4: null },
    { week: 'Week 6', w0: 100, w1: 85, w2: null, w3: null, w4: null },
  ], []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-font text-xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Analytics
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Deep-dive performance insights</p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Revenue vs Users dual chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} style={{ color: '#00D4FF' }} />
          <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>
            Revenue vs User Growth
          </h3>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Correlation between revenue and active users</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData.map((r, i) => ({ ...r, users: userData[i]?.active || 0 }))}
              margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false} interval={Math.floor(days / 7)} />
              <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
              <YAxis yAxisId="usr" orientation="right"
                tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Plus Jakarta Sans' }} />
              <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue"
                stroke="#00D4FF" strokeWidth={2} dot={false} />
              <Line yAxisId="usr" type="monotone" dataKey="users" name="Active Users"
                stroke="#00E5A0" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages + Cohort */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Pages */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} style={{ color: '#FFB347' }} />
            <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Top Pages</h3>
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Most visited pages this period</p>
          <div className="space-y-3">
            {topPages.map((p, i) => (
              <div key={p.path} className="flex items-center gap-3">
                <span className="metric-number text-xs w-4" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {p.path}
                    </span>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="metric-number text-xs" style={{ color: 'var(--text-primary)' }}>
                        {formatNumber(p.visits)}
                      </span>
                      <span className="text-xs flex items-center"
                        style={{ color: p.change >= 0 ? '#00E5A0' : '#FF4D6D' }}>
                        {p.change >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {Math.abs(p.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full"
                      style={{
                        width: `${(p.visits / topPages[0].visits) * 100}%`,
                        background: `rgba(255, 179, 71, ${0.9 - i * 0.15})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Retention */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} style={{ color: '#A78BFA' }} />
            <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>User Retention Cohorts</h3>
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Weekly cohort retention rates (%)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Cohort', 'Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4'].map(h => (
                    <th key={h} className="pb-2 text-left font-medium pr-4"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.map(row => (
                  <tr key={row.week} className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="py-2.5 pr-4 font-medium" style={{ color: 'var(--text-secondary)' }}>{row.week}</td>
                    {[row.w0, row.w1, row.w2, row.w3, row.w4].map((v, i) => (
                      <td key={i} className="py-2.5 pr-4">
                        {v !== null ? (
                          <span className="px-2 py-1 rounded-lg text-xs metric-number font-medium"
                            style={{
                              background: `rgba(167, 139, 250, ${v / 100 * 0.3})`,
                              color: v >= 70 ? '#A78BFA' : v >= 50 ? '#00D4FF' : 'var(--text-muted)',
                            }}>
                            {v}%
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Daily breakdown bar chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={16} style={{ color: '#00E5A0' }} />
          <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>New vs Returning Users</h3>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Daily user acquisition breakdown</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userData.slice(-14)} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Plus Jakarta Sans' }} />
              <Bar dataKey="new" name="New Users" fill="#00E5A0" fillOpacity={0.8} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="churned" name="Churned" fill="#FF4D6D" fillOpacity={0.8} radius={[3, 3, 0, 0]} stackId="b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
