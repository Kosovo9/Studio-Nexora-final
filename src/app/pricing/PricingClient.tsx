'use client';

import { useState, useMemo, useEffect } from 'react';
import JsonLd from '@/components/seo/JsonLd';
import { jsonldProduct, jsonldFAQ, jsonldBreadcrumb } from '@/lib/seo/jsonld';
import { SITE } from '@/lib/seo/site';

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
        } finally { setLoading(false); }
      }}
      className='w-full rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 disabled:opacity-50'
    >
      {loading ? 'Redirigiendo…' : 'Comprar'}
    </button>
  );
}

export default function PricingClient({ variant }: { variant: 'A'|'B' }) {
  const [cadence, setCadence] = useState<Cadence>('monthly');

  // Evento Plausible
  useEffect(()=>{
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('AB Pricing View', { props: { variant } });
    }
  },[variant]);

  const products = useMemo(()=> {
    const cur = 'USD';
    const url = SITE.url + '/pricing';
    const prod = (name:string, key:Plan) => {
      return {
        ...jsonldProduct(
          `Nexora ${name}`,
          `Plan ${name} de Studio Nexora`,
          url,
          PRICES[key].monthly,
          cur
        ),
        offers: [
          { '@type':'Offer', priceCurrency: cur, price: PRICES[key].monthly, url, availability:'https://schema.org/InStock' },
          { '@type':'Offer', priceCurrency: cur, price: PRICES[key].yearly,  url, availability:'https://schema.org/InStock' }
        ]
      };
    };
    return [prod('Basic','basic'), prod('Pro','pro'), prod('Elite','elite')];
  },[]);

  const faq = useMemo(()=>jsonldFAQ([
    { q:'¿Puedo cancelar cuando quiera?', a:'Sí, puedes cancelar en cualquier momento desde tu portal de cliente.' },
    { q:'¿Emitís factura/recibo?', a:'Sí, tras cada cobro recibirás un comprobante y puedes solicitar factura.' },
    { q:'¿Mensual vs anual?', a:'Anual ofrece descuento equivalente a 2 meses gratis aprox.' },
    { q:'¿Reembolsos?', a:'Para compras accidentales contáctanos en 24h. Aplican términos.' }
  ]),[]);

  const crumbs = useMemo(()=>jsonldBreadcrumb([
    { name:'Home', url: SITE.url },
    { name:'Pricing', url: SITE.url + '/pricing' }
  ]),[]);

  const features = {
    basic: ['Generador base','Acceso prompts','Actualizaciones mensuales'],
    pro:   ['Todo Basic','Batch avanzado','Soporte prioritario'],
    elite: ['Todo Pro','Volúmenes altos','Integraciones premium']
  };

  // Cambios sutiles entre variantes
  const title = variant === 'A' ? 'Planes' : 'Planes — Ahorra con anual';
  const badge  = variant === 'A' ? 'Más popular' : 'Mejor valor';
  const highlight = variant === 'A' ? 'pro' : 'elite';

  const Card = ({ name, plan, feats }:{ name:string; plan:Plan; feats:string[] }) => (
    <div className={`rounded-2xl border p-5 w-full ${highlight===plan?'border-white/35 bg-white/10 text-white':'border-white/15 bg-black/40 text-white'}`}>
      <div className='text-xl font-semibold flex items-center gap-2'>
        {name} {highlight===plan && <span className='text-xs px-2 py-0.5 rounded-full border border-white/30'>{badge}</span>}
      </div>
      <div className='text-4xl font-bold my-3'>
        ${PRICES[plan][cadence]} <span className='text-base font-normal opacity-70'>/{cadence==='monthly'?'mes':'año'}</span>
      </div>
      <ul className='text-sm opacity-85 space-y-1 mb-4 list-disc pl-5'>
        {feats.map((f,i)=><li key={i}>{f}</li>)}
      </ul>
      <BuyButton plan={plan} cadence={cadence}/>
    </div>
  );

  return (
    <main className='min-h-screen text-white'>
      {/* JSON-LD: 3 productos + FAQ + Breadcrumb */}
      {products.map((p,i)=><JsonLd key={i} data={p} />)}
      <JsonLd data={faq} />
      <JsonLd data={crumbs} />

      <div className='max-w-6xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-2'>{title}</h1>
        <p className='opacity-80 mb-6'>Elige mensual o anual. Precios de muestra; conectados a Stripe por ENV.</p>

        <div className='mb-6 flex gap-3 items-center'>
          <span className='opacity-80 text-sm'>Facturación:</span>
          <div className='inline-flex rounded-full border border-white/20 overflow-hidden'>
            <button onClick={()=>setCadence('monthly')} className={`px-3 py-1 text-sm ${cadence==='monthly'?'bg-white/15':''}`}>Mensual</button>
            <button onClick={()=>setCadence('yearly')} className={`px-3 py-1 text-sm ${cadence==='yearly'?'bg-white/15':''}`}>Anual</button>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-4'>
          <Card name='Basic' plan='basic' feats={features.basic} />
          <Card name='Pro'   plan='pro'   feats={features.pro} />
          <Card name='Elite' plan='elite' feats={features.elite} />
        </div>
      </div>
    </main>
  );
}

