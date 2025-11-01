import { diffWords, diffChars } from 'diff';

export type DiffStats = {
  tokensAdded: number; tokensRemoved: number;
  charsAdded: number; charsRemoved: number;
  oldTokens: number; newTokens: number;
  oldChars: number; newChars: number;
  pctTokens: number;
};

const wc = (s: string) => (s||'').trim().split(/\s+/).filter(Boolean).length;
const cc = (s: string) => (s||'').length;

export function computeDiffStatsServer(oldText: string, newText: string): DiffStats {
  const w = diffWords(oldText||'', newText||'');
  const c = diffChars(oldText||'', newText||'');
  let tokensAdded=0, tokensRemoved=0, charsAdded=0, charsRemoved=0;
  w.forEach(p=>{ if(p.added) tokensAdded += wc(p.value||''); else if(p.removed) tokensRemoved += wc(p.value||''); });
  c.forEach(p=>{ if(p.added) charsAdded += cc(p.value||''); else if(p.removed) charsRemoved += cc(p.value||''); });
  const oldTokens = wc(oldText||''); const newTokens = wc(newText||'');
  const oldChars  = cc(oldText||''); const newChars  = cc(newText||'');
  const pctTokens = oldTokens>0 ? ((newTokens-oldTokens)/oldTokens)*100 : (newTokens>0?100:0);
  return { tokensAdded, tokensRemoved, charsAdded, charsRemoved, oldTokens, newTokens, oldChars, newChars, pctTokens };
}

