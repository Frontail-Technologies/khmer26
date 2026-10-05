import { z } from 'zod';

export const planFormSchema = z.object({
  name: z.string().trim().min(2, 'Plan name must be at least 2 characters').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z.string().trim().max(1000).optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.enum(['USD', 'KHR']),
  billingInterval: z.enum(['monthly', 'yearly', 'lifetime']),
  durationDays: z.number().int().positive('Duration must be a positive number of days'),
  maxListings: z.number().int().positive('Listing quota must be a positive number'),
  featuredCredits: z.number().int().min(0, 'Credits cannot be negative'),
  bumpCredits: z.number().int().min(0, 'Credits cannot be negative'),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
