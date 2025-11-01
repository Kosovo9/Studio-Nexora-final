'use client';

import { useEffect, useState } from 'react';

export default function CookieManagerButton() {
  const [show, setShow] = useState(false);
  useEffect(()=>{ setShow(true); },[]);
  if (!show) return null;
  return (
    <button
      onClick={()=>{ const ev = new CustomEvent('sn_open_cookie_banner'); window.dispatchEvent(ev); }}
      className='fixed bottom-4 right-4 z-[61] rounded-full border border-white/20 bg-black/70 text-white px-3 py-2 text-xs backdrop-blur hover:bg-white/10'
      title='Gestionar cookies'
      aria-label='Gestionar cookies'
    >
      Preferencias de cookies
    </button>
  );
}

