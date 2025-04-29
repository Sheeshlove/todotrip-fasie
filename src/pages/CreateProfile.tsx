
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { HobbiesDialog } from '@/components/HobbiesDialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import * as z from 'zod';
import { russianCities } from '@/data/cities';
import { useGeolocation } from '@/hooks/useGeolocation';

const profileSchema = z.object({
  name: z.string().min(1, { message: "Введите ваше имя" }),
  age: z.string().min(1, { message: "Введите ваш возраст" }),
  description: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CreateProfile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    if (geoStatus === 'success' && detectedCity) {
      form.setValue('city', detectedCity);
      toast.success(`Город успешно определен: ${detectedCity}`);
    } else if (geoStatus === 'error' && geoError) {
      toast.error(geoError);
    }
  }, [geoStatus, detectedCity, geoError, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
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
      navigate('/profile');
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="ТуДуТрип - Создание профиля" description="Создайте свой профиль">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-todoDarkGray rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-todoYellow">Создание профиля</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Input type="number" placeholder="Ваш возраст" {...field} />
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
                          onClick={detectCity}
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
                      <div className="bg-todoBlack rounded-lg p-4">
                        <HobbiesDialog
                          selectedHobbies={selectedHobbies}
                          onHobbiesChange={(hobbies) => {
                            setSelectedHobbies(hobbies);
                            field.onChange(hobbies);
                          }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Описание (необязательно)</FormLabel>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить профиль'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateProfile;
