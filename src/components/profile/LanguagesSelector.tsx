
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { languages } from '@/data/languages';
import { Badge } from '@/components/ui/badge';
import { Globe, X } from 'lucide-react';

interface LanguagesSelectorProps {
  form: UseFormReturn<ProfileFormValues>;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
}

export const LanguagesSelector = ({ form, selectedLanguages, setSelectedLanguages }: LanguagesSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('');

  const handleAddLanguage = () => {
    if (selectedLanguage && !selectedLanguages.includes(selectedLanguage)) {
      const updatedLanguages = [...selectedLanguages, selectedLanguage];
      setSelectedLanguages(updatedLanguages);
      form.setValue('languages', updatedLanguages);
      setSelectedLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = selectedLanguages.filter(lang => lang !== languageToRemove);
    setSelectedLanguages(updatedLanguages);
    form.setValue('languages', updatedLanguages);
  };

  return (
    <FormField
      control={form.control}
      name="languages"
      render={() => (
        <FormItem>
          <FormLabel className="text-white">Языки</FormLabel>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {selectedLanguages.map((language) => (
                <Badge 
                  key={language} 
                  className="bg-todoLightGray text-todoBlack hover:bg-todoLightGray/80 flex items-center gap-1 px-3 py-1.5"
                >
                  {language}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveLanguage(language)}
                    className="ml-1 hover:bg-todoGray rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedLanguages.length === 0 && (
                <p className="text-gray-500 text-sm">Выберите языки, которыми вы владеете</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <Globe className="mr-2 h-4 w-4 text-todoMediumGray" />
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {languages.map((language) => (
                    <SelectItem
                      key={language}
                      value={language}
                      disabled={selectedLanguages.includes(language)}
                    >
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAddLanguage}
                disabled={!selectedLanguage || selectedLanguages.includes(selectedLanguage)}
              >
                Добавить
              </Button>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
