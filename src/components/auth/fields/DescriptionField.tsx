
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { GenericDescriptionField } from '@/components/shared/fields/GenericDescriptionField';

interface DescriptionFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return <GenericDescriptionField<RegisterFormValues> 
    form={form} 
    fieldName="description" 
    required={false}
  />;
};
