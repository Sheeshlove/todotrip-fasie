
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { HobbiesDialog } from "@/components/HobbiesDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages } from "@/data/languages";
import { Globe, X } from "lucide-react";
import React from "react";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
  selectedHobbies: string[];
  selectedLanguages: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  onLanguagesChange: (languages: string[]) => void;
}

export const PersonalInfoFields = ({
  form,
  selectedHobbies,
  selectedLanguages,
  onHobbiesChange,
  onLanguagesChange,
}: PersonalInfoFieldsProps) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('');

  const handleAddLanguage = () => {
    if (selectedLanguage && !selectedLanguages.includes(selectedLanguage)) {
      const updatedLanguages = [...selectedLanguages, selectedLanguage];
      onLanguagesChange(updatedLanguages);
      form.setValue('languages', updatedLanguages);
      setSelectedLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = selectedLanguages.filter(lang => lang !== languageToRemove);
    onLanguagesChange(updatedLanguages);
    form.setValue('languages', updatedLanguages);
  };

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
        name="languages"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Языки (необязательно)</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm">
                  {selectedLanguages.map((language) => (
                    <Badge 
                      key={language} 
                      className="bg-todoYellow/90 text-black hover:bg-todoYellow/70 flex items-center gap-1 px-3 py-1.5"
                    >
                      {language}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveLanguage(language)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedLanguages.length === 0 && (
                    <p className="text-sm text-gray-400">Нет выбранных языков</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full bg-todoDarkGray border-white/10">
                      <Globe className="mr-2 h-4 w-4 text-todoYellow" />
                      <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 bg-todoDarkGray border-white/10">
                      {languages.map((language) => (
                        <SelectItem
                          key={language}
                          value={language}
                          disabled={selectedLanguages.includes(language)}
                          className="focus:bg-todoYellow/20 focus:text-white"
                        >
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddLanguage}
                    disabled={!selectedLanguage || selectedLanguages.includes(selectedLanguage)}
                    className="bg-transparent border-todoYellow text-todoYellow hover:bg-todoYellow/10"
                  >
                    Добавить
                  </Button>
                </div>
              </div>
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
