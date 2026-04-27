# 📊 DashPulse Analytics — Pro

Production-ready real-time analytics dashboard built with Next.js 14 App Router, Supabase, Tailwind CSS, and Recharts.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
```
Fill in your Supabase project URL and anon key:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Set up the database
Open **Supabase → SQL Editor**, paste the entire contents of `supabase/schema.sql`, and click **Run**. This creates all tables, RLS policies, and the auto-profile trigger.

### 4. (Optional) Disable email confirmation for dev
In Supabase go to **Authentication → Email Templates → Confirm signup** and toggle off "Enable email confirmations". With this off, users are logged in immediately after registering — no email needed.

### 5. Run
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 How auth works

| Flow | What happens |
|---|---|
| **Register** | `supabase.auth.signUp()` → DB trigger creates `profiles` row → if email confirmation OFF, session starts immediately → redirect to `/dashboard` |
| **Register (confirmation ON)** | Shows "Check your inbox" screen — user clicks email link → redirected to dashboard |
| **Sign in** | `supabase.auth.signInWithPassword()` → `window.location.href = '/dashboard'` (hard nav ensures cookies are sent) |
| **Demo mode** | Sets `dashpulse_demo=true` cookie → middleware reads it and bypasses Supabase check |
| **Log out** | Clears Supabase session or demo cookie → `window.location.href = '/'` |

---

## 📁 Project Structure
```
dashpulse/
├── app/
│   ├── layout.js                  # Root layout (ThemeProvider + AuthProvider + Toaster)
│   ├── page.js                    # Landing page
│   ├── globals.css                # Full design system
│   ├── dashboard/
│   │   ├── layout.js              # Sidebar + DemoBanner + Navbar
│   │   ├── page.js                # Main dashboard
│   │   ├── analytics/page.js      # Deep analytics
│   │   └── settings/page.js       # Profile & preferences
│   └── auth/
│       ├── login/page.js          # Sign-in form
│       └── register/page.js       # Sign-up form
├── components/
│   ├── ThemeProvider.js           # Dark/light mode context
│   ├── AuthProvider (lib)         # Unified auth context
│   ├── Sidebar.js                 # Collapsible nav
│   ├── Navbar.js                  # Top bar
│   ├── DemoBanner.js              # Banner shown in demo mode
│   ├── StatCard.js                # KPI card with sparkline
│   ├── RevenueChart.js            # Bar + line chart
│   ├── UsersChart.js              # Area chart + live counter
│   ├── IncomeChart.js             # Donut chart
│   ├── EngagementMetrics.js       # Radar chart
│   ├── ActivityFeed.js            # Live event stream
│   ├── TransactionsTable.js       # Sortable table + CSV export
│   ├── GeoWidget.js               # Country breakdown
│   ├── WidgetGrid.js              # Widget picker
│   ├── DateRangeFilter.js         # Date preset dropdown
│   └── SkeletonLoader.js          # Shimmer loaders
├── lib/
│   ├── supabaseClient.js          # Browser client singleton
│   ├── authContext.js             # AuthProvider + useAuth hook
│   ├── helpers.js                 # Formatters + utilities
│   └── seedData.js                # Demo data generators
├── supabase/
│   └── schema.sql                 # Full DB schema (tables, RLS, triggers)
├── middleware.js                  # Route protection
└── jsconfig.json                  # @ path alias
```

---

## 🗄️ Database tables

| Table | Purpose |
|---|---|
| `profiles` | Extended user data (name, company, plan) — auto-created on signup |
| `transactions` | Payment records |
| `user_activity` | Event tracking |
| `metrics` | Daily metric snapshots |
| `notifications` | Per-user notifications |
| `widget_preferences` | Dashboard layout preferences |

---

## 🚢 Deploy to Vercel
```bash
vercel
```
Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel → Project → Settings → Environment Variables.
