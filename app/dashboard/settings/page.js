'use client';

import { useState } from 'react';
import { Sun, Moon, Bell, Shield, Palette, User, CreditCard, Save, Check } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import toast from 'react-hot-toast';
import { cn } from '@/lib/helpers';
import { useAuth } from '@/lib/authContext';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0"
      style={{
        background: checked ? '#00D4FF' : 'rgba(255,255,255,0.1)',
        boxShadow: checked ? '0 0 12px rgba(0,212,255,0.4)' : 'none',
      }}
    >
      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState('appearance');
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    email: true, push: true, weekly: true, security: true, product: false,
  });
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: authProfile?.full_name || user?.user_metadata?.full_name || '',
    email: authProfile?.email || user?.email || '',
    company: authProfile?.company || user?.user_metadata?.company || '',
    timezone: authProfile?.timezone || 'UTC',
  });
  // Sync once authProfile loads
  const [synced, setSynced] = useState(false);
  if (authProfile && !synced) {
    setProfile({
      name: authProfile.full_name || user?.user_metadata?.full_name || '',
      email: authProfile.email || user?.email || '',
      company: authProfile.company || user?.user_metadata?.company || '',
      timezone: authProfile.timezone || 'UTC',
    });
    setSynced(true);
  }
  const [accentColor, setAccentColor] = useState('#00D4FF');

  const COLORS = ['#00D4FF', '#00E5A0', '#A78BFA', '#FFB347', '#FF4D6D', '#F472B6'];

  function handleSave() {
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="heading-font text-xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Settings
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your account preferences</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 flex-wrap p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={tab === id
              ? { background: 'rgba(0,212,255,0.12)', color: '#00D4FF' }
              : { color: 'var(--text-muted)' }
            }>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="glass-card p-6 space-y-0">
        {tab === 'profile' && (
          <div className="space-y-4">
            <h3 className="heading-font text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Profile Information</h3>
            {[
              { key: 'name', label: 'Full Name' },
              { key: 'email', label: 'Email Address' },
              { key: 'company', label: 'Company' },
              { key: 'timezone', label: 'Timezone' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </label>
                <input
                  value={profile[key]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'appearance' && (
          <>
            <h3 className="heading-font text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
            <SettingRow label="Color Mode" description="Switch between dark and light themes">
              <div className="flex p-0.5 rounded-xl gap-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)' }}>
                {[
                  { t: 'dark', label: 'Dark', icon: Moon },
                  { t: 'light', label: 'Light', icon: Sun },
                ].map(({ t, label, icon: Icon }) => (
                  <button key={t} onClick={() => theme !== t && toggleTheme()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={theme === t
                      ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
                      : { color: 'var(--text-muted)' }
                    }>
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Accent Color" description="Customize your dashboard accent color">
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setAccentColor(c)}
                    className="w-6 h-6 rounded-full transition-all duration-200"
                    style={{
                      background: c,
                      border: accentColor === c ? `2px solid white` : '2px solid transparent',
                      boxShadow: accentColor === c ? `0 0 10px ${c}80` : 'none',
                    }}
                  />
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Compact Mode" description="Reduce spacing for more content density">
              <Toggle checked={false} onChange={() => toast('Compact mode coming soon!')} />
            </SettingRow>
          </>
        )}

        {tab === 'notifications' && (
          <>
            <h3 className="heading-font text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'weekly', label: 'Weekly Reports', desc: 'Receive weekly analytics digests' },
              { key: 'security', label: 'Security Alerts', desc: 'Get notified of suspicious activity' },
              { key: 'product', label: 'Product Updates', desc: 'News about new features' },
            ].map(({ key, label, desc }) => (
              <SettingRow key={key} label={label} description={desc}>
                <Toggle checked={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
              </SettingRow>
            ))}
          </>
        )}

        {tab === 'security' && (
          <>
            <h3 className="heading-font text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Security Settings</h3>
            <SettingRow label="Two-Factor Authentication" description="Add extra security to your account">
              <button className="btn-ghost text-xs">Enable 2FA</button>
            </SettingRow>
            <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
              <select className="input-field w-32 h-8 text-xs"
                style={{ appearance: 'none' }}>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>Never</option>
              </select>
            </SettingRow>
            <SettingRow label="Change Password" description="Update your account password">
              <button className="btn-ghost text-xs">Update Password</button>
            </SettingRow>
            <SettingRow label="Active Sessions" description="Manage logged-in devices">
              <button className="text-xs" style={{ color: '#FF4D6D' }}>Revoke All</button>
            </SettingRow>
          </>
        )}

        {tab === 'billing' && (
          <>
            <h3 className="heading-font text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Billing & Plan</h3>
            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#00D4FF' }}>Pro Plan</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>$49/month · Renews Jan 1, 2025</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
            <SettingRow label="Payment Method" description="Visa ending in 4242">
              <button className="btn-ghost text-xs">Update</button>
            </SettingRow>
            <SettingRow label="Billing History" description="View and download invoices">
              <button className="btn-ghost text-xs">View</button>
            </SettingRow>
            <SettingRow label="Cancel Subscription" description="Cancel your Pro subscription">
              <button className="text-xs" style={{ color: '#FF4D6D' }}>Cancel Plan</button>
            </SettingRow>
          </>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary gap-2">
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
