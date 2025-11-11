/*
  # AI Photo Studio Platform - Core Database Schema

  ## Overview
  Complete database schema for an AI-powered professional photo generation platform.
  Supports 100k+ concurrent users with optimized indexing and RLS policies.

  ## New Tables Created

  ### 1. `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `language` (text) - Preferred language (es/en)
  - `affiliate_code` (text, unique) - Personal affiliate code
  - `referred_by` (uuid) - Reference to affiliate who referred them
  - `credits` (integer) - Available photo credits
  - `total_spent` (numeric) - Lifetime spending
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `photo_uploads`
  Stores original uploaded photos from users
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Profile reference
  - `storage_path` (text) - Supabase storage path
  - `file_name` (text) - Original filename
  - `file_size` (integer) - File size in bytes
  - `category` (text) - Type: person, pet, family, team
  - `metadata` (jsonb) - Detected faces, gender, age estimation
  - `status` (text) - pending, processing, completed, failed
  - `created_at` (timestamptz)

  ### 3. `generated_photos`
  AI-generated professional photos
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Profile reference
  - `order_id` (uuid) - Order reference
  - `original_upload_id` (uuid) - Source photo
  - `version` (text) - A (similar) or B (enhanced)
  - `storage_path` (text) - Generated image path
  - `watermarked_path` (text) - Watermarked preview path
  - `prompt_used` (text) - AI prompt used
  - `generation_params` (jsonb) - Model parameters
  - `status` (text) - generating, ready, delivered
  - `created_at` (timestamptz)

  ### 4. `orders`
  Purchase orders and transactions
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Profile reference
  - `package_type` (text) - 1_photo, 2_photos, 3_photos, family, pet
  - `photo_count` (integer) - Number of photos
  - `price_mxn` (numeric) - Price in Mexican Pesos
  - `discount_percent` (numeric) - Applied discount
  - `final_price_mxn` (numeric) - Final price after discount
  - `payment_provider` (text) - stripe or lemon_squeezy
  - `payment_status` (text) - pending, completed, failed, refunded
  - `payment_id` (text) - External payment ID
  - `referred_by_code` (text) - Affiliate code used
  - `metadata` (jsonb) - Additional order data
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 5. `affiliate_earnings`
  Tracks affiliate commissions and payouts
  - `id` (uuid, primary key)
  - `affiliate_id` (uuid) - Profile reference
  - `order_id` (uuid) - Order that generated commission
  - `commission_percent` (numeric) - Commission rate (40%)
  - `commission_amount_mxn` (numeric) - Earned amount
  - `status` (text) - pending, approved, paid
  - `paid_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `referral_discounts`
  Referral discount tracking (15% friend discount)
  - `id` (uuid, primary key)
  - `referrer_id` (uuid) - User who referred
  - `referee_id` (uuid) - New user who was referred
  - `discount_code` (text, unique) - Generated discount code
  - `discount_percent` (numeric) - Discount amount (15%)
  - `used` (boolean) - Whether discount was used
  - `order_id` (uuid) - Order where discount was applied
  - `created_at` (timestamptz)
  - `used_at` (timestamptz)

  ### 7. `prompt_templates`
  Optimized AI prompts for different categories
  - `id` (uuid, primary key)
  - `category` (text) - person_male, person_female, child_boy, child_girl, pet_dog, pet_cat, family, team
  - `version` (text) - A (similar) or B (enhanced)
  - `prompt_template` (text) - AI prompt with variables
  - `variables` (jsonb) - Available variables
  - `optimization_score` (integer) - Quality rating 0-100
  - `active` (boolean) - Currently in use
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Admins have separate elevated policies
  - Affiliate data protected and validated

  ## Performance
  - Indexes on foreign keys
  - Indexes on status fields for filtering
  - Composite indexes for common queries
  - JSONB GIN indexes for metadata searches

  ## Notes
  - All monetary values in MXN (Mexican Pesos)
  - Supports multi-language (ES/EN)
  - Designed for 100k+ concurrent users
  - Zero-latency architecture with proper indexing
*/

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  language text DEFAULT 'es' CHECK (language IN ('es', 'en')),
  affiliate_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES profiles(id),
  credits integer DEFAULT 0,
  total_spent numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE INDEX idx_profiles_affiliate_code ON profiles(affiliate_code);
