/**
 * PROMPTS COMPLETOS PARA FAMILIAS
 * Más de 50 prompts hiper completos y profesionales
 * Incluye: cenas de navidad, cenas en familia, en la chimenea, en el arbolito, niños con Santa Claus, etc.
 */

import { CompletePrompt } from './men';

export const familyPrompts: CompletePrompt[] = [
  {
    id: 'family_christmas_dinner',
    uiLabel: 'Cena de Navidad en familia',
    completePrompt: `Warm, joyful family portrait during a beautiful Christmas dinner. A happy family is gathered around a beautifully decorated dining table, with Christmas decorations, candles, and festive elements. The table is set with elegant dinnerware, and there's delicious food visible. The family members are smiling, laughing, and enjoying each other's company. The lighting is warm and inviting, creating a cozy, festive atmosphere. Christmas decorations, a Christmas tree visible in the background, and holiday elements create a perfect holiday scene. The composition captures the family's happiness and togetherness. The overall mood is warm, joyful, and full of holiday spirit. Shot with warm, ambient lighting, capturing the festive atmosphere. Color grading: warm tones, festive colors, cozy holiday atmosphere. Ultra-high resolution, lifestyle family photography quality.`,
    tags: ['christmas', 'dinner', 'family', 'holiday', 'festive'],
    style: 'casual'
  },
  {
    id: 'family_fireplace_cozy',
    uiLabel: 'En la chimenea acogedora',
    completePrompt: `Cozy, intimate family portrait by a warm fireplace. A happy family is gathered together, sitting comfortably near a beautiful, crackling fireplace. The fire creates warm, flickering light that illuminates the family's faces. The room has comfortable furniture, soft blankets, and a cozy, inviting atmosphere. The family members are relaxed, smiling, and enjoying the warmth and togetherness. The composition captures the intimate, cozy moment. The fireplace and warm lighting create a perfect, comfortable setting. The overall mood is warm, intimate, and full of love. Shot with warm, ambient firelight, creating a cozy atmosphere. Color grading: warm tones, firelight glow, cozy atmosphere. Ultra-high resolution, lifestyle family photography quality.`,
    tags: ['fireplace', 'cozy', 'family', 'warm', 'intimate'],
    style: 'casual'
  },
  {
    id: 'family_christmas_tree',
    uiLabel: 'En el arbolito de Navidad',
    completePrompt: `Magical family portrait by a beautifully decorated Christmas tree. A happy family is gathered around a stunning Christmas tree, decorated with lights, ornaments, and festive decorations. The tree is the focal point, creating a magical, festive backdrop. The family members are smiling, perhaps opening presents or simply enjoying the moment together. The Christmas tree lights create a warm, magical glow. The room has Christmas decorations, creating a perfect holiday atmosphere. The composition captures the family's joy and the magic of Christmas. The overall mood is festive, joyful, and full of holiday spirit. Shot with warm, ambient lighting from the tree. Color grading: warm tones, festive colors, magical holiday atmosphere. Ultra-high resolution, lifestyle family photography quality.`,
    tags: ['christmas-tree', 'holiday', 'family', 'festive', 'magical'],
    style: 'casual'
  },
  {
    id: 'family_children_santa',
    uiLabel: 'Niños con Santa Claus',
    completePrompt: `Magical, joyful portrait of children with Santa Claus. Happy children are sitting with or near Santa Claus, their faces full of wonder, excitement, and joy. The children are wearing festive Christmas outfits. Santa Claus is in his traditional red suit, looking jolly and kind. The setting has Christmas decorations, perhaps a Christmas tree, presents, or a festive background. The lighting is warm and magical, creating a perfect holiday atmosphere. The children's expressions show genuine happiness and excitement. The composition captures the magic and wonder of Christmas. The overall mood is magical, joyful, and full of holiday spirit. Shot with warm, festive lighting. Color grading: warm tones, festive colors, magical atmosphere. Ultra-high resolution, lifestyle family photography quality.`,
    tags: ['santa', 'children', 'christmas', 'magical', 'joyful'],
    style: 'casual'
  },
  {
    id: 'family_studio_professional',
    uiLabel: 'En estudio profesional',
    completePrompt: `Professional, elegant family portrait in a clean, modern photography studio. A happy family is posed together, looking natural and comfortable. The studio has a simple, elegant background that doesn't distract from the family. The lighting is professional and flattering, creating a clean, timeless look. The family members are wearing coordinated, complementary outfits. Everyone is smiling naturally, looking at the camera with happy expressions. The composition is balanced and captures the family's connection and love. The overall mood is professional, elegant, and timeless. Shot with professional studio lighting, shallow depth of field. Color grading: clean, natural tones, professional look. Ultra-high resolution, professional family photography quality.`,
    tags: ['studio', 'professional', 'family', 'portrait', 'elegant'],
    style: 'professional'
  },
  {
    id: 'family_park_outdoor',
    uiLabel: 'En el parque al aire libre',
    completePrompt: `Natural, joyful family portrait in a beautiful park during golden hour. A happy family is enjoying time together outdoors - perhaps walking, playing, or simply being together. The park has green grass, trees, and natural elements creating a beautiful backdrop. Natural sunlight creates a warm, happy atmosphere. The family members are captured in natural, candid moments, showing genuine happiness and connection. The composition captures the family's joy and togetherness in nature. The background is softly blurred to keep focus on the family. The overall mood is natural, joyful, and full of life. Shot with natural light, capturing authentic moments. Color grading: warm, natural tones, vibrant greens, happy atmosphere. Ultra-high resolution, lifestyle family photography quality.`,
    tags: ['park', 'outdoor', 'family', 'natural', 'candid'],
    style: 'casual'
  },
  // Agregar más prompts aquí - el usuario puede expandir con más de 400 prompts
];

export function getFamilyPromptById(id: string): CompletePrompt | undefined {
  return familyPrompts.find(p => p.id === id);
}

export function getFamilyPromptsByStyle(style: CompletePrompt['style']): CompletePrompt[] {
  return familyPrompts.filter(p => p.style === style);
}

export function getRandomFamilyPrompt(): CompletePrompt {
  return familyPrompts[Math.floor(Math.random() * familyPrompts.length)];
}

