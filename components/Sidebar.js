'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Settings, ChevronLeft, ChevronRight,
  Zap, Users, CreditCard, Bell, FileText, Globe, LogOut, TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/helpers';
import { useAuth } from '@/lib/authContext';
import toast from 'react-hot-toast';

const NAV = [
  { label: 'Dashboard',    href: '/dashboard',                icon: LayoutDashboard },
  { label: 'Analytics',    href: '/dashboard/analytics',      icon: BarChart3 },
  { label: 'Revenue',      href: '/dashboard/revenue',        icon: TrendingUp },
  { label: 'Users',        href: '/dashboard/users',          icon: Users },
  { label: 'Transactions', href: '/dashboard/transactions',   icon: CreditCard },
  { label: 'Reports',      href: '/dashboard/reports',        icon: FileText },
  { label: 'Geography',    href: '/dashboard/geography',      icon: Globe },
];

const BOTTOM = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings',      href: '/dashboard/settings',      icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut, user, isDemo } = useAuth();

  const displayName = isDemo
    ? 'Demo User'
    : (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User');
  const displayInitial = displayName[0]?.toUpperCase() || 'U';
  const displayPlan = isDemo ? 'Demo Mode' : 'Pro Plan';

  async function handleLogout() {
    await signOut();
    toast.success('Logged out');
    window.location.href = '/';
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen transition-all duration-300 ease-in-out border-r z-20',
        collapsed ? 'w-[72px]' : 'w-[240px]',
      )}
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
          <Zap size={18} style={{ color: '#00D4FF' }} />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="heading-font text-sm" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              DashPulse
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Analytics Pro</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3.5 top-[72px] w-7 h-7 rounded-full flex items-center justify-center z-30 transition-all duration-200 hover:scale-110"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={cn('sidebar-link', active && 'active')}
              title={collapsed ? label : undefined}>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mx-2 divider" />

      {/* Bottom links */}
      <div className="px-2 py-3 space-y-0.5">
        {BOTTOM.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn('sidebar-link', pathname.startsWith(href) && 'active')}
            title={collapsed ? label : undefined}>
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
        <button onClick={handleLogout}
          className="sidebar-link w-full"
          title={collapsed ? 'Log out' : undefined}>
          <LogOut size={18} className="flex-shrink-0" style={{ color: '#FF4D6D' }} />
          {!collapsed && <span className="truncate" style={{ color: '#FF4D6D' }}>Log out</span>}
        </button>
      </div>

      {/* User badge */}
      {!collapsed && (
        <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }}>
              {displayInitial}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {displayName}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {displayPlan}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
