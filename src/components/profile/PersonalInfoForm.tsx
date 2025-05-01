
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';
import { NameField } from './fields/NameField';
import { AgeField } from './fields/AgeField';
import { DescriptionField } from './fields/DescriptionField';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const PersonalInfoForm = ({ form }: PersonalInfoFormProps) => {
  return (
    <div className="space-y-5">
      <NameField form={form} />
      <AgeField form={form} />
      <DescriptionField form={form} />
    </div>
  );
};
