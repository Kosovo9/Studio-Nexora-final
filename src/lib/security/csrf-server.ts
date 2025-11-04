'use server';
import { cookies, headers } from 'next/headers';
export async function csrfOk(req: Request){
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_PREVIEW_ADMIN === '1') return true;
  const hdr = req.headers.get('x-csrf-token') || '';
  const cookieStore = await cookies();
  const ck  = cookieStore.get('sn_csrf')?.value || '';
  return !!ck && hdr === ck;
}

