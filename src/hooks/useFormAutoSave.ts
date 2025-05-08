
import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Utility function to debounce function calls
export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

interface UseFormAutoSaveProps<T> {
  form: UseFormReturn<T>;
  userId: string;
  onSave?: (data: T) => void;
  saveDelay?: number;
}

export const useFormAutoSave = <T extends Record<string, any>>({
  form,
  userId,
  onSave,
  saveDelay = 1000
}: UseFormAutoSaveProps<T>) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Save profile function
  const saveData = async (values: T) => {
    if (!userId || isUpdating) return;
    
    setIsUpdating(true);
    setNeedsSaving(false);
    
    try {
      onSave?.(values);
    } catch (error) {
      toast.error('Ошибка сохранения');
      setNeedsSaving(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Debounced save function for form changes
  const debouncedSave = useCallback(
    debounce((data: T) => saveData(data), saveDelay), 
    [userId]
  );

  return {
    isUpdating,
    needsSaving, 
    setNeedsSaving,
    saveData,
    debouncedSave
  };
};
