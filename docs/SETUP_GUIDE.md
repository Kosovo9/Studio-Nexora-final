# 🚀 GUÍA DE CONFIGURACIÓN - SISTEMA DE REFERIDOS

## ✅ CHECKLIST DE INSTALACIÓN

### PASO 1: Configurar Supabase

1. **Ejecutar Migración SQL**

   - Abrir Supabase Dashboard
   - https://supabase.com/dashboard/project/YOUR_PROJECT/sql
   - Copiar y ejecutar: `supabase/migrations/20251111070000_complete_affiliate_referral_system.sql`

2. **Verificar Tablas Creadas**

   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

   Deberías ver:
   - ✅ affiliates
   - ✅ affiliate_earnings
   - ✅ referral_codes
   - ✅ referral_discounts
   - ✅ notifications

### PASO 2: Configurar Servicio de Email

#### Opción A: Resend (Recomendado - Más Fácil)

1. **Crear cuenta en Resend**
   - Ir a: https://resend.com
   - Sign up gratis

2. **Obtener API Key**
   - Dashboard → API Keys → Create API Key
   - Copiar el key que empieza con `re_`

3. **Agregar a `.env.local`**
   ```bash
   VITE_EMAIL_PROVIDER=resend
   VITE_RESEND_API_KEY=re_tu_api_key_aqui
   VITE_EMAIL_FROM=Studio Nexora <noreply@studionexora.com>
   ```

#### Opción B: SendGrid (Alternativa)

1. **Crear cuenta en SendGrid**
   - Ir a: https://sendgrid.com
   - Sign up (gratis hasta 100 emails/día)

2. **Obtener API Key**
   - Settings → API Keys → Create API Key
   - Full Access

3. **Agregar a `.env.local`**
   ```bash
   VITE_EMAIL_PROVIDER=sendgrid
   VITE_SENDGRID_API_KEY=SG.tu_api_key_aqui
   VITE_EMAIL_FROM=noreply@studionexora.com
   ```

### PASO 3: Instalar Dependencias del Proyecto

```bash
npm install
```

### PASO 4: Configurar Variables de Entorno

1. **Copiar el archivo de ejemplo**
   ```bash
   cp .env.example .env.local
   ```

2. **Completar todas las variables** (ver `.env.example`)

### PASO 5: Ejecutar Proyecto

```bash
npm run dev
```

## 🧪 TESTING - FLUJO COMPLETO

### Test 1: Crear Afiliado

```typescript
// En tu console o test file
import { AffiliateService } from '@/lib/affiliates/affiliate-service';

const affiliateService = new AffiliateService();

const result = await affiliateService.createAffiliate({
  user_id: 'user-uuid-here',
  full_name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '5512345678',
  bank_clabe: '012345678901234567',
  bank_name: 'BBVA Bancomer',
  account_holder_name: 'Juan Pérez García',
  commission_rate: 10.00
});

console.log('Afiliado creado:', result.affiliate?.affiliate_code);
// Output: AFF-JUAN24
```

### Test 2: Simular Venta con Código de Afiliado

```typescript
import { processPurchase } from '@/lib/webhooks/purchase-webhook';

await processPurchase({
  order_id: 'ORDER-001',
  customer_name: 'Cliente Test',
  customer_email: 'cliente@example.com',
  order_amount: 1000.00,
  promo_code: 'AFF-JUAN24', // Código del afiliado
  payment_completed: true
});

// Deberías recibir:
// ✅ Email al afiliado
// ✅ Email al admin
// ✅ Comisión registrada en DB
```

### Test 3: Crear y Usar Código de Referido

```typescript
import { ReferralService } from '@/lib/referrals/referral-service';

const referralService = new ReferralService();

// 1. Crear código
const { referral } = await referralService.createReferralCode({
  full_name: 'María López',
  email: 'maria@example.com',
  discount_type: 'percentage',
  discount_value: 15.00 // 15% descuento
});

console.log('Código creado:', referral?.code);
// Output: REF-MARIA42

// 2. Simular uso del código
await processPurchase({
  order_id: 'ORDER-002',
  customer_name: 'Otro Cliente',
  customer_email: 'otro@example.com',
  order_amount: 500.00,
  promo_code: 'REF-MARIA42',
  payment_completed: true
});

// Cliente paga: $425 (500 - 15%)
// No hay comisión (solo descuento)
```

