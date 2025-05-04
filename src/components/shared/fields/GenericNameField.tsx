
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, Path } from "react-hook-form";

interface GenericNameFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: Path<T>; // Changed from keyof T to Path<T>
  label?: string;
  placeholder?: string;
}

/**
 * Многоразовый компонент поля имени
 * Generic reusable name field component
 */
export function GenericNameField<T extends Record<string, any>>({
  form,
  fieldName,
  label = "Имя",
  placeholder = "Ваше имя"
}: GenericNameFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
