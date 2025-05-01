
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";

interface AgeFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const AgeField: React.FC<AgeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="age"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Возраст</FormLabel>
          <FormControl>
            <Input type="number" placeholder="Ваш возраст" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
