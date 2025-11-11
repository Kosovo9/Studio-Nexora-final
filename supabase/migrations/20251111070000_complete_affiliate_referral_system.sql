/*
  # Migración Completa del Sistema de Afiliados y Referidos
  
  ## Overview
  Migración completa con todas las tablas necesarias para:
  - Afiliados (AFF-XXXXX) con pagos quincenales
  - Referidos (REF-XXXXX) con descuentos
  - Notificaciones
  - Tracking completo
  
  ## Tablas
  
  ### 1. `affiliates`
  Información completa de afiliados con cuenta bancaria
  
  ### 2. `affiliate_earnings`
  Comisiones por venta con control de pagos
  
  ### 3. `referral_codes`
  Códigos de referido únicos
  
  ### 4. `referral_discounts`
  Descuentos aplicados
  
  ### 5. `notifications`
  Notificaciones del sistema
*/

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLA: affiliates (SI NO EXISTE)
-- =============================================
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Información básica
  affiliate_code VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  
  -- CUENTA BANCARIA (CLABE)
  bank_clabe VARCHAR(18),
  bank_name VARCHAR(100),
  account_holder_name VARCHAR(255),
  payment_method VARCHAR(50) DEFAULT 'bank_transfer',
  
  -- Configuración
  commission_rate NUMERIC(5,2) DEFAULT 10.00,
  minimum_payout NUMERIC(10,2) DEFAULT 500.00,
  
  -- Estadísticas
  total_clicks INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_earnings NUMERIC(10,2) DEFAULT 0,
  pending_earnings NUMERIC(10,2) DEFAULT 0,
  paid_earnings NUMERIC(10,2) DEFAULT 0,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  approved_at TIMESTAMPTZ,
  suspended_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: affiliate_earnings (Actualizar si existe)
-- =============================================
DO $$
BEGIN
  -- Agregar campos si no existen
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'order_amount'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN order_amount NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_hold_until'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_hold_until TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_scheduled_date'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_scheduled_date TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_completed_date'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_completed_date TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'customer_name'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN customer_name VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN customer_email VARCHAR(255);
  END IF;
END $$;

-- Actualizar referencia de affiliate_id si es necesario
DO $$
BEGIN
  -- Si affiliate_earnings.affiliate_id referencia a profiles, cambiarlo a affiliates
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'affiliate_earnings_affiliate_id_fkey'
    AND table_name = 'affiliate_earnings'
  ) THEN
    -- Verificar si la referencia es a profiles
    IF EXISTS (
      SELECT 1 FROM information_schema.constraint_column_usage
      WHERE constraint_name = 'affiliate_earnings_affiliate_id_fkey'
      AND table_name = 'profiles'
    ) THEN
      -- Eliminar constraint viejo
      ALTER TABLE affiliate_earnings DROP CONSTRAINT affiliate_earnings_affiliate_id_fkey;
      -- Agregar nuevo constraint
      ALTER TABLE affiliate_earnings 
      ADD CONSTRAINT affiliate_earnings_affiliate_id_fkey 
      FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- =============================================
-- TABLA: referral_codes
-- =============================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Código único
  code VARCHAR(50) UNIQUE NOT NULL,
  
  -- Información del referido
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Configuración de descuento
  discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_uses INTEGER,
  expires_at TIMESTAMPTZ,
  
  -- Referido por afiliado
  referred_by_affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  referred_by_code VARCHAR(50),
  
  -- Estadísticas
  times_used INTEGER DEFAULT 0,
  total_discount_given NUMERIC(10,2) DEFAULT 0,
  total_sales_generated NUMERIC(10,2) DEFAULT 0,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: referral_discounts (Actualizar si existe)
-- =============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_discounts' AND column_name = 'order_amount'
  ) THEN
    ALTER TABLE referral_discounts ADD COLUMN order_amount NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_discounts' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE referral_discounts ADD COLUMN discount_amount NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_discounts' AND column_name = 'final_amount'
  ) THEN
    ALTER TABLE referral_discounts ADD COLUMN final_amount NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_discounts' AND column_name = 'customer_name'
  ) THEN
    ALTER TABLE referral_discounts ADD COLUMN customer_name VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_discounts' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE referral_discounts ADD COLUMN customer_email VARCHAR(255);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_discounts' AND column_name = 'referral_id'
  ) THEN
    ALTER TABLE referral_discounts ADD COLUMN referral_id UUID REFERENCES referral_codes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =============================================
