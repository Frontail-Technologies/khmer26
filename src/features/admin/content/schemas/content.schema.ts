import { z } from 'zod';

export const bannerFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  placement: z.string().trim().min(1, 'Placement is required').max(80),
  imageMediaId: z
    .string()
    .uuid('Image media ID must be a valid UUID')
    .optional()
    .or(z.literal('')),
  imageUrl: z.string().trim().optional().or(z.literal('')),
  mobileImageMediaId: z
    .string()
    .uuid('Mobile image media ID must be a valid UUID')
    .optional()
    .or(z.literal('')),
  destinationType: z.string().trim().min(1).max(40).optional(),
  destinationValue: z.string().trim().max(500).optional().or(z.literal('')),
  destinationLabel: z.string().trim().max(120).optional().or(z.literal('')),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export const featuredSectionFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  sourceType: z.string().trim().min(1, 'Source type is required').max(60),
  sortMode: z.string().trim().max(40).optional().or(z.literal('')),
  displayStyle: z.string().trim().max(40).optional().or(z.literal('')),
  isActive: z.boolean(),
  sortOrder: z.number().int().optional(),
  itemLimit: z.number().int().positive().optional(),
});

export const safetyTipFormSchema = z.object({
  tip: z.string().trim().min(1, 'Tip content is required').max(500),
  context: z.string().trim().min(1, 'Context is required').max(80),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export const staticPageFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().trim().min(1, 'Title is required').max(200),
  content: z.string().trim().min(1, 'Page content is required'),
  isActive: z.boolean(),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
export type FeaturedSectionFormValues = z.infer<typeof featuredSectionFormSchema>;
export type SafetyTipFormValues = z.infer<typeof safetyTipFormSchema>;
export type StaticPageFormValues = z.infer<typeof staticPageFormSchema>;
