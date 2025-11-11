/*
  # Add Tracking and API Configuration Features

  ## Overview
  Extends the database schema to support affiliate/referral tracking dashboards,
  API configuration management, and consent tracking.

  ## New Tables

  ### 1. `admin_users`
  Identifies admin users with special permissions
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Profile reference
  - `role` (text) - admin, super_admin
  - `permissions` (jsonb) - Specific permissions
  - `created_at` (timestamptz)

  ### 2. `api_configurations`
  Stores encrypted API keys and configuration
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Admin user reference
  - `provider` (text) - stripe, lemonsqueezy, ai_api, supabase
  - `config_data` (jsonb) - Encrypted configuration data
  - `is_active` (boolean) - Whether config is enabled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `affiliate_clicks`
  Tracks clicks on affiliate links
  - `id` (uuid, primary key)
  - `affiliate_id` (uuid) - Profile reference
  - `clicked_at` (timestamptz)
  - `ip_address` (text) - For deduplication
  - `user_agent` (text) - Browser info
  - `referrer_url` (text) - Source URL
  - `converted` (boolean) - Whether led to purchase

  ### 4. `user_consents`
  Tracks user consent for terms and conditions
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Profile reference
  - `consent_type` (text) - upload_terms, privacy_policy, etc
  - `accepted` (boolean)
  - `ip_address` (text)
  - `user_agent` (text)
  - `accepted_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - API configs only accessible by admins
  - User data properly protected
  - Consent tracking for compliance

  ## Performance
  - Indexes on foreign keys
  - Indexes on tracking timestamps
  - Efficient query patterns
*/

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin Users table (create first as it's referenced by API configs)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- API Configurations table
CREATE TABLE IF NOT EXISTS api_configurations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('stripe', 'lemonsqueezy', 'ai_api', 'supabase')),
  config_data jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage API configs"
  ON api_configurations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE INDEX idx_api_configurations_provider ON api_configurations(provider);
CREATE INDEX idx_api_configurations_is_active ON api_configurations(is_active);

-- Affiliate Clicks table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clicked_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  referrer_url text,
  converted boolean DEFAULT false,
  order_id uuid REFERENCES orders(id)
);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (affiliate_id = auth.uid());

CREATE INDEX idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);
CREATE INDEX idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at DESC);
CREATE INDEX idx_affiliate_clicks_converted ON affiliate_clicks(converted);

-- User Consents table
CREATE TABLE IF NOT EXISTS user_consents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL CHECK (consent_type IN ('upload_terms', 'privacy_policy', 'terms_of_service', 'marketing')),
  accepted boolean NOT NULL,
  ip_address text,
  user_agent text,
  accepted_at timestamptz DEFAULT now()
);

ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consents"
  ON user_consents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own consents"
  ON user_consents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_consent_type ON user_consents(consent_type);

-- Trigger for api_configurations updated_at
CREATE TRIGGER update_api_configurations_updated_at
  BEFORE UPDATE ON api_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add affiliate_link_clicks counter to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'affiliate_clicks_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN affiliate_clicks_count integer DEFAULT 0;
  END IF;
END $$;

-- Function to increment click counter
CREATE OR REPLACE FUNCTION increment_affiliate_clicks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET affiliate_clicks_count = affiliate_clicks_count + 1
  WHERE id = NEW.affiliate_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment clicks
CREATE TRIGGER auto_increment_affiliate_clicks
  AFTER INSERT ON affiliate_clicks
  FOR EACH ROW
  EXECUTE FUNCTION increment_affiliate_clicks();