import { z } from 'zod';

export const promotionPackageSchema = z.object({
  promotionType: z.enum(['featured', 'top_listing', 'urgent']),
  name: z.string().trim().min(1, 'Name is required').max(120),
  description: z.string().trim().max(1000).nullable().optional(),
  durationDays: z.number().int().positive('Duration must be at least 1 day'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.enum(['USD', 'KHR']),
  isActive: z.boolean(),
});

export type PromotionPackageFormValues = z.infer<typeof promotionPackageSchema>;
