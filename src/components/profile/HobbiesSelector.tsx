import React, { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { HobbiesDialog } from '@/components/HobbiesDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HobbiesSelectorProps {
  form: UseFormReturn<ProfileFormValues>;
  selectedHobbies: string[];
  setSelectedHobbies: (hobbies: string[]) => void;
}

export const HobbiesSelector = ({ form, selectedHobbies, setSelectedHobbies }: HobbiesSelectorProps) => {
  // Make sure form value stays in sync with selectedHobbies
  useEffect(() => {
    form.setValue('hobbies', selectedHobbies, { 
      shouldValidate: true,
      shouldDirty: true, // Mark as dirty to trigger form change events
      shouldTouch: true  // Mark as touched to trigger validation
    });
  }, [selectedHobbies, form]);

  return (
    <FormField
      control={form.control}
      name="hobbies"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Хобби</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedHobbies.length > 0 ? (
                  selectedHobbies.map((hobby) => (
                    <Badge
                      key={hobby}
                      variant="outline"
                      className="bg-todoLightGray text-todoBlack hover:bg-todoLightGray/80 rounded-full px-4 py-1 text-sm"
                    >
                      {hobby}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Нет выбранных хобби</p>
                )}
              </div>
              
              <HobbiesDialog
                selectedHobbies={selectedHobbies}
                onHobbiesChange={(hobbies) => {
                  setSelectedHobbies(hobbies);
                  // Make sure to update the form value and trigger form events
                  field.onChange(hobbies);
                  // Explicitly mark as dirty and touched to trigger auto-save
                  form.trigger('hobbies');
                }}
                trigger={
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full mt-2"
                  >
                    Выбрать
                  </Button>
                }
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
