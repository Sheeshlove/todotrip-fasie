
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
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HobbiesDialog } from '@/components/HobbiesDialog';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { Loader2 } from 'lucide-react';
import { profileSchema, passwordChangeSchema, emailChangeSchema } from '@/lib/validations/profile';
import type { ProfileFormValues, PasswordChangeValues, EmailChangeValues } from '@/lib/validations/profile';

export const ProfileEditor = () => {
  const { user, profile, signOut } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.username || '',
      age: profile?.age || '',
      description: profile?.description || '',
      hobbies: profile?.hobbies || [],
    },
  });

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const emailForm = useForm<EmailChangeValues>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: user?.email || '',
      password: '',
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

  const changePassword = async (values: PasswordChangeValues) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) throw error;
      toast.success('Пароль успешно изменен');
      passwordForm.reset();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(`Ошибка изменения пароля: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const changeEmail = async (values: EmailChangeValues) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: values.newEmail
      });

      if (error) throw error;
      toast.success('Email успешно изменен. Проверьте почту для подтверждения.');
      emailForm.reset();
    } catch (error: any) {
      console.error('Error changing email:', error);
      toast.error(`Ошибка изменения email: ${error.message}`);
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

  if (!user) {
    return <div className="text-center text-white">Загрузка профиля...</div>;
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="profile">Профиль</TabsTrigger>
        <TabsTrigger value="account">Аккаунт</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="bg-todoDarkGray border-todoBlack">
          <CardContent className="pt-6">
            <ProfileImageUpload 
              userId={user.id}
              currentImage={profile?.avatar_url || null}
              onImageUpdate={updateProfileImage}
            />

            <Separator className="my-6 bg-todoBlack" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-6">
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card className="bg-todoDarkGray border-todoBlack mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Изменить email</h3>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(changeEmail)} className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Новый email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Введите новый email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Введите текущий пароль" {...field} />
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
                      Обновление...
                    </>
                  ) : (
                    'Изменить email'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-todoDarkGray border-todoBlack">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Изменить пароль</h3>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Текущий пароль</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Введите текущий пароль" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Новый пароль</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Введите новый пароль" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Подтвердите пароль</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Подтвердите новый пароль" {...field} />
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
                      Обновление...
                    </>
                  ) : (
                    'Изменить пароль'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
