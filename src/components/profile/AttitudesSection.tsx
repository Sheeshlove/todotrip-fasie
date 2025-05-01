
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { AttitudeSelector } from './AttitudeSelector';

interface AttitudesSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AttitudesSection: React.FC<AttitudesSectionProps> = ({ form }) => {
  const smokingOptions = [
    { value: 'Не курю', label: 'Не курю' },
    { value: 'Только электронки :)', label: 'Только электронки :)' },
    { value: 'Курю, когда выпью', label: 'Курю, когда выпью' },
    { value: 'Дымлю, как паровоз', label: 'Дымлю, как паровоз' }
  ];

  const drinkingOptions = [
    { value: 'Не пью', label: 'Не пью' },
    { value: 'Пью по особым случаям', label: 'Пью по особым случаям' },
    { value: 'Пью в компании', label: 'Пью в компании' },
    { value: 'Пью по выходным', label: 'Пью по выходным' },
    { value: 'Пью часто', label: 'Пью часто' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg font-medium">Привычки</h3>
      
      <FormField
        control={form.control}
        name="smokingAttitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Отношение к курению</FormLabel>
            <FormControl>
              <AttitudeSelector
                title="Курению"
                value={field.value || ''}
                options={smokingOptions}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="drinkingAttitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Отношение к алкоголю</FormLabel>
            <FormControl>
              <AttitudeSelector
                title="Алкоголю"
                value={field.value || ''}
                options={drinkingOptions}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
