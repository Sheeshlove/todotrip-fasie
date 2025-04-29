import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HobbiesDialog } from '@/components/HobbiesDialog';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { russianCities } from '@/data/cities';
import { useGeolocation } from '@/hooks/useGeolocation';

export const ProfileForm = () => {
  const { user, profile } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const { city: detectedCity, status: geoStatus, error: geoError, detectCity } = useGeolocation();

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
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.name,
          age: values.age,
          description: values.description,
          hobbies: values.hobbies,
          city: values.city,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Профиль обновлен');
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
      toast.success('Фото профиля обновлено');
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Ошибка обновления фото профиля');
    }
  };

  // Effect to update city when detected
  const handleDetectCity = () => {
    detectCity();
  };

  // Set detected city in form when available
  const handleSetDetectedCity = () => {
    if (detectedCity) {
      form.setValue('city', detectedCity);
      toast.success(`Город успешно определен: ${detectedCity}`);
    }
  };
  
  React.useEffect(() => {
    if (geoStatus === 'success' && detectedCity) {
      handleSetDetectedCity();
    } else if (geoStatus === 'error' && geoError) {
      toast.error(geoError);
    }
  }, [geoStatus, detectedCity, geoError]);

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Ваше имя" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Возраст</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Ваш возраст" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Город</FormLabel>
                <div className="space-y-2">
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-todoMediumGray" />
                        <SelectValue placeholder="Выберите город" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
                      {russianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center justify-center gap-2 mt-1"
                    onClick={handleDetectCity}
                    disabled={geoStatus === 'loading'}
                  >
                    {geoStatus === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Определение...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4" />
                        Определить автоматически
                      </>
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hobbies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Хобби</FormLabel>
                <HobbiesDialog
                  selectedHobbies={selectedHobbies}
                  onHobbiesChange={(hobbies) => {
                    setSelectedHobbies(hobbies);
                    field.onChange(hobbies);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">О себе</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Расскажите о себе"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
