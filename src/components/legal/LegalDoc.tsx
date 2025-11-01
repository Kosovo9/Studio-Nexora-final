'use client';

import { useEffect, useState } from 'react';
import { legalTexts, type LegalKind } from '@/config/legal/texts';

function pickLang() {
  if (typeof navigator === 'undefined') return 'es';
  const p = navigator.language.toLowerCase();
  return p.slice(0,2);
}

export default function LegalDoc({ kind, title }: { kind: LegalKind; title: string }) {
  const [lang, setLang] = useState('es');
  useEffect(()=>{ setLang(pickLang()); },[]);
  const texts = legalTexts(lang)[kind];
  return (
    <main className='min-h-screen text-white'>
      <div className='max-w-3xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-4'>{title}</h1>
        <ul className='list-disc pl-6 space-y-2 text-white/85'>
          {texts.map((t,i)=><li key={i}>{t}</li>)}
        </ul>
        <p className='text-xs opacity-60 mt-8'>Nota: Este resumen es informativo. Personaliza con tu asesor legal.</p>
      </div>
    </main>
  );
}

