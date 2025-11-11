/**
 * Templates de Email
 * NO afecta UI/UX
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Enviar email (placeholder - integrar con servicio real)
 */
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error: string | null }> {
  try {
    // TODO: Integrar con servicio de email real (SendGrid, Resend, etc.)
    // Por ahora, solo logueamos
    console.log('📧 Email notification:', {
      to: data.to,
      subject: data.subject,
      html: data.html.substring(0, 100) + '...',
    });

    // En producción, aquí iría la llamada al servicio de email:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: data.to }] }],
        from: { email: 'noreply@studionexora.com' },
        subject: data.subject,
        content: [{ type: 'text/html', value: data.html }],
      }),
    });
    */

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

