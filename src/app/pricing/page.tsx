'use client';

import { useState } from 'react';

type Plan = 'basic'|'pro'|'elite';
type Cadence = 'monthly'|'yearly';

const PRICES = {
  basic:  { monthly: 9,   yearly: 90  },
  pro:    { monthly: 29,  yearly: 290 },
  elite:  { monthly: 99,  yearly: 990 }
};

function BuyButton({ plan, cadence }: { plan: Plan; cadence: Cadence }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      disabled={loading}
      onClick={async ()=>{
        setLoading(true);
        try{
          const r = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({ plan, cadence })
          });
          const j = await r.json();
          if (j.url) window.location.href = j.url;
        } finally {
          setLoading(false);
        }
      }}
      className='w-full rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 disabled:opacity-50'
    >
      {loading ? 'Redirigiendo…' : 'Comprar'}
    </button>
  );
}

export default function Page() {
  const [cadence, setCadence] = useState<Cadence>('monthly');

  const Card = ({ name, plan, features }:{ name:string; plan:Plan; features:string[] }) => (
    <div className='rounded-2xl border border-white/15 p-5 bg-black/40 text-white w-full'>
      <div className='text-xl font-semibold'>{name}</div>
      <div className='text-4xl font-bold my-3'>
        ${PRICES[plan][cadence]} <span className='text-base font-normal opacity-70'>/{cadence==='monthly'?'mes':'año'}</span>
      </div>
      <ul className='text-sm opacity-85 space-y-1 mb-4 list-disc pl-5'>
        {features.map((f,i)=><li key={i}>{f}</li>)}
      </ul>
      <BuyButton plan={plan} cadence={cadence}/>
    </div>
  );

  return (
    <main className='min-h-screen text-white'>
      <div className='max-w-6xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-2'>Planes</h1>
        <p className='opacity-80 mb-6'>Elige mensual o anual. Precios de muestra; conectados a Stripe por ENV.</p>

        <div className='mb-6 flex gap-3 items-center'>
          <span className='opacity-80 text-sm'>Facturación:</span>
          <div className='inline-flex rounded-full border border-white/20 overflow-hidden'>
            <button onClick={()=>setCadence('monthly')} className={`px-3 py-1 text-sm ${cadence==='monthly'?'bg-white/15':''}`}>Mensual</button>
            <button onClick={()=>setCadence('yearly')} className={`px-3 py-1 text-sm ${cadence==='yearly'?'bg-white/15':''}`}>Anual</button>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-4'>
          <Card name='Basic' plan='basic' features={['Generador base','Acceso prompts','Actualizaciones mensuales']} />
          <Card name='Pro' plan='pro' features={['Todo Basic','Batch avanzado','Soporte prioritario']} />
          <Card name='Elite' plan='elite' features={['Todo Pro','Volúmenes altos','Integraciones premium']} />
        </div>
      </div>
    </main>
  );
}

