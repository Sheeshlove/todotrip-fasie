
import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, { message: "Введите ваше имя" }),
  age: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  description: z.string().optional(),
  city: z.string().optional(),
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
  newEmail: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(1, { message: "Введите пароль для подтверждения" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
export type EmailChangeValues = z.infer<typeof emailChangeSchema>;
