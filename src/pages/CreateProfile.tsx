
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { LocationSelector } from '@/components/profile/LocationSelector';
import { HobbiesSelector } from '@/components/profile/HobbiesSelector';
import { AttitudesSection } from '@/components/profile/AttitudesSection';

const CreateProfile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.username || '',
      age: profile?.age || '',
      description: profile?.description || '',
      hobbies: profile?.hobbies || [],
      city: profile?.city || '',
      smokingAttitude: profile?.smoking_attitude || '',
      drinkingAttitude: profile?.drinking_attitude || '',
    },
  });

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
          smoking_attitude: values.smokingAttitude,
          drinking_attitude: values.drinkingAttitude,
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
                <PersonalInfoForm form={form} />
                <LocationSelector form={form} />
                <HobbiesSelector 
                  form={form} 
                  selectedHobbies={selectedHobbies} 
                  setSelectedHobbies={setSelectedHobbies} 
                />
                <AttitudesSection form={form} />

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
