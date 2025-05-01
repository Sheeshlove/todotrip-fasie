
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";

interface NameFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Имя</FormLabel>
          <FormControl>
            <Input placeholder="Ваше имя" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