### Test 4: Verificar Cash Flow

```typescript
import { CashFlowReserveCalculator } from '@/lib/cash-flow/reserve-calculator';

const calculator = new CashFlowReserveCalculator();

const reserve = await calculator.calculateReserve();
console.log('Reserva necesaria:', reserve.total_reserve_needed);
console.log('Comisiones pendientes:', reserve.pending_commissions);
console.log('Próximo pago:', reserve.next_payment_date);

// Verificar salud financiera
const health = await calculator.checkCashFlowHealth(10000); // $10,000 MXN disponibles
console.log(health.message);
// Output: "✅ Efectivo suficiente" o "🚨 ALERTA: Faltan $XXX"
```

## 📊 DASHBOARD - Verificar en Supabase

### Query 1: Ver Afiliados Activos

```sql
SELECT
  affiliate_code,
  full_name,
  email,
  total_sales,
  pending_earnings,
  status
FROM affiliates
WHERE status = 'active'
ORDER BY total_earnings DESC;
```

### Query 2: Earnings Listos para Pago

```sql
SELECT * FROM earnings_ready_for_payment;
```

### Query 3: Próximos Pagos

```sql
SELECT
  a.full_name,
  a.bank_clabe,
  SUM(ae.commission_amount) as total_to_pay,
  ae.payment_scheduled_date
FROM affiliate_earnings ae
JOIN affiliates a ON ae.affiliate_id = a.id
WHERE ae.payment_status = 'approved'
  AND ae.payment_scheduled_date <= CURRENT_DATE + INTERVAL '7 days'
GROUP BY a.full_name, a.bank_clabe, ae.payment_scheduled_date
ORDER BY ae.payment_scheduled_date;
```

## 🔧 TROUBLESHOOTING

### Problema: Emails no se envían

**Solución:**

```bash
# 1. Verificar API Key
echo $VITE_RESEND_API_KEY  # o $VITE_SENDGRID_API_KEY

# 2. Verificar logs
# Ver console.log en terminal donde corre el servidor

# 3. Test manual (Resend)
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer tu_api_key" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@example.com","to":"tu@email.com","subject":"Test","html":"<p>Test</p>"}'
```

### Problema: Códigos no se generan

**Solución:**

```sql
-- Verificar que uuid-ossp esté habilitado
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar función
SELECT uuid_generate_v4();
```

### Problema: RLS bloquea queries

**Solución:**

```sql
-- Ver políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'affiliates';

-- Temporalmente deshabilitar para testing (NO en producción)
-- ALTER TABLE affiliates DISABLE ROW LEVEL SECURITY;
```

## 📈 MONITOREO EN PRODUCCIÓN

### Logs Importantes

Agregar logging mejorado en `purchase-webhook.ts`:

```typescript
// Log cada paso
console.log('🔄 Procesando compra:', {
  order_id: purchaseData.order_id,
  code_used: purchaseData.promo_code,
  amount: purchaseData.order_amount
});
```

### Métricas Clave

```sql
-- 1. Ventas diarias
SELECT 
  DATE(created_at) as date,
  COUNT(*) as sales,
  SUM(order_amount) as revenue,
  SUM(commission_amount) as commissions
FROM affiliate_earnings
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 2. Top afiliados
SELECT 
  a.full_name,
  a.affiliate_code,
  COUNT(*) as sales,
  SUM(ae.commission_amount) as total_earned
FROM affiliates a
JOIN affiliate_earnings ae ON a.id = ae.affiliate_id
GROUP BY a.id, a.full_name, a.affiliate_code
ORDER BY total_earned DESC
LIMIT 10;

-- 3. Conversión de códigos
SELECT 
  referral_code,
  times_used,
  total_discount_given,
  total_sales_generated,
  (total_discount_given::FLOAT / NULLIF(total_sales_generated, 0)) * 100 as discount_rate
FROM referral_codes
WHERE status = 'active'
ORDER BY times_used DESC;
```

