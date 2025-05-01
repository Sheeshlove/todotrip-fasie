
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { ProfileImagesCarousel } from './ProfileImagesCarousel';
import { ProfileFormContent } from './ProfileFormContent';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';

export const ProfileForm = () => {
  const { user, profile } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [profileImages, setProfileImages] = useState<string[]>(profile?.images || []);
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
    if (!user) return;
    
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
      throw error;
    }
  };

  const { isUpdating, needsSaving, setNeedsSaving, debouncedSave } = useFormAutoSave({
    form,
    userId: user?.id || '',
    onSave: (data) => saveProfile(data),
  });

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
        <ProfileFormContent
          form={form}
          selectedHobbies={selectedHobbies}
          setSelectedHobbies={setSelectedHobbies}
          isUpdating={isUpdating}
          needsSaving={needsSaving}
        />
      </div>
    </div>
  );
};
