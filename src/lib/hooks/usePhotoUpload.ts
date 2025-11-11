import { useState } from 'react';
import { uploadPhoto, type PhotoUpload } from '../services/photoService';

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    file: File,
    userId: string,
    category: 'person' | 'pet' | 'family' | 'team'
  ): Promise<PhotoUpload | null> => {
    setUploading(true);
    setError(null);

    try {
      const { data, error: uploadError } = await uploadPhoto(file, userId, category);
      
      if (uploadError) {
        setError(uploadError);
        return null;
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}

