# 📊 DashPulse Analytics — Pro

A production-ready, real-time business analytics dashboard built with:

- **Next.js 14** App Router (JavaScript only)
- **Supabase** (auth, database, real-time subscriptions)
- **Tailwind CSS v3** with custom deep-space design system
- **Recharts** for all data visualizations
- **Lucide Icons**, **react-hot-toast**, **date-fns**

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Then fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Enable **Real-time** for the `user_activity`, `notifications`, and `transactions` tables in the Supabase dashboard under **Database → Replication**

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
dashpulse/
├── app/
│   ├── layout.js              # Root layout with ThemeProvider + Toaster
│   ├── page.js                # Landing page (hero, features, pricing, testimonials)
│   ├── globals.css            # Design system, Tailwind layers, animations
│   ├── dashboard/
│   │   ├── layout.js          # Sidebar + Navbar shell
│   │   ├── page.js            # Main dashboard (KPIs, charts, widgets)
│   │   ├── analytics/
│   │   │   └── page.js        # Deep-dive analytics, cohorts, top pages
│   │   └── settings/
│   │       └── page.js        # Profile, appearance, notifications, billing
│   └── auth/
│       ├── login/page.js      # Email/password login + demo bypass
│       └── register/page.js   # Sign-up with password strength meter
├── components/
│   ├── ThemeProvider.js       # Dark/light mode context
│   ├── Sidebar.js             # Collapsible navigation sidebar
│   ├── Navbar.js              # Top bar with search, theme toggle, notifications
│   ├── StatCard.js            # KPI card with sparkline + trend badge
│   ├── RevenueChart.js        # Composed bar+line chart with range selector
│   ├── UsersChart.js          # Area chart with live user counter
│   ├── IncomeChart.js         # Donut/pie chart with legend
│   ├── EngagementMetrics.js   # Radar chart + metric grid
│   ├── ActivityFeed.js        # Live-updating event stream
│   ├── TransactionsTable.js   # Sortable, filterable, paginated table + CSV export
│   ├── GeoWidget.js           # Country breakdown with progress bars
│   ├── WidgetGrid.js          # Widget picker modal with toggle controls
│   ├── DateRangeFilter.js     # Date range preset dropdown
│   └── SkeletonLoader.js      # Shimmer skeletons for loading states
├── lib/
│   ├── supabaseClient.js      # Supabase browser client (singleton)
│   ├── helpers.js             # Formatters, utilities, color maps
│   └── seedData.js            # Demo data generators for all charts
├── supabase/
│   └── schema.sql             # Full DB schema with RLS, triggers, indexes
└── middleware.js              # Route protection + auth redirects
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary color | `#00D4FF` (electric cyan) |
| Success | `#00E5A0` (emerald) |
| Warning | `#FFB347` (amber) |
| Danger | `#FF4D6D` (rose) |
| Accent | `#A78BFA` (violet) |
| BG dark | `#080C14` |
| Card bg | `rgba(13,18,32,0.8)` |
| Heading font | Syne |
| Monospace | DM Mono |
| Body | Plus Jakarta Sans |

---

## ⚡ Key Features

### Dashboard
- **6 KPI stat cards** with sparklines and percentage change badges
- **Revenue chart** — ComposedChart (bars + target line) with 7D/14D/30D/90D range
- **Users chart** — Area chart with live online counter (updates every 2s)
- **Engagement metrics** — Radar chart + 6-metric mini-grid
- **Income breakdown** — Donut chart with center total
- **Live activity feed** — Auto-generates new events every ~5s, pauseable
- **Transactions table** — Sort, filter by status, search, paginate, export CSV
- **Geographic widget** — Top 8 countries with animated progress bars
- **Widget picker** — Show/hide any widget via modal

### Analytics Page
- Revenue vs Users dual-axis correlation chart
- User retention cohort matrix
- Top pages with visit bars and change %
- New vs Churned users bar chart

### Settings Page
- Profile editor
- Dark/light mode toggle + accent color picker
- Per-notification-type toggles
- Security settings (2FA, session timeout)
- Billing & plan management

### Auth
- Email/password login via Supabase Auth
- Register with password strength meter
- Demo bypass (no account needed)
- Middleware-enforced protected routes
- Auto profile creation on signup (DB trigger)

---

## 🔐 Security

- All Supabase keys behind `NEXT_PUBLIC_` / server-only env vars
- Row-Level Security (RLS) on all tables
- Next.js middleware protects `/dashboard/*` routes
- Auth session persisted via `@supabase/ssr` cookie handling

---

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## 📦 Adding Real Data

Replace the seed data generators in `lib/seedData.js` with Supabase queries:

```js
// Example: fetch real revenue data
const { data } = await supabase
  .from('transactions')
  .select('amount, created_at')
  .eq('status', 'completed')
  .gte('created_at', fromDate)
  .order('created_at', { ascending: true });
```

---

Built with ❤️ using Next.js App Router + Supabase
