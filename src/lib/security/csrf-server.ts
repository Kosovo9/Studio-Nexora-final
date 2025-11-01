'use server';
import { cookies, headers } from 'next/headers';
export function csrfOk(req: Request){
  const hdr = req.headers.get('x-csrf-token') || '';
  const ck  = cookies().get('sn_csrf')?.value || '';
  return !!ck && hdr === ck;
}

