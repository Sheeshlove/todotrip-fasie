
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { NameField } from "./fields/NameField";
import { AgeField } from "./fields/AgeField";
import { LanguagesField } from "./fields/LanguagesField";
import { HobbiesField } from "./fields/HobbiesField";
import { AttitudesFields } from "./fields/AttitudesFields";
import { DescriptionField } from "./fields/DescriptionField";

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
  return (
    <div className="space-y-6">
      <NameField form={form} />
      <AgeField form={form} />
      <LanguagesField 
        form={form} 
        selectedLanguages={selectedLanguages} 
        onLanguagesChange={onLanguagesChange}
      />
      <HobbiesField 
        form={form} 
        selectedHobbies={selectedHobbies} 
        onHobbiesChange={onHobbiesChange}
      />
      <AttitudesFields form={form} />
      <DescriptionField form={form} />
    </div>
  );
};
