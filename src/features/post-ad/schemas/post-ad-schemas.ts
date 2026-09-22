import { z } from "zod"

export const categoryStepSchema = z.object({
  categoryId: z.string().min(1, "Please choose a category for your listing"),
  categorySlug: z.string().min(1, "Category is required"),
  categoryPath: z.array(z.string()).min(1, "Category path is required"),
})

export const detailsStepSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  condition: z.string().min(1, "Please select the condition of your item"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(2500, "Description cannot exceed 2500 characters"),
  attributes: z.record(z.string(), z.string()).optional(),
})

export const photosStepSchema = z.object({
  photos: z
    .array(z.any())
    .min(1, "Please add at least 1 clear photo of your item"),
})

export const priceLocationStepSchema = z.object({
  price: z
    .union([z.number().positive("Price must be greater than 0"), z.string().min(1, "Please enter a valid price")])
    .refine((val) => Number(val) > 0, { message: "Price must be greater than 0" }),
  currency: z.string().default("USD"),
  negotiable: z.boolean().default(false),
  location: z.object({
    province: z.string().min(1, "Please select a province or city"),
    district: z.string().min(1, "Please enter your district or area"),
    label: z.string().min(1, "Location label is required"),
  }),
})

export const contactStepSchema = z.object({
  contactMethod: z.enum(["chat", "phone", "both"]),
  phoneNumber: z
    .string()
    .min(8, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  hidePhoneUntilClick: z.boolean().default(false),
})
