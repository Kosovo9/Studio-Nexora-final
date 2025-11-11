/**
 * Tipos TypeScript para Sistema de Referidos
 * NO afecta UI/UX - Solo lógica de negocio
 */

export interface Referral {
  id: string;
  user_id?: string;  // Opcional, puede ser guest
  
  // Información del referido
  full_name: string;
  email: string;
  phone?: string;
  
  // Código único de referido (REF-XXXXX)
  referral_code: string;           // Auto-generado
  
  // Configuración de descuento
  discount_type: 'percentage' | 'fixed';
  discount_value: number;          // Ej: 10 (10%) o 50 (50 MXN)
  max_uses?: number;               // Límite de usos
  expires_at?: Date;               // Fecha de expiración
  
  // Quién lo refirió (si aplica)
  referred_by_affiliate_id?: string;
  referred_by_code?: string;
  
  // Estadísticas
  times_used: number;
  total_discount_given: number;
  total_sales_generated: number;
  
  // Estado
  status: 'active' | 'inactive' | 'expired';
  created_at: Date;
  updated_at: Date;
}

export interface ReferralUsage {
  id: string;
  referral_code: string;
  referral_id: string;
  order_id: string;
  
  // Montos
  order_amount: number;
  discount_amount: number;
  final_amount: number;
  
  // Cliente que usó el código
  customer_name: string;
  customer_email: string;
  
  // Metadata
  used_at: Date;
  created_at: Date;
}

