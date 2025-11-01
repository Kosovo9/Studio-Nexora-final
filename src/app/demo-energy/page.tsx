'use client';

import dynamic from 'next/dynamic';
import { EnergyModeProvider } from '@/contexts/energy-mode';
import Navbar from '@/components/nav/Navbar';

const EarthBackground = dynamic(()=> import('@/components/earth/EarthBackground'), { ssr: false });

export default function Page() {
  return (
    <EnergyModeProvider>
      <div className='relative min-h-screen text-white'>
        <div className='fixed inset-0 -z-10'>
          <EarthBackground />
        </div>
        <Navbar />
        <main className='pt-16 max-w-4xl mx-auto px-6'>
          <h1 className='text-3xl font-bold drop-shadow'>Demo: Energy Toggle</h1>
          <p className='mt-3 text-white/80'>Alterna entre <b>Normal</b> y <b>Ahorro</b> desde el Navbar (preferencia guardada).</p>
        </main>
      </div>
    </EnergyModeProvider>
  );
}

