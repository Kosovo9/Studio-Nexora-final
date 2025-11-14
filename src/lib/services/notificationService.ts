/**
 * Notification Service
 * Handles email notifications for referral program
 */

import { logger } from '../utils/logger';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send referral welcome email to new user
 */
export async function sendReferralWelcomeEmail(
  email: string,
  referralCode: string,
  discountPercent: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const subject = '¡Bienvenido a Studio Nexora! - Tu código de descuento';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a Studio Nexora! 🎉</h1>
          </div>
          <div class="content">
            <p>Gracias por registrarte usando un código de referido.</p>
            <p><strong>¡Tienes ${discountPercent}% de descuento en tu primera compra!</strong></p>
            <div class="code-box">
              <p>Tu código de descuento:</p>
              <div class="code">${referralCode}</div>
            </div>
            <p>Usa este código al realizar tu primera compra y obtén ${discountPercent}% de descuento automáticamente.</p>
            <a href="${import.meta.env.VITE_APP_URL || 'https://studionexora.com'}" class="button">Comenzar Ahora</a>
            <p>¡Esperamos verte pronto!</p>
            <p>El equipo de Studio Nexora</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Integrar con servicio de email real (SendGrid, Resend, etc.)
    // Por ahora, solo logueamos
    logger.log('📧 Email notification:', { to: email, subject, html });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send referral success email to referrer
 */
export async function sendReferralSuccessEmail(
  email: string,
  refereeName: string,
  discountPercent: number,
  discountCode: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const subject = '¡Tu referido hizo su primera compra! - Descuento disponible';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 24px; font-weight: bold; color: #f5576c; letter-spacing: 2px; }
          .button { display: inline-block; background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Felicitaciones! 🎊</h1>
          </div>
          <div class="content">
            <p><strong>${refereeName}</strong> acaba de hacer su primera compra usando tu código de referido.</p>
            <p><strong>¡Obtienes ${discountPercent}% de descuento en tu próxima compra!</strong></p>
            <div class="code-box">
              <p>Tu código de descuento:</p>
              <div class="code">${discountCode}</div>
            </div>
            <p>Usa este código en tu próxima compra y disfruta de ${discountPercent}% de descuento.</p>
            <p><em>Puedes acumular hasta 3 descuentos de ${discountPercent}% cada uno.</em></p>
            <a href="${import.meta.env.VITE_APP_URL || 'https://studionexora.com'}" class="button">Usar Descuento</a>
            <p>¡Gracias por recomendar Studio Nexora!</p>
            <p>El equipo de Studio Nexora</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Integrar con servicio de email real
    logger.log('📧 Email notification:', { to: email, subject, html });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send generic notification email
 */
export async function sendNotificationEmail(
  notification: EmailNotification
): Promise<{ success: boolean; error: string | null }> {
  try {
    // TODO: Integrar con servicio de email real
    logger.log('📧 Email notification:', notification);

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

