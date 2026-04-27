'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Sun, Moon, ChevronDown, Settings, User, LogOut, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/lib/authContext';
import { generateActivityFeed } from '@/lib/seedData';
import { timeAgo } from '@/lib/helpers';
import toast from 'react-hot-toast';

const notifications = generateActivityFeed(6);

export default function Navbar({ title = 'Dashboard' }) {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isDemo, signOut } = useAuth();

  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleLogout() {
    await signOut();
    toast.success('Logged out');
    window.location.href = '/';
  }

  const displayName = isDemo
    ? 'Demo User'
    : (profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User');
  const displayInitial = displayName[0]?.toUpperCase() || 'U';
  const displayPlan = isDemo ? 'Demo' : 'Pro';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>

      {/* Left: page title */}
      <div>
        <h1 className="heading-font text-base" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <input
                autoFocus
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search anything…"
                className="input-field w-52 h-9 text-xs"
              />
              <button onClick={() => { setSearchOpen(false); setSearchValue(''); }}
                className="btn-ghost h-9 w-9 p-0 justify-center">
                <X size={15} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="btn-ghost h-9 w-9 p-0 justify-center">
              <Search size={16} />
            </button>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="btn-ghost h-9 w-9 p-0 justify-center" title="Toggle theme">
          {theme === 'dark'
            ? <Sun size={16} style={{ color: '#FFB347' }} />
            : <Moon size={16} style={{ color: '#00D4FF' }} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(o => !o)}
            className="btn-ghost h-9 w-9 p-0 justify-center relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#FF4D6D', border: '2px solid var(--bg-secondary)' }} />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 glass-card py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Notifications
                </span>
                <button className="text-xs" style={{ color: '#00D4FF' }}>Mark all read</button>
              </div>
              <div className="divider" />
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{n.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {n.name} · {timeAgo(n.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200"
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }}>
              {displayInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
                {displayName}
              </p>
              <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {displayPlan}
              </p>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 glass-card py-2 z-50 animate-fade-in">
              <a href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <User size={15} /> Profile
              </a>
              <a href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <Settings size={15} /> Settings
              </a>
              <div className="divider my-1" />
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                style={{ color: '#FF4D6D' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,77,109,0.06)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
