
import React from 'react';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';

interface AgeFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AgeField: React.FC<AgeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="age"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white font-medium">Возраст</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="Ваш возраст" 
              className="bg-todoDarkGray/70 border-white/10 focus:border-todoYellow/50 text-white transition-all"
              {...field} 
              onChange={(e) => {
                // Restrict to numbers only
                const value = e.target.value.replace(/\D/g, '');
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
