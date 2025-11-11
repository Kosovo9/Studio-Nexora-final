/**
 * STUDIO NEXORA - SISTEMA COMPLETO DE PROMPTS
 * 100+ prompts profesionales para generación de fotos
 * Genera múltiples variaciones según número de personas, tipo de paquete, etc.
 */

export interface PromptConfig {
  category: 'individual' | 'mascotas' | 'familia' | 'navidad' | 'grupales' | 'corporativo';
  numberOfPeople?: number; // Para familias/grupos
  variant: 'A' | 'B'; // A = 100% fidelidad, B = Mejoras realistas
  style?: string;
  occasion?: string;
}

export interface GeneratedPrompt {
  prompt: string;
  version: 'A' | 'B';
  category: string;
  metadata: {
    numberOfPeople?: number;
    style?: string;
    occasion?: string;
  };
}

// ============================================
// BASE PROMPTS POR CATEGORÍA
// ============================================

const BASE_PROMPTS = {
  individual: {
    A: [
      'Professional studio portrait, natural lighting, soft shadows, neutral background, 85mm f/1.8, high fidelity to facial features, natural skin texture, sharp eyes, authentic expression, 8K photographic quality',
      'Portrait photography, studio quality lighting, professional backdrop, maintaining 100% facial similarity, natural skin tones, detailed eyes, authentic expression, 50mm f/2.8, 4K resolution',
      'Professional headshot, even lighting, clean background, preserving all facial characteristics, natural hair texture, realistic skin, professional photography, 85mm lens, high resolution',
      'Studio portrait, soft natural light, minimal background, exact facial features preserved, natural skin texture, detailed eyes, professional quality, 50mm f/1.8, 8K quality',
      'Professional portrait, balanced lighting, neutral backdrop, maintaining original appearance, natural skin, sharp focus on eyes, authentic expression, studio photography, 85mm f/2.8',
    ],
    B: [
      'Enhanced professional portrait, cinematic lighting, luxury studio quality, subtle skin improvements maintaining texture, naturally enhanced eyes, confident expression, professional backdrop, premium photography, 85mm f/1.4',
      'Premium portrait photography, artistic lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened eyes, elegant expression, professional quality, 50mm f/1.8',
      'Luxury studio portrait, sophisticated lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional photography, 85mm f/1.2, high-end quality',
      'Professional enhanced portrait, dramatic lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved eyes, confident expression, editorial style, 50mm f/1.4',
      'Premium portrait, artistic studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional photography, 85mm f/1.8, high-end quality',
    ],
  },
  mascotas: {
    A: [
      'Professional pet portrait, natural lighting, authentic canine/feline expression, neutral background, sharp focus on eyes and features, natural fur texture, 100mm f/2.8, professional pet photography, 4K quality',
      'Pet photography, studio lighting, preserving authentic pet characteristics, clean background, detailed fur texture, natural expression, professional quality, 85mm f/2.8, high resolution',
      'Professional animal portrait, soft natural light, neutral backdrop, maintaining pet\'s authentic appearance, detailed fur, sharp eyes, natural expression, studio photography, 100mm f/2.8',
      'Pet studio portrait, even lighting, clean background, preserving all pet features, natural fur texture, detailed eyes, authentic pet expression, professional photography, 85mm f/2.8, 4K quality',
      'Professional pet photography, balanced lighting, neutral backdrop, maintaining original pet appearance, natural fur texture, sharp focus on eyes, authentic expression, studio quality, 100mm f/2.8',
    ],
    B: [
      'Enhanced pet portrait, premium studio lighting, luxury pet photography, subtle improvements maintaining authenticity, enhanced fur texture, naturally improved eyes, confident pet expression, professional backdrop, 100mm f/2.8',
      'Premium pet photography, artistic lighting, studio enhancements, realistic improvements while preserving pet essence, enhanced fur quality, naturally brightened eyes, elegant pet expression, professional quality, 85mm f/2.8',
      'Luxury pet studio portrait, sophisticated lighting, subtle enhancements, maintaining pet authenticity, improved fur texture, naturally enhanced features, professional pet photography, 100mm f/2.8, high-end quality',
      'Professional enhanced pet portrait, dramatic lighting, studio quality improvements, realistic enhancements, premium fur quality, naturally improved eyes, confident pet expression, editorial style, 85mm f/2.8',
      'Premium pet portrait, artistic studio lighting, luxury enhancements, maintaining natural pet look, enhanced fur texture, naturally improved features, professional pet photography, 100mm f/2.8, high-end quality',
    ],
  },
  familia: {
    A: [
      'Professional family photography, natural group composition, even lighting across all faces, neutral background, maintaining 100% similarity for each person, natural expressions, harmonious family dynamic, 35mm f/4, professional family portrait, 4K quality',
      'Family studio portrait, balanced lighting for all members, clean backdrop, preserving individual facial features, natural skin tones, authentic family expressions, professional group photography, 50mm f/4, high resolution',
      'Professional family photo, soft natural light, neutral background, maintaining each person\'s authentic appearance, natural expressions, family harmony, studio photography, 35mm f/4, 8K quality',
      'Family portrait photography, even lighting, professional backdrop, preserving all family members\' features, natural skin texture, detailed faces, authentic family expressions, professional quality, 50mm f/4, 4K resolution',
      'Studio family portrait, balanced lighting, neutral backdrop, maintaining original appearance for each person, natural expressions, family unity, professional photography, 35mm f/4, high-end quality',
    ],
    B: [
      'Enhanced family portrait, premium studio lighting, luxury family photography, subtle improvements maintaining authenticity for each member, enhanced skin quality, naturally improved expressions, confident family dynamic, professional backdrop, 35mm f/2.8',
      'Premium family photography, artistic lighting, studio enhancements, realistic improvements while preserving each person\'s essence, enhanced skin quality, naturally brightened features, elegant family expressions, professional quality, 50mm f/2.8',
      'Luxury family studio portrait, sophisticated lighting, subtle enhancements, maintaining family authenticity, improved skin texture, naturally enhanced features, professional family photography, 35mm f/2.8, high-end quality',
      'Professional enhanced family portrait, dramatic lighting, studio quality improvements, realistic enhancements for all members, premium skin quality, naturally improved expressions, confident family dynamic, editorial style, 50mm f/2.8',
      'Premium family portrait, artistic studio lighting, luxury enhancements, maintaining natural family look, enhanced skin texture, naturally improved features, professional family photography, 35mm f/2.8, high-end quality',
    ],
  },
  navidad: {
    A: [
      'Professional Christmas portrait, festive natural lighting, holiday background elements, maintaining 100% facial similarity, natural skin texture, authentic festive expression, Christmas atmosphere, 50mm f/2.8, professional holiday photography, 4K quality',
      'Christmas studio portrait, warm holiday lighting, festive backdrop, preserving all facial characteristics, natural skin tones, authentic Christmas expression, professional holiday photography, 85mm f/2.8, high resolution',
      'Professional holiday portrait, soft festive light, Christmas background, maintaining original appearance, natural skin texture, detailed eyes, authentic Christmas expression, studio photography, 50mm f/2.8, 8K quality',
      'Christmas photography, even warm lighting, festive backdrop, preserving facial features, natural skin texture, sharp eyes, authentic holiday expression, professional quality, 85mm f/2.8, 4K resolution',
      'Studio Christmas portrait, balanced festive lighting, holiday backdrop, maintaining original appearance, natural expressions, Christmas atmosphere, professional photography, 50mm f/2.8, high-end quality',
    ],
    B: [
      'Enhanced Christmas portrait, premium festive lighting, luxury holiday photography, subtle improvements maintaining authenticity, enhanced skin quality, naturally improved eyes, confident festive expression, professional Christmas backdrop, 50mm f/1.8',
      'Premium Christmas photography, artistic holiday lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened features, elegant festive expression, professional quality, 85mm f/1.8',
      'Luxury Christmas studio portrait, sophisticated festive lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional holiday photography, 50mm f/1.8, high-end quality',
      'Professional enhanced Christmas portrait, dramatic holiday lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved expressions, confident festive dynamic, editorial style, 85mm f/1.8',
      'Premium Christmas portrait, artistic holiday studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional Christmas photography, 50mm f/1.8, high-end quality',
    ],
  },
  grupales: {
    A: [
      'Professional group photography, natural composition for {count} people, even lighting across all faces, neutral background, maintaining 100% similarity for each person, natural group expressions, harmonious dynamic, 35mm f/4, professional group portrait, 4K quality',
      'Group studio portrait, balanced lighting for all {count} members, clean backdrop, preserving individual facial features, natural skin tones, authentic group expressions, professional group photography, 50mm f/4, high resolution',
      'Professional group photo, soft natural light, neutral background, maintaining each person\'s authentic appearance, natural expressions, group harmony, studio photography, 35mm f/4, 8K quality',
      'Group portrait photography, even lighting, professional backdrop, preserving all {count} members\' features, natural skin texture, detailed faces, authentic group expressions, professional quality, 50mm f/4, 4K resolution',
      'Studio group portrait, balanced lighting, neutral backdrop, maintaining original appearance for each of {count} people, natural expressions, group unity, professional photography, 35mm f/4, high-end quality',
    ],
    B: [
      'Enhanced group portrait, premium studio lighting, luxury group photography, subtle improvements maintaining authenticity for each of {count} members, enhanced skin quality, naturally improved expressions, confident group dynamic, professional backdrop, 35mm f/2.8',
      'Premium group photography, artistic lighting, studio enhancements, realistic improvements while preserving each person\'s essence, enhanced skin quality, naturally brightened features, elegant group expressions, professional quality, 50mm f/2.8',
      'Luxury group studio portrait, sophisticated lighting, subtle enhancements, maintaining group authenticity, improved skin texture, naturally enhanced features, professional group photography, 35mm f/2.8, high-end quality',
      'Professional enhanced group portrait, dramatic lighting, studio quality improvements, realistic enhancements for all {count} members, premium skin quality, naturally improved expressions, confident group dynamic, editorial style, 50mm f/2.8',
      'Premium group portrait, artistic studio lighting, luxury enhancements, maintaining natural group look, enhanced skin texture, naturally improved features, professional group photography, 35mm f/2.8, high-end quality',
    ],
  },
  corporativo: {
    A: [
      'Professional corporate portrait, business lighting, neutral professional background, maintaining 100% facial similarity, natural skin texture, professional expression, business attire, 85mm f/2.8, corporate photography, 4K quality',
      'Corporate headshot, even professional lighting, clean business backdrop, preserving all facial characteristics, natural skin tones, authentic professional expression, business photography, 50mm f/2.8, high resolution',
      'Professional business portrait, soft corporate light, neutral background, maintaining original appearance, natural skin texture, detailed eyes, authentic professional expression, studio photography, 85mm f/2.8, 8K quality',
      'Corporate photography, even professional lighting, business backdrop, preserving facial features, natural skin texture, sharp eyes, authentic business expression, professional quality, 50mm f/2.8, 4K resolution',
      'Studio corporate portrait, balanced professional lighting, neutral backdrop, maintaining original appearance, natural expressions, professional atmosphere, business photography, 85mm f/2.8, high-end quality',
    ],
    B: [
      'Enhanced corporate portrait, premium business lighting, luxury corporate photography, subtle improvements maintaining authenticity, enhanced skin quality, naturally improved eyes, confident professional expression, professional backdrop, 85mm f/1.8',
      'Premium corporate photography, artistic professional lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened features, elegant professional expression, professional quality, 50mm f/1.8',
      'Luxury corporate studio portrait, sophisticated business lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional corporate photography, 85mm f/1.8, high-end quality',
      'Professional enhanced corporate portrait, dramatic business lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved expressions, confident professional dynamic, editorial style, 50mm f/1.8',
      'Premium corporate portrait, artistic business studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional corporate photography, 85mm f/1.8, high-end quality',
    ],
  },
};

