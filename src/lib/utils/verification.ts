/**
 * Verification Utilities
 * Verifies all critical services and configurations
 */

import { supabase } from '../supabase';
import { isClerkConfigured, getClerkPublishableKey } from '../auth/clerk';
import { validateEnv, isEnvValid, envErrors } from '../config/env';
import { logger } from './logger';

export interface VerificationResult {
  service: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: any;
}

/**
 * Verify Supabase connection
 */
export async function verifySupabase(): Promise<VerificationResult> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        service: 'Supabase',
        status: 'error',
        message: 'Supabase credentials not configured',
        details: { url: !!supabaseUrl, key: !!supabaseKey },
      };
    }

    // Test connection by checking auth
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'Invalid Refresh Token: Refresh Token Not Found') {
      return {
        service: 'Supabase',
        status: 'warning',
        message: 'Supabase connection issue',
        details: { error: error.message },
      };
    }

    // Test storage access
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      return {
        service: 'Supabase Storage',
        status: 'warning',
        message: 'Storage access issue',
        details: { error: storageError.message },
      };
    }

    return {
      service: 'Supabase',
      status: 'ok',
      message: 'Supabase connected successfully',
      details: {
        url: supabaseUrl.substring(0, 30) + '...',
        buckets: buckets?.length || 0,
      },
    };
  } catch (error: any) {
    return {
      service: 'Supabase',
      status: 'error',
      message: 'Failed to verify Supabase',
      details: { error: error.message },
    };
  }
}

/**
 * Verify Clerk configuration
 */
export function verifyClerk(): VerificationResult {
  const configured = isClerkConfigured();
  const key = getClerkPublishableKey();

  if (!configured || !key) {
    return {
      service: 'Clerk',
      status: 'warning',
      message: 'Clerk not configured (using Supabase Auth as fallback)',
      details: { configured, hasKey: !!key },
    };
  }

  // Validate key format (Clerk keys start with pk_)
  if (!key.startsWith('pk_')) {
    return {
      service: 'Clerk',
      status: 'error',
      message: 'Invalid Clerk publishable key format',
      details: { keyPrefix: key.substring(0, 10) },
    };
  }

  return {
    service: 'Clerk',
    status: 'ok',
    message: 'Clerk configured correctly',
    details: { keyPrefix: key.substring(0, 10) + '...' },
  };
}

/**
 * Verify environment variables
 */
export function verifyEnvironment(): VerificationResult {
  const validation = validateEnv();

  if (!isEnvValid) {
    return {
      service: 'Environment Variables',
      status: 'error',
      message: 'Missing required environment variables',
      details: { errors: envErrors },
    };
  }

  // Check optional but recommended variables
  const optionalVars = {
    'VITE_CLERK_PUBLISHABLE_KEY': import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    'VITE_GOOGLE_AI_API_KEY': import.meta.env.VITE_GOOGLE_AI_API_KEY,
    'VITE_REPLICATE_API_TOKEN': import.meta.env.VITE_REPLICATE_API_TOKEN,
    'VITE_STABILITY_API_KEY': import.meta.env.VITE_STABILITY_API_KEY,
    'VITE_STRIPE_PUBLIC_KEY': import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  };

  const missingOptional = Object.entries(optionalVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingOptional.length > 0) {
    return {
      service: 'Environment Variables',
      status: 'warning',
      message: 'Some optional variables are missing',
      details: { missing: missingOptional },
    };
  }

  return {
    service: 'Environment Variables',
    status: 'ok',
    message: 'All environment variables configured',
  };
}

/**
 * Verify all services
 */
export async function verifyAll(): Promise<VerificationResult[]> {
  logger.log('🔍 Verificando servicios...');

  const results: VerificationResult[] = [];

  // Verify environment
  results.push(verifyEnvironment());

  // Verify Supabase
  results.push(await verifySupabase());

  // Verify Clerk
  results.push(verifyClerk());

  // Log results
  results.forEach((result) => {
    const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    logger.log(`${icon} ${result.service}: ${result.message}`);
    if (result.details) {
      logger.log('   Details:', result.details);
    }
  });

  return results;
}

