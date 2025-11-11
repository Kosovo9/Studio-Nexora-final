/**
 * Servicio de Gestión de Afiliados
 * Maneja registro, ventas, comisiones y pagos
 * NO afecta UI/UX - Solo lógica de negocio
 */

import { supabase } from '../../supabase';
import { generateAffiliateCode } from './code-generator';
import type { Affiliate, AffiliateEarning } from './affiliate-types';
import { sendAffiliateSaleNotification } from '../notifications/notification-service';
import { calculateCashFlowReserve } from '../cash-flow/reserve-calculator';

export class AffiliateService {
  /**
   * Crear nuevo afiliado con cuenta bancaria
   */
  async createAffiliate(data: {
    user_id: string;
    full_name: string;
    email: string;
    phone?: string;
    bank_clabe: string;
    bank_name: string;
    account_holder_name: string;
    commission_rate?: number;
  }): Promise<{ affiliate: Affiliate | null; error: string | null }> {
    try {
      // Validar CLABE (18 dígitos)
      if (!/^\d{18}$/.test(data.bank_clabe)) {
        return { affiliate: null, error: 'CLABE debe tener exactamente 18 dígitos' };
      }

      // Generar código único
      const affiliate_code = await generateAffiliateCode(data.full_name);

      // Insertar en base de datos
      const { data: affiliate, error } = await supabase
        .from('affiliates')
        .insert({
          user_id: data.user_id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          bank_clabe: data.bank_clabe,
          bank_name: data.bank_name,
          account_holder_name: data.account_holder_name,
          affiliate_code,
          commission_rate: data.commission_rate || 10.00,
          minimum_payout: 500.00,
          payment_method: 'bank_transfer',
          status: 'active',
          approved_at: new Date().toISOString(),
          total_clicks: 0,
          total_sales: 0,
          total_earnings: 0,
          pending_earnings: 0,
          paid_earnings: 0,
        })
        .select()
        .single();

      if (error) {
        return { affiliate: null, error: error.message };
      }

      return { affiliate: affiliate as Affiliate, error: null };
    } catch (error: any) {
      return { affiliate: null, error: error.message };
    }
  }

  /**
   * Registrar venta de afiliado y calcular comisión
   * Se ejecuta automáticamente cuando un cliente compra usando código AFF-XXXXX
   */
  async recordAffiliateSale(data: {
    affiliate_code: string;
    order_id: string;
    order_amount: number;
    customer_name: string;
    customer_email: string;
  }): Promise<{ earning: AffiliateEarning | null; error: string | null }> {
    try {
      // 1. Buscar afiliado por código
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('affiliate_code', data.affiliate_code)
        .eq('status', 'active')
        .single();

      if (affiliateError || !affiliate) {
        return { earning: null, error: 'Código de afiliado no válido' };
      }

      // 2. Calcular comisión
      const commission_rate = parseFloat(affiliate.commission_rate || '10');
      const commission_amount = (data.order_amount * commission_rate) / 100;

      // 3. Calcular fecha de retención (+15 días)
      const payment_hold_until = new Date();
      payment_hold_until.setDate(payment_hold_until.getDate() + 15);

      // 4. Calcular próxima fecha de pago (1 o 15 del mes)
      const payment_scheduled_date = this.calculateNextPaymentDate(payment_hold_until);

      // 5. Insertar earning
      const { data: earning, error: earningError } = await supabase
        .from('affiliate_earnings')
        .insert({
          affiliate_id: affiliate.id,
          order_id: data.order_id,
          order_amount: data.order_amount,
          commission_amount,
          commission_rate,
          payment_status: 'on_hold',
          payment_hold_until: payment_hold_until.toISOString(),
          payment_scheduled_date: payment_scheduled_date.toISOString(),
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          status: 'approved',
        })
        .select()
        .single();

      if (earningError) {
        return { earning: null, error: earningError.message };
      }

      // 6. Actualizar estadísticas del afiliado
      await supabase
        .from('affiliates')
        .update({
          total_sales: (affiliate.total_sales || 0) + 1,
          total_earnings: (parseFloat(affiliate.total_earnings || '0')) + commission_amount,
          pending_earnings: (parseFloat(affiliate.pending_earnings || '0')) + commission_amount,
        })
        .eq('id', affiliate.id);

      // 7. Enviar notificación al afiliado
      await sendAffiliateSaleNotification({
        affiliate_id: affiliate.id,
        affiliate_name: affiliate.full_name,
        affiliate_email: affiliate.email,
        customer_name: data.customer_name,
        order_amount: data.order_amount,
        commission_amount,
        order_date: new Date(),
        payment_scheduled_date,
      });

      // 8. Actualizar reserva de cash flow
      await calculateCashFlowReserve();

      return { earning: earning as AffiliateEarning, error: null };
    } catch (error: any) {
      return { earning: null, error: error.message };
    }
  }

  /**
   * Calcula la próxima fecha de pago quincenal (1 o 15 del mes)
   */
  private calculateNextPaymentDate(holdDate: Date): Date {
    const day = holdDate.getDate();
    const nextPayment = new Date(holdDate);

    if (day <= 1) {
      // Si es antes o igual al día 1, pagar el día 1
      nextPayment.setDate(1);
    } else if (day <= 15) {
      // Si es antes o igual al día 15, pagar el día 15
      nextPayment.setDate(15);
    } else {
      // Si es después del 15, pagar el día 1 del siguiente mes
      nextPayment.setMonth(nextPayment.getMonth() + 1);
      nextPayment.setDate(1);
    }

    return nextPayment;
  }

  /**
   * Obtener earnings pendientes de un afiliado
   */
  async getPendingEarnings(affiliate_id: string): Promise<{
    earnings: AffiliateEarning[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('affiliate_earnings')
        .select('*')
        .eq('affiliate_id', affiliate_id)
        .in('payment_status', ['pending', 'on_hold', 'approved'])
        .order('created_at', { ascending: false });

      if (error) {
        return { earnings: null, error: error.message };
      }

      return { earnings: data as AffiliateEarning[], error: null };
    } catch (error: any) {
      return { earnings: null, error: error.message };
    }
  }
}

