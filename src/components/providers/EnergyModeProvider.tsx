'use client';

import { EnergyModeProvider as Provider } from '@/contexts/energy-mode';

export default function EnergyModeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}

