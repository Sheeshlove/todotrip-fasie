
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { GenericAgeField } from '@/components/shared/fields/GenericAgeField';

interface AgeFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AgeField: React.FC<AgeFieldProps> = ({ form }) => {
  return <GenericAgeField<ProfileFormValues> form={form} fieldName="age" />;
};
