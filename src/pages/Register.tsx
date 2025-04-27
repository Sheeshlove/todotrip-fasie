import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
import PageLayout from "@/components/PageLayout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HobbiesDialog } from "@/components/HobbiesDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

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

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await signUp(values.email, values.password);
    } catch (error) {
      setShowLoginDialog(true);
    }
  };

  return (
    <PageLayout title="ТуДуТрип - Регистрация" description="Создайте аккаунт">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-todoDarkGray rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-todoYellow">Создание аккаунта</h1>
            
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

                <p className="text-sm text-center text-white mt-4">
                  Уже есть аккаунт?{" "}
                  <Link to="/login" className="text-todoYellow hover:underline">
                    Войти
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Аккаунт уже существует</AlertDialogTitle>
            <AlertDialogDescription>
              Пользователь с таким email или телефоном уже зарегистрирован. Хотите войти в существующий аккаунт?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginDialog(false)}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/login")}>
              Войти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Register;
