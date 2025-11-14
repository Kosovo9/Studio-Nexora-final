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
  const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;
  
  // Si no hay token de Replicate, usar Stability AI como fallback
  if (!REPLICATE_API_TOKEN) {
    console.warn('Replicate API token not configured, using Stability AI fallback');
    return await generateImageWithStabilityAI(prompt, version);
  }

  try {
    // Modelos optimizados para 2025
    const model = version === 'A' 
      ? 'stability-ai/stable-diffusion-xl-base-1.0:49ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'
      : 'stability-ai/flux-dev:38f1b130ceb4acfaf465be304a90c03b6ed5af8b3e1781b458be9c0f3e178e76';
    
    // Crear predicción
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model,
        input: { 
          prompt,
          num_outputs: 1,
          aspect_ratio: '2:3',
          output_format: 'webp',
          output_quality: 90
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    
    // Polling para obtener resultado
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      });
      result = await statusResponse.json();
    }

    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      return result.output[0];
    } else {
      throw new Error(`Generation failed: ${result.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Replicate API error:', error);
    // Fallback a Stability AI
    return await generateImageWithStabilityAI(prompt, version);
  }
}

/**
 * Fallback: Generate image using Stability AI
 */
async function generateImageWithStabilityAI(
  prompt: string,
  version: 'A' | 'B'
): Promise<string> {
  const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
  
  if (!STABILITY_API_KEY) {
    console.warn('No image generation API configured, using placeholder');
    return `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800`;
  }

  try {
    const engineId = version === 'A' 
      ? 'stable-diffusion-xl-1024-v1-0'
      : 'stable-diffusion-xl-1024-v1-0';
    
    const response = await fetch(
      `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          height: 1024,
          width: 768,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.artifacts && data.artifacts.length > 0) {
      // Convertir base64 a URL
      const base64 = data.artifacts[0].base64;
      return `data:image/png;base64,${base64}`;
    }
    
    throw new Error('No image generated');
  } catch (error: any) {
    console.error('Stability AI error:', error);
    // Último fallback: placeholder
    return `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800`;
  }
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
