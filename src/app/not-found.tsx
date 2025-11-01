import JsonLd from '@/components/seo/JsonLd';
import { jsonldBreadcrumb } from '@/lib/seo/jsonld';
import { SITE } from '@/lib/seo/site';

export default function NotFound() {
  const trail = [
    { name: 'Home', url: SITE.url },
    { name: '404', url: SITE.url + '/404' }
  ];
  return (
    <main className='min-h-screen text-white grid place-items-center p-8 text-center'>
      <JsonLd data={jsonldBreadcrumb(trail)} />
      <div>
        <h1 className='text-4xl font-bold mb-3'>Página no encontrada</h1>
        <p className='opacity-80'>La URL pudo cambiar. Vuelve al inicio.</p>
        <a href='/' className='underline mt-4 inline-block'>Ir a Home</a>
      </div>
    </main>
  );
}

