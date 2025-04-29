import React, { useState, lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';

// Base components loaded immediately
import { PersonalInfoForm } from './PersonalInfoForm';

// Dynamically import heavier components that aren't needed immediately
const LocationSelector = lazy(() => import('./LocationSelector').then(mod => ({ default: mod.LocationSelector })));
const HobbiesSelector = lazy(() => import('./HobbiesSelector').then(mod => ({ default: mod.HobbiesSelector })));
const ProfileImageUpload = lazy(() => import('@/components/ProfileImageUpload'));

// Simple loading component for Suspense fallbacks
const LoadingField = () => (
  <div className="flex items-center space-x-2 p-4 border rounded-md animate-pulse">
    <Loader2 className="h-4 w-4 animate-spin text-todoYellow" />
    <span className="text-todoYellow text-sm">Загрузка...</span>
  </div>
);

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

  const updateProfile = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Update the profile with the form data
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.name,
          age: data.age,
          description: data.description,
          hobbies: selectedHobbies,
          city: data.city,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Профиль успешно обновлен');
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
      
      // Update profile in context instead of reloading the page
      if (profile) {
        // Create an updated profile
        const updatedProfile = {
          ...profile,
          avatar_url: url,
          updated_at: new Date().toISOString()
        };
        
        // Update the cache directly if cache mechanism is used in AuthContext
        if (window.updateProfileCache && typeof window.updateProfileCache === 'function') {
          window.updateProfileCache(user.id, updatedProfile);
        }
      }
      
      toast.success('Фото профиля обновлено');
    } catch (error: any) {
      console.error('Error updating profile image:', error);
      toast.error('Ошибка обновления фото профиля');
    }
  };

  if (!user) {
    return <div className="text-center text-white">Загрузка профиля...</div>;
  }

  return (
    <>
      <Suspense fallback={<LoadingField />}>
        <ProfileImageUpload 
          userId={user.id}
          currentImage={profile?.avatar_url || null}
          onImageUpdate={updateProfileImage}
        />
      </Suspense>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-6 mt-6">
          <PersonalInfoForm form={form} />
          
          <Suspense fallback={<LoadingField />}>
            <LocationSelector form={form} />
          </Suspense>
          
          <Suspense fallback={<LoadingField />}>
            <HobbiesSelector 
              form={form} 
              selectedHobbies={selectedHobbies} 
              setSelectedHobbies={setSelectedHobbies} 
            />
          </Suspense>

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
