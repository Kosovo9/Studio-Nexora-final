/**
 * STUDIO NEXORA - SISTEMA DE PROMPTS POR CATEGORÍA
 * Categorías: mujer, hombre, pareja, niño, niña, mascotas (perro/gato), familia, grupo/equipo
 */

export type PhotoCategory = 
  | 'mujer' 
  | 'hombre' 
  | 'pareja' 
  | 'nino' 
  | 'nina' 
  | 'mascota_perro' 
  | 'mascota_gato' 
  | 'familia' 
  | 'grupo' 
  | 'equipo';

export interface CategoryPromptConfig {
  category: PhotoCategory;
  variant: 'A' | 'B'; // A = 100% fidelidad, B = Mejoras realistas
  style?: string;
  occasion?: string;
  numberOfPeople?: number;
  customPrompt?: string; // Para prompts personalizados del usuario
}

export interface CategoryGeneratedPrompt {
  prompt: string;
  version: 'A' | 'B';
  category: PhotoCategory;
  metadata: {
    numberOfPeople?: number;
    style?: string;
    occasion?: string;
    isCustom?: boolean;
  };
}

// ============================================
// PROMPTS BASE POR CATEGORÍA
// ============================================

const CATEGORY_PROMPTS: Record<PhotoCategory, { A: string[]; B: string[] }> = {
  mujer: {
    A: [
      'Professional female portrait, natural lighting, soft shadows, neutral background, 85mm f/1.8, high fidelity to facial features, natural skin texture, sharp eyes, authentic feminine expression, 8K photographic quality',
      'Female studio portrait, studio quality lighting, professional backdrop, maintaining 100% facial similarity, natural skin tones, detailed eyes, authentic expression, 50mm f/2.8, 4K resolution',
      'Professional female headshot, even lighting, clean background, preserving all facial characteristics, natural hair texture, realistic skin, professional photography, 85mm lens, high resolution',
      'Female studio portrait, soft natural light, minimal background, exact facial features preserved, natural skin texture, detailed eyes, professional quality, 50mm f/1.8, 8K quality',
      'Professional female portrait, balanced lighting, neutral backdrop, maintaining original appearance, natural skin, sharp focus on eyes, authentic expression, studio photography, 85mm f/2.8',
    ],
    B: [
      'Enhanced professional female portrait, cinematic lighting, luxury studio quality, subtle skin improvements maintaining texture, naturally enhanced eyes, confident feminine expression, professional backdrop, premium photography, 85mm f/1.4',
      'Premium female portrait photography, artistic lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened eyes, elegant expression, professional quality, 50mm f/1.8',
      'Luxury female studio portrait, sophisticated lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional photography, 85mm f/1.2, high-end quality',
      'Professional enhanced female portrait, dramatic lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved eyes, confident expression, editorial style, 50mm f/1.4',
      'Premium female portrait, artistic studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional photography, 85mm f/1.8, high-end quality',
    ],
  },
  hombre: {
    A: [
      'Professional male portrait, natural lighting, soft shadows, neutral background, 85mm f/1.8, high fidelity to facial features, natural skin texture, sharp eyes, authentic masculine expression, 8K photographic quality',
      'Male studio portrait, studio quality lighting, professional backdrop, maintaining 100% facial similarity, natural skin tones, detailed eyes, authentic expression, 50mm f/2.8, 4K resolution',
      'Professional male headshot, even lighting, clean background, preserving all facial characteristics, natural hair texture, realistic skin, professional photography, 85mm lens, high resolution',
      'Male studio portrait, soft natural light, minimal background, exact facial features preserved, natural skin texture, detailed eyes, professional quality, 50mm f/1.8, 8K quality',
      'Professional male portrait, balanced lighting, neutral backdrop, maintaining original appearance, natural skin, sharp focus on eyes, authentic expression, studio photography, 85mm f/2.8',
    ],
    B: [
      'Enhanced professional male portrait, cinematic lighting, luxury studio quality, subtle skin improvements maintaining texture, naturally enhanced eyes, confident masculine expression, professional backdrop, premium photography, 85mm f/1.4',
      'Premium male portrait photography, artistic lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened eyes, elegant expression, professional quality, 50mm f/1.8',
      'Luxury male studio portrait, sophisticated lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional photography, 85mm f/1.2, high-end quality',
      'Professional enhanced male portrait, dramatic lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved eyes, confident expression, editorial style, 50mm f/1.4',
      'Premium male portrait, artistic studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional photography, 85mm f/1.8, high-end quality',
    ],
  },
  pareja: {
    A: [
      'Professional couple portrait, natural lighting, soft shadows, neutral background, 85mm f/2.8, high fidelity to both faces, natural skin texture, sharp eyes, authentic couple expression, harmonious composition, 8K photographic quality',
      'Couple studio portrait, studio quality lighting, professional backdrop, maintaining 100% facial similarity for both, natural skin tones, detailed eyes, authentic couple dynamic, 50mm f/2.8, 4K resolution',
      'Professional couple photography, even lighting, clean background, preserving all facial characteristics of both, natural expressions, couple harmony, professional photography, 85mm lens, high resolution',
      'Couple studio portrait, soft natural light, minimal background, exact facial features preserved for both, natural skin texture, detailed eyes, professional quality, 50mm f/1.8, 8K quality',
      'Professional couple portrait, balanced lighting, neutral backdrop, maintaining original appearance for both, natural skin, sharp focus on eyes, authentic couple expression, studio photography, 85mm f/2.8',
    ],
    B: [
      'Enhanced professional couple portrait, cinematic lighting, luxury studio quality, subtle skin improvements maintaining texture for both, naturally enhanced eyes, confident couple expression, professional backdrop, premium photography, 85mm f/1.4',
      'Premium couple portrait photography, artistic lighting, studio enhancements, realistic improvements while preserving essence of both, enhanced skin quality, naturally brightened eyes, elegant couple dynamic, professional quality, 50mm f/1.8',
      'Luxury couple studio portrait, sophisticated lighting, subtle enhancements, maintaining authenticity for both, improved skin texture, naturally enhanced features, professional photography, 85mm f/1.2, high-end quality',
      'Professional enhanced couple portrait, dramatic lighting, studio quality improvements, realistic enhancements for both, premium skin quality, naturally improved eyes, confident couple expression, editorial style, 50mm f/1.4',
      'Premium couple portrait, artistic studio lighting, luxury enhancements, maintaining natural look for both, enhanced skin texture, naturally improved features, professional photography, 85mm f/1.8, high-end quality',
    ],
  },
  nino: {
    A: [
      'Professional child portrait (boy), natural lighting, soft shadows, neutral background, 85mm f/1.8, high fidelity to facial features, natural skin texture, sharp eyes, authentic child expression, playful yet professional, 8K photographic quality',
      'Child studio portrait (boy), studio quality lighting, professional backdrop, maintaining 100% facial similarity, natural skin tones, detailed eyes, authentic child expression, 50mm f/2.8, 4K resolution',
      'Professional child headshot (boy), even lighting, clean background, preserving all facial characteristics, natural hair texture, realistic skin, professional photography, 85mm lens, high resolution',
      'Child studio portrait (boy), soft natural light, minimal background, exact facial features preserved, natural skin texture, detailed eyes, professional quality, 50mm f/1.8, 8K quality',
      'Professional child portrait (boy), balanced lighting, neutral backdrop, maintaining original appearance, natural skin, sharp focus on eyes, authentic child expression, studio photography, 85mm f/2.8',
    ],
    B: [
      'Enhanced professional child portrait (boy), cinematic lighting, luxury studio quality, subtle skin improvements maintaining texture, naturally enhanced eyes, confident child expression, professional backdrop, premium photography, 85mm f/1.4',
      'Premium child portrait photography (boy), artistic lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened eyes, elegant child expression, professional quality, 50mm f/1.8',
      'Luxury child studio portrait (boy), sophisticated lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional photography, 85mm f/1.2, high-end quality',
      'Professional enhanced child portrait (boy), dramatic lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved eyes, confident child expression, editorial style, 50mm f/1.4',
      'Premium child portrait (boy), artistic studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional photography, 85mm f/1.8, high-end quality',
    ],
  },
  nina: {
    A: [
      'Professional child portrait (girl), natural lighting, soft shadows, neutral background, 85mm f/1.8, high fidelity to facial features, natural skin texture, sharp eyes, authentic child expression, playful yet professional, 8K photographic quality',
      'Child studio portrait (girl), studio quality lighting, professional backdrop, maintaining 100% facial similarity, natural skin tones, detailed eyes, authentic child expression, 50mm f/2.8, 4K resolution',
      'Professional child headshot (girl), even lighting, clean background, preserving all facial characteristics, natural hair texture, realistic skin, professional photography, 85mm lens, high resolution',
      'Child studio portrait (girl), soft natural light, minimal background, exact facial features preserved, natural skin texture, detailed eyes, professional quality, 50mm f/1.8, 8K quality',
      'Professional child portrait (girl), balanced lighting, neutral backdrop, maintaining original appearance, natural skin, sharp focus on eyes, authentic child expression, studio photography, 85mm f/2.8',
    ],
    B: [
      'Enhanced professional child portrait (girl), cinematic lighting, luxury studio quality, subtle skin improvements maintaining texture, naturally enhanced eyes, confident child expression, professional backdrop, premium photography, 85mm f/1.4',
      'Premium child portrait photography (girl), artistic lighting, studio enhancements, realistic improvements while preserving essence, enhanced skin quality, naturally brightened eyes, elegant child expression, professional quality, 50mm f/1.8',
      'Luxury child studio portrait (girl), sophisticated lighting, subtle enhancements, maintaining authenticity, improved skin texture, naturally enhanced features, professional photography, 85mm f/1.2, high-end quality',
      'Professional enhanced child portrait (girl), dramatic lighting, studio quality improvements, realistic enhancements, premium skin quality, naturally improved eyes, confident child expression, editorial style, 50mm f/1.4',
      'Premium child portrait (girl), artistic studio lighting, luxury enhancements, maintaining natural look, enhanced skin texture, naturally improved features, professional photography, 85mm f/1.8, high-end quality',
    ],
  },
  mascota_perro: {
    A: [
      'Professional dog portrait, natural lighting, authentic canine expression, neutral background, sharp focus on eyes and features, natural fur texture, 100mm f/2.8, professional pet photography, 4K quality',
      'Dog photography, studio lighting, preserving authentic dog characteristics, clean background, detailed fur texture, natural expression, professional quality, 85mm f/2.8, high resolution',
      'Professional dog portrait, soft natural light, neutral backdrop, maintaining dog\'s authentic appearance, detailed fur, sharp eyes, natural expression, studio photography, 100mm f/2.8',
      'Dog studio portrait, even lighting, clean background, preserving all dog features, natural fur texture, detailed eyes, authentic dog expression, professional photography, 85mm f/2.8, 4K quality',
      'Professional dog photography, balanced lighting, neutral backdrop, maintaining original dog appearance, natural fur texture, sharp focus on eyes, authentic expression, studio quality, 100mm f/2.8',
    ],
    B: [
      'Enhanced dog portrait, premium studio lighting, luxury pet photography, subtle improvements maintaining authenticity, enhanced fur texture, naturally improved eyes, confident dog expression, professional backdrop, 100mm f/2.8',
      'Premium dog photography, artistic lighting, studio enhancements, realistic improvements while preserving dog essence, enhanced fur quality, naturally brightened eyes, elegant dog expression, professional quality, 85mm f/2.8',
      'Luxury dog studio portrait, sophisticated lighting, subtle enhancements, maintaining dog authenticity, improved fur texture, naturally enhanced features, professional pet photography, 100mm f/2.8, high-end quality',
      'Professional enhanced dog portrait, dramatic lighting, studio quality improvements, realistic enhancements, premium fur quality, naturally improved eyes, confident dog expression, editorial style, 85mm f/2.8',
      'Premium dog portrait, artistic studio lighting, luxury enhancements, maintaining natural dog look, enhanced fur texture, naturally improved features, professional pet photography, 100mm f/2.8, high-end quality',
    ],
  },
  mascota_gato: {
    A: [
      'Professional cat portrait, natural lighting, authentic feline expression, neutral background, sharp focus on eyes and features, natural fur texture, 100mm f/2.8, professional pet photography, 4K quality',
      'Cat photography, studio lighting, preserving authentic cat characteristics, clean background, detailed fur texture, natural expression, professional quality, 85mm f/2.8, high resolution',
      'Professional cat portrait, soft natural light, neutral backdrop, maintaining cat\'s authentic appearance, detailed fur, sharp eyes, natural expression, studio photography, 100mm f/2.8',
      'Cat studio portrait, even lighting, clean background, preserving all cat features, natural fur texture, detailed eyes, authentic cat expression, professional photography, 85mm f/2.8, 4K quality',
      'Professional cat photography, balanced lighting, neutral backdrop, maintaining original cat appearance, natural fur texture, sharp focus on eyes, authentic expression, studio quality, 100mm f/2.8',
    ],
    B: [
      'Enhanced cat portrait, premium studio lighting, luxury pet photography, subtle improvements maintaining authenticity, enhanced fur texture, naturally improved eyes, confident cat expression, professional backdrop, 100mm f/2.8',
      'Premium cat photography, artistic lighting, studio enhancements, realistic improvements while preserving cat essence, enhanced fur quality, naturally brightened eyes, elegant cat expression, professional quality, 85mm f/2.8',
      'Luxury cat studio portrait, sophisticated lighting, subtle enhancements, maintaining cat authenticity, improved fur texture, naturally enhanced features, professional pet photography, 100mm f/2.8, high-end quality',
      'Professional enhanced cat portrait, dramatic lighting, studio quality improvements, realistic enhancements, premium fur quality, naturally improved eyes, confident cat expression, editorial style, 85mm f/2.8',
      'Premium cat portrait, artistic studio lighting, luxury enhancements, maintaining natural cat look, enhanced fur texture, naturally improved features, professional pet photography, 100mm f/2.8, high-end quality',
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
  grupo: {
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
  equipo: {
    A: [
      'Professional team photography, natural composition for {count} team members, even lighting across all faces, neutral or corporate background, maintaining 100% similarity for each person, natural team expressions, professional team dynamic, 35mm f/4, corporate team portrait, 4K quality',
      'Team studio portrait, balanced lighting for all {count} members, clean corporate backdrop, preserving individual facial features, natural skin tones, authentic team expressions, professional team photography, 50mm f/4, high resolution',
      'Professional team photo, soft natural light, neutral corporate background, maintaining each person\'s authentic appearance, natural expressions, team unity, studio photography, 35mm f/4, 8K quality',
      'Team portrait photography, even lighting, professional corporate backdrop, preserving all {count} team members\' features, natural skin texture, detailed faces, authentic team expressions, professional quality, 50mm f/4, 4K resolution',
      'Studio team portrait, balanced lighting, neutral corporate backdrop, maintaining original appearance for each of {count} people, natural expressions, team cohesion, professional photography, 35mm f/4, high-end quality',
    ],
    B: [
      'Enhanced team portrait, premium studio lighting, luxury team photography, subtle improvements maintaining authenticity for each of {count} members, enhanced skin quality, naturally improved expressions, confident team dynamic, professional corporate backdrop, 35mm f/2.8',
      'Premium team photography, artistic lighting, studio enhancements, realistic improvements while preserving each person\'s essence, enhanced skin quality, naturally brightened features, elegant team expressions, professional quality, 50mm f/2.8',
      'Luxury team studio portrait, sophisticated lighting, subtle enhancements, maintaining team authenticity, improved skin texture, naturally enhanced features, professional team photography, 35mm f/2.8, high-end quality',
      'Professional enhanced team portrait, dramatic lighting, studio quality improvements, realistic enhancements for all {count} members, premium skin quality, naturally improved expressions, confident team dynamic, editorial style, 50mm f/2.8',
      'Premium team portrait, artistic studio lighting, luxury enhancements, maintaining natural team look, enhanced skin texture, naturally improved features, professional team photography, 35mm f/2.8, high-end quality',
    ],
  },
};

// ============================================
// FUNCIONES DE GENERACIÓN
// ============================================

/**
 * Genera prompts para una categoría específica
 */
export function generateCategoryPrompts(
  config: CategoryPromptConfig,
  count: number = 4
): CategoryGeneratedPrompt[] {
  const prompts: CategoryGeneratedPrompt[] = [];
  
  // Si hay un prompt personalizado, usarlo
  if (config.customPrompt) {
    for (let i = 0; i < count; i++) {
      prompts.push({
        prompt: config.customPrompt,
        version: config.variant,
        category: config.category,
        metadata: {
          numberOfPeople: config.numberOfPeople,
          style: config.style,
          occasion: config.occasion,
          isCustom: true,
        },
      });
    }
    return prompts;
  }

  // Usar prompts base de la categoría
  const categoryPrompts = CATEGORY_PROMPTS[config.category]?.[config.variant] || 
                          CATEGORY_PROMPTS.mujer[config.variant];
  
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
        isCustom: false,
      },
    });
  }
  
  return prompts;
}

