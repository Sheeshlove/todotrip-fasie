
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";

interface AccountInfoFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const AccountInfoFields = ({ form }: AccountInfoFieldsProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
