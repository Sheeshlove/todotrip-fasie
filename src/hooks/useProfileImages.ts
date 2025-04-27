
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
      toast.error('Error uploading image');
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from('profiles')
        .remove([`${userId}/${path}`]);

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
