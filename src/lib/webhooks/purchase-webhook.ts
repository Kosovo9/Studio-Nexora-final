/**
 * Webhook de Compra - MAESTRO
 * Se ejecuta automáticamente cuando se completa una orden
 * Detecta códigos AFF-XXXXX o REF-XXXXX y procesa comisiones/descuentos
 * NO afecta UI/UX
 */

import { AffiliateService } from '../affiliates/affiliate-service';
import { ReferralService } from '../referrals/referral-service';
import { sendAffiliateSaleNotification, sendReferralUsedNotification } from '../notifications/notification-service';
import { calculateCashFlowReserve, checkCashFlowHealth } from '../cash-flow/reserve-calculator';
import { supabase } from '../../supabase';

const affiliateService = new AffiliateService();
const referralService = new ReferralService();

export interface PurchaseWebhookData {
  order_id: string;
  order_amount: number;
  customer_name: string;
  customer_email: string;
  discount_code?: string; // Puede ser AFF-XXXXX o REF-XXXXX
  payment_status: 'completed' | 'pending' | 'failed';
}

/**
 * WEBHOOK PRINCIPAL - Procesa cada compra
 * Se ejecuta cuando un cliente completa una compra
 */
export async function processPurchase(purchaseData: {
  order_id: string;
  customer_name: string;
  customer_email: string;
  order_amount: number;
  promo_code?: string;  // Código usado (AFF-XXXXX o REF-XXXXX)
  payment_completed: boolean;
}): Promise<{
  success: boolean;
  processed: {
    affiliate?: boolean;
    referral?: boolean;
  };
  error: string | null;
}> {
  console.log('🔄 Procesando compra:', purchaseData.order_id);

  // Validar que el pago esté completado
  if (!purchaseData.payment_completed) {
    console.log('⏸️ Compra pendiente de pago');
    return {
      success: true,
      processed: {},
      error: null,
    };
  }

  const processed = {
    affiliate: false,
    referral: false,
  };

  try {
    // ========================================
    // PASO 1: Identificar tipo de código
    // ========================================
    if (!purchaseData.promo_code) {
      console.log('✅ Compra sin código promocional');
      return {
        success: true,
        processed,
        error: null,
      };
    }

    const code = purchaseData.promo_code.toUpperCase();
    const isAffiliateCode = code.startsWith('AFF-');
    const isReferralCode = code.startsWith('REF-');

    console.log('🔍 Código detectado:', code);

    // ========================================
    // PASO 2A: Procesar CÓDIGO DE AFILIADO
    // ========================================
    if (isAffiliateCode) {
      console.log('💰 Procesando venta de AFILIADO');

      // Registrar venta y calcular comisión
      const { earning, error } = await affiliateService.recordAffiliateSale({
        affiliate_code: code,
        order_id: purchaseData.order_id,
        order_amount: purchaseData.order_amount,
        customer_name: purchaseData.customer_name,
        customer_email: purchaseData.customer_email,
      });

      if (error) {
        console.error('❌ Error procesando afiliado:', error);
      } else {
        console.log(`✅ Comisión registrada: $${earning!.commission_amount} MXN`);
        processed.affiliate = true;

        // Obtener datos del afiliado para notificación
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('full_name, email')
          .eq('affiliate_code', code)
          .single();

        if (affiliate && earning) {
          // Enviar notificaciones
          await sendAffiliateSaleNotification({
            affiliate_id: earning.affiliate_id,
            affiliate_name: affiliate.full_name,
            affiliate_email: affiliate.email,
            customer_name: purchaseData.customer_name,
            order_amount: purchaseData.order_amount,
            commission_amount: earning.commission_amount,
            order_date: new Date(),
            payment_scheduled_date: new Date(earning.payment_scheduled_date || new Date()),
          });

          console.log('📧 Notificaciones enviadas al afiliado y admin');
        }
      }
    }

    // ========================================
    // PASO 2B: Procesar CÓDIGO DE REFERIDO
    // ========================================
    if (isReferralCode) {
      console.log('🎁 Procesando código de REFERIDO');

      // Aplicar descuento
      const { discount_amount, final_amount, error } = await referralService.applyReferralDiscount({
        referral_code: code,
        order_id: purchaseData.order_id,
        order_amount: purchaseData.order_amount,
        customer_name: purchaseData.customer_name,
        customer_email: purchaseData.customer_email,
      });

      if (error) {
        console.error('❌ Error aplicando descuento:', error);
      } else {
        console.log(`✅ Descuento aplicado: -$${discount_amount} MXN`);
        console.log(`💵 Monto final: $${final_amount} MXN`);
        processed.referral = true;

        // Enviar notificación
        await sendReferralUsedNotification({
          referral_code: code,
          customer_name: purchaseData.customer_name,
          customer_email: purchaseData.customer_email,
          order_amount: purchaseData.order_amount,
          discount_amount,
          final_amount,
          order_date: new Date(),
        });

        console.log('📧 Notificación enviada al admin');
      }
    }

    // ========================================
    // PASO 3: Actualizar RESERVA DE EFECTIVO
    // ========================================
    console.log('💼 Calculando reserva de efectivo...');
    const reserveResult = await calculateCashFlowReserve();

    if (reserveResult.data) {
      const reserve = reserveResult.data;
      console.log('📊 RESERVA DE EFECTIVO:');
      console.log(`   - Total necesario: $${reserve.total_reserve_needed.toFixed(2)} MXN`);
      console.log(`   - Comisiones: $${reserve.pending_commissions.toFixed(2)} MXN`);
      console.log(`   - Descuentos: $${reserve.pending_discounts.toFixed(2)} MXN`);
      console.log(`   - Buffer (20%): $${reserve.buffer_amount.toFixed(2)} MXN`);
      console.log(`   - Próximo pago: ${reserve.next_payment_date.toLocaleDateString('es-MX')}`);

      // ========================================
      // PASO 4: ALERTAS DE EFECTIVO
      // ========================================
      // Obtener efectivo disponible (de configuración o DB)
      const available_cash = parseFloat(import.meta.env.VITE_AVAILABLE_CASH || '10000');

      const healthCheck = await checkCashFlowHealth(available_cash);
      if (healthCheck.data) {
        console.log(healthCheck.data.message);

        if (healthCheck.data.alert_level === 'critical') {
          // Enviar alerta urgente al admin
          console.log('🚨 ALERTA CRÍTICA: Fondos insuficientes para pagos programados');
          
          // TODO: Enviar email de alerta al admin
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@studionexora.com';
          console.log(`📧 Enviar alerta crítica a: ${adminEmail}`);
        }
      }
    }

    console.log('✅ Compra procesada completamente');

    return {
      success: true,
      processed,
      error: null,
    };
  } catch (error: any) {
    console.error('❌ Error procesando compra:', error);
    return {
      success: false,
      processed,
      error: error.message,
    };
  }
}

/**
 * Procesar webhook de compra completada (alias para compatibilidad)
 * Detecta automáticamente si es código de afiliado o referido
 */
export async function processPurchaseWebhook(data: PurchaseWebhookData): Promise<{
  success: boolean;
  processed: {
    affiliate?: boolean;
    referral?: boolean;
  };
  error: string | null;
}> {
  return processPurchase({
    order_id: data.order_id,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    order_amount: data.order_amount,
    promo_code: data.discount_code,
    payment_completed: data.payment_status === 'completed',
  });
}

/**
 * Integrar con orderService para ejecutar automáticamente
 */
export async function handleOrderCompleted(orderId: string): Promise<void> {
  try {
    // Obtener datos de la orden
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('Error obteniendo orden:', error);
      return;
    }

    // Procesar webhook
    await processPurchaseWebhook({
      order_id: orderId,
      order_amount: parseFloat(order.final_price_mxn),
      customer_name: order.profiles?.full_name || 'Cliente',
      customer_email: order.profiles?.email || '',
      discount_code: order.referred_by_code || order.metadata?.discount_code,
      payment_status: order.payment_status,
    });
  } catch (error) {
    console.error('Error en handleOrderCompleted:', error);
  }
}

