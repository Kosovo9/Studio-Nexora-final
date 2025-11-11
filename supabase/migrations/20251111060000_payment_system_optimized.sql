/*
  # Sistema de Pagos Optimizado 10X - Afiliados y Referidos
  
  ## Overview
  Sistema de pagos quincenales (1 y 15 de cada mes) con:
  - Mínimo de payout: $500 MXN
  - Retención anti-fraude: 15 días desde la venta
  - Solo pagos a partir de $500+ pesos acumulados
  - Ciclos quincenales automatizados
  
  ## Nuevas Tablas
  
  ### 1. `affiliates` (Principal - si no existe)
  Información completa del afiliado con métodos de pago
  
  ### 2. `payment_cycles`
  Ciclos quincenales de procesamiento de pagos
  
  ### 3. `payment_transactions`
  Transacciones individuales de pago
  
  ## Actualizaciones
  
  ### `affiliate_earnings`
  - Campos de control de pagos
  - payment_status, payment_hold_until, etc.
*/

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla affiliates (Principal - si no existe)
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  affiliate_code text UNIQUE NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('transfer', 'paypal', 'stripe')),
  payment_details jsonb NOT NULL DEFAULT '{}',
  total_earnings numeric(10,2) DEFAULT 0,
  paid_earnings numeric(10,2) DEFAULT 0,
  pending_earnings numeric(10,2) DEFAULT 0,
  minimum_payout numeric(10,2) DEFAULT 500,
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own data"
  ON affiliates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Affiliates can update own data"
  ON affiliates FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_affiliate_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliates_active ON affiliates(active);

-- Actualizar affiliate_earnings con campos de control de pagos
DO $$
BEGIN
  -- Agregar payment_status si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'hold', 'ready', 'processing', 'paid', 'failed'));
  END IF;

  -- Agregar payment_hold_until si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_hold_until'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_hold_until timestamptz;
  END IF;

  -- Agregar payment_cycle_id si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_cycle_id'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_cycle_id uuid;
  END IF;

  -- Agregar payment_transaction_id si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_earnings' AND column_name = 'payment_transaction_id'
  ) THEN
    ALTER TABLE affiliate_earnings ADD COLUMN payment_transaction_id uuid;
  END IF;
END $$;

-- Tabla payment_cycles (Ciclos quincenales)
CREATE TABLE IF NOT EXISTS payment_cycles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_date date NOT NULL UNIQUE, -- Fecha del ciclo (1 o 15 del mes)
  cycle_type text NOT NULL CHECK (cycle_type IN ('biweekly_1', 'biweekly_15')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_affiliates integer DEFAULT 0,
  total_amount numeric(10,2) DEFAULT 0,
  processed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view payment cycles"
  ON payment_cycles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE INDEX idx_payment_cycles_cycle_date ON payment_cycles(cycle_date DESC);
CREATE INDEX idx_payment_cycles_status ON payment_cycles(status);

-- Tabla payment_transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  payment_cycle_id uuid REFERENCES payment_cycles(id),
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'MXN',
  payment_method text NOT NULL CHECK (payment_method IN ('transfer', 'paypal', 'stripe')),
  payment_details jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  external_transaction_id text,
  failure_reason text,
  processed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliates
      WHERE affiliates.id = payment_transactions.affiliate_id
      AND affiliates.user_id = auth.uid()
    )
  );

