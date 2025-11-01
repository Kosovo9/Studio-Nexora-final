'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function TurnstileCheck() {
  const siteKey = process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!siteKey) return;

    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
    return () => {
      if (document.head.contains(s)) {
        document.head.removeChild(s);
      }
    };
  }, [siteKey]);

  useEffect(() => {
    const id = setInterval(() => {
      if (window.turnstile && ref.current && !ref.current.dataset.rendered) {
        window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: async (token: string) => {
            try {
              const r = await fetch('/api/turnstile/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
              });
              const j = await r.json();
              setOk(!!j.ok);
            } catch {
              setOk(false);
            }
            setLoading(false);
          },
          'error-callback': () => {
            setOk(false);
            setLoading(false);
          }
        });
        ref.current.dataset.rendered = '1';
      }
    }, 250);
    return () => clearInterval(id);
  }, [siteKey]);

  return (
    <div className='space-y-3'>
      <div ref={ref} className='cf-turnstile' />
      <div className='text-sm text-white/80'>
        {loading ? 'Verificando…' : ok ? '✅ Humano verificado' : '❌ Falló la verificación'}
      </div>
    </div>
  );
}

