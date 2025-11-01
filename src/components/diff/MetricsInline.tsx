'use client';
import { computeDiffStats } from './diffMetrics';

export default function MetricsInline({ oldText, newText, label='Δ tokens' }:{
  oldText: string; newText: string; label?: string;
}){
  const m = computeDiffStats(oldText||'', newText||'');
  const net = m.newTokens - m.oldTokens;
  const sign = net>0? '+' : (net<0? '' : '±');
  return (
    <div className='mt-1 text-[11px] opacity-80'>
      <span className='mr-2 font-semibold'>{label}:</span>
      <span className='px-1 rounded bg-emerald-500/15 border border-emerald-500/30 mr-1'>+{m.tokensAdded} tok</span>
      <span className='px-1 rounded bg-rose-500/15 border border-rose-500/30 mr-1'>-{m.tokensRemoved} tok</span>
      <span className='px-1 rounded bg-white/10 border border-white/20 mr-1'>{m.oldTokens}→{m.newTokens} ({sign}{net})</span>
      <span className='px-1 rounded bg-white/5 border border-white/15 mr-1'>Δ {m.pctTokens.toFixed(1)}%</span>
      <span className='px-1 rounded bg-white/5 border border-white/15'>chars {m.oldChars}→{m.newChars}</span>
    </div>
  );
}

