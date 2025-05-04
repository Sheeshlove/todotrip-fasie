
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Path } from "react-hook-form";

interface GenericAgeFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  required?: boolean;
}

export function GenericAgeField<T extends Record<string, any>>({
  form,
  fieldName,
  required = true
}: GenericAgeFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
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
}
