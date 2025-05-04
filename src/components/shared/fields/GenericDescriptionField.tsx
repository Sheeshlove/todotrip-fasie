
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface GenericDescriptionFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T; // Which field in the form to bind to
  label?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * Многоразовый компонент поля описания
 * Generic reusable description field component
 */
export const GenericDescriptionField = <T extends Record<string, any>>({
  form,
  fieldName,
  label = "Описание",
  placeholder = "Расскажите о себе",
  required = true
}: GenericDescriptionFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName as string}
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
};