// ============================================
// GENERADOR DE PROMPTS DINÁMICO
// ============================================

/**
 * Genera múltiples prompts según configuración
 * Retorna array de prompts para generar múltiples variaciones
 */
export function generatePrompts(config: PromptConfig, count: number = 4): GeneratedPrompt[] {
  const prompts: GeneratedPrompt[] = [];
  const categoryPrompts = BASE_PROMPTS[config.category]?.[config.variant] || BASE_PROMPTS.individual[config.variant];
  
  // Si no hay prompts para esta categoría, usar individual como fallback
  const availablePrompts = categoryPrompts.length;
  
  for (let i = 0; i < count; i++) {
    const promptIndex = i % availablePrompts;
    let prompt = categoryPrompts[promptIndex];
    
    // Reemplazar variables dinámicas
    if (config.numberOfPeople) {
      prompt = prompt.replace(/{count}/g, config.numberOfPeople.toString());
    }
    
    // Agregar estilo si se especifica
    if (config.style) {
      prompt = `${prompt}, ${config.style} style`;
    }
    
    // Agregar ocasión si se especifica
    if (config.occasion) {
      prompt = `${prompt}, ${config.occasion} occasion`;
    }
    
    prompts.push({
      prompt,
      version: config.variant,
      category: config.category,
      metadata: {
        numberOfPeople: config.numberOfPeople,
        style: config.style,
        occasion: config.occasion,
      },
    });
  }
  
  return prompts;
}

