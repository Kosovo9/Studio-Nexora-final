'use client';
import { diffWords, diffChars, diffSentences, Change } from 'diff';
import { useMemo } from 'react';

type Mode = 'word'|'char'|'sentence';
type Props = {
  oldText: string;
  newText: string;
  mode?: Mode;
  className?: string;
  compact?: boolean;       // si true, colapsa largos segmentos iguales
  maxKeep?: number;        // tokens contiguos sin cambio a mantener (por bloque)
};

function compute(oldText: string, newText: string, mode: Mode): Change[] {
  if (mode === 'char') return diffChars(oldText ?? '', newText ?? '');
  if (mode === 'sentence') return diffSentences(oldText ?? '', newText ?? '');
  return diffWords(oldText ?? '', newText ?? '');
}

export default function TokenDiff({
  oldText, newText, mode = 'word', className = '',
  compact = false, maxKeep = 120
}: Props) {
  const parts = useMemo(()=> compute(oldText||'', newText||'', mode), [oldText, newText, mode]);

  // compactar bloques largos sin cambios con "…"
  const compacted: Change[] = useMemo(()=>{
    if (!compact) return parts;
    const out: Change[] = [];
    for (const p of parts) {
      if (!p.added && !p.removed && (p.value?.length || 0) > maxKeep) {
        out.push({ value: p.value.slice(0, Math.floor(maxKeep/2)) });
        out.push({ value: ' … ', added: false, removed: false, count: 1 } as any);
        out.push({ value: p.value.slice(-Math.floor(maxKeep/2)) });
      } else {
        out.push(p);
      }
    }
    return out;
  }, [parts, compact, maxKeep]);

  return (
    <div className={`leading-relaxed text-sm whitespace-pre-wrap ${className}`}>
      {compacted.map((p, i) => {
        const base = 'px-0.5 py-0.5 rounded-sm';
        if (p.added) {
          return <span key={i} className={`bg-emerald-500/20 border border-emerald-500/40 ${base}`}>{p.value}</span>;
        }
        if (p.removed) {
          return <span key={i} className={`bg-rose-500/20 border border-rose-500/40 line-through ${base}`}>{p.value}</span>;
        }
        return <span key={i}>{p.value}</span>;
      })}
    </div>
  );
}

