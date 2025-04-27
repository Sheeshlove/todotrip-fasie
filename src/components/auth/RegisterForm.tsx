
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
import { useState } from "react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AccountInfoFields } from "./AccountInfoFields";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
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
        <div className="space-y-8">
          <PersonalInfoFields
            form={form}
            selectedHobbies={selectedHobbies}
            onHobbiesChange={setSelectedHobbies}
          />
          <AccountInfoFields form={form} />
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
