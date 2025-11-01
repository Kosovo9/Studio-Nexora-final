'use client';

import { useEffect, useState } from 'react';
import { csrfHeader } from '@/lib/security/csrf-client';

type Item = { Key?: string|null; Size?: number|null; LastModified?: string|Date|null };

export default function Page(){
  const [prefix, setPrefix] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async ()=>{
    const r = await fetch('/api/storage/list?prefix='+encodeURIComponent(prefix));
    const j = await r.json();
    setItems(j.items||[]);
  };

  useEffect(()=>{ load(); },[]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return;
    setBusy(true);
    try{
      const key = (prefix?prefix.replace(/\/?$/,'/'):'') + f.name;
      const r = await fetch('/api/storage/presign', {
        method:'POST',
        headers: { 'Content-Type':'application/json', ...csrfHeader() },
        body: JSON.stringify({ key, contentType: f.type || 'application/octet-stream' })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error||'presign failed');

      const up = await fetch(j.uploadUrl, { method:'PUT', headers: { 'Content-Type': f.type||'application/octet-stream' }, body: f });
      if (!up.ok) throw new Error('upload failed');
      await load();
      alert('Archivo subido: '+ (j.publicUrl || key));
    } catch(e:any){ alert(e?.message||'error'); }
    finally{ setBusy(false); (e.target as any).value=''; }
  }

  async function del(key: string){
    if(!confirm('Borrar definitivamente '+key+' ?')) return;
    const r = await fetch('/api/storage/delete', { method:'POST', headers: { 'Content-Type':'application/json', ...csrfHeader() }, body: JSON.stringify({ key }) });
    if (r.ok) { await load(); }
  }

  return (
    <div className='space-y-4 text-white'>
      <h1 className='text-2xl font-bold'>Assets</h1>
      <div className='flex gap-2 items-end'>
        <div>
          <label className='text-sm opacity-80'>Prefijo (carpeta virtual)</label>
          <input className='rounded border border-white/20 bg-black/40 px-3 py-2 block' value={prefix} onChange={e=>setPrefix(e.target.value)} placeholder='assets/uploads/' />
        </div>
        <button onClick={load} className='rounded border border-white/20 px-3 py-2'>Listar</button>
        <label className='rounded border border-white/20 px-3 py-2 cursor-pointer'>
          {busy?'Subiendo…':'Subir archivo'}
          <input type='file' className='hidden' onChange={onFile} disabled={busy}/>
        </label>
      </div>
      <table className='w-full text-sm'>
        <thead><tr className='text-left opacity-70'><th>Key</th><th>Tamaño</th><th>Modificado</th><th></th></tr></thead>
        <tbody>
          {items.map((it,i)=>(
            <tr key={i}>
              <td className='py-1 pr-3'>{it.Key}</td>
              <td className='py-1 pr-3'>{(it.Size||0).toLocaleString()} B</td>
              <td className='py-1 pr-3'>{String(it.LastModified||'')}</td>
              <td className='py-1'>
                {it.Key && <button onClick={()=>del(it.Key!)} className='rounded border border-white/20 px-2 py-1 text-xs'>Borrar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className='text-xs opacity-60'>Tip: configura <b>R2_PUBLIC_BASE</b> para tener URLs públicas CDN.</p>
    </div>
  );
}

