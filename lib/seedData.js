import { format, subDays } from 'date-fns';

/** Generate revenue data for the past N days */
export function generateRevenueData(days = 30) {
  const base = 18000;
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const trend = 1 + (i / days) * 0.3;
    const noise = (Math.random() - 0.4) * 0.3;
    return {
      date: format(date, 'MMM d'),
      revenue: Math.round(base * weekendMultiplier * trend * (1 + noise)),
      target: Math.round(base * trend),
    };
  });
}

/** Generate user activity data */
export function generateUserData(days = 30) {
  let users = 8200;
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const growth = (Math.random() - 0.3) * 150;
    users = Math.max(0, users + growth);
    return {
      date: format(date, 'MMM d'),
      active: Math.round(users),
      new: Math.round(users * 0.04 * (Math.random() + 0.5)),
      churned: Math.round(users * 0.01 * (Math.random() + 0.5)),
    };
  });
}

/** Income breakdown data */
export const incomeBreakdown = [
  { name: 'Subscriptions', value: 54200, color: '#00D4FF', percent: 52 },
  { name: 'One-time Purchases', value: 23800, color: '#00E5A0', percent: 23 },
  { name: 'Enterprise Contracts', value: 18500, color: '#A78BFA', percent: 18 },
  { name: 'Partnerships', value: 7300, color: '#FFB347', percent: 7 },
];

/** Engagement metrics */
export const engagementMetrics = {
  avgSessionTime: '4m 32s',
  bounceRate: 28.4,
  clickThroughRate: 3.7,
  pagesPerSession: 4.2,
  returnVisitorRate: 67.3,
  nps: 72,
};

/** Top pages */
export const topPages = [
  { path: '/dashboard', visits: 48320, change: 12.4 },
  { path: '/analytics', visits: 32140, change: 8.1 },
  { path: '/settings', visits: 18900, change: -2.3 },
  { path: '/reports', visits: 14200, change: 22.7 },
  { path: '/billing', visits: 9800, change: 5.4 },
];

/** Sample activity feed */
export function generateActivityFeed(count = 20) {
  const actions = [
    { type: 'signup', label: 'New user signed up', icon: 'UserPlus', color: '#00E5A0' },
    { type: 'purchase', label: 'New subscription started', icon: 'CreditCard', color: '#00D4FF' },
    { type: 'upgrade', label: 'Account upgraded to Pro', icon: 'TrendingUp', color: '#A78BFA' },
    { type: 'cancellation', label: 'Subscription cancelled', icon: 'UserMinus', color: '#FF4D6D' },
    { type: 'export', label: 'Data export requested', icon: 'Download', color: '#FFB347' },
    { type: 'alert', label: 'Unusual traffic spike detected', icon: 'AlertTriangle', color: '#FF4D6D' },
    { type: 'payment', label: 'Payment processed successfully', icon: 'CheckCircle', color: '#00E5A0' },
    { type: 'milestone', label: 'Revenue milestone reached', icon: 'Trophy', color: '#FFB347' },
  ];

  const names = [
    'Sarah Chen', 'Marcus Rodriguez', 'Priya Sharma', 'James O\'Brien',
    'Yuki Tanaka', 'Amara Nwosu', 'Luca Ferrari', 'Elena Vasquez',
    'David Kim', 'Fatima Al-Hassan', 'Noah Williams', 'Chloe Martin',
  ];

  return Array.from({ length: count }, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const minsAgo = Math.floor(Math.random() * 120);
    return {
      id: `activity-${i}`,
      ...action,
      name,
      timestamp: new Date(Date.now() - minsAgo * 60 * 1000).toISOString(),
      amount: action.type === 'purchase' || action.type === 'upgrade'
        ? Math.round(Math.random() * 400 + 29)
        : null,
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/** Sample transactions */
export function generateTransactions(count = 50) {
  const statuses = ['completed', 'pending', 'processing', 'failed'];
  const customers = [
    'Acme Corp', 'TechFlow Inc', 'StartupXYZ', 'DataDriven Co', 'CloudFirst Ltd',
    'NextGen Systems', 'Pixel Perfect', 'Smart Solutions', 'Future Labs', 'Code Wizards',
    'Sarah Chen', 'Marcus Rodriguez', 'Priya Sharma', 'James O\'Brien', 'Yuki Tanaka',
  ];
  const plans = ['Starter', 'Pro', 'Team', 'Enterprise'];

  return Array.from({ length: count }, (_, i) => ({
    id: `txn_${Math.random().toString(36).slice(2, 10)}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    plan: plans[Math.floor(Math.random() * plans.length)],
    amount: Math.round((Math.random() * 2000 + 29) * 100) / 100,
    status: statuses[Math.floor(Math.random() * 4)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    method: Math.random() > 0.3 ? 'Card' : 'Bank Transfer',
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** Key KPIs */
export const kpiData = {
  totalRevenue: { value: 284750, change: 18.4, label: 'Total Revenue', prefix: '$' },
  activeUsers: { value: 12847, change: 7.2, label: 'Active Users' },
  conversionRate: { value: 3.84, change: -0.3, label: 'Conversion Rate', suffix: '%' },
  avgOrderValue: { value: 247, change: 11.8, label: 'Avg Order Value', prefix: '$' },
  mrr: { value: 94250, change: 23.1, label: 'Monthly Recurring Revenue', prefix: '$' },
  churnRate: { value: 2.1, change: -0.4, label: 'Churn Rate', suffix: '%' },
};

/** Geographic data */
export const geoData = [
  { country: 'United States', users: 4820, revenue: 98400, flag: '🇺🇸' },
  { country: 'United Kingdom', users: 1940, revenue: 42100, flag: '🇬🇧' },
  { country: 'Germany', users: 1320, revenue: 31800, flag: '🇩🇪' },
  { country: 'Canada', users: 1180, revenue: 28900, flag: '🇨🇦' },
  { country: 'Australia', users: 890, revenue: 22400, flag: '🇦🇺' },
  { country: 'France', users: 760, revenue: 18700, flag: '🇫🇷' },
  { country: 'Japan', users: 640, revenue: 16200, flag: '🇯🇵' },
  { country: 'Netherlands', users: 520, revenue: 13800, flag: '🇳🇱' },
];
