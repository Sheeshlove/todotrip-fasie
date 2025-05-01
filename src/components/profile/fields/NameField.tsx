
import React from 'react';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';

interface NameFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white font-medium">Имя</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ваше имя" 
              className="bg-todoDarkGray/70 border-white/10 focus:border-todoYellow/50 text-white transition-all"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
