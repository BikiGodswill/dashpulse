'use client';

import { useState, Suspense } from 'react';
import { DollarSign, Users, TrendingUp, Percent, RefreshCw, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';
import RevenueChart from '@/components/RevenueChart';
import UsersChart from '@/components/UsersChart';
import ActivityFeed from '@/components/ActivityFeed';
import EngagementMetrics from '@/components/EngagementMetrics';
import IncomeChart from '@/components/IncomeChart';
import GeoWidget from '@/components/GeoWidget';
import TransactionsTable from '@/components/TransactionsTable';
import DateRangeFilter from '@/components/DateRangeFilter';
import WidgetGrid from '@/components/WidgetGrid';
import { SkeletonCard, SkeletonChart } from '@/components/SkeletonLoader';
import { kpiData } from '@/lib/seedData';

const DEFAULT_WIDGETS = ['revenue', 'users', 'engagement', 'income', 'activity', 'geo', 'transactions'];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [activeWidgets, setActiveWidgets] = useState(DEFAULT_WIDGETS);
  const [loading, setLoading] = useState(false);

  function toggleWidget(id) {
    setActiveWidgets(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  }

  function resetLayout() {
    setActiveWidgets(DEFAULT_WIDGETS);
  }

  function handleRefresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  const show = (id) => activeWidgets.includes(id);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="heading-font text-xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Overview
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time analytics · Auto-updating
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <WidgetGrid activeWidgets={activeWidgets} onToggleWidget={toggleWidget} onResetLayout={resetLayout} />
          <button onClick={handleRefresh} className="btn-ghost text-xs gap-1.5 h-9">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Revenue"
              value={kpiData.totalRevenue.value}
              change={kpiData.totalRevenue.change}
              format="currency"
              icon={DollarSign}
              color="#00D4FF"
              className="xl:col-span-1"
            />
            <StatCard
              label="Active Users"
              value={kpiData.activeUsers.value}
              change={kpiData.activeUsers.change}
              format="number"
              icon={Users}
              color="#00E5A0"
            />
            <StatCard
              label="MRR"
              value={kpiData.mrr.value}
              change={kpiData.mrr.change}
              format="currency"
              icon={TrendingUp}
              color="#A78BFA"
            />
            <StatCard
              label="Conversion"
              value={kpiData.conversionRate.value}
              change={kpiData.conversionRate.change}
              format="percent"
              icon={Percent}
              color="#FFB347"
            />
            <StatCard
              label="Avg Order"
              value={kpiData.avgOrderValue.value}
              change={kpiData.avgOrderValue.change}
              format="currency"
              icon={DollarSign}
              color="#00D4FF"
            />
            <StatCard
              label="Churn Rate"
              value={kpiData.churnRate.value}
              change={kpiData.churnRate.change}
              format="percent"
              icon={Activity}
              color="#FF4D6D"
            />
          </>
        )}
      </div>

      {/* Revenue + Users charts */}
      {(show('revenue') || show('users')) && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {show('revenue') && (
            <div className="xl:col-span-3">
              <Suspense fallback={<SkeletonChart />}>
                <RevenueChart />
              </Suspense>
            </div>
          )}
          {show('users') && (
            <div className="xl:col-span-2">
              <Suspense fallback={<SkeletonChart />}>
                <UsersChart />
              </Suspense>
            </div>
          )}
        </div>
      )}

      {/* Engagement + Income + Activity */}
      {(show('engagement') || show('income') || show('activity')) && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {show('engagement') && <EngagementMetrics />}
          {show('income') && <IncomeChart />}
          {show('activity') && <ActivityFeed />}
        </div>
      )}

      {/* Geo + Transactions */}
      {(show('geo') || show('transactions')) && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {show('geo') && (
            <div className="xl:col-span-1">
              <GeoWidget />
            </div>
          )}
          {show('transactions') && (
            <div className={show('geo') ? 'xl:col-span-3' : 'xl:col-span-4'}>
              <TransactionsTable limit={30} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
