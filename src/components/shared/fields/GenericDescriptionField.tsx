
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn, Path } from "react-hook-form";

interface GenericDescriptionFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: Path<T>; // Changed from keyof T to Path<T>
  label?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * Многоразовый компонент поля описания
 * Generic reusable description field component
 */
export function GenericDescriptionField<T extends Record<string, any>>({
  form,
  fieldName,
  label = "Описание",
  placeholder = "Расскажите о себе",
  required = true
}: GenericDescriptionFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">
            {label}{!required && " (необязательно)"}
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder}
              className="resize-none"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
