
import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Введите ваше имя" }),
  age: z.string().min(1, { message: "Введите ваш возраст" }),
  hobbies: z.array(z.string()).optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" })
    .max(128, { message: "Пароль не должен превышать 128 символов" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ"
    }),
  confirmPassword: z.string(),
  smokingAttitude: z.string().optional(),
  drinkingAttitude: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
