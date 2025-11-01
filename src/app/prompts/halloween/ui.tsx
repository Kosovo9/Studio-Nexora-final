'use client';

import { useMemo, useState } from 'react';

type Variant = {
  subject: 'hombre'|'mujer'|'perrito'|'perrita'|'ninio'|'ninia';
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  cfg_scale: number;
  seed: number;
  sampler: string;
  steps: number;
};

type Item = {
  id: string;
  location: string;
  theme: string;
  variants: Variant[];
};

type Pack = { pack: string; items: Item[] };

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

export default function Client({ data }: { data: Pack }) {
  const [subject, setSubject] = useState<'hombre'|'mujer'|'perrito'|'perrita'|'ninio'|'ninia'|'all'>('all');
  const [q, setQ] = useState('');
  const [theme, setTheme] = useState<'all'|string>('all');

  const themes = useMemo(() => Array.from(new Set(data.items.map(i=>i.theme))), [data]);
  const filtered = useMemo(()=>{
    return data.items.filter(i=>{
      const matchQ = q ? (i.location.toLowerCase().includes(q.toLowerCase())) : true;
      const matchT = theme==='all' ? true : i.theme===theme;
      return matchQ && matchT;
    }).map(i=>{
      const vs = subject==='all' ? i.variants : i.variants.filter(v=>v.subject===subject);
      return { ...i, variants: vs };
    }).filter(i=>i.variants.length>0);
  },[data, q, theme, subject]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Studio Nexora — Halloween & Día de Muertos</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={subject} onChange={e=>setSubject(e.target.value as any)} className="border px-2 py-1 rounded">
          <option value="all">All subjects</option>
          <option value="hombre">hombre</option>
          <option value="mujer">mujer</option>
          <option value="perrito">perrito</option>
          <option value="perrita">perrita</option>
          <option value="ninio">ninio</option>
          <option value="ninia">ninia</option>
        </select>
        <select value={theme} onChange={e=>setTheme(e.target.value)} className="border px-2 py-1 rounded">
          <option value="all">All themes</option>
          {themes.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search location…"
          className="border px-2 py-1 rounded min-w-[240px]"
        />
      </div>

      <ul className="space-y-4">
        {filtered.map(i=>(
          <li key={i.id} className="border rounded p-3">
            <div className="text-sm opacity-70">{i.location} • {i.theme}</div>
            <div className="text-lg font-medium">{i.id}</div>

            <div className="grid gap-3 mt-2">
              {i.variants.map((v,idx)=>(
                <div key={idx} className="border rounded p-3 bg-white/50">
                  <div className="font-semibold mb-1">Subject: {v.subject}</div>
                  <details className="mb-2">
                    <summary className="cursor-pointer">Prompt preview</summary>
                    <pre className="whitespace-pre-wrap text-sm mt-1">{v.prompt}</pre>
                    <pre className="whitespace-pre-wrap text-xs opacity-70 mt-1">NEG: {v.negative_prompt}</pre>
                  </details>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="border px-2 py-1 rounded"
                      onClick={()=>copy(`${v.prompt}\nNEG: ${v.negative_prompt}`)}
                    >Copy Base</button>
                    <button
                      className="border px-2 py-1 rounded"
                      onClick={()=>copy(JSON.stringify({input_text:v.prompt, negative_text:v.negative_prompt, width:v.width, height:v.height}, null, 2))}
                    >Copy Google</button>
                    <button
                      className="border px-2 py-1 rounded"
                      onClick={()=>copy(`[${i.id}-${v.subject}] ${v.prompt}\nNEG: ${v.negative_prompt}`)}
                    >Copy Grok</button>
                    <button
                      className="border px-2 py-1 rounded"
                      onClick={()=>copy(`${v.prompt}\nNEG: ${v.negative_prompt}`)}
                    >Copy PixVerse</button>
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

