/**
 * Payment Service
 * Handles Stripe and Lemon Squeezy integrations
 */

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const LEMONSQUEEZY_API_KEY = import.meta.env.VITE_LEMONSQUEEZY_API_KEY || '';
const LEMONSQUEEZY_STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || '';

export interface PaymentOptions {
  amount: number; // in MXN
  packageType: string;
  userId: string;
  orderId: string;
  referralCode?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Create Stripe checkout session
 */
export async function createStripeCheckout(
  options: PaymentOptions
): Promise<PaymentResult> {
  try {
    if (!STRIPE_PUBLIC_KEY) {
      return { success: false, error: 'Stripe not configured' };
    }

    // In production, this would call your backend API
    // which creates a Stripe checkout session
    // For now, return mock data
    
    const checkoutUrl = `/checkout/stripe?order=${options.orderId}`;
    
    return {
      success: true,
      paymentId: `stripe_${Date.now()}`,
      checkoutUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create Stripe checkout',
    };
  }
}

/**
 * Create Lemon Squeezy checkout
 */
export async function createLemonSqueezyCheckout(
  options: PaymentOptions
): Promise<PaymentResult> {
  try {
    if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID) {
      return { success: false, error: 'Lemon Squeezy not configured' };
    }

    // In production, this would call Lemon Squeezy API
    // For now, return mock data
    
    const checkoutUrl = `/checkout/lemonsqueezy?order=${options.orderId}`;
    
    return {
      success: true,
      paymentId: `ls_${Date.now()}`,
      checkoutUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create Lemon Squeezy checkout',
    };
  }
}

/**
 * Verify payment status
 */
export async function verifyPayment(
  paymentId: string,
  provider: 'stripe' | 'lemonsqueezy'
): Promise<{ verified: boolean; orderId?: string; error?: string }> {
  try {
    // In production, this would verify with the payment provider
    // For now, return mock verification
    
    return {
      verified: true,
      orderId: paymentId,
    };
  } catch (error: any) {
    return {
      verified: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Get payment provider based on configuration
 */
export function getAvailablePaymentProvider(): 'stripe' | 'lemonsqueezy' | null {
  if (STRIPE_PUBLIC_KEY) return 'stripe';
  if (LEMONSQUEEZY_API_KEY && LEMONSQUEEZY_STORE_ID) return 'lemonsqueezy';
  return null;
}

