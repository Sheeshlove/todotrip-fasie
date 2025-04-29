
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { emailChangeSchema, EmailChangeValues } from '@/lib/validations/profile';

export const EmailChangeForm = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<EmailChangeValues>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  const changeEmail = async (values: EmailChangeValues) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: values.newEmail
      });

      if (error) throw error;
      toast.success('Email успешно изменен. Проверьте почту для подтверждения.');
      form.reset();
    } catch (error: any) {
      console.error('Error changing email:', error);
      toast.error(`Ошибка изменения email: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(changeEmail)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
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
  );
};
