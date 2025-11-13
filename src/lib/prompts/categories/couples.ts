/**
 * PROMPTS COMPLETOS PARA PAREJAS
 * Más de 50 prompts hiper completos y profesionales
 */

import { CompletePrompt } from './men';

export const couplePrompts: CompletePrompt[] = [
  {
    id: 'couple_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Romantic, elegant portrait of a happy couple in a professional photography studio. The couple is posed together, showing natural affection and connection. They're wearing coordinated, elegant outfits that complement each other. The studio has a simple, elegant background that doesn't distract. The lighting is soft and flattering, creating a romantic, timeless atmosphere. The couple is looking at each other or at the camera with genuine happiness and love. The composition captures their connection and chemistry. The overall mood is romantic, elegant, and professional. Shot with professional studio lighting, shallow depth of field. Color grading: warm, romantic tones, elegant look. Ultra-high resolution, professional couple photography quality.`,
    tags: ['studio', 'professional', 'couple', 'romantic', 'elegant'],
    style: 'professional'
  },
  {
    id: 'couple_beach_sunset',
    uiLabel: 'En la playa al atardecer',
    completePrompt: `Romantic, stunning portrait of a couple on a beautiful beach during golden hour sunset. The couple is standing together, perhaps holding hands or in an embrace. The sky is painted with vibrant sunset colors - oranges, pinks, and purples. The ocean creates a romantic, serene backdrop. The warm sunset light creates a beautiful glow on both people. The couple appears happy, in love, and connected. The composition captures both the romantic atmosphere and the couple's love. The overall mood is romantic, dreamy, and cinematic. Shot with golden hour natural light, wide angle to capture the landscape. Color grading: warm sunset tones, vibrant sky, romantic atmosphere. Ultra-high resolution, landscape couple photography quality.`,
    tags: ['beach', 'sunset', 'romantic', 'nature', 'golden-hour'],
    style: 'nature'
  },
  {
    id: 'couple_fireplace_cozy',
    uiLabel: 'En la chimenea acogedora',
    completePrompt: `Intimate, cozy portrait of a couple by a warm fireplace. The couple is sitting together comfortably, enjoying the warmth and each other's company. The fire creates warm, flickering light that illuminates their faces. The room has comfortable furniture, soft blankets, and a cozy atmosphere. The couple appears relaxed, happy, and deeply connected. The composition captures the intimate, romantic moment. The fireplace and warm lighting create a perfect, cozy setting. The overall mood is warm, intimate, and full of love. Shot with warm, ambient firelight. Color grading: warm tones, firelight glow, cozy romantic atmosphere. Ultra-high resolution, lifestyle couple photography quality.`,
    tags: ['fireplace', 'cozy', 'romantic', 'intimate', 'warm'],
    style: 'casual'
  },
  {
    id: 'couple_cafe_morning',
    uiLabel: 'En una cafetería en el amanecer',
    completePrompt: `Natural, romantic portrait of a couple in a cozy coffee shop during golden hour morning light. The couple is sitting together, perhaps sharing a moment over coffee. Natural sunlight streams through windows, creating soft, flattering light. The coffee shop has a warm, inviting atmosphere with wooden furniture and ambient lighting. The couple appears relaxed, happy, and connected. The composition captures a natural, candid moment of togetherness. The overall mood is warm, romantic, and authentic. Shot with natural light, shallow depth of field. Color grading: warm golden tones, cozy atmosphere, romantic look. Ultra-high resolution, lifestyle couple photography quality.`,
    tags: ['cafe', 'morning', 'romantic', 'lifestyle', 'natural'],
    style: 'casual'
  },
  // Agregar más prompts aquí
];

export function getCouplePromptById(id: string): CompletePrompt | undefined {
  return couplePrompts.find(p => p.id === id);
}

export function getCouplePromptsByStyle(style: CompletePrompt['style']): CompletePrompt[] {
  return couplePrompts.filter(p => p.style === style);
}

export function getRandomCouplePrompt(): CompletePrompt {
  return couplePrompts[Math.floor(Math.random() * couplePrompts.length)];
}

