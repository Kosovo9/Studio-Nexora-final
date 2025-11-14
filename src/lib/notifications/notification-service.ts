/**
 * Sistema de Notificaciones Automáticas
 * Envía emails cuando hay ventas de afiliados o uso de códigos de referido
 * NO afecta UI/UX
 */

import { supabase } from '../../supabase';
import { sendEmail } from './email-templates';
import { logger } from '../utils/logger';
import { affiliateSaleEmail, referralUsedEmail, cashFlowAlertEmail, paymentProcessedEmail, welcomeAffiliateEmail, nearPayoutThresholdEmail } from './email-templates';

/**
 * Notificar cuando un afiliado genera una venta
 */
export async function sendAffiliateSaleNotification(data: {
  affiliate_id: string;
  affiliate_name: string;
  affiliate_email: string;
  customer_name: string;
  order_amount: number;
  commission_amount: number;
  order_date: Date;
  payment_scheduled_date: Date;
}): Promise<{ success: boolean; error: string | null }> {
  try {
      // 1. Notificar al AFILIADO (usando template profesional)
      const affiliateHtml = affiliateSaleEmail({
        affiliate_name: data.affiliate_name,
        customer_name: data.customer_name,
        order_amount: data.order_amount,
        commission_amount: data.commission_amount,
        commission_rate: 10, // TODO: obtener del affiliate
        order_date: data.order_date,
        payment_scheduled_date: data.payment_scheduled_date,
        total_pending: 0, // TODO: obtener del affiliate
        affiliate_code: '', // TODO: obtener del affiliate
      });

      await sendEmail({
        to: data.affiliate_email,
        subject: '🎉 ¡Nueva venta generada!',
        html: affiliateHtml,
      });

    // 2. Notificar al ADMINISTRADOR
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@studionexora.com';
    await sendEmail({
      to: adminEmail,
      subject: '💰 Nueva comisión generada',
      html: `
        <h2>Nueva comisión de afiliado</h2>
        <ul>
          <li><strong>Afiliado:</strong> ${data.affiliate_name}</li>
          <li><strong>Cliente:</strong> ${data.customer_name}</li>
          <li><strong>Monto venta:</strong> $${data.order_amount.toFixed(2)} MXN</li>
          <li><strong>Comisión:</strong> $${data.commission_amount.toFixed(2)} MXN</li>
          <li><strong>Fecha de pago:</strong> ${data.payment_scheduled_date.toLocaleDateString('es-MX')}</li>
        </ul>
      `,
    });

    // 3. Registrar notificación en DB (si existe tabla notifications)
    try {
      await supabase.from('notifications').insert({
        type: 'affiliate_sale',
        recipient_id: data.affiliate_id,
        title: '¡Nueva venta generada!',
        message: `Has ganado $${data.commission_amount.toFixed(2)} MXN por la venta de ${data.customer_name}`,
        metadata: {
          customer_name: data.customer_name,
          order_amount: data.order_amount,
          commission_amount: data.commission_amount,
        },
        read: false,
      });
    } catch (err) {
      // Si la tabla no existe, continuar sin error
      logger.warn('Tabla notifications no existe, continuando sin guardar notificación');
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Notificar cuando un referido usa su código
 */
export async function sendReferralUsedNotification(data: {
  referral_code: string;
  customer_name: string;
  customer_email: string;
  order_amount: number;
  discount_amount: number;
  final_amount: number;
  order_date: Date;
}): Promise<{ success: boolean; error: string | null }> {
  try {
      // Notificar al ADMINISTRADOR (usando template profesional)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@studionexora.com';
      const referralHtml = referralUsedEmail({
        referral_code: data.referral_code,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        order_amount: data.order_amount,
        discount_amount: data.discount_amount,
        discount_percentage: (data.discount_amount / data.order_amount) * 100,
        final_amount: data.final_amount,
        order_date: data.order_date,
      });

      await sendEmail({
        to: adminEmail,
        subject: '🎁 Código de referido usado',
        html: referralHtml,
      });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

