
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const resetSchema = z.object({
  email: z.string().email("Введите корректный email").min(1, "Email обязателен"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export const ForgotPasswordLink = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + '/login',
      });

      if (error) throw error;

      toast.success("Инструкции по восстановлению пароля отправлены на ваш email");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error("Ошибка отправки инструкций. Пожалуйста, проверьте email и попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-todoLightGray hover:text-todoYellow px-0 py-1 h-auto text-sm">
          Забыли пароль?
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-todoDarkGray border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Восстановление пароля</DialogTitle>
          <DialogDescription className="text-todoLightGray">
            Введите email, указанный при регистрации. Мы отправим вам инструкции по восстановлению пароля.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      {...field} 
                      className="bg-todoBlack border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full bg-todoYellow text-black hover:bg-yellow-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Отправить инструкции'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
