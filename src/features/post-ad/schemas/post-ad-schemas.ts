import { z } from "zod"

function isGoogleMapsUrl(value: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return host === "maps.app.goo.gl" ||
      (host === "goo.gl" && url.pathname.startsWith("/maps")) ||
      ((host === "google.com" || host === "www.google.com" || host === "maps.google.com") &&
        (host === "maps.google.com" || url.pathname.startsWith("/maps")))
  } catch {
    return false
  }
}

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
    .min(1, "Please add at least 1 clear photo of your item")
    .refine(
      (photos) => photos.every((photo) => photo?.uploadStatus === "done" && Boolean(photo?.mediaId)),
      "Wait for every photo to finish uploading before continuing"
    ),
})

export const priceLocationStepSchema = z.object({
  price: z
    .union([z.number().positive("Price must be greater than 0"), z.string().min(1, "Please enter a valid price")])
    .refine((val) => Number(val) > 0, { message: "Price must be greater than 0" }),
  currency: z.string().default("USD"),
  negotiable: z.boolean().default(false),
  location: z.object({
    provinceId: z.number().int().positive("Please select a province or city"),
    districtId: z.number().int().positive("Please select a district or khan"),
    communeId: z.number().int().positive().optional(),
    province: z.string().min(1, "Please select a province or city"),
    district: z.string().min(1, "Please enter your district or area"),
    label: z.string().min(1, "Location label is required"),
    googleMapsUrl: z.string().trim().max(2000).refine(isGoogleMapsUrl, "Enter a valid Google Maps link").optional(),
  }),
})

export const contactStepSchema = z.object({
  contactMethod: z.enum(["chat", "phone", "both"]),
})
