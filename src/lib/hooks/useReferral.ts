import { useState, useEffect } from 'react';
import {
  getUserReferralCode,
  getReferralStats,
  getUserReferrals,
  getUserDiscountCodes,
  validateDiscountCode,
  trackReferralClick,
  type ReferralStats,
  type Referral,
  type DiscountCode,
} from '../services/referralService';

export function useReferral(userId: string | null) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadReferralData();
    }
  }, [userId]);

  const loadReferralData = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const [codeResult, statsResult, referralsResult, codesResult] = await Promise.all([
        getUserReferralCode(userId),
        getReferralStats(userId),
        getUserReferrals(userId),
        getUserDiscountCodes(userId),
      ]);

      if (codeResult.error) setError(codeResult.error);
      else setReferralCode(codeResult.data);

      if (statsResult.error) setError(statsResult.error);
      else setStats(statsResult.data);

      if (referralsResult.error) setError(referralsResult.error);
      else setReferrals(referralsResult.data || []);

      if (codesResult.error) setError(codesResult.error);
      else setDiscountCodes(codesResult.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await validateDiscountCode(code);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to validate code');
      return { valid: false, discountPercent: 0, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (
    code: string,
    ipAddress?: string,
    userAgent?: string,
    referrerUrl?: string
  ) => {
    try {
      const result = await trackReferralClick(code, ipAddress, userAgent, referrerUrl);
      return result;
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to track click' };
    }
  };

  return {
    referralCode,
    stats,
    referrals,
    discountCodes,
    loading,
    error,
    validateCode,
    trackClick,
    refresh: loadReferralData,
  };
}

