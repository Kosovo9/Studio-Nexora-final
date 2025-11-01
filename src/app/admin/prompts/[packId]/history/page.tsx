'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { csrfHeader } from '@/lib/security/csrf-client';

export default function Page(){
  const { packId } = useParams<{ packId: string }>();
  const [list, setList] = useState<any[]>([]);
  const [sel, setSel]   = useState<string[]>([]);

  async function load(){
    const r = await fetch('/api/admin/prompts/version/list?pack_id='+packId);
    const j = await r.json(); setList(j.data||[]);
  }
  useEffect(()=>{ load(); },[packId]);

  return (
    <main className='text-white p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>History / Snapshots</h1>
      <div className='rounded-2xl border border-white/15 p-4 bg-black/40'>
        <table className='w-full text-sm'>
          <thead><tr className='text-left opacity-70'><th></th><th>Fecha</th><th>Checksum</th><th>Slug</th><th>Acciones</th></tr></thead>
          <tbody>
            {list.map((v:any)=>(
              <tr key={v.id}>
                <td><input type='checkbox' checked={sel.includes(v.id)} onChange={e=>{
                  const checked = e.target.checked;
                  setSel(s => checked ? [...new Set([...s, v.id])] : s.filter(x=>x!==v.id));
                }}/></td>
                <td>{dayjs(v.created_at).format('YYYY-MM-DD HH:mm')}</td>
                <td className='font-mono text-xs'>{v.checksum?.slice(0,16)}…</td>
                <td>{v.pack_slug}</td>
                <td className='flex gap-2'>
                  <button className='rounded border border-white/20 px-2 py-1 text-xs' onClick={async()=>{
                    if(!confirm('¿Restaurar a esta versión?')) return;
                    const r = await fetch('/api/admin/prompts/version/restore',{ method:'POST', headers:{'Content-Type':'application/json', ...csrfHeader()}, body: JSON.stringify({ version_id: v.id })});
                    const j = await r.json(); alert(j.error||('Restaurado ('+j.count+' items)'));
                  }}>Restore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='mt-3 flex gap-2'>
          <button className='rounded border border-white/20 px-3 py-2' onClick={async()=>{
            if (sel.length!==2) { alert('Selecciona exactamente 2 snapshots para comparar'); return; }
            const [a,b] = sel;
            window.location.href = `/admin/prompts/${packId}/visual-diff?v1=${encodeURIComponent(a)}&v2=${encodeURIComponent(b)}`;
          }}>Visual Diff (2 seleccionados)</button>
          <button className='rounded border border-white/20 px-3 py-2' onClick={()=>setSel([])}>Limpiar selección</button>
        </div>
      </div>
    </main>
  );
}

