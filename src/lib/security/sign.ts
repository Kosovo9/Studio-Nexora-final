import crypto from 'crypto';

export function signQuery(params: Record<string, any>, secret = process.env.IMG_SIGN_SECRET!) {
  const entries = Object.entries(params)
    .filter(([k,v]) => v!==undefined && v!==null && v!=='')
    .sort(([a],[b]) => a.localeCompare(b));
  const canonical = entries.map(([k,v]) => `${k}=${v}`).join('&');
  return crypto.createHmac('sha256', secret).update(canonical).digest('base64url');
}

export function verifyQuery(params: URLSearchParams, secret = process.env.IMG_SIGN_SECRET!) {
  const sig = params.get('sig') || '';
  const clone = new URLSearchParams(params);
  clone.delete('sig');
  const entries = Array.from(clone.entries()).sort(([a],[b])=>a.localeCompare(b));
  const canonical = entries.map(([k,v]) => `${k}=${v}`).join('&');
  const expected = crypto.createHmac('sha256', secret).update(canonical).digest('base64url');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig||''));
}

