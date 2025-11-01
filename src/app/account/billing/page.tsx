'use client';

import { useState } from 'react';

export default function Page(){
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <main className='min-h-screen text-white'>
      <div className='max-w-xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-2'>Facturación</h1>
        <p className='opacity-80 mb-4'>Gestiona tu suscripción en el portal seguro de Stripe.</p>
        <div className='space-y-2'>
          <input className='w-full rounded border border-white/20 bg-black/40 px-3 py-2' placeholder='Stripe Customer ID (cus_...)' value={customerId} onChange={e=>setCustomerId(e.target.value)} />
          <button disabled={loading||!customerId} onClick={async()=>{
            setLoading(true);
            try {
              const r = await fetch('/api/stripe/portal', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ customerId })
              });
              const j = await r.json();
              if (j.url) window.location.href = j.url;
            } finally { setLoading(false); }
          }} className='rounded-lg border border-white/20 px-3 py-2 disabled:opacity-50'>
            {loading ? 'Abriendo…' : 'Gestionar suscripción'}
          </button>
        </div>
        <p className='text-xs opacity-60 mt-4'>Nota: integra tu sistema de auth para recuperar el <b>customerId</b> automáticamente.</p>
      </div>
    </main>
  );
}

