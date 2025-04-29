import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define allowed mime types and max file size
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_MB = 5; // 5MB max file size

export const useProfileImages = (userId: string) => {
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return { 
        valid: false, 
        message: `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE_MB}MB` 
      };
    }
    
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        message: 'Недопустимый тип файла. Разрешены только JPEG, PNG, WebP и GIF' 
      };
    }

    return { valid: true };
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      // Validate file before uploading
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.message);
        return null;
      }

      setUploading(true);
      
      // Create a safe filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const sanitizedFileName = `${path}_${timestamp}_${randomString}.${fileExt}`;
      const filePath = `${userId}/${sanitizedFileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type // Set the correct content-type
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string) => {
    try {
      // Validate the path to ensure it belongs to the current user
      if (!path.startsWith(`${userId}/`)) {
        path = `${userId}/${path}`;
      }
      
      const { error } = await supabase.storage
        .from('profiles')
        .remove([path]);

      if (error) {
        throw error;
      }
    } catch (error) {
      toast.error('Error deleting image');
      console.error('Error deleting image:', error);
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};