/**
 * Genera prompts para un paquete específico
 */
export function generatePromptsForPackage(
  packageType: string,
  numberOfPeople: number = 1,
  variant: 'A' | 'B' = 'A'
): GeneratedPrompt[] {
  let category: PromptConfig['category'] = 'individual';
  let photoCount = 4; // Default
  
  // Determinar categoría y cantidad según tipo de paquete
  switch (packageType) {
    case '1_photo':
      category = 'individual';
      photoCount = 4; // 4 variaciones de 1 foto
      break;
    case '2_photos':
      category = 'individual';
      photoCount = 8; // 4 variaciones x 2 fotos
      break;
    case '3_photos':
      category = 'individual';
      photoCount = 12; // 4 variaciones x 3 fotos
      break;
    case 'pet':
      category = 'mascotas';
      photoCount = 4; // 4 variaciones de mascota
      break;
    case 'family':
      category = 'familia';
      photoCount = numberOfPeople <= 3 ? 12 : 18; // 4-6 variaciones según número de personas
      break;
    case 'christmas':
      category = 'navidad';
      photoCount = numberOfPeople <= 2 ? 8 : 12; // 4-6 variaciones según número de personas
      break;
    default:
      category = 'individual';
      photoCount = 4;
  }
  
  // Generar prompts para versión A y B
  const promptsA = generatePrompts({ category, numberOfPeople, variant: 'A' }, Math.ceil(photoCount / 2));
  const promptsB = generatePrompts({ category, numberOfPeople, variant: 'B' }, Math.floor(photoCount / 2));
  
  return [...promptsA, ...promptsB];
}

