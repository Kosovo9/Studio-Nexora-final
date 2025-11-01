'use client';

const MAP: Record<string, string> = {
  prompt: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200',
  negative_prompt: 'bg-rose-500/15 border-rose-400/30 text-rose-200',
  title: 'bg-amber-500/15 border-amber-400/30 text-amber-200',
  theme: 'bg-sky-500/15 border-sky-400/30 text-sky-200',
  location: 'bg-violet-500/15 border-violet-400/30 text-violet-200',
  subject: 'bg-blue-500/15 border-blue-400/30 text-blue-200',
  cover_key: 'bg-slate-500/15 border-slate-400/30 text-slate-200',
};

export default function Chips({ fields }:{ fields: string[] }){
  if (!fields?.length) return <span className='ml-2 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'>Sin cambios</span>;
  return (
    <span className='inline-flex flex-wrap gap-1 ml-2'>
      {fields.map((f,i)=>(
        <span key={i} className={`px-2 py-0.5 rounded-full border text-xs ${MAP[f]||'bg-yellow-500/15 border-yellow-400/30 text-yellow-100'}`}>{f}</span>
      ))}
    </span>
  );
}

