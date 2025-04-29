
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { HobbiesDialog } from '@/components/HobbiesDialog';

interface HobbiesSelectorProps {
  form: UseFormReturn<ProfileFormValues>;
  selectedHobbies: string[];
  setSelectedHobbies: (hobbies: string[]) => void;
}

export const HobbiesSelector = ({ form, selectedHobbies, setSelectedHobbies }: HobbiesSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="hobbies"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Хобби</FormLabel>
          <HobbiesDialog
            selectedHobbies={selectedHobbies}
            onHobbiesChange={(hobbies) => {
              setSelectedHobbies(hobbies);
              field.onChange(hobbies);
            }}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
