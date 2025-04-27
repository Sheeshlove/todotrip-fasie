
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { HobbiesDialog } from "@/components/HobbiesDialog";

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
            <HobbiesDialog
              selectedHobbies={selectedHobbies}
              onHobbiesChange={(hobbies) => {
                onHobbiesChange(hobbies);
                field.onChange(hobbies);
              }}
            />
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
