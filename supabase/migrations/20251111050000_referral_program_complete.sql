/*
  # Programa de Referidos Completo - Studio Nexora
  
  ## Overview
  Sistema completo de referidos con descuentos acumulables:
  - Referidor: 20% de descuento en próxima compra (hasta 3 referidos)
  - Referido: 15% de descuento en primera compra
  - Tracking completo de clicks y conversiones
  - Sistema de notificaciones
  
  ## Nuevas Tablas
  
  ### 1. `user_referrals`
  Tracking de referidos exitosos por usuario
  - `id` (uuid, primary key)
  - `referrer_id` (uuid) - Usuario que refirió
  - `referee_id` (uuid) - Usuario referido
  - `referral_code` (text) - Código usado
  - `status` (text) - pending, completed, expired
  - `referrer_discount_applied` (boolean) - Si el descuento del referidor fue aplicado
  - `referee_discount_applied` (boolean) - Si el descuento del referido fue aplicado
  - `order_id` (uuid) - Orden que activó el referido
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)
  
  ### 2. `referral_discount_codes`
  Códigos de descuento generados por referidos
  - `id` (uuid, primary key)
  - `referrer_id` (uuid) - Usuario que genera el código
  - `code` (text, unique) - Código único
  - `discount_percent` (numeric) - Porcentaje de descuento
  - `discount_type` (text) - referrer (20%) o referee (15%)
  - `max_uses` (integer) - Máximo de usos (3 para referidor)
  - `current_uses` (integer) - Usos actuales
  - `expires_at` (timestamptz) - Fecha de expiración
  - `active` (boolean) - Si está activo
  - `created_at` (timestamptz)
  
  ## Actualizaciones a Tablas Existentes
  
  ### `profiles`
  - `referral_code` (text, unique) - Código único de referido (ya existe)
  - `total_referrals` (integer) - Total de referidos exitosos
  - `available_referral_discounts` (integer) - Descuentos disponibles (0-3)
  - `referral_discount_percent` (numeric) - Porcentaje acumulado de descuento
  
  ## Funciones y Triggers
  - Función para generar códigos únicos
  - Trigger para actualizar contadores
  - Función para aplicar descuentos automáticamente
*/

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Actualizar tabla profiles con campos de referidos
DO $$
BEGIN
  -- Agregar total_referrals si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_referrals'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_referrals integer DEFAULT 0;
  END IF;

  -- Agregar available_referral_discounts si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'available_referral_discounts'
  ) THEN
    ALTER TABLE profiles ADD COLUMN available_referral_discounts integer DEFAULT 0;
  END IF;

  -- Agregar referral_discount_percent si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'referral_discount_percent'
  ) THEN
    ALTER TABLE profiles ADD COLUMN referral_discount_percent numeric(5,2) DEFAULT 0;
  END IF;
END $$;

-- Tabla user_referrals
CREATE TABLE IF NOT EXISTS user_referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  referrer_discount_applied boolean DEFAULT false,
  referee_discount_applied boolean DEFAULT false,
  order_id uuid REFERENCES orders(id),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(referrer_id, referee_id)
);

ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON user_referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users can insert own referrals"
  ON user_referrals FOR INSERT
  TO authenticated
  WITH CHECK (referee_id = auth.uid());

CREATE INDEX idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX idx_user_referrals_referee_id ON user_referrals(referee_id);
CREATE INDEX idx_user_referrals_status ON user_referrals(status);
CREATE INDEX idx_user_referrals_referral_code ON user_referrals(referral_code);

-- Tabla referral_discount_codes
CREATE TABLE IF NOT EXISTS referral_discount_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  discount_percent numeric(5,2) NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('referrer', 'referee')),
  max_uses integer DEFAULT 1,
  current_uses integer DEFAULT 0,
  expires_at timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referral_discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own discount codes"
  ON referral_discount_codes FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid());

CREATE POLICY "Anyone can view active discount codes"
  ON referral_discount_codes FOR SELECT
  TO authenticated
  USING (active = true);

CREATE INDEX idx_referral_discount_codes_code ON referral_discount_codes(code);
CREATE INDEX idx_referral_discount_codes_referrer_id ON referral_discount_codes(referrer_id);
CREATE INDEX idx_referral_discount_codes_active ON referral_discount_codes(active);

-- Función para generar código único de referido
CREATE OR REPLACE FUNCTION generate_referral_code(user_id uuid)
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generar código: NEXORA-{8 caracteres aleatorios}
    new_code := 'NEXORA-' || upper(substring(md5(random()::text || user_id::text) from 1 for 8));
    
    -- Verificar si ya existe
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = new_code) INTO code_exists;
    
    -- Si no existe, salir del loop
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Función para crear referido cuando se registra con código
CREATE OR REPLACE FUNCTION create_referral_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  referrer_profile_id uuid;
  referral_code_used text;
