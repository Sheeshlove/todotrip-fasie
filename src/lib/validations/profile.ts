import * as z from "zod";

// Enhanced validation with more secure rules
export const profileSchema = z.object({
  name: z.string()
    .min(1, { message: "Введите ваше имя" })
    .max(50, { message: "Имя слишком длинное" })
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/, { 
      message: "Имя может содержать только буквы, пробелы, апострофы и дефисы" 
    }),
  age: z.string()
    .optional()
    .refine(val => !val || /^\d{1,3}$/.test(val), {
      message: "Возраст должен быть числом от 1 до 999"
    }),
  hobbies: z.array(z.string()
    .min(1, { message: "Хобби не может быть пустым" })
    .max(50, { message: "Хобби слишком длинное" })
  ).optional(),
  description: z.string()
    .max(500, { message: "Описание слишком длинное" })
    .optional(),
  city: z.string()
    .max(100, { message: "Название города слишком длинное" })
    .optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: "Введите текущий пароль" }),
  newPassword: z.string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" })
    .max(128, { message: "Пароль не должен превышать 128 символов" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ"
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export const emailChangeSchema = z.object({
  newEmail: z.string()
    .email({ message: "Введите корректный email" })
    .max(255, { message: "Email слишком длинный" }),
  password: z.string().min(1, { message: "Введите пароль для подтверждения" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
export type EmailChangeValues = z.infer<typeof emailChangeSchema>;
