import { z } from "zod"

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Code must contain exactly 6 numbers"),
})

export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>