CREATE INDEX idx_payment_transactions_affiliate_id ON payment_transactions(affiliate_id);
CREATE INDEX idx_payment_transactions_cycle_id ON payment_transactions(payment_cycle_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

-- Función para calcular earnings pendientes listos para pago
CREATE OR REPLACE FUNCTION get_affiliate_pending_earnings(affiliate_uuid uuid)
RETURNS numeric AS $$
DECLARE
  total_pending numeric;
BEGIN
  SELECT COALESCE(SUM(commission_amount_mxn), 0) INTO total_pending
  FROM affiliate_earnings
  WHERE affiliate_id = affiliate_uuid
    AND status IN ('pending', 'approved')
    AND (payment_status = 'ready' OR payment_status = 'pending')
    AND (payment_hold_until IS NULL OR payment_hold_until <= now());
  
  RETURN total_pending;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar payment_status de earnings
CREATE OR REPLACE FUNCTION update_earnings_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el earning está aprobado y han pasado 15 días, marcarlo como ready
  IF NEW.status = 'approved' AND NEW.payment_hold_until IS NULL THEN
    NEW.payment_hold_until := NEW.created_at + interval '15 days';
    NEW.payment_status := 'hold';
  END IF;

  -- Si pasó el período de retención, marcar como ready
  IF NEW.payment_hold_until IS NOT NULL AND NEW.payment_hold_until <= now() THEN
    NEW.payment_status := 'ready';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar payment_status automáticamente
DROP TRIGGER IF EXISTS trigger_update_earnings_payment_status ON affiliate_earnings;
CREATE TRIGGER trigger_update_earnings_payment_status
  BEFORE INSERT OR UPDATE ON affiliate_earnings
  FOR EACH ROW
  EXECUTE FUNCTION update_earnings_payment_status();

-- Función para crear ciclo de pago quincenal
CREATE OR REPLACE FUNCTION create_payment_cycle(cycle_date_param date)
RETURNS uuid AS $$
DECLARE
  cycle_id uuid;
  cycle_type_val text;
BEGIN
  -- Determinar tipo de ciclo (1 o 15 del mes)
  IF EXTRACT(DAY FROM cycle_date_param) <= 15 THEN
    cycle_type_val := 'biweekly_1';
  ELSE
    cycle_type_val := 'biweekly_15';
  END IF;

  -- Crear ciclo
  INSERT INTO payment_cycles (cycle_date, cycle_type, status)
  VALUES (cycle_date_param, cycle_type_val, 'pending')
  ON CONFLICT (cycle_date) DO UPDATE SET updated_at = now()
  RETURNING id INTO cycle_id;

  RETURN cycle_id;
END;
$$ LANGUAGE plpgsql;

-- Función para procesar pagos de un ciclo
CREATE OR REPLACE FUNCTION process_payment_cycle(cycle_id_param uuid)
RETURNS TABLE (
  affiliate_id uuid,
  total_amount numeric,
  payment_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ae.affiliate_id,
    SUM(ae.commission_amount_mxn) as total_amount,
    COUNT(*) as payment_count
  FROM affiliate_earnings ae
  INNER JOIN affiliates a ON a.id = ae.affiliate_id
  WHERE ae.payment_status = 'ready'
    AND ae.payment_cycle_id IS NULL
    AND (SELECT get_affiliate_pending_earnings(ae.affiliate_id)) >= a.minimum_payout
  GROUP BY ae.affiliate_id
  HAVING SUM(ae.commission_amount_mxn) >= 500; -- Mínimo $500 MXN
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vista para earnings listos para pago (>= $500)
CREATE OR REPLACE VIEW earnings_ready_for_payment AS
SELECT 
  a.id as affiliate_id,
  a.user_id,
  a.affiliate_code,
  a.payment_method,
  a.payment_details,
  get_affiliate_pending_earnings(a.id) as total_pending,
  COUNT(ae.id) as earnings_count,
  a.minimum_payout
FROM affiliates a
LEFT JOIN affiliate_earnings ae ON ae.affiliate_id = a.id
  AND ae.payment_status = 'ready'
  AND (ae.payment_hold_until IS NULL OR ae.payment_hold_until <= now())
WHERE a.active = true
GROUP BY a.id, a.user_id, a.affiliate_code, a.payment_method, a.payment_details, a.minimum_payout
HAVING get_affiliate_pending_earnings(a.id) >= 500;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_cycles_updated_at
  BEFORE UPDATE ON payment_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE affiliates IS 'Información completa de afiliados con métodos de pago y estadísticas';
COMMENT ON TABLE payment_cycles IS 'Ciclos quincenales de procesamiento de pagos (1 y 15 de cada mes)';
COMMENT ON TABLE payment_transactions IS 'Transacciones individuales de pago a afiliados';
COMMENT ON FUNCTION get_affiliate_pending_earnings IS 'Calcula earnings pendientes listos para pago de un afiliado';
COMMENT ON FUNCTION create_payment_cycle IS 'Crea un ciclo de pago quincenal';
COMMENT ON FUNCTION process_payment_cycle IS 'Procesa pagos de un ciclo quincenal';

