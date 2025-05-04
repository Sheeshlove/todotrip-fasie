
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
import { useState, useEffect } from "react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AccountInfoFields } from "./AccountInfoFields";
import { Loader2, ShieldAlert } from "lucide-react";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [securityChecks, setSecurityChecks] = useState({
    passwordLength: false,
    hasSpecialChar: false,
    hasNumber: false,
    emailValid: false
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      age: "",
      hobbies: [],
      languages: [],
      description: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur" // Validate on blur for better UX
  });

  const watchPassword = form.watch("password");
  const watchEmail = form.watch("email");

  // Security checks for password and email
  useEffect(() => {
    if (watchPassword) {
      setSecurityChecks(prev => ({
        ...prev,
        passwordLength: watchPassword.length >= 8,
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(watchPassword),
        hasNumber: /\d/.test(watchPassword)
      }));
    }
    
    if (watchEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setSecurityChecks(prev => ({
        ...prev,
        emailValid: emailRegex.test(watchEmail)
      }));
    }
  }, [watchPassword, watchEmail]);

  // Enhanced submit with extra validation
  const handleSubmit = async (values: RegisterFormValues) => {
    // Set hobbies and languages arrays from state
    values.hobbies = selectedHobbies;
    values.languages = selectedLanguages;
    
    // Sanitize inputs
    values.name = values.name.trim();
    values.email = values.email.trim();
    values.description = values.description?.trim();
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-8">
          <PersonalInfoFields
            form={form}
            selectedHobbies={selectedHobbies}
            onHobbiesChange={setSelectedHobbies}
            selectedLanguages={selectedLanguages}
            onLanguagesChange={setSelectedLanguages}
          />
          <AccountInfoFields form={form} />
          
          {/* Security recommendations */}
          <div className="p-3 bg-amber-50/10 rounded-lg border border-amber-200/20">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <ShieldAlert size={16} />
              <h4 className="text-sm font-medium">Рекомендации по безопасности</h4>
            </div>
            <ul className="text-xs space-y-1 text-amber-200/80">
              <li className={`flex items-center gap-1 ${securityChecks.passwordLength ? 'text-green-400' : ''}`}>
                • Пароль должен содержать минимум 8 символов
              </li>
              <li className={`flex items-center gap-1 ${securityChecks.hasSpecialChar ? 'text-green-400' : ''}`}>
                • Используйте специальные символы (!@#$%)
              </li>
              <li className={`flex items-center gap-1 ${securityChecks.hasNumber ? 'text-green-400' : ''}`}>
                • Добавьте цифры для усиления пароля
              </li>
              <li className={`flex items-center gap-1 ${securityChecks.emailValid ? 'text-green-400' : ''}`}>
                • Укажите действительный email адрес
              </li>
            </ul>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-todoYellow text-black hover:bg-yellow-400"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Создание...
            </>
          ) : (
            'Создать аккаунт'
          )}
        </Button>
      </form>
    </Form>
  );
};
