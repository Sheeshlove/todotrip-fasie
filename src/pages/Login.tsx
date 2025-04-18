
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Login form schema with email/phone validation
const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Введите email или телефон" }),
  password: z.string().min(1, { message: "Введите пароль" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  
  const onSubmit = (values: LoginFormValues) => {
    setLoginError(null);
    
    // Simulate login validation
    const isEmail = values.identifier.includes('@');
    const isValidPhone = /^\d{10,11}$/.test(values.identifier.replace(/\D/g, ''));
    
    if ((loginMethod === 'email' && !isEmail) || (loginMethod === 'phone' && !isValidPhone)) {
      setLoginError(`Неверный ${loginMethod === 'email' ? 'email' : 'номер телефона'}`);
      return;
    }
    
    if (values.password !== "password123") { // Simulated password check
      if (loginError) {
        setLoginError(`Неверный ${loginMethod === 'email' ? 'email' : 'номер телефона'} и пароль`);
      } else {
        setLoginError("Неверный пароль");
      }
      return;
    }
    
    // Successful login
    navigate('/profile');
  };
  
  return (
    <PageLayout title="ToDoTrip - Вход" description="Вход в аккаунт">
      <div className="max-w-md mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs 
              defaultValue="email" 
              className="w-full"
              onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Телефон</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{loginMethod === 'email' ? 'Email' : 'Телефон'}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        {loginMethod === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                      </div>
                      <Input 
                        placeholder={loginMethod === 'email' ? 'Ваш email' : 'Ваш номер телефона'} 
                        {...field} 
                        className="pl-10"
                      />
                    </div>
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
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input 
                        placeholder="Ваш пароль" 
                        {...field} 
                        type="password" 
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {loginError && (
              <div className="text-destructive text-sm font-medium">{loginError}</div>
            )}
            
            <Button type="submit" className="w-full bg-todoYellow text-black hover:bg-yellow-400">
              Войти
            </Button>
            
            <p className="text-sm text-center mt-4">
              Ещё нет аккаунта? <Link to="/profile" className="text-todoYellow hover:underline">Создать</Link>
            </p>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default Login;