BEGIN
  -- Obtener código de referido de metadata si existe
  referral_code_used := NEW.raw_user_meta_data->>'referral_code';
  
  IF referral_code_used IS NOT NULL THEN
    -- Buscar el referidor por código
    SELECT id INTO referrer_profile_id
    FROM profiles
    WHERE referral_code = referral_code_used;
    
    IF referrer_profile_id IS NOT NULL THEN
      -- Crear registro de referido
      INSERT INTO user_referrals (referrer_id, referee_id, referral_code, status)
      VALUES (referrer_profile_id, NEW.id, referral_code_used, 'pending')
      ON CONFLICT (referrer_id, referee_id) DO NOTHING;
      
      -- Crear código de descuento para el referido (15%)
      INSERT INTO referral_discount_codes (referrer_id, code, discount_percent, discount_type, max_uses)
      VALUES (NEW.id, 'REF-' || upper(substring(md5(random()::text || NEW.id::text) from 1 for 10)), 15, 'referee', 1)
      ON CONFLICT (code) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear referido al registrarse
DROP TRIGGER IF EXISTS trigger_create_referral_on_signup ON auth.users;
CREATE TRIGGER trigger_create_referral_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_on_signup();

-- Función para aplicar descuento de referidor cuando referido completa orden
CREATE OR REPLACE FUNCTION apply_referrer_discount_on_order()
RETURNS TRIGGER AS $$
DECLARE
  referral_record user_referrals;
  referrer_profile profiles;
  discount_code_id uuid;
  new_discount_code text;
BEGIN
  -- Solo procesar si el pago se completó
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    -- Buscar referido pendiente para este usuario
    SELECT * INTO referral_record
    FROM user_referrals
    WHERE referee_id = NEW.user_id
      AND status = 'pending'
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF referral_record IS NOT NULL THEN
      -- Obtener perfil del referidor
      SELECT * INTO referrer_profile
      FROM profiles
      WHERE id = referral_record.referrer_id;
      
      IF referrer_profile IS NOT NULL THEN
        -- Actualizar contador de referidos exitosos
        UPDATE profiles
        SET 
          total_referrals = total_referrals + 1,
          available_referral_discounts = LEAST(available_referral_discounts + 1, 3)
        WHERE id = referral_record.referrer_id;
        
        -- Si tiene menos de 3 descuentos disponibles, crear código de descuento (20%)
        IF referrer_profile.available_referral_discounts < 3 THEN
          new_discount_code := 'REF20-' || upper(substring(md5(random()::text || referral_record.referrer_id::text || now()::text) from 1 for 8));
          
          INSERT INTO referral_discount_codes (referrer_id, code, discount_percent, discount_type, max_uses, expires_at)
          VALUES (
            referral_record.referrer_id,
            new_discount_code,
            20,
            'referrer',
            1,
            now() + interval '90 days'
          )
          ON CONFLICT (code) DO NOTHING
          RETURNING id INTO discount_code_id;
        END IF;
        
        -- Marcar referido como completado
        UPDATE user_referrals
        SET 
          status = 'completed',
          order_id = NEW.id,
          completed_at = now(),
          referee_discount_applied = true
        WHERE id = referral_record.id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para aplicar descuento cuando se completa orden
DROP TRIGGER IF EXISTS trigger_apply_referrer_discount ON orders;
CREATE TRIGGER trigger_apply_referrer_discount
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION apply_referrer_discount_on_order();

-- Función para obtener estadísticas de referidos
CREATE OR REPLACE FUNCTION get_referral_stats(user_id uuid)
RETURNS TABLE (
  total_referrals bigint,
  completed_referrals bigint,
  pending_referrals bigint,
  available_discounts integer,
  total_discount_percent numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_referrals,
    COUNT(*) FILTER (WHERE ur.status = 'completed')::bigint as completed_referrals,
    COUNT(*) FILTER (WHERE ur.status = 'pending')::bigint as pending_referrals,
    COALESCE(p.available_referral_discounts, 0)::integer as available_discounts,
    COALESCE(p.referral_discount_percent, 0)::numeric as total_discount_percent
  FROM user_referrals ur
  RIGHT JOIN profiles p ON p.id = user_id
  WHERE ur.referrer_id = user_id OR ur.referrer_id IS NULL
  GROUP BY p.available_referral_discounts, p.referral_discount_percent;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON TABLE user_referrals IS 'Tracking de referidos exitosos entre usuarios';
COMMENT ON TABLE referral_discount_codes IS 'Códigos de descuento generados por el sistema de referidos';
COMMENT ON FUNCTION generate_referral_code IS 'Genera un código único de referido para un usuario';
COMMENT ON FUNCTION create_referral_on_signup IS 'Crea registro de referido cuando un usuario se registra con código';
COMMENT ON FUNCTION apply_referrer_discount_on_order IS 'Aplica descuento al referidor cuando el referido completa una orden';
COMMENT ON FUNCTION get_referral_stats IS 'Obtiene estadísticas de referidos para un usuario';

