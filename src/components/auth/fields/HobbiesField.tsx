
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HobbiesDialog } from "@/components/HobbiesDialog";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";

interface HobbiesFieldProps {
  form: UseFormReturn<RegisterFormValues>;
  selectedHobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
}

export const HobbiesField: React.FC<HobbiesFieldProps> = ({ 
  form, 
  selectedHobbies, 
  onHobbiesChange 
}) => {
  return (
    <FormField
      control={form.control}
      name="hobbies"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Хобби (необязательно)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedHobbies.length > 0 ? (
                  selectedHobbies.map((hobby) => (
                    <Badge
                      key={hobby}
                      variant="outline"
                      className="bg-todoYellow/90 text-black hover:bg-todoYellow/70 rounded-full px-4 py-1 text-sm"
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
                  onHobbiesChange(hobbies);
                  field.onChange(hobbies);
                }}
                trigger={
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full mt-2 bg-transparent border-todoYellow text-todoYellow hover:bg-todoYellow/10"
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
