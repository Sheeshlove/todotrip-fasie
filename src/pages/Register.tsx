
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginDialog } from "@/components/auth/LoginDialog";
import PageLayout from "@/components/PageLayout";
import type { RegisterFormValues } from "@/lib/validations/register";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await signUp(values.email, values.password, {
        name: values.name,
        hobbies: values.hobbies,
        description: values.description,
        age: values.age
      });
      navigate('/create-profile');
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
            
            <RegisterForm onSubmit={onSubmit} />

            <p className="text-sm text-center text-white mt-4">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-todoYellow hover:underline">
                Войти
              </Link>
            </p>
          </div>
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
