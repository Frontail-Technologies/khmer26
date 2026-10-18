import { z } from "zod"

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "emailRequired")
      .email("emailInvalid")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, "passwordMin8"),
    confirmPassword: z
      .string()
      .min(1, "confirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
