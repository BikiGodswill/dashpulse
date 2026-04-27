'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn, formatNumber, formatCurrency, generateSparkData } from '@/lib/helpers';
import { useMemo } from 'react';

export default function StatCard({
  label,
  value,
  change,
  prefix = '',
  suffix = '',
  color = '#00D4FF',
  icon: Icon,
  format = 'number', // 'number' | 'currency' | 'percent' | 'raw'
  loading = false,
  className,
}) {
  const sparkData = useMemo(() => generateSparkData(100, 0.3, 10), []);

  const formattedValue = useMemo(() => {
    if (format === 'currency') return formatCurrency(value);
    if (format === 'number') return prefix + formatNumber(value) + suffix;
    if (format === 'percent') return prefix + value?.toFixed(1) + '%';
    return prefix + value + suffix;
  }, [value, format, prefix, suffix]);

  const isPositive = change >= 0;
  const isNeutral = change === 0;

  if (loading) {
    return (
      <div className={cn('stat-card', className)}>
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div className={cn('stat-card group', className)}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={15} style={{ color }} />
            </div>
          )}
          <span className="text-xs font-medium tracking-wide uppercase"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {label}
          </span>
        </div>

        {/* Change badge */}
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold',
            isNeutral ? 'badge-info' : isPositive ? 'badge-success' : 'badge-danger'
          )}>
            {isNeutral
              ? <Minus size={11} />
              : isPositive
                ? <TrendingUp size={11} />
                : <TrendingDown size={11} />
            }
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="metric-number text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        {formattedValue}
      </div>

      {/* Sparkline */}
      <div className="h-12 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`spark-${label?.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#spark-${label?.replace(/\s/g, '')})`}
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom label */}
      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        {isNeutral ? 'No change' : isPositive ? `↑ ${Math.abs(change).toFixed(1)}%` : `↓ ${Math.abs(change).toFixed(1)}%`}
        {' '}vs last period
      </p>
    </div>
  );
}
