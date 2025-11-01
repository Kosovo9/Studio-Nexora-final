'use client';

import { useEffect, useState } from 'react';
import { CONSENT_COOKIE, defaultConsent, type ConsentState, parseConsent } from '@/lib/consent/consent';

function writeConsent(c: ConsentState) {
  const v = encodeURIComponent(JSON.stringify({ ...c, updatedAt: new Date().toISOString() }));
  document.cookie = `${CONSENT_COOKIE}=${v}; Path=/; Max-Age=${3600*24*365}; SameSite=Lax`;
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<ConsentState>(defaultConsent());

  useEffect(()=>{
    const h=()=>setOpen(true);
    window.addEventListener('sn_open_cookie_banner', h);
    return()=>window.removeEventListener('sn_open_cookie_banner', h);
  },[]);

  useEffect(()=>{
    const match = document.cookie.split('; ').find(x=>x.startsWith(CONSENT_COOKIE+'='));
    const raw = match?.split('=')[1];
    const c = parseConsent(raw);
    if (!c) setOpen(true);
  },[]);

  if (!open) return null;

  return (
    <div className='fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/80 text-white p-4 backdrop-blur'>
      <div className='font-semibold text-lg'>Cookies & Privacidad</div>
      <p className='text-sm opacity-80 mt-1'>Usamos cookies para funcionalidades esenciales y, si aceptas, analítica anónima y marketing.</p>
      <div className='grid grid-cols-3 gap-3 mt-3'>
        <div className='rounded-xl border border-white/15 p-3'>
          <div className='font-medium'>Necesarias</div>
          <div className='text-xs opacity-70'>Siempre activas</div>
          <input type='checkbox' checked readOnly className='mt-2'/>
        </div>
        <div className='rounded-xl border border-white/15 p-3'>
          <label className='font-medium flex items-center gap-2'>
            <input type='checkbox' checked={val.analytics} onChange={e=>setVal(v=>({...v, analytics:e.target.checked}))}/>
            Analítica
          </label>
          <div className='text-xs opacity-70 mt-1'>Plausible (auto-hosted/anon)</div>
        </div>
        <div className='rounded-xl border border-white/15 p-3'>
          <label className='font-medium flex items-center gap-2'>
            <input type='checkbox' checked={val.marketing} onChange={e=>setVal(v=>({...v, marketing:e.target.checked}))}/>
            Marketing
          </label>
          <div className='text-xs opacity-70 mt-1'>Campañas y atribución</div>
        </div>
      </div>
      <div className='flex flex-wrap gap-2 mt-3'>
        <button onClick={()=>{ const c={...defaultConsent(), analytics:false, marketing:false}; writeConsent(c); setOpen(false); location.reload(); }} className='rounded-lg border border-white/20 px-3 py-1 text-sm'>Rechazar todo</button>
        <button onClick={()=>{ const c={...defaultConsent(), analytics:true, marketing:true}; writeConsent(c); setOpen(false); location.reload(); }} className='rounded-lg border border-white/20 px-3 py-1 text-sm'>Aceptar todo</button>
        <button onClick={()=>{ writeConsent(val); setOpen(false); location.reload(); }} className='rounded-lg border border-white/20 px-3 py-1 text-sm'>Guardar preferencias</button>
      </div>
    </div>
  );
}

