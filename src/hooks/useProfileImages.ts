
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfileImages = (userId: string) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${path}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      toast.error('Ошибка загрузки изображения');
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string) => {
    try {
      // Ensure path is properly formatted
      const formattedPath = path.includes(userId) ? path : `${userId}/${path}`;
      
      const { error } = await supabase.storage
        .from('profiles')
        .remove([formattedPath]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      toast.error('Ошибка удаления изображения');
      console.error('Error deleting image:', error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};
