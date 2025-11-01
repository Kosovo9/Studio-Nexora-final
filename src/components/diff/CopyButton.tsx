'use client';
import { useState } from 'react';

export default function CopyButton({ text, label='Copy' }:{ text:string; label?:string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async()=>{ try{ await navigator.clipboard.writeText(text||''); setOk(true); setTimeout(()=>setOk(false), 1200);}catch(e){ alert('Copy failed'); }}}
      className='rounded border border-white/20 px-2 py-1 text-xs'
      title='Copiar al portapapeles'
    >
      {ok ? 'Copied ✔' : label}
    </button>
  );
}

