import { z } from "zod"

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "passwordMin6"),
    confirmPassword: z
      .string()
      .min(1, "confirmNewPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
