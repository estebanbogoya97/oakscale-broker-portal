-- ============================================================================
-- OAKSCALE BROKER PORTAL - DATABASE INITIALIZATION
-- Creates schema for profiles, leads, and automated email routing
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE - Broker Information
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  broker_network text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Broker profile information synced from auth signup';

-- ============================================================================
-- 2. LEADS TABLE - Candidate Referrals
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  brand_interest text NOT NULL,
  state text NOT NULL,
  city text,
  broker_notes text,
  attachment_url text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'placed', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE leads IS 'Candidate referrals submitted by brokers';
CREATE INDEX idx_leads_broker_id ON leads(broker_id);
CREATE INDEX idx_leads_brand_interest ON leads(brand_interest);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================================================
-- 3. EMAIL LOGS TABLE (Optional but recommended for troubleshooting)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  status text CHECK (status IN ('sent', 'failed', 'pending')),
  error_message text,
  sent_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE email_logs IS 'Track email sending for each lead';
CREATE INDEX idx_email_logs_lead_id ON email_logs(lead_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- ========== PROFILES RLS POLICIES ==========
-- Service Role can read all profiles (needed for edge function)
CREATE POLICY "service_role_read_all" ON profiles
  FOR SELECT 
  TO authenticated, service_role
  USING (true);

-- Users can only see their own profile
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- ========== LEADS RLS POLICIES ==========
-- Brokers can insert their own leads
CREATE POLICY "brokers_insert_leads" ON leads
  FOR INSERT 
  TO authenticated
  WITH CHECK (broker_id = auth.uid());

-- Brokers can read only their own leads
CREATE POLICY "brokers_read_own_leads" ON leads
  FOR SELECT 
  TO authenticated
  USING (broker_id = auth.uid());

-- Service Role can read all leads (for edge function and admin dashboard)
CREATE POLICY "service_role_read_all_leads" ON leads
  FOR SELECT 
  TO service_role
  USING (true);

-- ========== EMAIL LOGS RLS POLICIES ==========
-- Service Role can insert and read email logs
CREATE POLICY "service_role_manage_logs" ON email_logs
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role_read_logs" ON email_logs
  FOR SELECT 
  TO service_role
  USING (true);

-- ============================================================================
-- 5. TRIGGER FUNCTION - Auto-create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, broker_network)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'broker_network', 'Independent')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists (allows safe re-running of migration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically create a profile when a new user signs up';

-- ============================================================================
-- 6. TRIGGER FUNCTION - Log email attempts
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_email_send()
RETURNS trigger AS $$
BEGIN
  -- This will be called when a lead is inserted
  -- Status is set to 'pending' and the edge function will update it
  INSERT INTO public.email_logs (lead_id, recipient_email, subject, status)
  VALUES (
    new.id,
    (SELECT CASE 
      WHEN new.brand_interest = 'Payroll Vault' THEN 'payrollvault@oakscale.com'
      WHEN new.brand_interest = 'Sea Love' THEN 'sealove@oakscale.com'
      WHEN new.brand_interest = 'Greenlight Mobility' THEN 'greenlight@oakscale.com'
      WHEN new.brand_interest = 'Break Coffee Co.' THEN 'breakcoffee@oakscale.com'
      ELSE 'caleb@oakscale.com'
    END),
    CONCAT('New ', new.brand_interest, ' Referral'),
    'pending'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that logs emails when a lead is inserted
DROP TRIGGER IF EXISTS log_lead_email ON leads;
CREATE TRIGGER log_lead_email
  AFTER INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION public.log_email_send();

COMMENT ON FUNCTION public.log_email_send IS 'Log email attempts when leads are submitted';

-- ============================================================================
-- 7. VERIFY SETUP
-- ============================================================================
-- Run these selects to verify:
-- SELECT * FROM profiles;
-- SELECT * FROM leads;
-- SELECT * FROM email_logs;
