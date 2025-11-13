/**
 * MAPEO ENTRE OPCIONES DEL UI Y PROMPTS COMPLETOS
 * 
 * Este archivo conecta las opciones simples que el cliente ve en el UI
 * con los prompts completos y profesionales que se usan internamente.
 * 
 * El cliente solo ve: "En estudio de lujo con traje negro"
 * Pero internamente usamos: [prompt completo de 200+ palabras]
 */

import {
  PromptCategory,
  getCompletePromptFromUIOption,
  getAllUIOptions,
  getPromptsByCategory,
  CompletePrompt
} from './categories';

/**
 * Mapeo de opciones simples del UI a IDs de prompts completos
 * Esto permite que el cliente vea opciones simples pero usemos prompts completos
 */
export interface UIPromptMapping {
  // Categoría del sujeto
  category: PromptCategory;
  
  // Opción simple que el cliente ve en el UI
  uiOption: string;
  
  // ID del prompt completo que se usará internamente
  promptId: string;
  
  // Tags adicionales para búsqueda
  tags?: string[];
}

/**
 * Obtener el prompt completo basado en la selección del cliente
 */
export function getCompletePrompt(
  category: PromptCategory,
  uiOption: string
): CompletePrompt | undefined {
  return getCompletePromptFromUIOption(category, uiOption);
}

/**
 * Obtener todas las opciones de UI disponibles para una categoría
 * Estas son las opciones que el cliente verá en el selector
 */
export function getAvailableUIOptions(category: PromptCategory): string[] {
  return getAllUIOptions(category);
}

/**
 * Generar múltiples prompts para una selección
 * Útil cuando necesitamos generar variaciones
 */
export function generatePromptVariations(
  category: PromptCategory,
  uiOption: string,
  count: number = 2
): CompletePrompt[] {
  const basePrompt = getCompletePrompt(category, uiOption);
  if (!basePrompt) return [];

  // Si solo necesitamos uno, retornar el base
  if (count === 1) return [basePrompt];

  // Para múltiples variaciones, podemos:
  // 1. Usar el mismo prompt (versión A y B)
  // 2. O buscar prompts similares en la misma categoría
  const prompts = getPromptsByCategory(category);
  const similarPrompts = prompts.filter(
    p => p.style === basePrompt.style || p.tags.some(tag => basePrompt.tags.includes(tag))
  );

  const variations: CompletePrompt[] = [basePrompt];
  
  // Agregar variaciones similares hasta completar el count
  for (let i = 0; i < count - 1 && i < similarPrompts.length; i++) {
    if (similarPrompts[i].id !== basePrompt.id) {
      variations.push(similarPrompts[i]);
    }
  }

  // Si no hay suficientes variaciones, duplicar el base con pequeñas modificaciones
  while (variations.length < count) {
    variations.push({ ...basePrompt, id: `${basePrompt.id}_v${variations.length}` });
  }

  return variations.slice(0, count);
}

/**
 * Buscar prompts por tags
 */
export function searchPromptsByTags(
  category: PromptCategory,
  tags: string[]
): CompletePrompt[] {
  const prompts = getPromptsByCategory(category);
  return prompts.filter(prompt =>
    tags.some(tag => prompt.tags.includes(tag))
  );
}

/**
 * Obtener prompts aleatorios de una categoría
 */
export function getRandomPrompts(
  category: PromptCategory,
  count: number = 1
): CompletePrompt[] {
  const prompts = getPromptsByCategory(category);
  const shuffled = [...prompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

