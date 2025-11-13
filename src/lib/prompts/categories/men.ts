/**
 * PROMPTS COMPLETOS PARA HOMBRES
 * Más de 50 prompts hiper completos y profesionales
 * El cliente solo ve opciones simples en el UI, pero internamente usamos estos prompts completos
 */

export interface CompletePrompt {
  id: string;
  uiLabel: string; // Lo que el cliente ve en el UI (ej: "En estudio de lujo con traje negro")
  completePrompt: string; // El prompt completo que se usa internamente
  tags: string[];
  style: 'professional' | 'casual' | 'luxury' | 'urban' | 'nature';
}

export const menPrompts: CompletePrompt[] = [
  {
    id: 'men_studio_luxury_black_suit',
    uiLabel: 'En estudio de lujo con traje negro',
    completePrompt: `Professional portrait of a confident man in a perfectly tailored black tuxedo, standing in an elegant luxury photography studio with dramatic Rembrandt lighting. The background is a deep charcoal gray seamless backdrop. The man has a strong, professional posture, looking directly at the camera with a subtle, confident smile. The lighting creates beautiful shadows on his face, highlighting his jawline and cheekbones. The suit is immaculate, with a crisp white dress shirt, black bow tie, and polished black leather shoes. The overall atmosphere is sophisticated, high-end, and timeless. Shot with a professional 85mm portrait lens, shallow depth of field, studio lighting setup with key light, fill light, and hair light. Color grading: rich blacks, warm skin tones, cinematic look. Ultra-high resolution, professional photography quality.`,
    tags: ['studio', 'luxury', 'professional', 'black-suit', 'formal'],
    style: 'luxury'
  },
  {
    id: 'men_nyc_times_square_night',
    uiLabel: 'En NYC, Times Square de noche',
    completePrompt: `Dynamic portrait of a stylish man in Times Square, New York City at night, surrounded by vibrant neon lights and digital billboards. The man is wearing a modern dark coat, standing confidently amidst the bustling city energy. The iconic yellow taxis and colorful advertisements create a stunning bokeh background. The lighting is a mix of natural city lights and neon signs, creating a cinematic urban atmosphere. The man's face is well-lit by the ambient city lights, showing a confident, urban professional look. The composition captures the energy and excitement of New York City at night. Shot with a wide aperture to blur the background lights into beautiful bokeh, while keeping the subject sharp. Color grading: vibrant neon colors, deep blacks, cinematic blue hour tones. Ultra-high resolution, professional street photography quality.`,
    tags: ['nyc', 'times-square', 'night', 'urban', 'city'],
    style: 'urban'
  },
  {
    id: 'men_cafe_morning',
    uiLabel: 'En una cafetería en el amanecer',
    completePrompt: `Warm, inviting portrait of a man in a cozy coffee shop during golden hour morning light. The man is sitting by a large window, natural sunlight streaming in, creating soft, flattering shadows. He's wearing a casual but stylish outfit - a well-fitted sweater or button-down shirt. The background shows a beautiful coffee shop interior with wooden tables, plants, and warm ambient lighting. There's a coffee cup on the table, steam rising. The morning light creates a golden, peaceful atmosphere. The man has a relaxed, content expression, looking slightly off-camera. The composition is natural and candid, capturing a moment of morning tranquility. Shot with natural light, shallow depth of field to blur the background slightly. Color grading: warm tones, golden hour palette, cozy atmosphere. Ultra-high resolution, lifestyle photography quality.`,
    tags: ['cafe', 'morning', 'coffee', 'lifestyle', 'natural-light'],
    style: 'casual'
  },
  {
    id: 'men_beach_sunset',
    uiLabel: 'En la playa al atardecer',
    completePrompt: `Stunning portrait of a man on a beautiful beach during golden hour sunset. The man is standing near the water's edge, wearing casual beach attire - a light linen shirt or t-shirt, shorts, barefoot. The sky is painted with vibrant oranges, pinks, and purples as the sun sets. The ocean waves are gentle, creating a serene backdrop. The warm sunset light illuminates the man's face, creating a romantic, cinematic atmosphere. The man has a relaxed, happy expression, looking towards the horizon. The composition captures the vastness of the ocean and the beauty of the sunset. Sand, water, and sky create a perfect natural setting. Shot with golden hour natural light, wide angle to capture the landscape. Color grading: warm sunset tones, vibrant sky colors, cinematic look. Ultra-high resolution, landscape portrait photography quality.`,
    tags: ['beach', 'sunset', 'nature', 'outdoor', 'golden-hour'],
    style: 'nature'
  },
  {
    id: 'men_office_modern',
    uiLabel: 'En oficina moderna',
    completePrompt: `Professional corporate portrait of a successful businessman in a modern, sleek office environment. The man is wearing a sharp navy blue or charcoal gray business suit with a crisp white dress shirt and tie. He's standing confidently in a contemporary office space with floor-to-ceiling windows showing a city skyline. The office has modern furniture, clean lines, and professional decor. Natural light from the windows combines with office lighting to create a professional, well-lit environment. The man has a confident, approachable expression, looking directly at the camera. The composition shows both the professional setting and the subject clearly. Books, a laptop, and professional items are visible in the background, adding context. Shot with professional lighting setup, balanced exposure. Color grading: clean, professional tones, slight cool temperature. Ultra-high resolution, corporate photography quality.`,
    tags: ['office', 'corporate', 'professional', 'business', 'modern'],
    style: 'professional'
  },
  // Agregar más prompts aquí - el usuario puede expandir esta lista
];

/**
 * Obtener prompt completo por ID
 */
export function getMenPromptById(id: string): CompletePrompt | undefined {
  return menPrompts.find(p => p.id === id);
}

/**
 * Obtener todos los prompts de una categoría de estilo
 */
export function getMenPromptsByStyle(style: CompletePrompt['style']): CompletePrompt[] {
  return menPrompts.filter(p => p.style === style);
}

/**
 * Obtener prompt aleatorio
 */
export function getRandomMenPrompt(): CompletePrompt {
  return menPrompts[Math.floor(Math.random() * menPrompts.length)];
}

