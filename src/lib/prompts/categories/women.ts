/**
 * PROMPTS COMPLETOS PARA MUJERES
 * Más de 50 prompts hiper completos y profesionales
 */

import { CompletePrompt } from './men';

export const womenPrompts: CompletePrompt[] = [
  {
    id: 'women_studio_luxury_black_dress',
    uiLabel: 'En estudio de lujo con vestido negro',
    completePrompt: `Elegant and sophisticated portrait of a beautiful woman in a stunning black evening dress, photographed in a luxury photography studio with professional lighting. The dress is elegant and form-fitting, with delicate details. The woman has flawless makeup, styled hair, and is wearing elegant jewelry - perhaps a statement necklace or earrings. The background is a deep, rich backdrop that complements the elegance. The lighting is soft and flattering, using butterfly lighting or Rembrandt lighting to create beautiful shadows and highlights. The woman has a confident, graceful pose, looking directly at the camera with a subtle, elegant smile. The overall atmosphere is high-fashion, luxurious, and timeless. Shot with an 85mm portrait lens, shallow depth of field, professional studio lighting. Color grading: rich blacks, warm skin tones, cinematic elegance. Ultra-high resolution, fashion photography quality.`,
    tags: ['studio', 'luxury', 'elegant', 'black-dress', 'formal'],
    style: 'luxury'
  },
  {
    id: 'women_nyc_times_square_night',
    uiLabel: 'En NYC, Times Square de noche',
    completePrompt: `Dynamic and vibrant portrait of a stylish woman in Times Square, New York City at night. She's wearing a fashionable coat or jacket, standing confidently amidst the iconic neon lights and digital billboards. The colorful city lights create a stunning, energetic backdrop. The woman's face is beautifully lit by the ambient neon lights, creating a modern, urban glamour look. The composition captures the excitement and energy of New York City at night. The background shows the famous Times Square atmosphere with lights, signs, and the urban energy. Shot with wide aperture for beautiful bokeh background, keeping the subject sharp. Color grading: vibrant neon colors, cinematic urban tones, modern look. Ultra-high resolution, street fashion photography quality.`,
    tags: ['nyc', 'times-square', 'night', 'urban', 'fashion'],
    style: 'urban'
  },
  {
    id: 'women_cafe_morning',
    uiLabel: 'En una cafetería en el amanecer',
    completePrompt: `Warm, natural portrait of a woman in a beautiful coffee shop during golden hour morning light. She's sitting by a large window, natural sunlight creating soft, flattering illumination. She's wearing a cozy, stylish outfit - perhaps a sweater, cardigan, or casual blouse. The coffee shop has a warm, inviting atmosphere with wooden furniture, plants, and ambient lighting. There's a coffee cup on the table, steam gently rising. The morning light creates a golden, peaceful glow. The woman has a relaxed, content expression, looking naturally at the camera or slightly away. The composition feels candid and authentic, capturing a moment of morning tranquility. Shot with natural light, shallow depth of field. Color grading: warm golden tones, cozy atmosphere, lifestyle photography look. Ultra-high resolution, lifestyle photography quality.`,
    tags: ['cafe', 'morning', 'coffee', 'lifestyle', 'natural'],
    style: 'casual'
  },
  {
    id: 'women_beach_sunset',
    uiLabel: 'En la playa al atardecer',
    completePrompt: `Stunning portrait of a woman on a beautiful beach during golden hour sunset. She's wearing a flowing dress or beach attire, standing near the water's edge. The sky is painted with vibrant sunset colors - oranges, pinks, and purples. The ocean creates a serene, romantic backdrop. The warm sunset light creates a beautiful glow on her face and hair. The woman has a relaxed, happy expression, perhaps looking towards the horizon or at the camera. The composition captures both the natural beauty of the beach and the elegance of the subject. The wind might be gently moving her hair and dress, adding movement. Shot with golden hour natural light, wide angle to capture the landscape. Color grading: warm sunset tones, vibrant sky, romantic atmosphere. Ultra-high resolution, landscape portrait photography quality.`,
    tags: ['beach', 'sunset', 'nature', 'romantic', 'golden-hour'],
    style: 'nature'
  },
  {
    id: 'women_office_modern',
    uiLabel: 'En oficina moderna',
    completePrompt: `Professional corporate portrait of a successful businesswoman in a modern, elegant office. She's wearing a sharp business suit or professional blazer with a blouse, looking confident and approachable. The office has modern design, floor-to-ceiling windows showing a city skyline, contemporary furniture. Natural light from windows combines with professional office lighting. The woman has a confident, professional expression, looking directly at the camera. The composition shows both the professional environment and the subject clearly. Professional items like a laptop, books, or modern office decor are visible. The overall atmosphere is professional, modern, and empowering. Shot with balanced professional lighting. Color grading: clean, professional tones, slight cool temperature. Ultra-high resolution, corporate photography quality.`,
    tags: ['office', 'corporate', 'professional', 'business', 'modern'],
    style: 'professional'
  },
  // Agregar más prompts aquí
];

export function getWomenPromptById(id: string): CompletePrompt | undefined {
  return womenPrompts.find(p => p.id === id);
}

export function getWomenPromptsByStyle(style: CompletePrompt['style']): CompletePrompt[] {
  return womenPrompts.filter(p => p.style === style);
}

export function getRandomWomenPrompt(): CompletePrompt {
  return womenPrompts[Math.floor(Math.random() * womenPrompts.length)];
}

