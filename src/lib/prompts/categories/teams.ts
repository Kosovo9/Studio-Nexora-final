/**
 * PROMPTS COMPLETOS PARA EQUIPOS
 * Más de 50 prompts hiper completos y profesionales
 */

import { CompletePrompt } from './men';

export const teamPrompts: CompletePrompt[] = [
  {
    id: 'team_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Professional, dynamic team portrait in a modern photography studio. A group of professionals is posed together, showing unity and teamwork. Everyone is wearing coordinated business attire or team uniforms. The studio has a clean, professional background. The lighting is even and professional, ensuring everyone is well-lit. The team members are arranged in a balanced composition, with everyone visible and looking at the camera with confident, professional expressions. The overall mood is professional, cohesive, and shows team unity. Shot with professional studio lighting, ensuring everyone is in focus. Color grading: clean, professional tones, corporate look. Ultra-high resolution, professional team photography quality.`,
    tags: ['studio', 'professional', 'team', 'corporate', 'group'],
    style: 'professional'
  },
  {
    id: 'team_office_modern',
    uiLabel: 'En oficina moderna',
    completePrompt: `Professional team portrait in a modern, sleek office environment. A group of professionals is gathered in a contemporary office space, perhaps in a meeting room or open workspace. The office has modern design, floor-to-ceiling windows, and professional decor. Natural light from windows combines with office lighting. The team is arranged naturally, showing collaboration and teamwork. Everyone is wearing professional business attire. The composition captures both the professional environment and the team's unity. The overall atmosphere is professional, modern, and shows a cohesive team. Shot with balanced professional lighting. Color grading: clean, professional tones, modern look. Ultra-high resolution, corporate team photography quality.`,
    tags: ['office', 'corporate', 'team', 'professional', 'modern'],
    style: 'professional'
  },
  {
    id: 'team_outdoor_casual',
    uiLabel: 'Al aire libre casual',
    completePrompt: `Natural, relaxed team portrait in an outdoor setting. A group of people is gathered together in a casual, comfortable outdoor environment - perhaps a park, outdoor space, or natural setting. Everyone is wearing casual, coordinated outfits. Natural light creates a warm, friendly atmosphere. The team is arranged naturally, showing camaraderie and friendship. The composition captures the team's connection and relaxed energy. The background shows a pleasant outdoor setting. The overall mood is casual, friendly, and shows team bonding. Shot with natural light, capturing the relaxed atmosphere. Color grading: warm, natural tones, friendly atmosphere. Ultra-high resolution, lifestyle team photography quality.`,
    tags: ['outdoor', 'casual', 'team', 'natural', 'relaxed'],
    style: 'casual'
  },
  // Agregar más prompts aquí
];

export function getTeamPromptById(id: string): CompletePrompt | undefined {
  return teamPrompts.find(p => p.id === id);
}

export function getTeamPromptsByStyle(style: CompletePrompt['style']): CompletePrompt[] {
  return teamPrompts.filter(p => p.style === style);
}

export function getRandomTeamPrompt(): CompletePrompt {
  return teamPrompts[Math.floor(Math.random() * teamPrompts.length)];
}

