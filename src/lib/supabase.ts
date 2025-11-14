import { createClient } from '@supabase/supabase-js';
import { logger } from './utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage buckets
export const STORAGE_BUCKETS = {
  PHOTO_UPLOADS: 'photo-uploads',
  GENERATED_PHOTOS: 'generated-photos',
  WATERMARKED_PREVIEWS: 'watermarked-previews',
} as const;

// Helper function to upload file to Supabase Storage
export async function uploadToStorage(
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
): Promise<{ data: { path: string } | null; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: options?.upsert || false,
    });

  return { data, error };
}

// Helper function to get public URL from Storage
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Helper function to download file from Storage
export async function downloadFromStorage(
  bucket: string,
  path: string
): Promise<{ data: Blob | null; error: any }> {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  return { data, error };
}

// Helper function to delete file from Storage
export async function deleteFromStorage(
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  return { data, error };
}
