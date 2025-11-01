'use client';

import Link from 'next/link';
import { useEnergyMode } from '@/contexts/energy-mode';

export default function Navbar() {
  const { mode, toggle } = useEnergyMode();
  const isAhorro = mode === 'ahorro';
  
  return (
    <nav className='fixed top-0 inset-x-0 z-50 backdrop-blur bg-black/30 text-white border-b border-white/10'>
      <div className='max-w-6xl mx-auto px-4 h-14 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/' className='font-semibold tracking-wide'>Studio Nexora</Link>
          <Link href='/earth' className='opacity-80 hover:opacity-100'>Earth</Link>
          <Link href='/prompts/halloween' className='opacity-80 hover:opacity-100'>Prompts</Link>
          <Link href='/prompts/halloween/families' className='opacity-80 hover:opacity-100'>Familias</Link>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs uppercase tracking-wider opacity-80'>Energía: {isAhorro ? 'Ahorro' : 'Normal'}</span>
          <button
            onClick={toggle}
            className='select-none rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10'
            aria-label='Toggle energy mode'
            title='Alternar modo de energía'
          >
            {isAhorro ? 'Usar Normal' : 'Usar Ahorro'}
          </button>
        </div>
      </div>
    </nav>
  );
}

