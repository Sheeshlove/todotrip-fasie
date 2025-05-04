
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { GenericNameField } from '@/components/shared/fields/GenericNameField';

interface NameFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return (
    <GenericNameField<ProfileFormValues>
      form={form}
      fieldName="name"
    />
  );
};
