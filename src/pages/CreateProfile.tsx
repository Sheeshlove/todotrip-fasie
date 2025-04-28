import { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, { message: "Введите ваше имя" }),
  age: z.string().min(1, { message: "Введите ваш возраст" }),
  description: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CreateProfile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.username || '',
      age: profile?.age || '',
      description: profile?.description || '',
      hobbies: profile?.hobbies || [],
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.name,
          age: values.age,
          description: values.description,
          hobbies: values.hobbies,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Профиль обновлен');
      navigate('/profile');
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
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
                >
                  Сохранить профиль
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
