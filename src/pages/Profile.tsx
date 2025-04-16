
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageLayout from '@/components/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 18 && parseInt(val) <= 100, {
    message: "Возраст должен быть от 18 до 100 лет",
  }),
  city: z.string().min(2, { message: "Укажите ваш город" }),
  hobbies: z.string().min(2, { message: "Укажите ваши хобби" }),
  email: z.string().email({ message: "Некорректный email" }),
  phone: z.string().min(10, { message: "Некорректный номер телефона" }),
  password: z.string().min(8, { message: "Пароль должен содержать минимум 8 символов" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Profile = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      city: "",
      hobbies: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = (values: FormValues) => {
    console.log(values);
    // Here you would handle the registration process
  };
  
  return (
    <PageLayout title="ToDoTrip - Register Profile" description="Сохраняй свои маршруты">
      <div className="max-w-md mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Сохраняй свои маршруты</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
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
                  <FormLabel>Возраст</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваш возраст" {...field} type="number" />
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
                  <FormLabel>Город</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваш город" {...field} />
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
                  <FormLabel>Хобби</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваши хобби и интересы" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваш email" {...field} type="email" />
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
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваш номер телефона" {...field} />
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
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите пароль" {...field} type="password" />
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
                  <FormLabel>Подтверждение пароля</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите пароль ещё раз" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Регистрация</Button>
            
            <p className="text-sm text-center mt-4">
              Регистрируясь, вы принимаете нашу {' '}
              <a 
                href="http://todotrip.pro/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline text-todoYellow hover:text-yellow-300"
              >
                политику конфиденциальности
              </a>
            </p>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default Profile;
