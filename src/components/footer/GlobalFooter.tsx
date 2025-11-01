'use client';

import { useEffect, useMemo, useState } from 'react';
import { FLAGS } from '@/config/flags';
import { DISCLAIMERS } from '@/config/disclaimers';
import { AFFILIATES } from '@/config/affiliates';

function pickLang() {
  if (typeof navigator === 'undefined') return 'es';
  const p = navigator.language.toLowerCase();
  if (p.startsWith('es')) return 'es';
  if (p.startsWith('en')) return 'en';
  if (p.startsWith('pt')) return 'pt';
  if (p.startsWith('fr')) return 'fr';
  if (p.startsWith('de')) return 'de';
  if (p.startsWith('it')) return 'it';
  if (p.startsWith('zh')) return 'zh';
  if (p.startsWith('ja')) return 'ja';
  if (p.startsWith('ko')) return 'ko';
  if (p.startsWith('ar')) return 'ar';
  if (p.startsWith('hi')) return 'hi';
  if (p.startsWith('ru')) return 'ru';
  return 'es';
}

export default function GlobalFooter() {
  const [lang, setLang] = useState('es');
  useEffect(() => { setLang(pickLang()); }, []);
  const flags = useMemo(() => Object.entries(FLAGS), []);
  const disclaimers = (DISCLAIMERS as any)[lang] as string[] || DISCLAIMERS['es'];

  const affiliates = AFFILIATES.filter(a => a.active);

  return (
    <footer className='mt-16 border-t border-white/10 text-white/80 bg-black/40 backdrop-blur'>
      <div className='max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3'>
        <div>
          <div className='font-semibold text-white'>Languages</div>
          <div className='flex flex-wrap gap-2 mt-2 text-xl'>
            {flags.map(([k, f]) => <span key={k} title={k}>{f}</span>)}
          </div>
        </div>
        <div className='md:col-span-2'>
          <div className='font-semibold text-white'>Disclaimers</div>
          <ul className='mt-2 list-disc pl-5 space-y-1'>
            {disclaimers.map((d, i) => <li key={i} className='text-sm'>{d}</li>)}
          </ul>
          <div className='mt-4'>
            <div className='font-semibold text-white'>Affiliates</div>
            <ul className='mt-2 flex flex-wrap gap-3 text-sm'>
              {affiliates.map(a => (
                <li key={a.name}>
                  <a className='underline hover:text-white' href={a.baseUrl} target='_blank' rel='noreferrer'>
                    {a.name}{a.trackingId ? ` (${a.trackingId})` : ''}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='text-center text-xs py-3 border-t border-white/10'>© {new Date().getFullYear()} Studio Nexora. All rights reserved.</div>
    </footer>
  );
}

