
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Path } from "react-hook-form";

interface GenericNameFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  required?: boolean;
}

export function GenericNameField<T extends Record<string, any>>({
  form,
  fieldName,
  required = true
}: GenericNameFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
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
}
