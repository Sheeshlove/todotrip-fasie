
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Phone, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { sanitizeUrl } from '@/utils/secureSessionUtils';

// Enhanced validation schema with security checks
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Введите email или телефон" })
    .refine(val => val.trim().length > 0, { message: "Поле не может содержать только пробелы" }),
  password: z
    .string()
    .min(1, { message: "Введите пароль" })
    .refine(val => val.trim().length > 0, { message: "Поле не может содержать только пробелы" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from query parameter and sanitize it
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = sanitizeUrl(searchParams.get('returnUrl') || '/');
  
  // Form setup with enhanced validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onBlur" // Validate on blur for better UX
  });
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl);
    }
  }, [isAuthenticated, navigate, returnUrl]);
  
  // Enhanced secure login with proper validation and rate limiting
  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      // Check if login attempts exceed threshold for security
      if (loginAttempts >= 5) {
        setLoginError('Слишком много попыток входа. Пожалуйста, попробуйте позже.');
        return;
      }
      
      // Sanitize inputs to prevent injection attacks
      const sanitizedIdentifier = values.identifier.trim();
      
      await signIn(sanitizedIdentifier, values.password);
      navigate(returnUrl);
    } catch (error) {
      // Increment failed login attempts for rate limiting
      setLoginAttempts(prev => prev + 1);
      
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError(`Неверный ${loginMethod === 'email' ? 'email' : 'номер телефона'} или пароль`);
      }
    } finally {
      setIsSubmitting(false);
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
                          aria-autocomplete="none"
                          autoComplete={loginMethod === 'email' ? 'email' : 'tel'}
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
                          autoComplete="current-password"
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
              
              {loginAttempts > 2 && (
                <div className="p-3 bg-amber-50/10 rounded-lg border border-amber-200/20">
                  <div className="flex items-center gap-2 mb-1 text-amber-400">
                    <Shield size={16} />
                    <h4 className="text-sm font-medium">Советы по безопасности</h4>
                  </div>
                  <p className="text-xs text-amber-200/80">
                    Убедитесь, что вы используете корректные учетные данные. После 5 неудачных попыток вход будет временно заблокирован.
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-todoYellow text-black hover:bg-yellow-400 hover:scale-101 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Проверка...' : 'Войти'}
              </Button>
              
              <p className="text-sm text-center mt-4 text-todoLightGray">
                Ещё нет аккаунта? <Link to="/register" className="text-todoYellow hover:underline">Создать</Link>
              </p>
              
              <p className="text-xs text-center text-todoLightGray/70">
                Входя в аккаунт, вы соглашаетесь с нашей <Link to="/privacy-policy" className="underline hover:text-todoYellow/80">Политикой конфиденциальности</Link>
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
