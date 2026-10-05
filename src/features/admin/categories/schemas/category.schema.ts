import { z } from 'zod';

export const categoryFormSchema = z.object({
  nameEn: z.string().trim().min(2, 'English name must be at least 2 characters').max(120),
  nameKm: z.string().trim().min(2, 'Khmer name must be at least 2 characters').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  parentId: z.string().uuid().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
