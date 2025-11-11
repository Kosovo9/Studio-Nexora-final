/**
 * Mercado Pago Configuration
 * Información bancaria para transferencias
 */

export interface MercadoPagoBankInfo {
  clabe: string;
  beneficiario: string;
  institucion: string;
  link?: string;
}

export const MERCADOPAGO_CONFIG: MercadoPagoBankInfo = {
  clabe: '722969020209036818',
  beneficiario: 'Neil Ernesto Ortega Castro',
  institucion: 'Mercado Pago W',
  link: 'https://link.mercadopago.com.mx/studionexora',
};

/**
 * Get Mercado Pago bank transfer information
 */
export function getMercadoPagoBankInfo(): MercadoPagoBankInfo {
  return MERCADOPAGO_CONFIG;
}

/**
 * Get formatted CLABE for display
 */
export function getFormattedCLABE(): string {
  return MERCADOPAGO_CONFIG.clabe;
}

/**
 * Get beneficiary name
 */
export function getBeneficiaryName(): string {
  return MERCADOPAGO_CONFIG.beneficiario;
}

/**
 * Get institution name
 */
export function getInstitutionName(): string {
  return MERCADOPAGO_CONFIG.institucion;
}

/**
 * Get Mercado Pago payment link
 */
export function getMercadoPagoLink(): string {
  return MERCADOPAGO_CONFIG.link || 'https://link.mercadopago.com.mx/studionexora';
}

