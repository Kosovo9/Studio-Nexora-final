/**
 * Affiliate Service
 * Gestión completa de afiliados con sistema de pagos optimizado
 */

import { supabase } from '../supabase';
import { getAffiliatePendingEarnings, getAffiliateTransactions } from './paymentProcessingService';

export interface Affiliate {
  id: string;
  userId: string;
  affiliateCode: string;
  paymentMethod: 'transfer' | 'paypal' | 'stripe';
  paymentDetails: any;
  totalEarnings: number;
  paidEarnings: number;
  pendingEarnings: number;
  minimumPayout: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get or create affiliate profile
 */
export async function getOrCreateAffiliate(userId: string): Promise<{
  data: Affiliate | null;
  error: string | null;
}> {
  try {
    // Verificar si ya existe
    const { data: existing, error: checkError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing && !checkError) {
      // Obtener earnings pendientes actualizados
      const { data: pending } = await getAffiliatePendingEarnings(existing.id);

      return {
        data: {
          id: existing.id,
          userId: existing.user_id,
          affiliateCode: existing.affiliate_code,
          paymentMethod: existing.payment_method,
          paymentDetails: existing.payment_details,
          totalEarnings: parseFloat(existing.total_earnings || '0'),
          paidEarnings: parseFloat(existing.paid_earnings || '0'),
          pendingEarnings: pending || 0,
          minimumPayout: parseFloat(existing.minimum_payout || '500'),
          totalClicks: existing.total_clicks || 0,
          totalConversions: existing.total_conversions || 0,
          conversionRate: parseFloat(existing.conversion_rate || '0'),
          active: existing.active,
          createdAt: existing.created_at,
          updatedAt: existing.updated_at,
        },
        error: null,
      };
    }

    // Si no existe, obtener código de referido del perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('affiliate_code')
      .eq('id', userId)
      .single();

    if (!profile || !profile.affiliate_code) {
      return { data: null, error: 'User profile not found or no affiliate code' };
    }

    // Crear nuevo afiliado
    const { data: newAffiliate, error: createError } = await supabase
      .from('affiliates')
      .insert({
        user_id: userId,
        affiliate_code: profile.affiliate_code,
        payment_method: 'transfer', // Default
        payment_details: {},
        minimum_payout: 500,
      })
      .select()
      .single();

    if (createError || !newAffiliate) {
      return { data: null, error: createError?.message || 'Failed to create affiliate' };
    }

    return {
      data: {
        id: newAffiliate.id,
        userId: newAffiliate.user_id,
        affiliateCode: newAffiliate.affiliate_code,
        paymentMethod: newAffiliate.payment_method,
        paymentDetails: newAffiliate.payment_details,
        totalEarnings: 0,
        paidEarnings: 0,
        pendingEarnings: 0,
        minimumPayout: parseFloat(newAffiliate.minimum_payout || '500'),
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        active: newAffiliate.active,
        createdAt: newAffiliate.created_at,
        updatedAt: newAffiliate.updated_at,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get or create affiliate' };
  }
}

/**
 * Update affiliate payment method
 */
export async function updateAffiliatePaymentMethod(
  affiliateId: string,
  paymentMethod: 'transfer' | 'paypal' | 'stripe',
  paymentDetails: any
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('affiliates')
      .update({
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      })
      .eq('id', affiliateId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update payment method' };
  }
}

/**
 * Get affiliate statistics
 */
export async function getAffiliateStats(affiliateId: string): Promise<{
  data: {
    totalEarnings: number;
    paidEarnings: number;
    pendingEarnings: number;
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
    nextPaymentDate?: string;
    canWithdraw: boolean;
  } | null;
  error: string | null;
}> {
  try {
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', affiliateId)
      .single();

    if (affiliateError || !affiliate) {
      return { data: null, error: affiliateError?.message || 'Affiliate not found' };
    }

    const { data: pending } = await getAffiliatePendingEarnings(affiliateId);
    const { data: transactions } = await getAffiliateTransactions(affiliateId);

    // Calcular próxima fecha de pago (1 o 15 del mes)
    const now = new Date();
    const currentDay = now.getDate();
    let nextPaymentDate: Date;

    if (currentDay <= 1) {
      nextPaymentDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (currentDay <= 15) {
      nextPaymentDate = new Date(now.getFullYear(), now.getMonth(), 15);
    } else {
      nextPaymentDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    return {
      data: {
        totalEarnings: parseFloat(affiliate.total_earnings || '0'),
        paidEarnings: parseFloat(affiliate.paid_earnings || '0'),
        pendingEarnings: pending || 0,
        totalClicks: affiliate.total_clicks || 0,
        totalConversions: affiliate.total_conversions || 0,
        conversionRate: parseFloat(affiliate.conversion_rate || '0'),
        nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
        canWithdraw: (pending || 0) >= parseFloat(affiliate.minimum_payout || '500'),
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get affiliate stats' };
  }
}

