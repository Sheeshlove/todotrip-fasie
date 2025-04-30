
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { HobbiesDialog } from "@/components/HobbiesDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
  selectedHobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
}

export const PersonalInfoFields = ({
  form,
  selectedHobbies,
  onHobbiesChange,
}: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Имя</FormLabel>
            <FormControl>
              <Input placeholder="Ваше имя" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Возраст</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ваш возраст" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                    onHobbiesChange(hobbies);
                    field.onChange(hobbies);
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

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Описание (необязательно)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Расскажите о себе"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
