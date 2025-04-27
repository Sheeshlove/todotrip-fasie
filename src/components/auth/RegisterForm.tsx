
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HobbiesDialog } from "@/components/HobbiesDialog";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      age: "",
      hobbies: [],
      description: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  return (
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
              <FormLabel className="text-white">Хобби (необязательно)</FormLabel>
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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Телефон</FormLabel>
              <FormControl>
                <Input placeholder="+7" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
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
                <Input type="password" placeholder="Минимум 8 символов" {...field} />
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
                <Input type="password" placeholder="Повторите пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-todoYellow text-black hover:bg-yellow-400"
        >
          Создать аккаунт
        </Button>
      </form>
    </Form>
  );
};
