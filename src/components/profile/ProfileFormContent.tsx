
import React from 'react';
import { Form } from '@/components/ui/form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { UseFormReturn } from 'react-hook-form';
import { PersonalInfoForm } from './PersonalInfoForm';
import { LocationSelector } from './LocationSelector';
import { HobbiesSelector } from './HobbiesSelector';
import { LanguagesSelector } from './LanguagesSelector';
import { AttitudesSection } from './AttitudesSection';
import { FormStatusIndicator } from './FormStatusIndicator';

interface ProfileFormContentProps {
  form: UseFormReturn<ProfileFormValues>;
  selectedHobbies: string[];
  setSelectedHobbies: (hobbies: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  isUpdating: boolean;
  needsSaving: boolean;
}

export const ProfileFormContent: React.FC<ProfileFormContentProps> = ({
  form,
  selectedHobbies,
  setSelectedHobbies,
  selectedLanguages,
  setSelectedLanguages,
  isUpdating,
  needsSaving
}) => {
  return (
    <Form {...form}>
      <div className="space-y-8">
        <PersonalInfoForm form={form} />
        <LocationSelector form={form} />
        <LanguagesSelector 
          form={form} 
          selectedLanguages={selectedLanguages} 
          setSelectedLanguages={setSelectedLanguages} 
        />
        <HobbiesSelector 
          form={form} 
          selectedHobbies={selectedHobbies} 
          setSelectedHobbies={setSelectedHobbies} 
        />
        <AttitudesSection form={form} />
        
        {/* Status indicator */}
        <FormStatusIndicator isUpdating={isUpdating} needsSaving={needsSaving} />
      </div>
    </Form>
  );
};
