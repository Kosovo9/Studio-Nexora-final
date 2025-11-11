# 📚 API REFERENCE - Sistema de Referidos

## AffiliateService

### `createAffiliate(data)`

Crea un nuevo afiliado con código único generado automáticamente.

**Parámetros:**

```typescript
{
  user_id: string; // UUID del usuario autenticado
  full_name: string; // Nombre completo
  email: string; // Email
  phone?: string; // Teléfono (opcional)
  bank_clabe: string; // CLABE 18 dígitos
  bank_name: string; // Nombre del banco
  account_holder_name: string; // Titular de cuenta
  commission_rate?: number; // % comisión (default: 10)
}
```

**Retorna:**

```typescript
{
  affiliate?: Affiliate; // Objeto del afiliado creado
  error?: string; // Mensaje de error si falla
}
```

**Ejemplo:**

```typescript
const result = await affiliateService.createAffiliate({
  user_id: 'uuid-123',
  full_name: 'Juan Pérez',
  email: 'juan@example.com',
  bank_clabe: '012345678901234567',
  bank_name: 'BBVA',
  account_holder_name: 'Juan Pérez García'
});

if (!result.error) {
  console.log('Código generado:', result.affiliate?.affiliate_code);
}
```

---

### `recordAffiliateSale(data)`

Registra una venta y calcula comisión automáticamente.

**Parámetros:**

```typescript
{
  affiliate_code: string; // Código AFF-XXXXX
  order_id: string; // ID único de la orden
  order_amount: number; // Monto total MXN
  customer_name: string; // Nombre del cliente
  customer_email: string; // Email del cliente
}
```

**Retorna:**

```typescript
{
  earning?: AffiliateEarning; // Registro de comisión
  error?: string;
}
```

**Ejemplo:**

```typescript
const result = await affiliateService.recordAffiliateSale({
  affiliate_code: 'AFF-JUAN24',
  order_id: 'ORDER-12345',
  order_amount: 1000.00,
  customer_name: 'Cliente Test',
  customer_email: 'cliente@example.com'
});

// Comisión calculada automáticamente
// Si comisión = 10%, earning.commission_amount = 100.00
```

---

### `getPendingEarnings(affiliate_id)`

Obtiene todas las comisiones pendientes de un afiliado.

**Ejemplo:**

```typescript
const { earnings, error } = await affiliateService.getPendingEarnings('affiliate-uuid');

earnings?.forEach(earning => {
  console.log(`$${earning.commission_amount} - Pago: ${earning.payment_scheduled_date}`);
});
```

---

## ReferralService

### `createReferralCode(data)`

Crea código de descuento REF-XXXXX.

**Parámetros:**

```typescript
{
  full_name: string;
  email: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number; // % o monto fijo
  max_uses?: number; // Límite de usos
  expires_at?: Date; // Fecha de expiración
  referred_by_affiliate_id?: string; // Si viene de afiliado
}
```

**Ejemplo:**

```typescript
const { referral } = await referralService.createReferralCode({
  full_name: 'María López',
  email: 'maria@example.com',
  discount_type: 'percentage',
  discount_value: 15.00,
  max_uses: 100
});

console.log('Código:', referral?.code); // REF-MARIA42
```

---

### `applyReferralDiscount(data)`

Aplica descuento cuando cliente usa código.

**Parámetros:**

```typescript
{
  referral_code: string;
  order_id: string;
  order_amount: number;
  customer_name: string;
  customer_email: string;
}
```

**Retorna:**

```typescript
{
  discount_amount: number; // Descuento aplicado
  final_amount: number; // Monto final a pagar
  error?: string;
}
```

**Ejemplo:**

```typescript
const result = await referralService.applyReferralDiscount({
  referral_code: 'REF-MARIA42',
  order_id: 'ORDER-456',
  order_amount: 1000.00,
  customer_name: 'Cliente',
  customer_email: 'cliente@example.com'
});

console.log(`Descuento: $${result.discount_amount}`);
console.log(`Total a pagar: $${result.final_amount}`);
// Output: Descuento: $150, Total: $850
```

---

## NotificationService

### `notifyAffiliateSale(data)`

Envía email al afiliado cuando genera venta.

**Envía a:**
- ✅ Afiliado (info de su comisión)
- ✅ Admin (reporte de venta)

---

### `notifyReferralUsed(data)`

Envía email cuando se usa código de referido.

**Envía a:**
- ✅ Admin (reporte de descuento)

---

## CashFlowReserveCalculator

### `calculateReserve()`

Calcula efectivo necesario para próximos pagos.

**Retorna:**

```typescript
{
  total_reserve_needed: number; // Total a reservar
  pending_commissions: number; // Comisiones próximos 15 días
  pending_discounts: number; // Descuentos proyectados
  buffer_amount: number; // Buffer 20%
  next_payment_date: Date; // Próxima fecha (1 o 15)
  breakdown: object; // Desglose detallado
}
```

**Ejemplo:**

```typescript
const reserve = await calculator.calculateReserve();

console.log(`Reservar: $${reserve.total_reserve_needed.toFixed(2)} MXN`);
console.log(`Próximo pago: ${reserve.next_payment_date.toLocaleDateString()}`);

if (reserve.total_reserve_needed > availableCash) {
  console.log('🚨 ALERTA: Fondos insuficientes');
}
```

---

### `checkCashFlowHealth(available_cash)`

Verifica si hay suficiente efectivo.

**Retorna:**

```typescript
{
  is_healthy: boolean;
  alert_level: 'safe' | 'warning' | 'critical';
  message: string;
  reserve_needed: number;
}
```

**Ejemplo:**

```typescript
const health = await calculator.checkCashFlowHealth(10000);

console.log(health.message);
// "✅ Efectivo suficiente" - safe
// "⚠️ Efectivo justo" - warning
// "🚨 ALERTA: Faltan $XXX" - critical
```

---

## Webhook: processPurchase()

### Endpoint: `POST /api/webhooks/purchase`

**Body:**

```json
{
  "order_id": "ORDER-12345",
  "customer_name": "Juan Pérez",
  "customer_email": "juan@example.com",
  "order_amount": 1000.00,
  "promo_code": "AFF-JUAN24",
  "payment_completed": true
}
```

**Proceso Automático:**

1. ✅ Detecta tipo de código (AFF o REF)
2. ✅ Procesa comisión o descuento
3. ✅ Envía notificaciones
4. ✅ Actualiza reserva de efectivo
5. ✅ Registra en base de datos

**Respuesta:**

```json
{
  "success": true,
  "message": "Compra procesada correctamente"
}
```

