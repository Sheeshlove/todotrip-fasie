
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { PersonalInfoForm } from './PersonalInfoForm';
import { LocationSelector } from './LocationSelector';
import { HobbiesSelector } from './HobbiesSelector';
import { AttitudesSection } from './AttitudesSection';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { ProfileImagesCarousel } from './ProfileImagesCarousel';

// Utility function to debounce function calls
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const ProfileForm = () => {
  const { user, profile } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [profileImages, setProfileImages] = useState<string[]>(profile?.images || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [needsSaving, setNeedsSaving] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.username || '',
      age: profile?.age || '',
      description: profile?.description || '',
      hobbies: profile?.hobbies || [],
      city: profile?.city || '',
      smokingAttitude: profile?.smoking_attitude || '',
      drinkingAttitude: profile?.drinking_attitude || ''
    },
    mode: 'onBlur'
  });

  // Save profile function
  const saveProfile = async (values: ProfileFormValues, images?: string[]) => {
    if (!user || isUpdating) return;
    
    setIsUpdating(true);
    setNeedsSaving(false);
    
    try {
      const imagesToSave = images || profileImages;
      
      const { error, data } = await supabase.from('profiles').update({
        username: values.name,
        age: values.age,
        description: values.description,
        hobbies: selectedHobbies,
        city: values.city,
        smoking_attitude: values.smokingAttitude,
        drinking_attitude: values.drinkingAttitude,
        images: imagesToSave,
        updated_at: new Date().toISOString()
      }).eq('id', user.id).select();
      
      if (error) throw error;

      // Clear cache and update local storage
      if (data && data.length > 0) {
        localStorage.removeItem(`profile_${user.id}`);
        localStorage.removeItem(`profile_${user.id}_time`);
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(data[0]));
        localStorage.setItem(`profile_${user.id}_time`, Date.now().toString());
      }
      
      toast.success('Изменения сохранены', {
        position: 'bottom-right',
        duration: 2000
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка сохранения');
      setNeedsSaving(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Debounced save function for form changes
  const debouncedSave = useCallback(
    debounce((data: ProfileFormValues) => saveProfile(data), 1000), 
    [user, selectedHobbies, profileImages]
  );

  // Watch form changes and trigger auto-save
  useEffect(() => {
    const subscription = form.watch(data => {
      if (user) {
        setNeedsSaving(true);
        debouncedSave(data as ProfileFormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedSave, user, profileImages]);

  // Save on page exit
  useBeforeUnload(useCallback(event => {
    if (needsSaving) {
      saveProfile(form.getValues());
      event.preventDefault();
      event.returnValue = '';
    }
  }, [needsSaving, form]));

  // Save when navigating away using React Router
  useEffect(() => {
    return () => {
      if (needsSaving) {
        saveProfile(form.getValues());
      }
    };
  }, [needsSaving]);

  // Handle image updates
  const updateProfileImage = async (url: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('profiles').update({
        avatar_url: url,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      
      if (error) throw error;

      localStorage.removeItem(`profile_${user.id}`);
      localStorage.removeItem(`profile_${user.id}_time`);

      if (profile) {
        profile.avatar_url = url;
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Ошибка обновления фото профиля');
    }
  };

  // Handle multiple profile images update
  const updateProfileImages = (urls: string[]) => {
    setProfileImages(urls);
    saveProfile(form.getValues(), urls);
  };

  if (!user) {
    return <div className="text-center text-white">Загрузка профиля...</div>;
  }
  
  return (
    <div className="space-y-8">
      <ProfileImageUpload 
        userId={user.id} 
        currentImage={profile?.avatar_url || null} 
        onImageUpdate={updateProfileImage} 
      />
      
      <ProfileImagesCarousel 
        userId={user.id} 
        images={profileImages} 
        onImagesUpdate={updateProfileImages} 
      />

      <div className="bg-todoDarkGray/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-lg">
        <Form {...form}>
          <div className="space-y-8">
            <PersonalInfoForm form={form} />
            <LocationSelector form={form} />
            <HobbiesSelector form={form} selectedHobbies={selectedHobbies} setSelectedHobbies={setSelectedHobbies} />
            <AttitudesSection form={form} />
            
            {/* Status indicator */}
            <div className="flex items-center justify-end text-sm">
              {isUpdating ? (
                <div className="flex items-center bg-black/20 px-4 py-2 rounded-full">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-todoYellow" />
                  <span className="text-gray-300">Сохранение...</span>
                </div>
              ) : needsSaving ? (
                <div className="flex items-center bg-amber-900/20 text-amber-300 px-4 py-2 rounded-full">
                  <span className="text-xs">Ожидание сохранения...</span>
                </div>
              ) : (
                <div className="flex items-center bg-green-900/20 text-green-300 px-4 py-2 rounded-full">
                  <Save className="w-4 h-4 mr-1" />
                  <span className="text-xs">Все изменения сохранены</span>
                </div>
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
