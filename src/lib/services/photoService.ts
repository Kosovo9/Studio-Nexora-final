/**
 * Photo Processing Service
 * Handles upload, generation, and management of photos
 * Updated with new category system
 */

import { supabase, STORAGE_BUCKETS, uploadToStorage, getPublicUrl } from '../supabase';
import { generateImageVersions, applyWatermark } from './aiService';
import type { PhotoCategory } from '../prompts/categoryPrompts';

export interface PhotoUpload {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  storagePath: string;
  publicUrl: string;
  category: PhotoCategory;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface GeneratedPhoto {
  id: string;
  uploadId: string;
  orderId: string;
  version: 'A' | 'B';
  storagePath: string;
  watermarkedPath: string;
  publicUrl: string;
  watermarkedUrl: string;
  prompt: string;
  status: 'generating' | 'ready' | 'delivered';
  createdAt: string;
}

/**
 * Upload multiple photos to Supabase Storage
 */
export async function uploadPhotos(
  files: File[],
  userId: string,
  category: PhotoCategory
): Promise<{ data: PhotoUpload[] | null; error: string | null }> {
  const uploads: PhotoUpload[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await uploadPhoto(file, userId, category);
    if (result.data) {
      uploads.push(result.data);
    } else if (result.error) {
      errors.push(`${file.name}: ${result.error}`);
    }
  }

  if (uploads.length === 0) {
    return { data: null, error: errors.join('; ') || 'Failed to upload photos' };
  }

  return { data: uploads, error: errors.length > 0 ? errors.join('; ') : null };
}

/**
 * Upload photo to Supabase Storage
 */
export async function uploadPhoto(
  file: File,
  userId: string,
  category: PhotoCategory
): Promise<{ data: PhotoUpload | null; error: string | null }> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { data: null, error: 'File must be an image' };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { data: null, error: 'File size must be less than 10MB' };
    }

    // Generate unique path
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${userId}/${timestamp}_${randomId}_${file.name}`;
    const path = `uploads/${fileName}`;

    // Upload to Storage
    const { data: uploadData, error: uploadError } = await uploadToStorage(
      STORAGE_BUCKETS.PHOTO_UPLOADS,
      path,
      file
    );

    if (uploadError) {
      return { data: null, error: uploadError.message };
    }

    // Get public URL
    const publicUrl = getPublicUrl(STORAGE_BUCKETS.PHOTO_UPLOADS, path);

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('photo_uploads')
      .insert({
        user_id: userId,
        storage_path: path,
        file_name: file.name,
        file_size: file.size,
        category,
        status: 'pending',
        metadata: {},
      })
      .select()
      .single();

    if (dbError) {
      // If DB insert fails, try to delete uploaded file
      await supabase.storage.from(STORAGE_BUCKETS.PHOTO_UPLOADS).remove([path]);
      return { data: null, error: dbError.message };
    }

    return {
      data: {
        id: dbData.id,
        userId: dbData.user_id,
        fileName: dbData.file_name,
        fileSize: dbData.file_size,
        storagePath: dbData.storage_path,
        publicUrl,
        category: dbData.category as PhotoCategory,
        status: dbData.status as any,
        createdAt: dbData.created_at,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to upload photo' };
  }
}

/**
 * Generate professional photos from uploaded photo
 */
export async function generatePhotos(
  uploadId: string,
  orderId: string,
  userId: string,
  prompt: string,
  style?: string
): Promise<{ data: GeneratedPhoto[] | null; error: string | null }> {
  try {
    // Get uploaded photo
    const { data: upload, error: uploadError } = await supabase
      .from('photo_uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (uploadError || !upload) {
      return { data: null, error: 'Upload not found' };
    }

    // Get public URL
    const originalUrl = getPublicUrl(STORAGE_BUCKETS.PHOTO_UPLOADS, upload.storage_path);

    // Update status to processing
    await supabase
      .from('photo_uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId);

    // Generate both versions
    const { versionA, versionB, error: genError } = await generateImageVersions(
      originalUrl,
      prompt,
      style
    );

    if (genError || !versionA || !versionB) {
      await supabase
        .from('photo_uploads')
        .update({ status: 'failed' })
        .eq('id', uploadId);
      return { data: null, error: genError || 'Failed to generate images' };
    }

    // Apply watermarks
    const watermarkedA = await applyWatermark(versionA.url);
    const watermarkedB = await applyWatermark(versionB.url);

    // Save generated photos to database
    const generatedPhotos: GeneratedPhoto[] = [];

    for (const version of [
      { data: versionA, watermarked: watermarkedA },
      { data: versionB, watermarked: watermarkedB },
    ]) {
      const { data: dbData, error: dbError } = await supabase
        .from('generated_photos')
        .insert({
          user_id: userId,
          order_id: orderId,
          original_upload_id: uploadId,
          version: version.data.version,
          storage_path: version.data.url, // In production, upload to Storage
          watermarked_path: version.watermarked,
          prompt_used: version.data.prompt,
          status: 'ready',
        })
        .select()
        .single();

      if (!dbError && dbData) {
        generatedPhotos.push({
          id: dbData.id,
          uploadId: dbData.original_upload_id,
          orderId: dbData.order_id,
          version: dbData.version as 'A' | 'B',
          storagePath: dbData.storage_path,
          watermarkedPath: dbData.watermarked_path,
          publicUrl: version.data.url,
          watermarkedUrl: version.watermarked,
          prompt: dbData.prompt_used,
          status: dbData.status as any,
          createdAt: dbData.created_at,
        });
      }
    }

    // Update upload status to completed
    await supabase
      .from('photo_uploads')
      .update({ status: 'completed' })
      .eq('id', uploadId);

    return { data: generatedPhotos, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to generate photos' };
  }
}

/**
 * Generate photos for multiple uploads
 */
export async function generatePhotosForUploads(
  uploadIds: string[],
  orderId: string,
  userId: string,
  prompts: string[],
  style?: string
): Promise<{ data: GeneratedPhoto[] | null; error: string | null }> {
  const allGenerated: GeneratedPhoto[] = [];
  const errors: string[] = [];

  for (let i = 0; i < uploadIds.length; i++) {
    const uploadId = uploadIds[i];
    const prompt = prompts[i] || prompts[0] || 'Professional portrait';
    
    const result = await generatePhotos(uploadId, orderId, userId, prompt, style);
    
    if (result.data) {
      allGenerated.push(...result.data);
    } else if (result.error) {
      errors.push(`Upload ${uploadId}: ${result.error}`);
    }
  }

  if (allGenerated.length === 0) {
    return { data: null, error: errors.join('; ') || 'Failed to generate photos' };
  }

  return { data: allGenerated, error: errors.length > 0 ? errors.join('; ') : null };
}

/**
 * Get user's photos
 */
export async function getUserPhotos(userId: string): Promise<{
  data: PhotoUpload[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('photo_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const photos: PhotoUpload[] = (data || []).map((item) => ({
      id: item.id,
      userId: item.user_id,
      fileName: item.file_name,
      fileSize: item.file_size,
      storagePath: item.storage_path,
      publicUrl: getPublicUrl(STORAGE_BUCKETS.PHOTO_UPLOADS, item.storage_path),
      category: item.category as PhotoCategory,
      status: item.status as any,
      createdAt: item.created_at,
    }));

    return { data: photos, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get photos' };
  }
}

/**
 * Get generated photos for an order
 */
export async function getOrderGeneratedPhotos(orderId: string): Promise<{
  data: GeneratedPhoto[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('generated_photos')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const photos: GeneratedPhoto[] = (data || []).map((item) => ({
      id: item.id,
      uploadId: item.original_upload_id,
      orderId: item.order_id,
      version: item.version as 'A' | 'B',
      storagePath: item.storage_path,
      watermarkedPath: item.watermarked_path,
      publicUrl: item.storage_path, // In production, get from Storage
      watermarkedUrl: item.watermarked_path,
      prompt: item.prompt_used,
      status: item.status as any,
      createdAt: item.created_at,
    }));

    return { data: photos, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get generated photos' };
  }
}
