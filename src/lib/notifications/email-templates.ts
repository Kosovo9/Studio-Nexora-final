/**
 * Templates de Emails Profesionales
 * Compatible con SendGrid y Resend
 * NO afecta UI/UX
 */

import { logger } from '../utils/logger';

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Servicio de envío de emails (compatible con SendGrid/Resend)
 */
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error: string | null }> {
  try {
    const provider = import.meta.env.VITE_EMAIL_PROVIDER || 'resend'; // 'resend' o 'sendgrid'

    if (provider === 'resend') {
      return await sendWithResend(data);
    } else if (provider === 'sendgrid') {
      return await sendWithSendGrid(data);
    }

    // Fallback: solo loguear (para desarrollo)
    logger.log('📧 Email notification (dev mode):', {
      to: data.to,
      subject: data.subject,
      html: data.html.substring(0, 100) + '...',
    });

    return { success: true, error: null };
  } catch (error: any) {
    logger.error('Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enviar con Resend (Recomendado - Más fácil)
 */
async function sendWithResend(data: EmailData): Promise<{ success: boolean; error: string | null }> {
  try {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY;
    if (!apiKey) {
      logger.warn('RESEND_API_KEY no configurada, usando modo desarrollo');
      return { success: true, error: null };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: import.meta.env.VITE_EMAIL_FROM || 'Studio Nexora <noreply@studionexora.com>',
        to: Array.isArray(data.to) ? data.to : [data.to],
        subject: data.subject,
        html: data.html,
        text: data.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Enviar con SendGrid (Alternativa)
 */
async function sendWithSendGrid(data: EmailData): Promise<{ success: boolean; error: string | null }> {
  try {
    const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
    if (!apiKey) {
      logger.warn('SENDGRID_API_KEY no configurada, usando modo desarrollo');
      return { success: true, error: null };
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: Array.isArray(data.to) ? data.to.map(email => ({ email })) : [{ email: data.to }],
          },
        ],
        from: {
          email: import.meta.env.VITE_EMAIL_FROM || 'noreply@studionexora.com',
          name: 'Studio Nexora',
        },
        subject: data.subject,
        content: [
          {
            type: 'text/html',
            value: data.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: error || 'Failed to send email' };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// TEMPLATES PROFESIONALES
// ============================================

/**
 * Template base con branding
 */
function emailTemplate(content: string): string {
  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .highlight {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
        }
        .success { border-left-color: #28a745; background: #d4edda; }
        .info { border-left-color: #17a2b8; background: #d1ecf1; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        th { background: #f8f9fa; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 28px;">Studio Nexora</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${currentYear} Studio Nexora. Todos los derechos reservados.</p>
          <p>Si tienes preguntas, contáctanos en soporte@studionexora.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 1. Email: Nueva venta para AFILIADO
 */
export function affiliateSaleEmail(data: {
  affiliate_name: string;
  customer_name: string;
  order_amount: number;
  commission_amount: number;
  commission_rate: number;
  order_date: Date;
  payment_scheduled_date: Date;
  total_pending: number;
  affiliate_code: string;
}): string {
  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  
  const content = `
    <h2>🎉 ¡Felicidades ${data.affiliate_name}!</h2>
    <p>Has generado una nueva venta exitosa:</p>

    <table>
      <tr>
        <th>Cliente</th>
        <td>${data.customer_name}</td>
      </tr>
      <tr>
        <th>Monto de venta</th>
        <td><strong style="color: #28a745;">$${data.order_amount.toFixed(2)} MXN</strong></td>
      </tr>
      <tr>
        <th>Tu comisión (${data.commission_rate}%)</th>
        <td><strong style="color: #667eea; font-size: 20px;">$${data.commission_amount.toFixed(2)} MXN</strong></td>
      </tr>
      <tr>
        <th>Fecha de venta</th>
        <td>${data.order_date.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</td>
      </tr>
    </table>

    <div class="highlight info">
      <strong>📅 Próximo pago:</strong><br>
      Tu comisión estará disponible el <strong>${data.payment_scheduled_date.toLocaleDateString('es-MX', { dateStyle: 'long' })}</strong>
      <br><small>(Después de 15 días de período de retención)</small>
    </div>

    <div class="highlight success">
      <strong>💰 Total pendiente de pago:</strong> $${data.total_pending.toFixed(2)} MXN<br>
      <small>Se pagará cuando acumules mínimo $500 MXN</small>
    </div>

    <p><strong>Tu código de afiliado:</strong> <code style="background: #f8f9fa; padding: 5px 10px; border-radius: 3px;">${data.affiliate_code}</code></p>

    <a href="${appUrl}/dashboard/affiliate" class="button">
      Ver Dashboard de Afiliado
    </a>
  `;

  return emailTemplate(content);
}

/**
 * 2. Email: Código de referido usado
 */
export function referralUsedEmail(data: {
  referral_code: string;
  customer_name: string;
  customer_email: string;
  order_amount: number;
  discount_amount: number;
  discount_percentage: number;
  final_amount: number;
  order_date: Date;
}): string {
  const content = `
    <h2>🎁 Código de Descuento Aplicado</h2>
    <p>Un cliente ha usado un código de referido:</p>

    <table>
      <tr>
        <th>Código usado</th>
        <td><strong>${data.referral_code}</strong></td>
      </tr>
      <tr>
        <th>Cliente</th>
        <td>${data.customer_name}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${data.customer_email}</td>
      </tr>
      <tr>
        <th>Monto original</th>
        <td>$${data.order_amount.toFixed(2)} MXN</td>
      </tr>
      <tr>
        <th>Descuento aplicado (${data.discount_percentage}%)</th>
        <td style="color: #dc3545;"><strong>-$${data.discount_amount.toFixed(2)} MXN</strong></td>
      </tr>
      <tr>
        <th>Monto final</th>
        <td><strong style="color: #28a745; font-size: 18px;">$${data.final_amount.toFixed(2)} MXN</strong></td>
      </tr>
      <tr>
        <th>Fecha</th>
        <td>${data.order_date.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</td>
      </tr>
    </table>

    <div class="highlight">
      <strong>💡 Nota:</strong> Este es un código de referido (descuento). No genera comisiones.
    </div>
  `;

  return emailTemplate(content);
}

/**
 * 3. Email: Alerta de Cash Flow Crítico
 */
export function cashFlowAlertEmail(data: {
  available_cash: number;
  reserve_needed: number;
  deficit: number;
  pending_commissions: number;
  next_payment_date: Date;
  affiliates_to_pay: number;
}): string {
  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  
  const content = `
    <h2 style="color: #dc3545;">🚨 ALERTA: Reserva de Efectivo Insuficiente</h2>
    
    <div class="highlight" style="background: #f8d7da; border-left-color: #dc3545;">
      <strong>⚠️ ACCIÓN REQUERIDA</strong><br>
      No hay suficiente efectivo para cubrir los pagos programados.
    </div>

    <h3>📊 Situación Actual</h3>
    <table>
      <tr>
        <th>Efectivo disponible</th>
        <td>$${data.available_cash.toFixed(2)} MXN</td>
      </tr>
      <tr>
        <th>Reserva necesaria</th>
        <td><strong>$${data.reserve_needed.toFixed(2)} MXN</strong></td>
      </tr>
      <tr>
        <th>Déficit</th>
        <td style="color: #dc3545; font-size: 20px;"><strong>-$${data.deficit.toFixed(2)} MXN</strong></td>
      </tr>
    </table>

    <h3>💰 Próximos Pagos</h3>
    <table>
      <tr>
        <th>Comisiones pendientes</th>
        <td>$${data.pending_commissions.toFixed(2)} MXN</td>
      </tr>
      <tr>
        <th>Afiliados a pagar</th>
        <td>${data.affiliates_to_pay} personas</td>
      </tr>
      <tr>
        <th>Fecha de pago</th>
        <td><strong>${data.next_payment_date.toLocaleDateString('es-MX', { dateStyle: 'long' })}</strong></td>
      </tr>
    </table>

    <div class="highlight info">
      <strong>✅ Soluciones:</strong>
      <ul>
        <li>Depositar $${data.deficit.toFixed(2)} MXN antes del ${data.next_payment_date.toLocaleDateString('es-MX')}</li>
        <li>Revisar proyecciones de ventas</li>
        <li>Contactar afiliados si es necesario posponer pagos</li>
      </ul>
    </div>

    <a href="${appUrl}/admin/cash-flow" class="button" style="background: #dc3545;">
      Ver Dashboard de Cash Flow
    </a>
  `;

  return emailTemplate(content);
}

/**
 * 4. Email: Pago procesado para afiliado
 */
export function paymentProcessedEmail(data: {
  affiliate_name: string;
  payment_amount: number;
  payment_date: Date;
  bank_clabe: string;
  earnings_count: number;
  payment_reference: string;
}): string {
  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  
  const content = `
    <h2>✅ ¡Pago Procesado Exitosamente!</h2>
    <p>Hola ${data.affiliate_name},</p>
    <p>Tu pago de comisiones ha sido procesado y enviado a tu cuenta bancaria:</p>

    <div class="highlight success">
      <h3 style="margin-top: 0; color: #28a745;">💵 Monto pagado: $${data.payment_amount.toFixed(2)} MXN</h3>
    </div>

    <table>
      <tr>
        <th>Fecha de pago</th>
        <td>${data.payment_date.toLocaleDateString('es-MX', { dateStyle: 'long' })}</td>
      </tr>
      <tr>
        <th>Cuenta bancaria (CLABE)</th>
        <td><code>${data.bank_clabe}</code></td>
      </tr>
      <tr>
        <th>Ventas incluidas</th>
        <td>${data.earnings_count} comisiones</td>
      </tr>
      <tr>
        <th>Referencia</th>
        <td><code>${data.payment_reference}</code></td>
      </tr>
    </table>

    <div class="highlight info">
      <strong>📝 Importante:</strong> El pago puede tardar de 24 a 48 horas hábiles en reflejarse en tu cuenta bancaria.
    </div>

    <p>¡Gracias por ser parte de Studio Nexora! 🎉</p>

    <a href="${appUrl}/dashboard/affiliate/payments" class="button">
      Ver Historial de Pagos
    </a>
  `;

  return emailTemplate(content);
}

/**
 * 5. Email: Bienvenida a nuevo afiliado
 */
export function welcomeAffiliateEmail(data: {
  affiliate_name: string;
  affiliate_code: string;
  commission_rate: number;
  minimum_payout: number;
  dashboard_url: string;
}): string {
  const content = `
    <h2>🎉 ¡Bienvenido al Programa de Afiliados!</h2>
    <p>Hola ${data.affiliate_name},</p>
    <p>¡Tu cuenta de afiliado ha sido activada exitosamente!</p>

    <div class="highlight success">
      <h3 style="margin-top: 0;">Tu Código de Afiliado:</h3>
      <p style="font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px;">${data.affiliate_code}</p>
      <p><small>Comparte este código para empezar a ganar comisiones</small></p>
    </div>

    <h3>💰 Detalles de tu Programa</h3>
    <table>
      <tr>
        <th>Comisión por venta</th>
        <td><strong>${data.commission_rate}%</strong></td>
      </tr>
      <tr>
        <th>Pago mínimo</th>
        <td>$${data.minimum_payout.toFixed(2)} MXN</td>
      </tr>
      <tr>
        <th>Frecuencia de pago</th>
        <td>Cada 15 días (1 y 15 del mes)</td>
      </tr>
      <tr>
        <th>Método de pago</th>
        <td>Transferencia bancaria (CLABE)</td>
      </tr>
    </table>

    <h3>🚀 Cómo Empezar</h3>
    <ol style="line-height: 2;">
      <li><strong>Comparte tu código</strong> ${data.affiliate_code} con tus contactos</li>
      <li><strong>Ellos compran</strong> usando tu código en el checkout</li>
      <li><strong>Tú ganas</strong> ${data.commission_rate}% de comisión por cada venta</li>
      <li><strong>Te pagamos</strong> cada 15 días cuando acumules mínimo $${data.minimum_payout} MXN</li>
    </ol>

    <div class="highlight info">
      <strong>💡 Tip:</strong> Mientras más compartas tu código, más ganas. ¡No hay límite de comisiones!
    </div>

    <a href="${data.dashboard_url}" class="button">
      Ir a Mi Dashboard
    </a>

    <p style="margin-top: 30px;"><small>¿Tienes preguntas? Responde este email y te ayudaremos.</small></p>
  `;

  return emailTemplate(content);
}

/**
 * 6. Email: Recordatorio - Próximo al mínimo de pago
 */
export function nearPayoutThresholdEmail(data: {
  affiliate_name: string;
  current_pending: number;
  minimum_payout: number;
  remaining_amount: number;
  next_payment_date: Date;
}): string {
  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  const percentage = Math.min(100, (data.current_pending / data.minimum_payout) * 100);
  
  const content = `
    <h2>🎯 ¡Estás Cerca de tu Próximo Pago!</h2>
    <p>Hola ${data.affiliate_name},</p>
    <p>¡Excelente trabajo! Estás muy cerca de alcanzar el mínimo para recibir tu pago:</p>

    <div class="highlight" style="background: #fff3cd; border-left-color: #ffc107;">
      <h3 style="margin-top: 0;">📊 Progreso Actual</h3>
      <div style="background: #e9ecef; border-radius: 10px; padding: 3px; margin: 10px 0;">
        <div style="background: linear-gradient(90deg, #667eea, #764ba2); width: ${percentage}%; padding: 10px 0; border-radius: 8px; text-align: center; color: white; font-weight: bold;">
          ${percentage.toFixed(0)}%
        </div>
      </div>
      <table style="width: 100%; margin-top: 15px;">
        <tr>
          <td><strong>Tienes acumulado:</strong></td>
          <td style="text-align: right; font-size: 18px; color: #667eea;"><strong>$${data.current_pending.toFixed(2)} MXN</strong></td>
        </tr>
        <tr>
          <td><strong>Mínimo requerido:</strong></td>
          <td style="text-align: right;">$${data.minimum_payout.toFixed(2)} MXN</td>
        </tr>
        <tr style="border-top: 2px solid #dee2e6;">
          <td><strong>Te falta:</strong></td>
          <td style="text-align: right; font-size: 18px; color: #ffc107;"><strong>$${data.remaining_amount.toFixed(2)} MXN</strong></td>
        </tr>
      </table>
    </div>

    <div class="highlight success">
      <strong>🎉 ¡Una venta más y alcanzas el mínimo!</strong><br>
      Tu próximo pago será el <strong>${data.next_payment_date.toLocaleDateString('es-MX', { dateStyle: 'long' })}</strong>
    </div>

    <p><strong>💪 Sigue promoviendo:</strong></p>
    <ul>
      <li>Comparte tu código en redes sociales</li>
      <li>Envíalo a amigos y familiares</li>
      <li>Publícalo en tu blog o sitio web</li>
    </ul>

    <a href="${appUrl}/dashboard/affiliate" class="button">
      Ver Dashboard
    </a>
  `;

  return emailTemplate(content);
}
