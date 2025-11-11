/**
 * Tipos TypeScript para Sistema de Afiliados
 * NO afecta UI/UX - Solo lógica de negocio
 */

export interface Affiliate {
  id: string;
  user_id: string;
  
  // Información básica
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  
  // CUENTA BANCARIA (UN SOLO TIPO: CLABE)
  bank_clabe: string;              // 18 dígitos
  bank_name: string;               // Ej: "BBVA Bancomer"
  account_holder_name: string;     // Nombre del titular
  
  // Código único de afiliado (AFF-XXXXX)
  affiliate_code: string;          // Auto-generado
  
  // Configuración
  commission_rate: number;         // Ej: 10.00 (10%)
  minimum_payout: number;          // Default: 500.00 MXN
  
  // Estadísticas en tiempo real
  total_clicks: number;
  total_sales: number;
  total_earnings: number;          // Total histórico
  pending_earnings: number;        // Esperando pago
  paid_earnings: number;           // Ya pagado
  
  // Estado
  status: 'active' | 'inactive' | 'suspended';
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AffiliateEarning {
  id: string;
  affiliate_id: string;
  order_id: string;
  
  // Montos
  order_amount: number;            // Total de la venta
  commission_amount: number;       // Comisión ganada
  commission_rate: number;         // % aplicado
  
  // Control de pagos
  payment_status: 'pending' | 'on_hold' | 'approved' | 'paid' | 'cancelled';
  payment_hold_until: Date;        // Fecha cuando se libera (+15 días)
  payment_scheduled_date?: Date;   // Próxima fecha de pago (1 o 15)
  payment_completed_date?: Date;   // Cuando se pagó
  
  // Metadata
  customer_name: string;           // Quién compró
  customer_email: string;
  created_at: Date;
}

