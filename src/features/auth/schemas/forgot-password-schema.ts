import { z } from "zod"

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email address or phone number is required")
    .trim(),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
