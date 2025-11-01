'use client';

type Fam = {
  id: string;
  location: string;
  concept: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  cfg_scale: number;
  seed: number;
  sampler: string;
  steps: number;
};

function copy(t: string) {
  navigator.clipboard.writeText(t);
}

export default function Client({ items }: { items: Fam[] }) {
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-semibold mb-4'>Studio Nexora — Familias/Grupos</h1>
      <ul className='space-y-4'>
        {items.map(it => (
          <li key={it.id} className='border rounded p-3'>
            <div className='text-sm opacity-70'>{it.location} • {it.concept}</div>
            <div className='text-lg font-medium mb-2'>{it.id}</div>
            <details className='mb-2'>
              <summary className='cursor-pointer'>Prompt preview</summary>
              <pre className='whitespace-pre-wrap text-sm mt-1'>{it.prompt}</pre>
              <pre className='whitespace-pre-wrap text-xs opacity-70 mt-1'>NEG: {it.negative_prompt}</pre>
            </details>
            <div className='flex flex-wrap gap-2'>
              <button
                className='border px-2 py-1 rounded'
                onClick={() => copy(`${it.prompt}\nNEG: ${it.negative_prompt}`)}
              >
                Copy Base
              </button>
              <button
                className='border px-2 py-1 rounded'
                onClick={() => copy(JSON.stringify({
                  input_text: it.prompt,
                  negative_text: it.negative_prompt,
                  width: it.width,
                  height: it.height
                }, null, 2))}
              >
                Copy Google
              </button>
              <button
                className='border px-2 py-1 rounded'
                onClick={() => copy(`[${it.id}] ${it.prompt}\nNEG: ${it.negative_prompt}`)}
              >
                Copy Grok
              </button>
              <button
                className='border px-2 py-1 rounded'
                onClick={() => copy(`${it.prompt}\nNEG: ${it.negative_prompt}`)}
              >
                Copy PixVerse
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

