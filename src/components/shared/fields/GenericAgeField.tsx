
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, Path } from "react-hook-form";

interface GenericAgeFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: Path<T>; // Changed from keyof T to Path<T>
  label?: string;
  placeholder?: string;
}

/**
 * Многоразовый компонент поля возраста
 * Generic reusable age field component
 */
export function GenericAgeField<T extends Record<string, any>>({
  form,
  fieldName,
  label = "Возраст",
  placeholder = "Ваш возраст"
}: GenericAgeFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">{label}</FormLabel>
          <FormControl>
            <Input type="number" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
