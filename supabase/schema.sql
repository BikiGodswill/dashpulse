-- ╔══════════════════════════════════════════════════════════════╗
-- ║          DashPulse Analytics — Supabase Schema v2            ║
-- ║   Paste this into Supabase → SQL Editor → Run               ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ─── Extensions ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ──────────────────────────────────────────────────────
-- One row per user, created automatically by the trigger below.
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  full_name    TEXT DEFAULT '',
  company      TEXT DEFAULT '',
  avatar_url   TEXT,
  plan         TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  timezone     TEXT DEFAULT 'UTC',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: owner select"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: owner update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── updated_at helper ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── transactions ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT,
  plan             TEXT DEFAULT 'starter',
  amount           DECIMAL(10,2) NOT NULL,
  currency         TEXT DEFAULT 'USD',
  status           TEXT DEFAULT 'pending'
                     CHECK (status IN ('pending','processing','completed','failed','refunded')),
  payment_method   TEXT DEFAULT 'card',
  stripe_payment_id TEXT,
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_txn_user    ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_txn_status  ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_txn_created ON public.transactions(created_at DESC);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions: owner select"
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions: service insert"
  ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── user_activity ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_activity (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  event_label TEXT,
  page        TEXT,
  session_id  TEXT,
  properties  JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user    ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type    ON public.user_activity(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.user_activity(created_at DESC);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity: owner select" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity: owner insert" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── metrics ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.metrics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metric_name TEXT NOT NULL,
  value       DECIMAL(20,4) NOT NULL,
  unit        TEXT,
  dimensions  JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, metric_date, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON public.metrics(user_id, metric_date DESC);

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "metrics: owner all" ON public.metrics FOR ALL USING (auth.uid() = user_id);

-- ─── notifications ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('info','success','warning','error','system')),
  title        TEXT NOT NULL,
  message      TEXT,
  action_label TEXT,
  action_url   TEXT,
  read         BOOLEAN DEFAULT FALSE,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_unread  ON public.notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notif_created ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif: owner select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif: owner update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ─── widget_preferences ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.widget_preferences (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  active_widgets TEXT[] DEFAULT ARRAY['revenue','users','engagement','income','activity','geo','transactions'],
  widget_order   JSONB DEFAULT '[]',
  layout_config  JSONB DEFAULT '{}',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.widget_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "widgets: owner all" ON public.widget_preferences FOR ALL USING (auth.uid() = user_id);

-- ─── Enable Realtime for live feed ──────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
