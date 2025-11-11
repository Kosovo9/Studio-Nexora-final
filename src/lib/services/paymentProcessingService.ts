/**
 * Payment Processing Service
 * Sistema de pagos quincenales optimizado para afiliados y referidos
 * - Pagos: 1 y 15 de cada mes
 * - Mínimo: $500 MXN
 * - Retención: 15 días anti-fraude
 */

import { supabase } from '../supabase';

export interface PaymentCycle {
  id: string;
  cycleDate: string;
  cycleType: 'biweekly_1' | 'biweekly_15';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalAffiliates: number;
  totalAmount: number;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  affiliateId: string;
  paymentCycleId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'transfer' | 'paypal' | 'stripe';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  externalTransactionId?: string;
  failureReason?: string;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface AffiliatePaymentSummary {
  affiliateId: string;
  userId: string;
  affiliateCode: string;
  totalPending: number;
  earningsCount: number;
  minimumPayout: number;
  paymentMethod: string;
  paymentDetails: any;
}

/**
 * Get next payment cycle dates
 */
export function getNextPaymentCycles(): { date1: Date; date2: Date } {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let date1: Date;
  let date2: Date;

  if (currentDay <= 1) {
    // Si estamos antes del día 1, próximo ciclo es el 1 de este mes
    date1 = new Date(currentYear, currentMonth, 1);
    date2 = new Date(currentYear, currentMonth, 15);
  } else if (currentDay <= 15) {
    // Si estamos antes del día 15, próximo ciclo es el 15 de este mes
    date1 = new Date(currentYear, currentMonth, 15);
    date2 = new Date(currentYear, currentMonth + 1, 1);
  } else {
    // Si estamos después del 15, próximo ciclo es el 1 del próximo mes
    date1 = new Date(currentYear, currentMonth + 1, 1);
    date2 = new Date(currentYear, currentMonth + 1, 15);
  }

  return { date1, date2 };
}

/**
 * Get affiliates ready for payment (>= $500 MXN)
 */
export async function getAffiliatesReadyForPayment(): Promise<{
  data: AffiliatePaymentSummary[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('earnings_ready_for_payment')
      .select('*');

    if (error) {
      return { data: null, error: error.message };
    }

    const summaries: AffiliatePaymentSummary[] = (data || []).map((item) => ({
      affiliateId: item.affiliate_id,
      userId: item.user_id,
      affiliateCode: item.affiliate_code,
      totalPending: parseFloat(item.total_pending || '0'),
      earningsCount: item.earnings_count || 0,
      minimumPayout: parseFloat(item.minimum_payout || '500'),
      paymentMethod: item.payment_method,
      paymentDetails: item.payment_details,
    }));

    return { data: summaries, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get affiliates ready for payment' };
  }
}

/**
 * Get affiliate pending earnings
 */
export async function getAffiliatePendingEarnings(affiliateId: string): Promise<{
  data: number | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.rpc('get_affiliate_pending_earnings', {
      affiliate_uuid: affiliateId,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: parseFloat(data || '0'), error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get pending earnings' };
  }
}

/**
 * Create payment cycle
 */
export async function createPaymentCycle(cycleDate: Date): Promise<{
  data: PaymentCycle | null;
  error: string | null;
}> {
  try {
    const dateString = cycleDate.toISOString().split('T')[0];

    const { data, error } = await supabase.rpc('create_payment_cycle', {
      cycle_date_param: dateString,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    // Get the created cycle
    const { data: cycle, error: cycleError } = await supabase
      .from('payment_cycles')
      .select('*')
      .eq('cycle_date', dateString)
      .single();

    if (cycleError || !cycle) {
      return { data: null, error: cycleError?.message || 'Failed to retrieve created cycle' };
    }

    return {
      data: {
        id: cycle.id,
        cycleDate: cycle.cycle_date,
        cycleType: cycle.cycle_type,
        status: cycle.status,
        totalAffiliates: cycle.total_affiliates,
        totalAmount: parseFloat(cycle.total_amount || '0'),
        processedAt: cycle.processed_at,
        completedAt: cycle.completed_at,
        createdAt: cycle.created_at,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to create payment cycle' };
  }
}

/**
 * Process payment cycle (admin only)
 */
export async function processPaymentCycle(cycleId: string): Promise<{
  success: boolean;
  transactionsCreated: number;
  totalAmount: number;
  error: string | null;
}> {
  try {
    // Get affiliates ready for payment in this cycle
    const { data: readyAffiliates, error: readyError } = await supabase.rpc(
      'process_payment_cycle',
      {
        cycle_id_param: cycleId,
      }
    );

    if (readyError) {
      return {
        success: false,
        transactionsCreated: 0,
        totalAmount: 0,
        error: readyError.message,
      };
    }

    if (!readyAffiliates || readyAffiliates.length === 0) {
      return {
        success: true,
        transactionsCreated: 0,
        totalAmount: 0,
        error: null,
      };
    }

    // Create payment transactions for each affiliate
    const transactions = [];
    let totalAmount = 0;

    for (const affiliate of readyAffiliates) {
      // Get affiliate payment method
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('payment_method, payment_details')
        .eq('id', affiliate.affiliate_id)
        .single();

      if (affiliateData) {
        const { data: transaction, error: transError } = await supabase
          .from('payment_transactions')
          .insert({
            affiliate_id: affiliate.affiliate_id,
            payment_cycle_id: cycleId,
            amount: parseFloat(affiliate.total_amount),
            currency: 'MXN',
            payment_method: affiliateData.payment_method,
            payment_details: affiliateData.payment_details,
            status: 'pending',
          })
          .select()
          .single();

        if (!transError && transaction) {
          transactions.push(transaction);
          totalAmount += parseFloat(affiliate.total_amount);

          // Update earnings to link with transaction
          await supabase
            .from('affiliate_earnings')
            .update({
              payment_cycle_id: cycleId,
              payment_transaction_id: transaction.id,
              payment_status: 'processing',
            })
            .eq('affiliate_id', affiliate.affiliate_id)
            .eq('payment_status', 'ready');
        }
      }
    }

    // Update cycle status
    await supabase
      .from('payment_cycles')
      .update({
        status: 'processing',
        total_affiliates: transactions.length,
        total_amount: totalAmount,
        processed_at: new Date().toISOString(),
      })
      .eq('id', cycleId);

    return {
      success: true,
      transactionsCreated: transactions.length,
      totalAmount,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      transactionsCreated: 0,
      totalAmount: 0,
      error: error.message || 'Failed to process payment cycle',
    };
  }
}

/**
 * Get payment transactions for an affiliate
 */
export async function getAffiliateTransactions(affiliateId: string): Promise<{
  data: PaymentTransaction[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const transactions: PaymentTransaction[] = (data || []).map((item) => ({
      id: item.id,
      affiliateId: item.affiliate_id,
      paymentCycleId: item.payment_cycle_id,
      amount: parseFloat(item.amount),
      currency: item.currency,
      paymentMethod: item.payment_method,
      status: item.status,
      externalTransactionId: item.external_transaction_id,
      failureReason: item.failure_reason,
      processedAt: item.processed_at,
      completedAt: item.completed_at,
      createdAt: item.created_at,
    }));

    return { data: transactions, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get transactions' };
  }
}

/**
 * Update transaction status (admin only)
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'processing' | 'completed' | 'failed',
  externalTransactionId?: string,
  failureReason?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
      if (externalTransactionId) {
        updateData.external_transaction_id = externalTransactionId;
      }
    }

    if (status === 'failed' && failureReason) {
      updateData.failure_reason = failureReason;
    }

    const { error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transactionId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Si se completó, actualizar earnings y affiliates
    if (status === 'completed') {
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('affiliate_id, amount')
        .eq('id', transactionId)
        .single();

      if (transaction) {
        // Actualizar earnings a 'paid'
        await supabase
          .from('affiliate_earnings')
          .update({ payment_status: 'paid' })
          .eq('payment_transaction_id', transactionId);

        // Actualizar totales del afiliado
        await supabase.rpc('increment_affiliate_paid_earnings', {
          affiliate_uuid: transaction.affiliate_id,
          amount: parseFloat(transaction.amount),
        });
      }
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update transaction status' };
  }
}

