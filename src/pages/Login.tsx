
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Введите email или телефон" }),
  password: z.string().min(1, { message: "Введите пароль" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const { signIn } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await signIn(values.identifier, values.password);
    } catch (error) {
      setLoginError(`Неверный ${loginMethod === 'email' ? 'email' : 'номер телефона'} или пароль`);
    }
  };
  
  return (
    <PageLayout title="ТуДуТрип - Вход" description="Вход в аккаунт">
      <div className="max-w-md mx-auto py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-center text-todoYellow">Вход в аккаунт</h1>
        
        <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-8 rounded-xl shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs 
                defaultValue="email" 
                className="w-full"
                onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-todoBlack/20">
                  <TabsTrigger 
                    value="email" 
                    className="data-[state=active]:bg-todoYellow data-[state=active]:text-black"
                  >
                    Email
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phone" 
                    className="data-[state=active]:bg-todoYellow data-[state=active]:text-black"
                  >
                    Телефон
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{loginMethod === 'email' ? 'Email' : 'Телефон'}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-todoLightGray">
                          {loginMethod === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                        </div>
                        <Input 
                          placeholder={loginMethod === 'email' ? 'Ваш email' : 'Ваш номер телефона'} 
                          {...field} 
                          className="pl-10 bg-todoBlack border-white/10 focus:border-todoYellow/50"
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
                    <FormLabel className="text-white">Пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-todoLightGray">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input 
                          placeholder="Ваш пароль" 
                          {...field} 
                          type="password" 
                          className="pl-10 bg-todoBlack border-white/10 focus:border-todoYellow/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {loginError && (
                <div className="text-destructive text-sm font-medium bg-destructive/20 p-3 rounded-lg">
                  {loginError}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-todoYellow text-black hover:bg-yellow-400 hover:scale-101 transition-all"
              >
                Войти
              </Button>
              
              <p className="text-sm text-center mt-4 text-todoLightGray">
                Ещё нет аккаунта? <Link to="/register" className="text-todoYellow hover:underline">Создать</Link>
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
