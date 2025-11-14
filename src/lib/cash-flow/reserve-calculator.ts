/**
 * Calculadora de Reserva de Efectivo
 * Calcula cuánto dinero necesitas reservar para pagos de comisiones
 * NO afecta UI/UX
 */

import { supabase } from '../../supabase';
import { logger } from '../utils/logger';

export interface CashFlowReserve {
  total_reserve_needed: number;
  pending_commissions: number;
  pending_discounts: number;
  buffer_amount: number;
  next_payment_date: Date;
  breakdown: {
    message: string;
    commissions: string;
    discounts: string;
    buffer: string;
  };
}

/**
 * Calcular reserva de efectivo necesaria
 */
export async function calculateCashFlowReserve(): Promise<{
  data: CashFlowReserve | null;
  error: string | null;
}> {
  try {
    const today = new Date();
    const next15Days = new Date(today);
    next15Days.setDate(next15Days.getDate() + 15);

    // 1. Comisiones que vencen en próximos 15 días
    const { data: upcomingCommissions, error: commissionsError } = await supabase
      .from('affiliate_earnings')
      .select('commission_amount_mxn')
      .in('payment_status', ['on_hold', 'ready'])
      .lte('payment_hold_until', next15Days.toISOString());

    if (commissionsError) {
      logger.warn('Error calculando comisiones:', commissionsError);
    }

    const pending_commissions = upcomingCommissions?.reduce(
      (sum, earning) => sum + parseFloat(earning.commission_amount_mxn || '0'),
      0
    ) || 0;

    // 2. Proyectar descuentos de próximos 15 días (basado en promedio)
    const { data: recentDiscounts, error: discountsError } = await supabase
      .from('referral_discounts')
      .select('discount_percent, discount_amount')
      .gte('created_at', new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString());

    if (discountsError) {
      logger.warn('Error calculando descuentos:', discountsError);
    }

    const totalRecentDiscounts = recentDiscounts?.reduce(
      (sum, disc) => sum + parseFloat(disc.discount_amount || disc.discount_percent || '0'),
      0
    ) || 0;

    const avg_daily_discount = totalRecentDiscounts / 15;
    const pending_discounts = avg_daily_discount * 15;

    // 3. Buffer de seguridad (20%)
    const subtotal = pending_commissions + pending_discounts;
    const buffer_amount = subtotal * 0.20;

    // 4. Total necesario
    const total_reserve_needed = subtotal + buffer_amount;

    // 5. Próxima fecha de pago (1 o 15)
    const next_payment_date = getNextPaymentDate();

    return {
      data: {
        total_reserve_needed,
        pending_commissions,
        pending_discounts,
        buffer_amount,
        next_payment_date,
        breakdown: {
          message: total_reserve_needed > 0 
            ? `⚠️ RESERVAR: $${total_reserve_needed.toFixed(2)} MXN para pagos` 
            : '✅ No hay pagos pendientes',
          commissions: `$${pending_commissions.toFixed(2)} MXN en comisiones`,
          discounts: `$${pending_discounts.toFixed(2)} MXN estimado en descuentos`,
          buffer: `$${buffer_amount.toFixed(2)} MXN de buffer (20%)`,
        },
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

/**
 * Obtener próxima fecha de pago (1 o 15 del mes)
 */
function getNextPaymentDate(): Date {
  const today = new Date();
  const day = today.getDate();
  const nextPayment = new Date(today);

  if (day <= 1) {
    nextPayment.setDate(1);
  } else if (day <= 15) {
    nextPayment.setDate(15);
  } else {
    nextPayment.setMonth(nextPayment.getMonth() + 1);
    nextPayment.setDate(1);
  }

  return nextPayment;
}

/**
 * Verificar si hay suficiente efectivo disponible
 */
export async function checkCashFlowHealth(available_cash: number): Promise<{
  data: {
    is_healthy: boolean;
    alert_level: 'safe' | 'warning' | 'critical';
    message: string;
    reserve_needed: number;
    available_cash: number;
    deficit?: number;
  } | null;
  error: string | null;
}> {
  try {
    const reserveResult = await calculateCashFlowReserve();
    
    if (reserveResult.error || !reserveResult.data) {
      return { data: null, error: reserveResult.error || 'Failed to calculate reserve' };
    }

    const reserve = reserveResult.data;
    const reserve_needed = reserve.total_reserve_needed;

    if (available_cash >= reserve_needed * 1.2) {
      return {
        data: {
          is_healthy: true,
          alert_level: 'safe',
          message: '✅ Efectivo suficiente para todos los compromisos',
          reserve_needed,
          available_cash,
        },
        error: null,
      };
    } else if (available_cash >= reserve_needed) {
      return {
        data: {
          is_healthy: true,
          alert_level: 'warning',
          message: '⚠️ Efectivo justo, monitorear de cerca',
          reserve_needed,
          available_cash,
        },
        error: null,
      };
    } else {
      const deficit = reserve_needed - available_cash;
      return {
        data: {
          is_healthy: false,
          alert_level: 'critical',
          message: `🚨 ALERTA: Faltan $${deficit.toFixed(2)} MXN`,
          reserve_needed,
          available_cash,
          deficit,
        },
        error: null,
      };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

/**
 * Guardar reserva calculada en base de datos (para admin dashboard)
 */
export async function saveCashFlowReserve(reserve: CashFlowReserve): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    // Intentar guardar en tabla cash_flow_reserves si existe
    const { error } = await supabase
      .from('cash_flow_reserves')
      .insert({
        total_reserve_needed: reserve.total_reserve_needed,
        pending_commissions: reserve.pending_commissions,
        pending_discounts: reserve.pending_discounts,
        buffer_amount: reserve.buffer_amount,
        next_payment_date: reserve.next_payment_date.toISOString(),
        calculated_at: new Date().toISOString(),
      });

    if (error) {
      // Si la tabla no existe, no es crítico
      logger.warn('Tabla cash_flow_reserves no existe, continuando sin guardar');
      return { success: true, error: null };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

