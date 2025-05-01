
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/lib/validations/profile';

export interface FormFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

// Add more shared form utilities here as needed
