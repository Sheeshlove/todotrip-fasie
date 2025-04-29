
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { passwordChangeSchema, PasswordChangeValues } from '@/lib/validations/profile';

export const PasswordChangeForm = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePassword = async (values: PasswordChangeValues) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) throw error;
      toast.success('Пароль успешно изменен');
      form.reset();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(`Ошибка изменения пароля: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(changePassword)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
  );
};
