/**
 * Clerk Authentication Integration
 * Provides authentication using Clerk
 */

import { ClerkProvider, useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { logger } from '../utils/logger';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

if (!CLERK_PUBLISHABLE_KEY) {
  logger.warn('Clerk Publishable Key not configured. Please set VITE_CLERK_PUBLISHABLE_KEY');
}

export { ClerkProvider, useClerkAuth, useUser };

/**
 * Get Clerk publishable key
 */
export function getClerkPublishableKey(): string {
  return CLERK_PUBLISHABLE_KEY;
}

/**
 * Check if Clerk is configured
 */
export function isClerkConfigured(): boolean {
  return !!CLERK_PUBLISHABLE_KEY;
}

