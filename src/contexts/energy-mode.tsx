'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Mode = 'normal' | 'ahorro';

type Ctx = { mode: Mode; toggle: () => void; set: (m: Mode)=>void };

const EnergyModeContext = createContext<Ctx | null>(null);

const KEY = 'sn_energy_mode';

export function EnergyModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('normal');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Mode | null;
      if (saved === 'ahorro' || saved === 'normal') setMode(saved);
    } catch {}
  }, []);
  
  useEffect(() => {
    try { localStorage.setItem(KEY, mode); } catch {}
  }, [mode]);

  const value = useMemo<Ctx>(()=>({
    mode,
    toggle: ()=> setMode(m=> m==='normal' ? 'ahorro' : 'normal'),
    set: (m)=> setMode(m)
  }), [mode]);

  return <EnergyModeContext.Provider value={value}>{children}</EnergyModeContext.Provider>;
}

export function useEnergyMode() {
  const ctx = useContext(EnergyModeContext);
  if (!ctx) throw new Error('useEnergyMode must be used within EnergyModeProvider');
  return ctx;
}

