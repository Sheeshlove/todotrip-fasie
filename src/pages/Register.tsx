
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginDialog } from "@/components/auth/LoginDialog";
import PageLayout from "@/components/PageLayout";
import { UserPlus, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { RegisterFormValues } from "@/lib/validations/register";
import { sanitize } from "@/utils/securityUtils";

const Register = () => {
  const { signUp } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Log registration attempt (without sensitive data)
      console.log('Starting registration with values:', {
        email: sanitize.xss(values.email),
        name: sanitize.xss(values.name),
        age: sanitize.xss(values.age),
        // Don't log password for security reasons
      });
      
      // Sanitize all inputs before sending to API
      const sanitizedValues = {
        ...values,
        email: sanitize.xss(values.email),
        name: sanitize.xss(values.name),
        description: values.description ? sanitize.xss(values.description) : undefined,
        age: sanitize.xss(values.age),
        // Don't sanitize password - it should be handled by authentication system
      };
      
      await signUp(sanitizedValues.email, values.password, {
        name: sanitizedValues.name,
        hobbies: values.hobbies,
        description: sanitizedValues.description,
        age: sanitizedValues.age
      });
      
      console.log('Registration completed without errors');
      // Navigation is handled by AuthContext's onAuthStateChange
    } catch (error: any) {
      console.error('Registration error caught in Register component:', error);
      if (error.message?.toLowerCase().includes('already registered')) {
        setShowLoginDialog(true);
      }
      // Let the toast in AuthContext handle other error messages
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="ТуДуТрип - Регистрация" description="Создайте аккаунт">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-lg">
          <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-8 rounded-xl shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-todoYellow/20 p-3 rounded-full">
                <UserPlus className="w-8 h-8 text-todoYellow" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-8 text-todoYellow text-center">Создание аккаунта</h1>
            
            {showSecurityInfo && (
              <Alert className="mb-6 bg-blue-900/20 border-blue-500/30">
                <Shield className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-400">Безопасность ваших данных</AlertTitle>
                <AlertDescription className="text-blue-300/80 text-sm">
                  Мы шифруем ваши личные данные и используем безопасное соединение. 
                  Ваш пароль никогда не хранится в открытом виде и не передается третьим лицам.
                </AlertDescription>
              </Alert>
            )}
            
            <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />

            <div className="flex justify-between items-center mt-6 text-sm text-todoLightGray">
              <button 
                onClick={() => setShowSecurityInfo(!showSecurityInfo)} 
                className="flex items-center gap-1 text-todoYellow/70 hover:text-todoYellow"
              >
                <Shield size={14} />
                <span>{showSecurityInfo ? 'Скрыть информацию' : 'О безопасности'}</span>
              </button>
              
              <Link to="/login" className="text-todoYellow hover:underline">
                Уже есть аккаунт?
              </Link>
            </div>
          </Card>
          
          <p className="text-xs text-center mt-4 text-todoLightGray/60">
            Регистрируясь, вы соглашаетесь с нашей <Link to="/privacy-policy" className="underline hover:text-todoYellow/80">Политикой конфиденциальности</Link>
          </p>
        </div>
      </div>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
      />
    </PageLayout>
  );
};

export default Register;
