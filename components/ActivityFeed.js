'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, CreditCard, TrendingUp, UserMinus, Download,
  AlertTriangle, CheckCircle, Trophy, Activity, Wifi,
} from 'lucide-react';
import { timeAgo, formatCurrency } from '@/lib/helpers';
import { generateActivityFeed } from '@/lib/seedData';

const ICON_MAP = {
  UserPlus, CreditCard, TrendingUp, UserMinus, Download,
  AlertTriangle, CheckCircle, Trophy,
};

const NEW_EVENTS = [
  { type: 'signup', label: 'New user signed up', icon: 'UserPlus', color: '#00E5A0' },
  { type: 'purchase', label: 'New subscription started', icon: 'CreditCard', color: '#00D4FF' },
  { type: 'payment', label: 'Payment processed', icon: 'CheckCircle', color: '#00E5A0' },
  { type: 'upgrade', label: 'Account upgraded to Pro', icon: 'TrendingUp', color: '#A78BFA' },
];

const NAMES = [
  'Emma Johnson', 'Liam Park', 'Sofia Garcia', 'Noah Williams',
  'Isabella Chen', 'Oliver Kim', 'Mia Patel', 'Ethan Brown',
];

export default function ActivityFeed() {
  const [events, setEvents] = useState(() => generateActivityFeed(12));
  const [isLive, setIsLive] = useState(true);
  const [newCount, setNewCount] = useState(0);

  const addEvent = useCallback(() => {
    const action = NEW_EVENTS[Math.floor(Math.random() * NEW_EVENTS.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const newEvent = {
      id: `live-${Date.now()}`,
      ...action,
      name,
      timestamp: new Date().toISOString(),
      amount: action.type === 'purchase' || action.type === 'upgrade'
        ? Math.round(Math.random() * 400 + 29)
        : null,
      isNew: true,
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 18)]);
    setNewCount(c => c + 1);
    setTimeout(() => {
      setEvents(prev => prev.map(e => e.id === newEvent.id ? { ...e, isNew: false } : e));
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(addEvent, 4500 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isLive, addEvent]);

  return (
    <div className="glass-card flex flex-col h-full" style={{ maxHeight: '520px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Activity size={15} style={{ color: '#00D4FF' }} />
          <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Live Activity</h3>
          {newCount > 0 && (
            <span className="badge badge-info text-xs animate-fade-in">{newCount} new</span>
          )}
        </div>

        <button
          onClick={() => setIsLive(l => !l)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200"
          style={isLive
            ? { background: 'rgba(0,229,160,0.12)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.25)' }
            : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
          }
        >
          <Wifi size={11} className={isLive ? 'animate-pulse' : ''} />
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {events.map((event, i) => {
          const Icon = ICON_MAP[event.icon] || CheckCircle;
          return (
            <div
              key={event.id}
              className="flex items-start gap-3 px-5 py-3 border-b transition-all duration-500"
              style={{
                borderColor: 'var(--border-subtle)',
                background: event.isNew ? `${event.color}08` : 'transparent',
                opacity: i > 14 ? 0.5 : 1,
              }}
            >
              {/* Icon */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${event.color}18`, border: `1px solid ${event.color}30` }}>
                <Icon size={13} style={{ color: event.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {event.label}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                  {event.name}
                  {event.amount && (
                    <span className="ml-1" style={{ color: event.color }}>
                      · {formatCurrency(event.amount)}
                    </span>
                  )}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs flex-shrink-0 mt-0.5 font-mono"
                style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                {timeAgo(event.timestamp)}
              </span>

              {/* New indicator */}
              {event.isNew && (
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 animate-pulse"
                  style={{ background: event.color }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="text-xs font-medium transition-colors"
          style={{ color: '#00D4FF' }}
          onMouseOver={e => e.target.style.color = '#4DE5FF'}
          onMouseOut={e => e.target.style.color = '#00D4FF'}
        >
          View all activity →
        </button>
      </div>
    </div>
  );
}
