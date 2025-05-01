
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";

interface AttitudesFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const AttitudesFields: React.FC<AttitudesFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="smokingAttitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Отношение к курению (необязательно)</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {["Не курю", "Только электронки :)", "Курю, когда выпью", "Дымлю, как паровоз"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`smoking-${option}`} />
                    <Label htmlFor={`smoking-${option}`} className="text-white">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
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
            <FormLabel className="text-white">Отношение к алкоголю (необязательно)</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {["Не пью", "Пью по особым случаям", "Пью в компании", "Пью по выходным", "Пью часто"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`drinking-${option}`} />
                    <Label htmlFor={`drinking-${option}`} className="text-white">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
