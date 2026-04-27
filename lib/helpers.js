import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format currency */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format large numbers (e.g. 12500 → 12.5K) */
export function formatNumber(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

/** Format percentage with sign */
export function formatPercent(value, showSign = true) {
  const sign = value >= 0 && showSign ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/** Date range presets */
export function getDateRange(preset) {
  const now = new Date();
  switch (preset) {
    case 'today':
      return { from: format(now, 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') };
    case 'week':
      return {
        from: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        to: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      };
    case 'month':
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    case '7days':
      return { from: format(subDays(now, 6), 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') };
    case '30days':
      return { from: format(subDays(now, 29), 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') };
    case '90days':
      return { from: format(subDays(now, 89), 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') };
    default:
      return { from: format(subDays(now, 29), 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') };
  }
}

/** Generate sparkline-style mini data */
export function generateSparkData(base, variance = 0.2, points = 8) {
  return Array.from({ length: points }, (_, i) => ({
    i,
    v: Math.max(0, base * (1 + (Math.random() - 0.5) * variance * 2)),
  }));
}

/** Export data as CSV */
export function exportCSV(data, filename = 'dashpulse-export') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Calculate percentage change */
export function calcChange(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

/** Truncate string */
export function truncate(str, length = 32) {
  if (!str) return '';
  return str.length > length ? `${str.slice(0, length)}…` : str;
}

/** Generate avatar URL */
export function avatarUrl(seed) {
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0D1220&textColor=00D4FF`;
}

/** Time ago */
export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return format(date, 'MMM d');
}

/** Status color map */
export const statusColors = {
  completed: 'badge-success',
  pending: 'badge-warning',
  failed: 'badge-danger',
  processing: 'badge-info',
};

/** Metric color by type */
export const metricColors = {
  revenue: '#00D4FF',
  users: '#00E5A0',
  engagement: '#FFB347',
  conversion: '#A78BFA',
};