-- TABLA: notifications
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenido
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  
  -- Estado
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES OPTIMIZADOS
-- =============================================

-- Affiliates
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);

-- Affiliate Earnings
CREATE INDEX IF NOT EXISTS idx_earnings_affiliate_id ON affiliate_earnings(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_earnings_order_id ON affiliate_earnings(order_id);
CREATE INDEX IF NOT EXISTS idx_earnings_payment_status ON affiliate_earnings(payment_status);
CREATE INDEX IF NOT EXISTS idx_earnings_hold_date ON affiliate_earnings(payment_hold_until);
CREATE INDEX IF NOT EXISTS idx_earnings_scheduled_date ON affiliate_earnings(payment_scheduled_date);

-- Referral Codes
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_status ON referral_codes(status);
CREATE INDEX IF NOT EXISTS idx_referral_codes_affiliate ON referral_codes(referred_by_affiliate_id);

-- Referral Discounts
CREATE INDEX IF NOT EXISTS idx_referral_discounts_code ON referral_discounts(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_discounts_order ON referral_discounts(order_id);
CREATE INDEX IF NOT EXISTS idx_referral_discounts_referral_id ON referral_discounts(referral_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Actualizar updated_at en affiliates
CREATE OR REPLACE FUNCTION update_affiliates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS affiliates_updated_at ON affiliates;
CREATE TRIGGER affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliates_timestamp();

-- Trigger: Actualizar updated_at en referral_codes
CREATE OR REPLACE FUNCTION update_referral_codes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS referral_codes_updated_at ON referral_codes;
CREATE TRIGGER referral_codes_updated_at
  BEFORE UPDATE ON referral_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_codes_timestamp();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Affiliates
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates can view own data" ON affiliates;
CREATE POLICY "Affiliates can view own data"
  ON affiliates FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Affiliates can update own data" ON affiliates;
CREATE POLICY "Affiliates can update own data"
  ON affiliates FOR UPDATE
  USING (auth.uid() = user_id);

-- Affiliate Earnings
ALTER TABLE affiliate_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates can view own earnings" ON affiliate_earnings;
CREATE POLICY "Affiliates can view own earnings"
  ON affiliate_earnings FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Referral Codes
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own referral codes" ON referral_codes;
CREATE POLICY "Users can view own referral codes"
  ON referral_codes FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Referral Discounts
ALTER TABLE referral_discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view referral discounts" ON referral_discounts;
CREATE POLICY "Public can view referral discounts"
  ON referral_discounts FOR SELECT
  TO authenticated
  USING (true);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (recipient_id = auth.uid());

-- Comentarios
COMMENT ON TABLE affiliates IS 'Información completa de afiliados con cuenta bancaria y estadísticas';
COMMENT ON TABLE affiliate_earnings IS 'Comisiones por venta con control de pagos quincenales';
COMMENT ON TABLE referral_codes IS 'Códigos de referido únicos para descuentos';
COMMENT ON TABLE referral_discounts IS 'Descuentos aplicados por códigos de referido';
COMMENT ON TABLE notifications IS 'Notificaciones del sistema para usuarios';

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista: Earnings listos para pago (>= $500 MXN)
CREATE OR REPLACE VIEW earnings_ready_for_payment AS
SELECT 
  ae.affiliate_id,
  a.full_name,
  a.email,
  a.bank_clabe,
  a.bank_name,
  SUM(ae.commission_amount) as total_pending,
  COUNT(*) as transactions_count,
  MIN(ae.created_at) as oldest_earning,
  MAX(ae.payment_scheduled_date) as next_payment_date
FROM affiliate_earnings ae
JOIN affiliates a ON ae.affiliate_id = a.id
WHERE 
  ae.payment_status IN ('on_hold', 'approved')
  AND ae.payment_hold_until <= CURRENT_DATE
  AND a.status = 'active'
GROUP BY ae.affiliate_id, a.full_name, a.email, a.bank_clabe, a.bank_name
HAVING SUM(ae.commission_amount) >= 500;

-- Vista: Dashboard de afiliado
CREATE OR REPLACE VIEW affiliate_dashboard AS
SELECT 
  a.id,
  a.affiliate_code,
  a.full_name,
  a.email,
  a.commission_rate,
  a.total_sales,
  a.total_earnings,
  a.pending_earnings,
  a.paid_earnings,
  a.status,
  COUNT(DISTINCT ae.id) as total_transactions,
  COUNT(DISTINCT CASE WHEN ae.payment_status = 'on_hold' THEN ae.id END) as pending_transactions,
  MAX(ae.created_at) as last_sale_date
FROM affiliates a
LEFT JOIN affiliate_earnings ae ON a.id = ae.affiliate_id
GROUP BY a.id, a.affiliate_code, a.full_name, a.email, a.commission_rate, 
         a.total_sales, a.total_earnings, a.pending_earnings, a.paid_earnings, a.status;

-- Vista: Reporte de cash flow
CREATE OR REPLACE VIEW cash_flow_report AS
SELECT 
  DATE(ae.payment_scheduled_date) as payment_date,
  COUNT(DISTINCT ae.affiliate_id) as affiliates_count,
  COUNT(*) as earnings_count,
  SUM(ae.commission_amount) as total_amount,
  AVG(ae.commission_amount) as avg_commission
FROM affiliate_earnings ae
WHERE ae.payment_status IN ('on_hold', 'approved')
GROUP BY DATE(ae.payment_scheduled_date)
ORDER BY payment_date;

-- =============================================
-- FUNCIONES ÚTILES
-- =============================================

-- Función: Obtener próxima fecha de pago
CREATE OR REPLACE FUNCTION get_next_payment_date()
RETURNS DATE AS $$
DECLARE
  today DATE := CURRENT_DATE;
  day_of_month INT := EXTRACT(DAY FROM today);
  next_payment DATE;
BEGIN
  IF day_of_month <= 1 THEN
    next_payment := DATE_TRUNC('month', today)::DATE + INTERVAL '0 days';
  ELSIF day_of_month <= 15 THEN
    next_payment := DATE_TRUNC('month', today)::DATE + INTERVAL '14 days';
  ELSE
    next_payment := (DATE_TRUNC('month', today) + INTERVAL '1 month')::DATE;
  END IF;
  
  RETURN next_payment;
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener estadísticas de afiliado
CREATE OR REPLACE FUNCTION get_affiliate_stats(p_affiliate_id UUID)
RETURNS TABLE (
  total_sales BIGINT,
  total_earnings NUMERIC,
  pending_earnings NUMERIC,
  paid_earnings NUMERIC,
  this_month_sales BIGINT,
  this_month_earnings NUMERIC,
  avg_commission NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_sales,
    SUM(commission_amount) as total_earnings,
    SUM(CASE WHEN payment_status IN ('on_hold', 'approved') THEN commission_amount ELSE 0 END) as pending_earnings,
    SUM(CASE WHEN payment_status = 'paid' THEN commission_amount ELSE 0 END) as paid_earnings,
    COUNT(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::BIGINT as this_month_sales,
    SUM(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN commission_amount ELSE 0 END) as this_month_earnings,
    AVG(commission_amount) as avg_commission
  FROM affiliate_earnings
  WHERE affiliate_id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener earnings pendientes de un afiliado
CREATE OR REPLACE FUNCTION get_affiliate_pending_earnings(p_affiliate_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_pending NUMERIC;
BEGIN
  SELECT COALESCE(SUM(commission_amount), 0)
  INTO total_pending
  FROM affiliate_earnings
  WHERE affiliate_id = p_affiliate_id
    AND payment_status IN ('on_hold', 'approved')
    AND payment_hold_until <= CURRENT_DATE;
  
  RETURN total_pending;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VERIFICACIÓN
-- =============================================

DO $$
DECLARE
  table_count INT;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('affiliates', 'affiliate_earnings', 'referral_codes', 'referral_discounts', 'notifications');
  
  RAISE NOTICE '✅ Migración completada exitosamente';
  RAISE NOTICE '✅ Tablas creadas: %', table_count;
END $$;

