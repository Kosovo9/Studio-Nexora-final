export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt?: string;
};

export const CONSENT_COOKIE = 'sn_consent';

export function parseConsent(raw?: string): ConsentState | null {
  if (!raw) return null;
  try { return JSON.parse(decodeURIComponent(raw)) as ConsentState; }
  catch { return null; }
}

export function defaultConsent(): ConsentState {
  return { necessary: true, analytics: false, marketing: false };
}

