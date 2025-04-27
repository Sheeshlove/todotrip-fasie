
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/register";
import { useState } from "react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AccountInfoFields } from "./AccountInfoFields";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
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
        >
          Создать аккаунт
        </Button>
      </form>
    </Form>
  );
};
