import { z } from "zod"

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, "codeSixDigits")
    .max(6, "codeSixDigits")
    .regex(/^\d{6}$/, "codeNumbersOnly"),
})

export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>
