/**
 * Referral Service
 * Handles referral program with discounts:
 * - Referrer: 20% discount (up to 3 successful referrals)
 * - Referee: 15% discount on first purchase
 */

import { supabase } from '../supabase';

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  availableDiscounts: number;
  totalDiscountPercent: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  referrerDiscountApplied: boolean;
  refereeDiscountApplied: boolean;
  orderId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DiscountCode {
  id: string;
  referrerId: string;
  code: string;
  discountPercent: number;
  discountType: 'referrer' | 'referee';
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
}

/**
 * Get user's referral code
 */
export async function getUserReferralCode(userId: string): Promise<{
  data: string | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Si no tiene código, generar uno
    if (!data.referral_code) {
      const { data: generated, error: genError } = await supabase.rpc('generate_referral_code', {
        user_id: userId,
      });

      if (genError) {
        return { data: null, error: genError.message };
      }

      // Actualizar perfil con el código generado
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referral_code: generated })
        .eq('id', userId);

      if (updateError) {
        return { data: null, error: updateError.message };
      }

      return { data: generated, error: null };
    }

    return { data: data.referral_code, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get referral code' };
  }
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string): Promise<{
  data: ReferralStats | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.rpc('get_referral_stats', {
      user_id: userId,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data || data.length === 0) {
      return {
        data: {
          totalReferrals: 0,
          completedReferrals: 0,
          pendingReferrals: 0,
          availableDiscounts: 0,
          totalDiscountPercent: 0,
        },
        error: null,
      };
    }

    const stats = data[0];
    return {
      data: {
        totalReferrals: parseInt(stats.total_referrals) || 0,
        completedReferrals: parseInt(stats.completed_referrals) || 0,
        pendingReferrals: parseInt(stats.pending_referrals) || 0,
        availableDiscounts: parseInt(stats.available_discounts) || 0,
        totalDiscountPercent: parseFloat(stats.total_discount_percent) || 0,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get referral stats' };
  }
}

/**
 * Get user's referrals list
 */
export async function getUserReferrals(userId: string): Promise<{
  data: Referral[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const referrals: Referral[] = (data || []).map((item) => ({
      id: item.id,
      referrerId: item.referrer_id,
      refereeId: item.referee_id,
      referralCode: item.referral_code,
      status: item.status,
      referrerDiscountApplied: item.referrer_discount_applied,
      refereeDiscountApplied: item.referee_discount_applied,
      orderId: item.order_id,
      createdAt: item.created_at,
      completedAt: item.completed_at,
    }));

    return { data: referrals, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get referrals' };
  }
}

/**
 * Get available discount codes for a user
 */
export async function getUserDiscountCodes(userId: string): Promise<{
  data: DiscountCode[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('referral_discount_codes')
      .select('*')
      .eq('referrer_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const codes: DiscountCode[] = (data || []).map((item) => ({
      id: item.id,
      referrerId: item.referrer_id,
      code: item.code,
      discountPercent: parseFloat(item.discount_percent),
      discountType: item.discount_type,
      maxUses: item.max_uses,
      currentUses: item.current_uses,
      expiresAt: item.expires_at,
      active: item.active,
      createdAt: item.created_at,
    }));

    return { data: codes, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get discount codes' };
  }
}

/**
 * Validate and apply discount code
 */
export async function validateDiscountCode(code: string): Promise<{
  valid: boolean;
  discountPercent: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('referral_discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error || !data) {
      return { valid: false, discountPercent: 0, error: 'Invalid discount code' };
    }

    // Verificar si está expirado
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, discountPercent: 0, error: 'Discount code expired' };
    }

    // Verificar si alcanzó el máximo de usos
    if (data.current_uses >= data.max_uses) {
      return { valid: false, discountPercent: 0, error: 'Discount code limit reached' };
    }

    return {
      valid: true,
      discountPercent: parseFloat(data.discount_percent),
      error: null,
    };
  } catch (error: any) {
    return { valid: false, discountPercent: 0, error: error.message || 'Failed to validate code' };
  }
}

/**
 * Use discount code (increment current_uses)
 */
export async function useDiscountCode(code: string, orderId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('referral_discount_codes')
      .update({
        current_uses: supabase.raw('current_uses + 1'),
      })
      .eq('code', code.toUpperCase())
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to use discount code' };
    }

    // Si alcanzó el máximo, desactivar
    if (data.current_uses >= data.max_uses) {
      await supabase
        .from('referral_discount_codes')
        .update({ active: false })
        .eq('id', data.id);
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to use discount code' };
  }
}

/**
 * Track referral click
 */
export async function trackReferralClick(
  referralCode: string,
  ipAddress?: string,
  userAgent?: string,
  referrerUrl?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Buscar el referidor por código
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode.toUpperCase())
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Registrar click (usando la tabla affiliate_clicks que ya existe)
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        affiliate_id: profile.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer_url: referrerUrl,
        converted: false,
      });

    if (clickError) {
      return { success: false, error: clickError.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to track click' };
  }
}