/**
 * Obtiene un prompt aleatorio de una categoría
 */
export function getRandomCategoryPrompt(config: CategoryPromptConfig): CategoryGeneratedPrompt {
  const prompts = generateCategoryPrompts(config, 1);
  return prompts[0];
}

/**
 * Mapea categoría antigua a nueva
 */
export function mapOldCategoryToNew(oldCategory: string): PhotoCategory {
  const mapping: Record<string, PhotoCategory> = {
    'person': 'mujer', // Default a mujer, pero debería especificarse
    'pet': 'mascota_perro', // Default a perro
    'family': 'familia',
    'team': 'equipo',
    'individual': 'mujer', // Default
  };
  
  return mapping[oldCategory] || 'mujer';
}

/**
 * Obtiene todas las categorías disponibles
 */
export function getAllCategories(): PhotoCategory[] {
  return Object.keys(CATEGORY_PROMPTS) as PhotoCategory[];
}

/**
 * Obtiene información de una categoría
 */
export function getCategoryInfo(category: PhotoCategory): {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
} {
  const info: Record<PhotoCategory, { name: string; nameEn: string; description: string; descriptionEn: string }> = {
    mujer: {
      name: 'Mujer',
      nameEn: 'Woman',
      description: 'Retratos profesionales para mujeres',
      descriptionEn: 'Professional portraits for women',
    },
    hombre: {
      name: 'Hombre',
      nameEn: 'Man',
      description: 'Retratos profesionales para hombres',
      descriptionEn: 'Professional portraits for men',
    },
    pareja: {
      name: 'Pareja',
      nameEn: 'Couple',
      description: 'Fotografías profesionales de parejas',
      descriptionEn: 'Professional couple photography',
    },
    nino: {
      name: 'Niño',
      nameEn: 'Boy',
      description: 'Retratos profesionales para niños',
      descriptionEn: 'Professional portraits for boys',
    },
    nina: {
      name: 'Niña',
      nameEn: 'Girl',
      description: 'Retratos profesionales para niñas',
      descriptionEn: 'Professional portraits for girls',
    },
    mascota_perro: {
      name: 'Mascota - Perro',
      nameEn: 'Pet - Dog',
      description: 'Fotografías profesionales de perros',
      descriptionEn: 'Professional dog photography',
    },
    mascota_gato: {
      name: 'Mascota - Gato',
      nameEn: 'Pet - Cat',
      description: 'Fotografías profesionales de gatos',
      descriptionEn: 'Professional cat photography',
    },
    familia: {
      name: 'Familia',
      nameEn: 'Family',
      description: 'Fotografías profesionales familiares',
      descriptionEn: 'Professional family photography',
    },
    grupo: {
      name: 'Grupo',
      nameEn: 'Group',
      description: 'Fotografías profesionales de grupos',
      descriptionEn: 'Professional group photography',
    },
    equipo: {
      name: 'Equipo',
      nameEn: 'Team',
      description: 'Fotografías profesionales de equipos',
      descriptionEn: 'Professional team photography',
    },
  };
  
  return info[category] || info.mujer;
}

