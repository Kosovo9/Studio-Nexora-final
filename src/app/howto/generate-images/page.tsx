'use client';

import JsonLd from '@/components/seo/JsonLd';
import { jsonldHowTo, jsonldBreadcrumb } from '@/lib/seo/jsonld';
import { SITE } from '@/lib/seo/site';

export default function Page(){
  const howto = jsonldHowTo('Generar imágenes hiperrealistas con Studio Nexora', [
    'Abre /prompts/halloween y filtra por sujeto, tema y ubicación.',
    'Copia el prompt para tu plataforma (Google, Grok, PixVerse, Wan2).',
    'Abre tu generador y pega el prompt con su NEG.',
    'Ajusta medidas (width/height) y lotes según tu GPU/plan.',
    'Genera, evalúa y reitera con variantes ligeras.',
    'Exporta y agrega metadatos/UTM si aplica.'
  ]);

  const crumbs = jsonldBreadcrumb([
    { name:'Home', url: SITE.url },
    { name:'HowTo', url: SITE.url + '/howto' },
    { name:'Generate Images', url: SITE.url + '/howto/generate-images' }
  ]);

  return (
    <main className='min-h-screen text-white'>
      <JsonLd data={howto}/>
      <JsonLd data={crumbs}/>
      <div className='max-w-3xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-4'>HowTo: Generar imágenes hiperrealistas</h1>
        <ol className='list-decimal pl-6 space-y-2 opacity-90'>
          <li>Abre <a className='underline' href='/prompts/halloween'>/prompts/halloween</a> y filtra.</li>
          <li>Copia el prompt para tu plataforma.</li>
          <li>Pega el prompt en tu generador (NEG incluido).</li>
          <li>Ajusta resolución y parámetros.</li>
          <li>Genera y compara resultados.</li>
          <li>Exporta con metadatos.</li>
        </ol>
      </div>
    </main>
  );
}

