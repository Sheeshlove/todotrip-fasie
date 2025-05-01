import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Введите ваше имя" }),
  age: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  password: z.string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" })
    .max(64, { message: "Пароль не должен превышать 64 символа" }),
  confirmPassword: z.string(),
  smokingAttitude: z.string().optional(),
  drinkingAttitude: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
