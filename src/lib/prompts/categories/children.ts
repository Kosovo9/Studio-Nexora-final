/**
 * PROMPTS COMPLETOS PARA NIÑOS Y NIÑAS
 * Más de 50 prompts hiper completos y profesionales
 */

import { CompletePrompt } from './men';

export const boyPrompts: CompletePrompt[] = [
  {
    id: 'boy_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Adorable professional portrait of a happy young boy in a bright, cheerful photography studio. The boy is wearing clean, age-appropriate clothing - perhaps a button-down shirt or polo shirt. The studio has a playful, colorful background or a clean, simple backdrop. The lighting is soft and natural, creating a warm, friendly atmosphere. The boy has a genuine, joyful smile, looking directly at the camera with bright, happy eyes. The composition is centered and balanced, capturing the child's natural innocence and energy. The overall mood is happy, playful, and professional. Shot with soft, flattering lighting, shallow depth of field. Color grading: bright, cheerful tones, natural skin colors, warm atmosphere. Ultra-high resolution, professional child photography quality.`,
    tags: ['studio', 'professional', 'child', 'portrait', 'happy'],
    style: 'professional'
  },
  {
    id: 'boy_park_playing',
    uiLabel: 'En el parque jugando',
    completePrompt: `Natural, candid portrait of a boy playing in a beautiful park during golden hour. The boy is wearing casual, comfortable clothes suitable for playing. The park has green grass, trees, and a playground in the background. Natural sunlight creates a warm, happy atmosphere. The boy is captured in a natural moment - perhaps running, playing, or smiling. The composition is dynamic and captures the child's energy and joy. The background is slightly blurred to keep focus on the child. The overall mood is joyful, natural, and full of life. Shot with natural light, action-friendly settings. Color grading: warm, natural tones, vibrant greens, happy atmosphere. Ultra-high resolution, lifestyle child photography quality.`,
    tags: ['park', 'playing', 'outdoor', 'natural', 'candid'],
    style: 'casual'
  },
  // Agregar más prompts aquí
];

export const girlPrompts: CompletePrompt[] = [
  {
    id: 'girl_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Beautiful professional portrait of a sweet young girl in an elegant, soft photography studio. The girl is wearing a pretty dress or age-appropriate outfit, perhaps with a bow or hair accessory. The studio has a soft, pastel background or a clean, simple backdrop. The lighting is gentle and flattering, creating a warm, innocent atmosphere. The girl has a sweet, gentle smile, looking directly at the camera with bright, expressive eyes. The composition is balanced and captures the child's natural beauty and innocence. The overall mood is sweet, elegant, and professional. Shot with soft, diffused lighting, shallow depth of field. Color grading: soft, pastel tones, natural skin colors, warm atmosphere. Ultra-high resolution, professional child photography quality.`,
    tags: ['studio', 'professional', 'child', 'portrait', 'sweet'],
    style: 'professional'
  },
  {
    id: 'girl_park_playing',
    uiLabel: 'En el parque jugando',
    completePrompt: `Natural, joyful portrait of a girl playing in a beautiful park during golden hour. The girl is wearing a pretty, comfortable outfit - perhaps a dress or casual clothes. The park has green grass, flowers, and trees creating a beautiful natural backdrop. Natural sunlight creates a warm, magical atmosphere. The girl is captured in a natural moment - perhaps playing, dancing, or smiling happily. The composition captures the child's joy and energy. The background is softly blurred to keep focus on the child. The overall mood is happy, natural, and full of life. Shot with natural light, capturing movement. Color grading: warm, natural tones, vibrant colors, happy atmosphere. Ultra-high resolution, lifestyle child photography quality.`,
    tags: ['park', 'playing', 'outdoor', 'natural', 'joyful'],
    style: 'casual'
  },
  // Agregar más prompts aquí
];

export function getBoyPromptById(id: string): CompletePrompt | undefined {
  return boyPrompts.find(p => p.id === id);
}

export function getGirlPromptById(id: string): CompletePrompt | undefined {
  return girlPrompts.find(p => p.id === id);
}

export function getRandomBoyPrompt(): CompletePrompt {
  return boyPrompts[Math.floor(Math.random() * boyPrompts.length)];
}

export function getRandomGirlPrompt(): CompletePrompt {
  return girlPrompts[Math.floor(Math.random() * girlPrompts.length)];
}