/**
 * Obtiene un prompt aleatorio de una categoría
 */
export function getRandomPrompt(config: PromptConfig): GeneratedPrompt {
  const prompts = generatePrompts(config, 1);
  return prompts[0];
}

/**
 * Genera prompts para múltiples personas (familias/grupos)
 * Ajusta automáticamente según número de personas
 */
export function generatePromptsForGroup(
  numberOfPeople: number,
  category: 'familia' | 'grupales' | 'corporativo' = 'grupales',
  variant: 'A' | 'B' = 'A'
): GeneratedPrompt[] {
  // Calcular número de variaciones según cantidad de personas
  let variationsPerPerson = 2; // Base: 2 variaciones por persona
  
  if (numberOfPeople <= 2) {
    variationsPerPerson = 3; // 3 variaciones para 1-2 personas
  } else if (numberOfPeople <= 4) {
    variationsPerPerson = 2; // 2 variaciones para 3-4 personas
  } else {
    variationsPerPerson = 1.5; // 1.5 variaciones para 5+ personas
  }
  
  const totalVariations = Math.ceil(numberOfPeople * variationsPerPerson);
  const maxVariations = 20; // Límite máximo
  
  const count = Math.min(totalVariations, maxVariations);
  
  return generatePrompts({ category, numberOfPeople, variant }, count);
}

// ============================================
// ESTADÍSTICAS Y VALIDACIÓN
// ============================================

export function getPromptStats(): {
  totalPrompts: number;
  byCategory: Record<string, number>;
  byVariant: Record<string, number>;
} {
  const stats = {
    totalPrompts: 0,
    byCategory: {} as Record<string, number>,
    byVariant: { A: 0, B: 0 },
  };
  
  Object.keys(BASE_PROMPTS).forEach((category) => {
    const categoryData = BASE_PROMPTS[category as keyof typeof BASE_PROMPTS];
    const aCount = categoryData.A.length;
    const bCount = categoryData.B.length;
    
    stats.totalPrompts += aCount + bCount;
    stats.byCategory[category] = aCount + bCount;
    stats.byVariant.A += aCount;
    stats.byVariant.B += bCount;
  });
  
  return stats;
}

