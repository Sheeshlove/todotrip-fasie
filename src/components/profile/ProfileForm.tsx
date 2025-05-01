
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
  const {
    user,
    profile
  } = useAuth();
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
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Auto-save profile when form values change (with debouncing)
  const saveProfile = async (values: ProfileFormValues) => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    setNeedsSaving(false);
    try {
      const {
        error,
        data
      } = await supabase.from('profiles').update({
        username: values.name,
        age: values.age,
        description: values.description,
        hobbies: selectedHobbies,
        city: values.city,
        smoking_attitude: values.smokingAttitude,
        drinking_attitude: values.drinkingAttitude,
        images: profileImages,
        updated_at: new Date().toISOString()
      }).eq('id', user.id).select();
      if (error) throw error;

      // Update cache
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

  // Debounced save function
  const debouncedSave = React.useCallback(debounce((data: ProfileFormValues) => saveProfile(data), 1000), [user, selectedHobbies, profileImages]);

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
  useBeforeUnload(React.useCallback(event => {
    if (needsSaving) {
      saveProfile(form.getValues());
      // Standard message for beforeunload dialog
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
      const {
        error
      } = await supabase.from('profiles').update({
        avatar_url: url,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;

      // Clear the profile cache in localStorage
      localStorage.removeItem(`profile_${user.id}`);
      localStorage.removeItem(`profile_${user.id}_time`);
      toast.success('Фото профиля обновлено');

      // No need to reload - just update the UI
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
    setNeedsSaving(true);
    // This will trigger the form.watch effect which will save the profile
  };

  if (!user) {
    return <div className="text-center text-white">Загрузка профиля...</div>;
  }
  return <>
      <ProfileImageUpload userId={user.id} currentImage={profile?.avatar_url || null} onImageUpdate={updateProfileImage} />
      
      <ProfileImagesCarousel userId={user.id} images={profileImages} onImagesUpdate={updateProfileImages} />

      <Form {...form}>
        <div className="space-y-6 mt-6">
          <PersonalInfoForm form={form} />
          <LocationSelector form={form} />
          <HobbiesSelector form={form} selectedHobbies={selectedHobbies} setSelectedHobbies={setSelectedHobbies} />
          <AttitudesSection form={form} />
          
          {/* Status indicator instead of a save button */}
          <div className="flex items-center justify-end text-sm">
            {isUpdating ? <div className="flex items-center text-gray-400">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </div> : needsSaving ? <div className="text-amber-400">Ожидание сохранения...</div> : <div className="text-green-400 py-0 my-0 mx-0 px-[59px] rounded-none">Все изменения сохранены</div>}
          </div>
        </div>
      </Form>
    </>;
};
