/**
 * AI Image Generation Service
 * Uses Google AI Studio (Gemini) for prompt enhancement
 * Note: Gemini doesn't generate images directly, so we use it for prompt optimization
 * and then call an image generation API (Replicate, Stability AI, etc.)
 */

const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyCkL5za2v-SmEd778ba-sUBuO6ldRVJPbE';
const GOOGLE_AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface ImageGenerationOptions {
  prompt: string;
  version: 'A' | 'B'; // A = similar, B = enhanced
  originalImageUrl?: string;
  style?: string;
}

export interface GeneratedImage {
  url: string;
  version: 'A' | 'B';
  prompt: string;
}

/**
 * Enhance prompt using Google AI Studio (Gemini)
 * Gemini is excellent for prompt optimization and enhancement
 */
async function enhancePromptWithGemini(
  basePrompt: string,
  version: 'A' | 'B',
  style?: string
): Promise<string> {
  try {
    if (!GOOGLE_AI_API_KEY) {
      // Fallback to manual enhancement if API key not available
      return enhancePrompt(basePrompt, version, style);
    }

    const systemPrompt = version === 'A'
      ? 'You are a professional photography prompt engineer. Enhance this prompt for a professional studio portrait that maintains 100% similarity to the original subject. Focus on natural lighting, professional quality, and preserving facial characteristics. Return only the enhanced prompt.'
      : 'You are a professional photography prompt engineer. Enhance this prompt for an enhanced professional portrait with artistic improvements. Focus on cinematic lighting, luxury studio quality, and realistic enhancement while maintaining the subject\'s essence. Return only the enhanced prompt.';

    const userPrompt = style
      ? `Base prompt: "${basePrompt}". Style: ${style}. Create an optimized prompt for ${version === 'A' ? 'similar' : 'enhanced'} professional photography.`
      : `Base prompt: "${basePrompt}". Create an optimized prompt for ${version === 'A' ? 'similar' : 'enhanced'} professional photography.`;

    const response = await fetch(`${GOOGLE_AI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const enhancedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (enhancedPrompt) {
      return enhancedPrompt;
    }

    // Fallback to manual enhancement
    return enhancePrompt(basePrompt, version, style);
  } catch (error: any) {
    console.warn('Failed to enhance prompt with Gemini, using manual enhancement:', error);
    return enhancePrompt(basePrompt, version, style);
  }
}

/**
 * Generate image using Google AI Studio (Gemini) for prompt enhancement
 * Then calls an image generation API
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<{ data: GeneratedImage | null; error: string | null }> {
  try {
    // Enhance prompt using Gemini
    const enhancedPrompt = await enhancePromptWithGemini(
      options.prompt,
      options.version,
      options.style
    );

    // Generate image using external API
    const imageUrl = await generateImageWithAPI(enhancedPrompt, options.version);

    return {
      data: {
        url: imageUrl,
        version: options.version,
        prompt: enhancedPrompt,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Error generating image:', error);
    return { data: null, error: error.message || 'Failed to generate image' };
  }
}

/**
 * Enhance prompt based on version type (fallback method)
 */
function enhancePrompt(
  basePrompt: string,
  version: 'A' | 'B',
  style?: string
): string {
  if (version === 'A') {
    // Version A: Similar to original, professional studio quality
    return `Professional studio portrait, ${basePrompt}, high quality, 4K resolution, natural lighting, professional photography, similar to original features, maintaining facial characteristics`;
  } else {
    // Version B: Enhanced, more artistic
    return `Enhanced professional portrait, ${basePrompt}, ${style || 'luxury studio'}, high quality, 4K resolution, cinematic lighting, professional photography, realistic enhancement, maintaining essence`;
  }
}

/**
 * Generate image using external API
 * This is a placeholder - replace with actual image generation API
 * Options:
 * 1. Replicate API (Stable Diffusion, Flux, etc.) - Recommended
 * 2. Stability AI API
 * 3. OpenAI DALL-E
 * 4. Midjourney API (if available)
 */
async function generateImageWithAPI(
  prompt: string,
  version: 'A' | 'B'
): Promise<string> {
  // TODO: Replace with actual image generation API
  // Example with Replicate:
  /*
  const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;
  const model = version === 'A' 
    ? 'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf'
    : 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
  
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model,
      input: { prompt, num_outputs: 1 },
    }),
  });
  
  const data = await response.json();
  // Poll for completion...
  return data.output[0];
  */

  // For now, return a placeholder
  // In production, make actual API call here
  return `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800`;
}

/**
 * Generate multiple versions of an image
 */
export async function generateImageVersions(
  originalImageUrl: string,
  prompt: string,
  style?: string
): Promise<{ versionA: GeneratedImage | null; versionB: GeneratedImage | null; error: string | null }> {
  try {
    const [resultA, resultB] = await Promise.all([
      generateImage({ prompt, version: 'A', originalImageUrl, style }),
      generateImage({ prompt, version: 'B', originalImageUrl, style }),
    ]);

    return {
      versionA: resultA.data,
      versionB: resultB.data,
      error: resultA.error || resultB.error || null,
    };
  } catch (error: any) {
    return {
      versionA: null,
      versionB: null,
      error: error.message || 'Failed to generate image versions',
    };
  }
}

/**
 * Apply watermark to image
 */
export async function applyWatermark(imageUrl: string): Promise<string> {
  // TODO: Implement watermarking
  // Options:
  // 1. Use canvas API to draw watermark
  // 2. Use server-side image processing
  // 3. Use Supabase Edge Function
  
  // For now, return original URL
  return imageUrl;
}

/**
 * Remove watermark from image (after payment)
 */
export async function removeWatermark(imageUrl: string): Promise<string> {
  // In production, this would return the original unwatermarked image
  // stored separately in Storage
  return imageUrl;
}
