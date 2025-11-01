'use client';
import { computeDiffStats } from './diffMetrics';

export default function TotalsBar({ rows }:{ rows: any[] }){
  // Suma métricas solo de cambiados
  let add=0, rem=0, oldT=0, newT=0;
  rows.forEach(r=>{
    const pm = computeDiffStats(r.left?.prompt||'', r.right?.prompt||'');
    const nm = computeDiffStats(r.left?.negative_prompt||'', r.right?.negative_prompt||'');
    add += pm.tokensAdded + nm.tokensAdded;
    rem += pm.tokensRemoved + nm.tokensRemoved;
    oldT+= pm.oldTokens + nm.oldTokens;
    newT+= pm.newTokens + nm.newTokens;
  });
  const net = newT - oldT;
  const pct = oldT>0 ? ((newT-oldT)/oldT)*100 : (newT>0?100:0);
  return (
    <div className='mt-2 rounded-xl border border-white/15 bg-black/40 p-3 text-xs flex flex-wrap gap-2'>
      <div className='font-semibold mr-2'>Resumen diffs:</div>
      <span className='px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30'>+{add} tok</span>
      <span className='px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30'>-{rem} tok</span>
      <span className='px-2 py-0.5 rounded bg-white/10 border border-white/20'>{oldT}→{newT} ({net>=0?'+':''}{net})</span>
      <span className='px-2 py-0.5 rounded bg-white/5 border border-white/15'>Δ {pct.toFixed(1)}%</span>
    </div>
  );
}

