
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/register";
import { GenericNameField } from '@/components/shared/fields/GenericNameField';

interface NameFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return <GenericNameField<RegisterFormValues> form={form} fieldName="name" />;
};
