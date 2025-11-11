/**
 * Sistema de Notificaciones Automáticas
 * Envía emails cuando hay ventas de afiliados o uso de códigos de referido
 * NO afecta UI/UX
 */

import { supabase } from '../../supabase';
import { sendEmail } from './email-templates';

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
    // 1. Notificar al AFILIADO
    await sendEmail({
      to: data.affiliate_email,
      subject: '🎉 ¡Nueva venta generada!',
      html: `
        <h2>¡Felicidades ${data.affiliate_name}!</h2>
        <p>Has generado una nueva venta:</p>
        <ul>
          <li><strong>Cliente:</strong> ${data.customer_name}</li>
          <li><strong>Monto de venta:</strong> $${data.order_amount.toFixed(2)} MXN</li>
          <li><strong>Tu comisión:</strong> $${data.commission_amount.toFixed(2)} MXN</li>
          <li><strong>Fecha:</strong> ${data.order_date.toLocaleString('es-MX')}</li>
          <li><strong>Pago programado:</strong> ${data.payment_scheduled_date.toLocaleDateString('es-MX')}</li>
        </ul>
        <p><small>* La comisión estará disponible para pago después de 15 días de retención.</small></p>
      `,
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
      console.warn('Tabla notifications no existe, continuando sin guardar notificación');
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
    // Notificar al ADMINISTRADOR
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@studionexora.com';
    await sendEmail({
      to: adminEmail,
      subject: '🎁 Código de referido usado',
      html: `
        <h2>Descuento de referido aplicado</h2>
        <ul>
          <li><strong>Código:</strong> ${data.referral_code}</li>
          <li><strong>Cliente:</strong> ${data.customer_name}</li>
          <li><strong>Email:</strong> ${data.customer_email}</li>
          <li><strong>Monto original:</strong> $${data.order_amount.toFixed(2)} MXN</li>
          <li><strong>Descuento:</strong> -$${data.discount_amount.toFixed(2)} MXN</li>
          <li><strong>Monto final:</strong> $${data.final_amount.toFixed(2)} MXN</li>
          <li><strong>Fecha:</strong> ${data.order_date.toLocaleString('es-MX')}</li>
        </ul>
      `,
    });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

