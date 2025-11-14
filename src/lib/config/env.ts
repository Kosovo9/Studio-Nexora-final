/**
 * Environment variables validation
 * Validates all required env vars at startup
 */

interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  clerk: {
    publishableKey: string;
  };
  app: {
    url: string;
  };
  apis: {
    googleAI?: string;
    replicate?: string;
    stabilityAI?: string;
    stripe?: string;
    lemonSqueezy?: string;
    lemonSqueezyStoreId?: string;
  };
}

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_URL',
] as const;

const optionalVars = [
  'VITE_CLERK_PUBLISHABLE_KEY',
  'VITE_GOOGLE_AI_API_KEY',
  'VITE_REPLICATE_API_TOKEN',
  'VITE_STABILITY_API_KEY',
  'VITE_STRIPE_PUBLIC_KEY',
  'VITE_LEMONSQUEEZY_API_KEY',
  'VITE_LEMONSQUEEZY_STORE_ID',
] as const;

export function validateEnv(): { valid: boolean; errors: string[]; config: EnvConfig | null } {
  const errors: string[] = [];

  // Check required variables
  for (const varName of requiredVars) {
    const value = import.meta.env[varName];
    if (!value || value.trim() === '') {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Validate Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://') && !supabaseUrl.includes('.supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
  }

  // Validate App URL format
  const appUrl = import.meta.env.VITE_APP_URL;
  if (appUrl && !appUrl.startsWith('http')) {
    errors.push('VITE_APP_URL must be a valid URL (http:// or https://)');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      config: null,
    };
  }

  // Build config object
  const config: EnvConfig = {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    },
    clerk: {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
    },
    app: {
      url: import.meta.env.VITE_APP_URL || '',
    },
    apis: {
      googleAI: import.meta.env.VITE_GOOGLE_AI_API_KEY,
      replicate: import.meta.env.VITE_REPLICATE_API_TOKEN,
      stabilityAI: import.meta.env.VITE_STABILITY_API_KEY,
      stripe: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
      lemonSqueezy: import.meta.env.VITE_LEMONSQUEEZY_API_KEY,
      lemonSqueezyStoreId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID,
    },
  };

  return {
    valid: true,
    errors: [],
    config,
  };
}

// Validate on import
const validation = validateEnv();

if (!validation.valid) {
  // Use logger if available, otherwise console (for initial load)
  const logError = typeof window !== 'undefined' && (window as any).__logger 
    ? (window as any).__logger.error 
    : console.error;
  logError('❌ Environment validation failed:');
  validation.errors.forEach(error => logError(`  - ${error}`));
  logError('\nPlease check your .env file or environment variables.');
}

export const env = validation.config;
export const envErrors = validation.errors;
export const isEnvValid = validation.valid;

