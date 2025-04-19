
import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Введите ваше имя" }),
  age: z.string().min(1, { message: "Введите ваш возраст" }),
  hobbies: z.array(z.string()).optional(),
  description: z.string().optional(),
  phone: z.string().min(10, { message: "Введите корректный номер телефона" }),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Пароль должен содержать буквы и цифры"
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
