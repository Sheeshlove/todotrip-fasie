
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { GenericAgeField } from '@/components/shared/fields/GenericAgeField';

interface AgeFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const AgeField: React.FC<AgeFieldProps> = ({ form }) => {
  return <GenericAgeField<RegisterFormValues> form={form} fieldName="age" />;
};
