// Simple in-memory rate limiter
const mem = new Map<string, { count: number; resetAt: number }>();

export function ratelimit(key: string, max: number, windowMs: number): { ok: boolean } {
  const now = Date.now();
  const entry = mem.get(key);
  
  if (!entry || now > entry.resetAt) {
    mem.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  
  if (entry.count >= max) {
    return { ok: false };
  }
  
  entry.count++;
  return { ok: true };
}

