import { z } from "zod"

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
    countryCode: z
      .string()
      .default("+855"),
    phone: z
      .string()
      .min(6, "Please enter a valid phone number")
      .regex(/^[0-9\s-]+$/, "Phone number can only contain digits")
      .trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
