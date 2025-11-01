'use client';

import { useSearchParams } from 'next/navigation';
export default function Page(){
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  return (
    <main className='min-h-screen text-white'>
      <div className='max-w-3xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-4'>Buscar</h1>
        <p className='opacity-80'>Query: <b>{q}</b></p>
        <p className='text-sm opacity-70 mt-2'>Aquí puedes conectar tu índice real (Supabase/Algolia) cuando quieras.</p>
      </div>
    </main>
  );
}

