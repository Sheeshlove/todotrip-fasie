
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { languages } from "@/data/languages";
import { Globe, X } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageToggle = (language: string) => {
    let updatedLanguages = [...selectedLanguages];
    
    if (selectedLanguages.includes(language)) {
      updatedLanguages = updatedLanguages.filter(lang => lang !== language);
    } else {
      updatedLanguages.push(language);
    }
    
    onLanguagesChange(updatedLanguages);
    form.setValue('languages', updatedLanguages);
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
        <FormItem className="mb-4">
          <FormLabel className="text-white">Языки (необязательно)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm overflow-y-auto max-h-[120px]">
                {selectedLanguages.map((language) => (
                  <Badge 
                    key={language} 
                    className="bg-todoYellow/90 text-black hover:bg-todoYellow/70 flex items-center gap-1 px-3 py-1.5 mb-1"
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
              
              <Collapsible 
                open={isOpen} 
                onOpenChange={setIsOpen} 
                className="w-full border border-white/10 rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex items-center w-full p-3 bg-todoDarkGray text-left">
                  <Globe className="mr-2 h-4 w-4 text-todoYellow" />
                  <span>{isOpen ? "Закрыть" : "Выбрать языки"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-todoDarkGray p-4">
                  <ScrollArea className="h-[300px] pr-4 rounded">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {languages.map((language) => (
                        <div key={language} className="flex items-center space-x-2 py-1">
                          <Checkbox 
                            id={`auth-lang-${language}`}
                            checked={selectedLanguages.includes(language)}
                            onCheckedChange={() => handleLanguageToggle(language)}
                            className="data-[state=checked]:bg-todoYellow data-[state=checked]:border-todoYellow"
                          />
                          <label
                            htmlFor={`auth-lang-${language}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
