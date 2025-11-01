'use client';
import { diffWords, diffChars } from 'diff';

export type DiffStats = {
  tokensAdded: number; tokensRemoved: number;
  charsAdded: number; charsRemoved: number;
  oldTokens: number; newTokens: number;
  oldChars: number; newChars: number;
  pctTokens: number; // Δ% vs old
};

function wc(s: string){ return (s||'').trim().split(/\s+/).filter(Boolean).length; }
function cc(s: string){ return (s||'').length; }

export function computeDiffStats(oldText: string, newText: string): DiffStats {
  const w = diffWords(oldText||'', newText||'');
  const c = diffChars(oldText||'', newText||'');

  let tokensAdded=0, tokensRemoved=0;
  w.forEach(p=>{
    if (p.added) tokensAdded += wc(p.value||'');
    else if (p.removed) tokensRemoved += wc(p.value||'');
  });

  let charsAdded=0, charsRemoved=0;
  c.forEach(p=>{
    if (p.added) charsAdded += cc(p.value||'');
    else if (p.removed) charsRemoved += cc(p.value||'');
  });

  const oldTokens = wc(oldText||'');
  const newTokens = wc(newText||'');
  const oldChars  = cc(oldText||'');
  const newChars  = cc(newText||'');

  const pctTokens = oldTokens>0 ? ((newTokens-oldTokens)/oldTokens)*100 : (newTokens>0?100:0);

  return { tokensAdded, tokensRemoved, charsAdded, charsRemoved, oldTokens, newTokens, oldChars, newChars, pctTokens };
}

