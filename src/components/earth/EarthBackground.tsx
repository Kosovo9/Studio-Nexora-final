'use client';

import dynamic from 'next/dynamic';

const EarthCanvas = dynamic(() => import('./EarthCanvas'), { ssr: false });

export default function EarthBackground() {
  return <EarthCanvas asBackground />;
}

