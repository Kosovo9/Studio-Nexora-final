import portraitsData from './portraits.json';
import citiesData from './cities.json';
import seasonalData from './seasonal.json';
import scenariosData from './scenarios.json';

export interface PromptData {
  id: string;
  category: string;
  name: string;
  base_prompt: string;
  enhancement_prompt: string;
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  seasonal?: boolean;
  available_months?: number[];
  isPopular?: boolean;
}

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompts: PromptData[];
}

const allPrompts: PromptData[] = [
  ...portraitsData,
  ...citiesData,
  ...seasonalData,
  ...scenariosData
];

export const categories: PromptCategory[] = [
  {
    id: 'studio',
    name: 'Estudios Fotográficos',
    description: 'Retratos profesionales en estudio con iluminación perfecta',
    icon: 'Camera',
    prompts: allPrompts.filter(p => p.category === 'studio')
  },
  {
    id: 'city',
    name: 'Ciudades Icónicas',
    description: 'Las mejores locaciones urbanas del mundo',
    icon: 'Building',
    prompts: allPrompts.filter(p => p.category === 'city')
  },
  {
    id: 'nature',
    name: 'Escenarios Naturales',
    description: 'Paisajes naturales impresionantes',
    icon: 'Trees',
    prompts: allPrompts.filter(p => p.category === 'nature')
  },
  {
    id: 'interior',
    name: 'Interiores',
    description: 'Espacios interiores elegantes y acogedores',
    icon: 'Home',
    prompts: allPrompts.filter(p => p.category === 'interior')
  },
  {
    id: 'seasonal',
    name: 'Temáticas Especiales',
    description: 'Eventos y celebraciones especiales',
    icon: 'Calendar',
    prompts: allPrompts.filter(p => p.category === 'seasonal')
  },
  {
    id: 'luxury',
    name: 'Lujo Premium',
    description: 'Locaciones de lujo exclusivas',
    icon: 'Crown',
    prompts: allPrompts.filter(p => p.category === 'luxury')
  },
  {
    id: 'urban',
    name: 'Urbano Moderno',
    description: 'Estilo de vida urbano contemporáneo',
    icon: 'Building2',
    prompts: allPrompts.filter(p => p.category === 'urban')
  },
  {
    id: 'professional',
    name: 'Profesional',
    description: 'Retratos corporativos y ejecutivos',
    icon: 'Briefcase',
    prompts: allPrompts.filter(p => p.category === 'professional')
  }
];

export const getPromptById = (id: string): PromptData | undefined => {
  return allPrompts.find(p => p.id === id);
};

export const getPromptsByCategory = (category: string): PromptData[] => {
  return allPrompts.filter(p => p.category === category);
};

export const getSeasonalPrompts = (month: number): PromptData[] => {
  return allPrompts.filter(p =>
    p.seasonal &&
    p.available_months &&
    p.available_months.includes(month)
  );
};

export const getChristmasPrompts = (): PromptData[] => {
  const currentMonth = new Date().getMonth() + 1;
  return seasonalData.filter(p =>
    p.id.startsWith('christmas_') &&
    p.available_months?.includes(currentMonth)
  );
};

export const searchPrompts = (query: string): PromptData[] => {
  const lowerQuery = query.toLowerCase();
  return allPrompts.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export { allPrompts };
export default allPrompts;
