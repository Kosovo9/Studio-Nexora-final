/**
 * Webhook de Compra
 * Se ejecuta automáticamente cuando se completa una orden
 * Detecta códigos AFF-XXXXX o REF-XXXXX y procesa comisiones/descuentos
 * NO afecta UI/UX
 */

import { AffiliateService } from '../affiliates/affiliate-service';
import { ReferralService } from '../referrals/referral-service';

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
 * Procesar webhook de compra completada
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
  try {
    // Solo procesar si el pago está completado
    if (data.payment_status !== 'completed') {
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

    // Si hay código de descuento, verificar tipo
    if (data.discount_code) {
      const code = data.discount_code.toUpperCase();

      // Detectar si es código de AFILIADO (AFF-XXXXX)
      if (code.startsWith('AFF-')) {
        const result = await affiliateService.recordAffiliateSale({
          affiliate_code: code,
          order_id: data.order_id,
          order_amount: data.order_amount,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
        });

        if (!result.error) {
          processed.affiliate = true;
        }
      }

      // Detectar si es código de REFERIDO (REF-XXXXX)
      if (code.startsWith('REF-')) {
        const result = await referralService.applyReferralDiscount({
          referral_code: code,
          order_id: data.order_id,
          order_amount: data.order_amount,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
        });

        if (!result.error) {
          processed.referral = true;
        }
      }
    }

    return {
      success: true,
      processed,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      processed: {},
      error: error.message,
    };
  }
}

/**
 * Integrar con orderService para ejecutar automáticamente
 */
export async function handleOrderCompleted(orderId: string): Promise<void> {
  try {
    // Obtener datos de la orden
    const { supabase } = await import('../../supabase');
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

