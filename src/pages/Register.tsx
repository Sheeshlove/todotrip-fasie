
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginDialog } from "@/components/auth/LoginDialog";
import PageLayout from "@/components/PageLayout";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { RegisterFormValues } from "@/lib/validations/register";

const Register = () => {
  const { signUp } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      console.log('Starting registration with values:', {
        email: values.email,
        name: values.name,
        age: values.age,
        // Don't log password for security reasons
      });
      
      await signUp(values.email, values.password, {
        name: values.name,
        hobbies: values.hobbies,
        description: values.description,
        age: values.age
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
            
            <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />

            <p className="text-sm text-center text-todoLightGray mt-6">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-todoYellow hover:underline">
                Войти
              </Link>
            </p>
          </Card>
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
