
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Path } from "react-hook-form";

interface GenericDescriptionFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  required?: boolean;
}

export function GenericDescriptionField<T extends Record<string, any>>({
  form,
  fieldName,
  required = false
}: GenericDescriptionFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">
            Описание{!required && " (необязательно)"}
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Расскажите о себе"
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
