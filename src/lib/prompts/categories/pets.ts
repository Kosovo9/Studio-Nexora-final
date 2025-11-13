/**
 * PROMPTS COMPLETOS PARA MASCOTAS (PERROS Y GATOS)
 * Más de 50 prompts hiper completos y profesionales
 */

import { CompletePrompt } from './men';

export const dogPrompts: CompletePrompt[] = [
  {
    id: 'dog_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Adorable professional portrait of a well-groomed dog in a clean, bright photography studio. The dog is sitting or standing confidently, looking directly at the camera with bright, alert eyes. The studio has a simple, elegant background that complements the dog's coloring. The lighting is soft and even, highlighting the dog's features and fur texture beautifully. The dog appears happy and well-cared-for, with a natural, friendly expression. The composition is centered and balanced, capturing the dog's personality. The overall mood is professional, clean, and showcases the dog's best features. Shot with professional studio lighting, shallow depth of field. Color grading: natural tones, vibrant fur colors, clean background. Ultra-high resolution, professional pet photography quality.`,
    tags: ['studio', 'professional', 'dog', 'portrait', 'clean'],
    style: 'professional'
  },
  {
    id: 'dog_park_playing',
    uiLabel: 'En el parque jugando',
    completePrompt: `Natural, joyful portrait of a happy dog playing in a beautiful park during golden hour. The dog is captured in action - perhaps running, playing with a ball, or exploring. The park has green grass, trees, and natural elements creating a beautiful backdrop. Natural sunlight creates a warm, happy atmosphere. The dog appears energetic, happy, and full of life. The composition captures the dog's personality and energy. The background is softly blurred to keep focus on the dog. The overall mood is joyful, natural, and captures the dog's playful spirit. Shot with natural light, action-friendly settings. Color grading: warm, natural tones, vibrant greens, happy atmosphere. Ultra-high resolution, lifestyle pet photography quality.`,
    tags: ['park', 'playing', 'outdoor', 'natural', 'active'],
    style: 'casual'
  },
  // Agregar más prompts aquí
];

export const catPrompts: CompletePrompt[] = [
  {
    id: 'cat_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Elegant professional portrait of a beautiful cat in a clean, sophisticated photography studio. The cat is sitting or posing naturally, looking at the camera with expressive eyes. The studio has a simple, elegant background that complements the cat's fur color and pattern. The lighting is soft and flattering, highlighting the cat's features, fur texture, and markings beautifully. The cat appears calm, confident, and well-groomed. The composition is balanced and captures the cat's unique personality and beauty. The overall mood is elegant, professional, and showcases the cat's best features. Shot with professional studio lighting, shallow depth of field. Color grading: natural tones, vibrant fur colors, clean background. Ultra-high resolution, professional pet photography quality.`,
    tags: ['studio', 'professional', 'cat', 'portrait', 'elegant'],
    style: 'professional'
  },
  {
    id: 'cat_home_cozy',
    uiLabel: 'En casa acogedora',
    completePrompt: `Natural, cozy portrait of a cat in a warm, inviting home environment. The cat is captured in a comfortable, natural setting - perhaps on a windowsill, couch, or favorite spot. The home has warm lighting, comfortable furniture, and a lived-in, cozy atmosphere. Natural light from windows creates a soft, warm glow. The cat appears relaxed, content, and at ease in its environment. The composition captures the cat's natural behavior and comfort. The background shows a cozy home setting that adds context. The overall mood is warm, comfortable, and natural. Shot with natural light, capturing the cozy atmosphere. Color grading: warm tones, cozy atmosphere, natural look. Ultra-high resolution, lifestyle pet photography quality.`,
    tags: ['home', 'cozy', 'indoor', 'natural', 'comfortable'],
    style: 'casual'
  },
  // Agregar más prompts aquí
];

export function getDogPromptById(id: string): CompletePrompt | undefined {
  return dogPrompts.find(p => p.id === id);
}

export function getCatPromptById(id: string): CompletePrompt | undefined {
  return catPrompts.find(p => p.id === id);
}

export function getRandomDogPrompt(): CompletePrompt {
  return dogPrompts[Math.floor(Math.random() * dogPrompts.length)];
}

export function getRandomCatPrompt(): CompletePrompt {
  return catPrompts[Math.floor(Math.random() * catPrompts.length)];
}

