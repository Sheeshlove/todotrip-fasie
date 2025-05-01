
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { languages } from "@/data/languages";
import { Globe, X } from "lucide-react";

interface LanguagesFieldProps {
  form: UseFormReturn<RegisterFormValues>;
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

export const LanguagesField: React.FC<LanguagesFieldProps> = ({ 
  form, 
  selectedLanguages, 
  onLanguagesChange 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

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
  );
};
