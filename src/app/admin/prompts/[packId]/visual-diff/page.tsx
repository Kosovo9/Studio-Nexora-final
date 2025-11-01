'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import TokenDiff from '@/components/diff/TokenDiff';
import CopyButton from '@/components/diff/CopyButton';
import Chips from '@/components/diff/Chips';
import MetricsInline from '@/components/diff/MetricsInline';
import TotalsBar from '@/components/diff/TotalsBar';
import { itemDiffFields } from '@/lib/utils/fingerprint';

type Row = {
  id: string;
  changed?: string[];
  left?: {
    prompt: string;
    negative_prompt: string;
    subject: string;
    title?: string;
    theme?: string;
    location?: string;
    cover_key?: string;
  };
  right?: {
    prompt: string;
    negative_prompt: string;
    subject: string;
    title?: string;
    theme?: string;
    location?: string;
    cover_key?: string;
  };
};

export default function Page(){
  const { packId } = useParams<{ packId: string }>();
  const sp = useSearchParams();
  const v1 = sp.get('v1')||'';
  const v2 = sp.get('v2')||'';
  
  const [rows, setRows] = useState<Row[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [showOnlyChanged, setShowOnlyChanged] = useState(true);
  const [diffMode, setDiffMode] = useState<'word'|'char'|'sentence'>('word');

  useEffect(()=>{ 
    (window as any).setDiffMode = (m:any)=> setDiffMode(m); 
    return ()=>{ try{ delete (window as any).setDiffMode; } catch(_){} }
  },[]);

  // Fetch full snapshots
  useEffect(()=>{
    if (!v1 || !v2) return;
    Promise.all([
      fetch(`/api/admin/prompts/version/get?version_id=${encodeURIComponent(v1)}`).then(x=>x.json()).then(x=>x.data),
      fetch(`/api/admin/prompts/version/get?version_id=${encodeURIComponent(v2)}`).then(x=>x.json()).then(x=>x.data)
    ]).then(([a,b])=>{
      if (a && b) {
        const items1 = a.items || [];
        const items2 = b.items || [];
        
        // Match items by prompt similarity or index
        const map1 = new Map();
        const map2 = new Map();
        
        items1.forEach((it:any, idx:number) => {
          const key = it.id || it.prompt?.slice(0,30) || `idx-${idx}`;
          map1.set(key, it);
        });
        
        items2.forEach((it:any, idx:number) => {
          const key = it.id || it.prompt?.slice(0,30) || `idx-${idx}`;
          map2.set(key, it);
        });
        
        const allKeys = new Set([...map1.keys(), ...map2.keys()]);
        const rws: Row[] = [];
        for (const key of allKeys) {
          const l = map1.get(key);
          const r = map2.get(key);
          const changed = itemDiffFields(l, r);
          if (showOnlyChanged && changed.length === 0) continue;
          rws.push({ id: String(key), left: l, right: r, changed });
        }
        setRows(rws);
        setMeta({ v1: a, v2: b });
      }
    }).catch(e=>console.error('Error loading snapshots:', e));
  }, [v1, v2, packId, showOnlyChanged]);

  const list = useMemo(()=> rows.filter(r => showOnlyChanged ? (r.changed?.length || 0) > 0 : true), [rows, showOnlyChanged]);

  return (
    <main className='text-white p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>Visual Diff por Item</h1>
      {meta && (
        <div className='text-sm opacity-70'>
          <div>V1: {meta.v1?.pack_slug} ({new Date(meta.v1?.created_at).toLocaleString()})</div>
          <div>V2: {meta.v2?.pack_slug} ({new Date(meta.v2?.created_at).toLocaleString()})</div>
        </div>
      )}
      <div className='rounded-2xl border border-white/15 p-4 bg-black/40 space-y-3'>
        <div className='flex items-center gap-4'>
          <label className='flex items-center gap-2'>
            <input type='checkbox' checked={showOnlyChanged} onChange={e=>setShowOnlyChanged(e.target.checked)}/>
            Mostrar solo cambiados
          </label>
          <div className='flex items-center gap-2 text-sm opacity-80'>
            <span>Modo:</span>
            <button className={`rounded border border-white/20 px-2 py-1 text-xs ${diffMode==='word'?'bg-white/10':''}`} onClick={()=> setDiffMode('word')}>word</button>
            <button className={`rounded border border-white/20 px-2 py-1 text-xs ${diffMode==='char'?'bg-white/10':''}`} onClick={()=> setDiffMode('char')}>char</button>
            <button className={`rounded border border-white/20 px-2 py-1 text-xs ${diffMode==='sentence'?'bg-white/10':''}`} onClick={()=> setDiffMode('sentence')}>sentence</button>
          </div>
        </div>
        <div className='text-xs opacity-70'>
          <span className='inline-block mr-2 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40'>+ added</span>
          <span className='inline-block mr-2 px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 line-through'>– removed</span>
          <span className='inline-block'>texto plano = sin cambio</span>
        </div>
      </div>
      {list.length > 0 && <TotalsBar rows={list} />}
      
      {meta && v1 && v2 && (
        <div className='flex flex-wrap gap-2'>
          <a className='rounded border border-white/20 px-3 py-1 text-sm hover:bg-white/10' href={`/api/admin/prompts/version/diff-metrics?v1=${encodeURIComponent(v1)}&v2=${encodeURIComponent(v2)}`}>Export JSON</a>
          <a className='rounded border border-white/20 px-3 py-1 text-sm hover:bg-white/10' href={`/api/admin/prompts/version/diff-metrics?v1=${encodeURIComponent(v1)}&v2=${encodeURIComponent(v2)}&format=csv`}>Export CSV</a>
        </div>
      )}

      <div className='space-y-4'>
        {list.map((row, idx)=> (
          <details key={row.id || idx} className='rounded-2xl border border-white/15 p-4 bg-black/40'>
            <summary className='cursor-pointer text-sm font-semibold mb-2'>
              Item #{idx+1} {row.left?.subject || row.right?.subject || ''} — {row.left?.title || row.right?.title || 'Sin título'}
              <Chips fields={row.changed || []} />
            </summary>
            <div className='mt-3 space-y-3'>
              <details className='rounded border border-white/10 p-3'>
                <summary className='cursor-pointer text-sm opacity-80'>Prompt</summary>
                <TokenDiff oldText={row.left?.prompt || ''} newText={row.right?.prompt || ''} mode={diffMode} compact className='mt-1'/>
                <MetricsInline oldText={row.left?.prompt || ''} newText={row.right?.prompt || ''} label='Prompt Δ'/>
                <div className='mt-2 flex gap-2'>
                  <CopyButton text={row.left?.prompt||''} label='Copy A'/>
                  <CopyButton text={row.right?.prompt||''} label='Copy B'/>
                </div>
              </details>
              <details className='rounded border border-white/10 p-3'>
                <summary className='cursor-pointer text-sm opacity-80'>Negative</summary>
                <TokenDiff oldText={row.left?.negative_prompt || ''} newText={row.right?.negative_prompt || ''} mode={diffMode} compact className='mt-1'/>
                <MetricsInline oldText={row.left?.negative_prompt || ''} newText={row.right?.negative_prompt || ''} label='Negative Δ'/>
                <div className='mt-2 flex gap-2'>
                  <CopyButton text={row.left?.negative_prompt||''} label='Copy A'/>
                  <CopyButton text={row.right?.negative_prompt||''} label='Copy B'/>
                </div>
              </details>
            </div>
          </details>
        ))}
      </div>
      {rows.length === 0 && <div className='text-center opacity-60 py-8'>No hay cambios o cargando...</div>}
    </main>
  );
}

