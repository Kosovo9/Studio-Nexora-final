'use client';

import { useEffect } from 'react';
import { CONSENT_COOKIE, parseConsent } from '@/lib/consent/consent';

declare global {
  interface Window {
    plausible?: (e:string,opts?:any)=>void;
  }
}

export default function PlausibleGate() {
  useEffect(()=>{
    const raw = document.cookie.split('; ').find(x=>x.startsWith(CONSENT_COOKIE+'='))?.split('=')[1];
    const c = parseConsent(raw || '');
    const allow = !!c?.analytics;
    if (!allow) return;

    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'nexoraproglobal.com';
    const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', domain);
    s.src = src;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  },[]);
  return null;
}