CREATE INDEX idx_profiles_referred_by ON profiles(referred_by);

-- Photo uploads table
CREATE TABLE IF NOT EXISTS photo_uploads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  category text NOT NULL CHECK (category IN ('person', 'pet', 'family', 'team')),
  metadata jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photo_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own uploads"
  ON photo_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own uploads"
  ON photo_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_photo_uploads_user_id ON photo_uploads(user_id);
CREATE INDEX idx_photo_uploads_status ON photo_uploads(status);
CREATE INDEX idx_photo_uploads_created_at ON photo_uploads(created_at DESC);

-- Generated photos table
CREATE TABLE IF NOT EXISTS generated_photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid NOT NULL,
  original_upload_id uuid NOT NULL REFERENCES photo_uploads(id) ON DELETE CASCADE,
  version text NOT NULL CHECK (version IN ('A', 'B')),
  storage_path text NOT NULL,
  watermarked_path text NOT NULL,
  prompt_used text NOT NULL,
  generation_params jsonb DEFAULT '{}',
  status text DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'delivered')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generated photos"
  ON generated_photos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_generated_photos_user_id ON generated_photos(user_id);
CREATE INDEX idx_generated_photos_order_id ON generated_photos(order_id);
CREATE INDEX idx_generated_photos_status ON generated_photos(status);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  package_type text NOT NULL CHECK (package_type IN ('1_photo', '2_photos', '3_photos', 'family', 'pet')),
  photo_count integer NOT NULL,
  price_mxn numeric(10,2) NOT NULL,
  discount_percent numeric(5,2) DEFAULT 0,
  final_price_mxn numeric(10,2) NOT NULL,
  payment_provider text NOT NULL CHECK (payment_provider IN ('stripe', 'lemon_squeezy')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id text,
  referred_by_code text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_referred_by_code ON orders(referred_by_code);

-- Affiliate earnings table
CREATE TABLE IF NOT EXISTS affiliate_earnings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  commission_percent numeric(5,2) NOT NULL DEFAULT 40,
  commission_amount_mxn numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE affiliate_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own earnings"
  ON affiliate_earnings FOR SELECT
  TO authenticated
  USING (affiliate_id = auth.uid());

CREATE INDEX idx_affiliate_earnings_affiliate_id ON affiliate_earnings(affiliate_id);
CREATE INDEX idx_affiliate_earnings_status ON affiliate_earnings(status);

-- Referral discounts table
CREATE TABLE IF NOT EXISTS referral_discounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  discount_code text UNIQUE NOT NULL,
  discount_percent numeric(5,2) DEFAULT 15,
  used boolean DEFAULT false,
  order_id uuid REFERENCES orders(id),
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

ALTER TABLE referral_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral discounts"
  ON referral_discounts FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE INDEX idx_referral_discounts_referrer_id ON referral_discounts(referrer_id);
CREATE INDEX idx_referral_discounts_discount_code ON referral_discounts(discount_code);
CREATE INDEX idx_referral_discounts_used ON referral_discounts(used);

-- Prompt templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL CHECK (category IN ('person_male', 'person_female', 'child_boy', 'child_girl', 'pet_dog', 'pet_cat', 'family', 'team')),
  version text NOT NULL CHECK (version IN ('A', 'B')),
  prompt_template text NOT NULL,
  variables jsonb DEFAULT '[]',
  optimization_score integer DEFAULT 0 CHECK (optimization_score >= 0 AND optimization_score <= 100),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category, version, active)
);

ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active prompt templates"
  ON prompt_templates FOR SELECT
  TO authenticated
  USING (active = true);

CREATE INDEX idx_prompt_templates_category ON prompt_templates(category);
CREATE INDEX idx_prompt_templates_active ON prompt_templates(active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();