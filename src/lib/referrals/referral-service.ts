/**
 * Servicio de Gestión de Referidos
 * Maneja códigos de descuento REF-XXXXX
 * NO afecta UI/UX - Solo lógica de negocio
 */

import { supabase } from '../../supabase';
import { generateReferralCode } from './code-generator';
import type { Referral, ReferralUsage } from './referral-types';
import { sendReferralUsedNotification } from '../notifications/notification-service';
import { calculateCashFlowReserve } from '../cash-flow/reserve-calculator';

export class ReferralService {
  /**
   * Crear nuevo código de referido
   */
  async createReferralCode(data: {
    full_name: string;
    email: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_uses?: number;
    expires_at?: Date;
    referred_by_affiliate_id?: string;
  }): Promise<{ referral: Referral | null; error: string | null }> {
    try {
      // Generar código único REF-XXXXX
      const referral_code = await generateReferralCode(data.full_name);

      const { data: referral, error } = await supabase
        .from('referral_codes')
        .insert({
          full_name: data.full_name,
          email: data.email,
          code: referral_code,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          max_uses: data.max_uses,
          expires_at: data.expires_at?.toISOString(),
          referred_by_affiliate_id: data.referred_by_affiliate_id,
          status: 'active',
          times_used: 0,
          total_discount_given: 0,
          total_sales_generated: 0,
        })
        .select()
        .single();

      if (error) {
        return { referral: null, error: error.message };
      }

      return { referral: referral as Referral, error: null };
    } catch (error: any) {
      return { referral: null, error: error.message };
    }
  }

  /**
   * Aplicar descuento de referido
   * Se ejecuta cuando un cliente usa código REF-XXXXX al comprar
   */
  async applyReferralDiscount(data: {
    referral_code: string;
    order_id: string;
    order_amount: number;
    customer_name: string;
    customer_email: string;
  }): Promise<{ discount_amount: number; final_amount: number; error: string | null }> {
    try {
      // 1. Buscar código de referido
      const { data: referral, error: referralError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', data.referral_code)
        .eq('status', 'active')
        .single();

      if (referralError || !referral) {
        return { discount_amount: 0, final_amount: data.order_amount, error: 'Código de referido no válido' };
      }

      // 2. Validar expiración
      if (referral.expires_at && new Date(referral.expires_at) < new Date()) {
        return { discount_amount: 0, final_amount: data.order_amount, error: 'Código expirado' };
      }

      // 3. Validar límite de usos
      if (referral.max_uses && referral.times_used >= referral.max_uses) {
        return { discount_amount: 0, final_amount: data.order_amount, error: 'Código agotado' };
      }

      // 4. Calcular descuento
      let discount_amount = 0;
      if (referral.discount_type === 'percentage') {
        discount_amount = (data.order_amount * referral.discount_value) / 100;
      } else {
        discount_amount = Math.min(referral.discount_value, data.order_amount);
      }

      const final_amount = Math.max(0, data.order_amount - discount_amount);

      // 5. Registrar uso
      await supabase
        .from('referral_discounts')
        .insert({
          referral_code: data.referral_code,
          referral_id: referral.id,
          order_id: data.order_id,
          order_amount: data.order_amount,
          discount_amount,
          final_amount,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          used: true,
          used_at: new Date().toISOString(),
        });

      // 6. Actualizar estadísticas
      await supabase
        .from('referral_codes')
        .update({
          times_used: (referral.times_used || 0) + 1,
          total_discount_given: (parseFloat(referral.total_discount_given || '0')) + discount_amount,
          total_sales_generated: (parseFloat(referral.total_sales_generated || '0')) + final_amount,
        })
        .eq('id', referral.id);

      // 7. Enviar notificación
      await sendReferralUsedNotification({
        referral_code: data.referral_code,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        order_amount: data.order_amount,
        discount_amount,
        final_amount,
        order_date: new Date(),
      });

      // 8. Actualizar reserva de cash flow (descuento = costo)
      await calculateCashFlowReserve();

      return { discount_amount, final_amount, error: null };
    } catch (error: any) {
      return { discount_amount: 0, final_amount: data.order_amount, error: error.message };
    }
  }
}

