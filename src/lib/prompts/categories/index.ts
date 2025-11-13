/**
 * ÍNDICE CENTRAL DE TODOS LOS PROMPTS
 * Exporta todos los prompts organizados por categoría
 */

export type { CompletePrompt } from './men';

// Exportar todos los prompts
export { menPrompts, getMenPromptById, getMenPromptsByStyle, getRandomMenPrompt } from './men';
export { womenPrompts, getWomenPromptById, getWomenPromptsByStyle, getRandomWomenPrompt } from './women';
export { boyPrompts, girlPrompts, getBoyPromptById, getGirlPromptById, getRandomBoyPrompt, getRandomGirlPrompt } from './children';
export { dogPrompts, catPrompts, getDogPromptById, getCatPromptById, getRandomDogPrompt, getRandomCatPrompt } from './pets';
export { familyPrompts, getFamilyPromptById, getFamilyPromptsByStyle, getRandomFamilyPrompt } from './families';
export { couplePrompts, getCouplePromptById, getCouplePromptsByStyle, getRandomCouplePrompt } from './couples';
export { teamPrompts, getTeamPromptById, getTeamPromptsByStyle, getRandomTeamPrompt } from './teams';

/**
 * Tipo de categoría de prompt
 */
export type PromptCategory = 
  | 'men' 
  | 'women' 
  | 'boy' 
  | 'girl' 
  | 'dog' 
  | 'cat' 
  | 'family' 
  | 'couple' 
  | 'team';

/**
 * Obtener todos los prompts de una categoría
 */
export function getPromptsByCategory(category: PromptCategory): import('./men').CompletePrompt[] {
  switch (category) {
    case 'men':
      return menPrompts;
    case 'women':
      return womenPrompts;
    case 'boy':
      return boyPrompts;
    case 'girl':
      return girlPrompts;
    case 'dog':
      return dogPrompts;
    case 'cat':
      return catPrompts;
    case 'family':
      return familyPrompts;
    case 'couple':
      return couplePrompts;
    case 'team':
      return teamPrompts;
    default:
      return [];
  }
}

/**
 * Obtener prompt por ID y categoría
 */
export function getPromptById(category: PromptCategory, id: string): import('./men').CompletePrompt | undefined {
  switch (category) {
    case 'men':
      return getMenPromptById(id);
    case 'women':
      return getWomenPromptById(id);
    case 'boy':
      return getBoyPromptById(id);
    case 'girl':
      return getGirlPromptById(id);
    case 'dog':
      return getDogPromptById(id);
    case 'cat':
      return getCatPromptById(id);
    case 'family':
      return getFamilyPromptById(id);
    case 'couple':
      return getCouplePromptById(id);
    case 'team':
      return getTeamPromptById(id);
    default:
      return undefined;
  }
}

/**
 * Obtener todas las opciones de UI (lo que el cliente ve)
 */
export function getAllUIOptions(category: PromptCategory): string[] {
  const prompts = getPromptsByCategory(category);
  return prompts.map(p => p.uiLabel);
}

/**
 * Obtener prompt completo basado en la opción de UI seleccionada
 */
export function getCompletePromptFromUIOption(
  category: PromptCategory,
  uiLabel: string
): import('./men').CompletePrompt | undefined {
  const prompts = getPromptsByCategory(category);
  return prompts.find(p => p.uiLabel === uiLabel);
}

/**
 * Contar total de prompts disponibles
 */
export function getTotalPromptsCount(): number {
  return (
    menPrompts.length +
    womenPrompts.length +
    boyPrompts.length +
    girlPrompts.length +
    dogPrompts.length +
    catPrompts.length +
    familyPrompts.length +
    couplePrompts.length +
    teamPrompts.length
  );
}

