
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";

interface DescriptionFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Описание</FormLabel>
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
};
