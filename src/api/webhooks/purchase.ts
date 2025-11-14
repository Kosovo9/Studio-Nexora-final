/**
 * API Endpoint - Webhook de Compras
 * Para Vite/React (no Next.js)
 * Se puede llamar desde el frontend o integrar con backend
 * NO afecta UI/UX
 */

import { processPurchase } from '../../lib/webhooks/purchase-webhook';
import { logger } from '../../lib/utils/logger';

export interface PurchaseWebhookRequest {
  order_id: string;
  customer_name: string;
  customer_email: string;
  order_amount: number;
  promo_code?: string;
  payment_completed: boolean;
}

/**
 * Handler del webhook de compras
 * Se puede llamar desde el frontend o desde un servidor backend
 */
export async function handlePurchaseWebhook(
  request: PurchaseWebhookRequest
): Promise<{
  success: boolean;
  processed: {
    affiliate?: boolean;
    referral?: boolean;
  };
  error: string | null;
}> {
  try {
    // Validar datos requeridos
    if (!request.order_id || !request.customer_email || !request.order_amount) {
      return {
        success: false,
        processed: {},
        error: 'Datos requeridos faltantes: order_id, customer_email, order_amount',
      };
    }

    // Procesar la compra
    const result = await processPurchase({
      order_id: request.order_id,
      customer_name: request.customer_name || 'Cliente',
      customer_email: request.customer_email,
      order_amount: request.order_amount,
      promo_code: request.promo_code,
      payment_completed: request.payment_completed,
    });

    return result;
  } catch (error: any) {
    logger.error('Error en webhook handler:', error);
    return {
      success: false,
      processed: {},
      error: error.message || 'Error procesando webhook',
    };
  }
}

/**
 * Función helper para llamar desde el frontend
 * Ejemplo de uso en un componente:
 * 
 * import { handlePurchaseWebhook } from '@/api/webhooks/purchase';
 * 
 * await handlePurchaseWebhook({
 *   order_id: order.id,
 *   customer_name: user.name,
 *   customer_email: user.email,
 *   order_amount: order.finalPriceMxn,
 *   promo_code: order.discountCode,
 *   payment_completed: true,
 * });
 */
export default handlePurchaseWebhook;

