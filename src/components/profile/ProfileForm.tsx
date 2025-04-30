import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';

import { PersonalInfoForm } from './PersonalInfoForm';
import { LocationSelector } from './LocationSelector';
import { HobbiesSelector } from './HobbiesSelector';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';

export const ProfileForm = () => {
  const { user, profile } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.username || '',
      age: profile?.age || '',
      description: profile?.description || '',
      hobbies: profile?.hobbies || [],
      city: profile?.city || '',
    },
  });

  const updateProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      console.log("Submitting profile with hobbies:", selectedHobbies);
      
      const { error, data } = await supabase
        .from('profiles')
        .update({
          username: values.name,
          age: values.age,
          description: values.description,
          hobbies: selectedHobbies, // Use selectedHobbies state here
          city: values.city,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select();

      if (error) throw error;
      
      // Clear and update the profile cache
      localStorage.removeItem(`profile_${user.id}`);
      localStorage.removeItem(`profile_${user.id}_time`);
      
      if (data && data.length > 0) {
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(data[0]));
        localStorage.setItem(`profile_${user.id}_time`, Date.now().toString());
      }
      
      toast.success('Профиль обновлен');
      
      // Force a page reload to show updated profile
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка обновления профиля');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateProfileImage = async (url: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Clear the profile cache in localStorage
      localStorage.removeItem(`profile_${user.id}`);
      localStorage.removeItem(`profile_${user.id}_time`);
      
      toast.success('Фото профиля обновлено');
      
      // Force a page reload to ensure the updated profile is displayed
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Ошибка обновления фото профиля');
    }
  };

  if (!user) {
    return <div className="text-center text-white">Загрузка профиля...</div>;
  }

  return (
    <>
      <ProfileImageUpload 
        userId={user.id}
        currentImage={profile?.avatar_url || null}
        onImageUpdate={updateProfileImage}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-6 mt-6">
          <PersonalInfoForm form={form} />
          <LocationSelector form={form} />
          <HobbiesSelector 
            form={form} 
            selectedHobbies={selectedHobbies} 
            setSelectedHobbies={setSelectedHobbies} 
          />

          <Button 
            type="submit" 
            className="w-full bg-todoYellow text-black hover:bg-yellow-400"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
