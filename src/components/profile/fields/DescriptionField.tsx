
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { GenericDescriptionField } from '@/components/shared/fields/GenericDescriptionField';

interface DescriptionFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return (
    <GenericDescriptionField<ProfileFormValues>
      form={form}
      fieldName="description"
    />
  );
};
