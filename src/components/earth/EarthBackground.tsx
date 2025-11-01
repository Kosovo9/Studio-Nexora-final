'use client';

import dynamic from 'next/dynamic';
import NexoraGradient from '@/components/visual/NexoraGradient';
import { useEnergyMode } from '@/contexts/energy-mode';

const EarthCanvas = dynamic(() => import('./EarthCanvas'), { ssr: false });

export default function EarthBackground() {
  const { mode } = useEnergyMode();
  const ahorro = mode === 'ahorro';
  
  return (
    <div className='fixed inset-0 -z-10'>
      <EarthCanvas asBackground pauseOnBlur respectReducedMotion forceStatic={ahorro} />
      <NexoraGradient />
    </div>
  );
}
