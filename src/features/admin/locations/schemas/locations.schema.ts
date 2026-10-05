import { z } from 'zod';

const slugPattern = /^[a-z0-9-]+$/;

export const provinceFormSchema = z.object({
  id: z.number().int().positive('Province ID must be a positive integer'),
  nameEn: z.string().trim().min(1, 'English name is required').max(120),
  nameKm: z.string().trim().min(1, 'Khmer name is required').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(slugPattern, 'Only lowercase letters, numbers, and hyphens allowed'),
  isCapital: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const districtFormSchema = z.object({
  id: z.number().int().positive('District ID must be a positive integer'),
  provinceId: z.number().int().positive('Province is required'),
  nameEn: z.string().trim().min(1, 'English name is required').max(120),
  nameKm: z.string().trim().min(1, 'Khmer name is required').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(slugPattern, 'Only lowercase letters, numbers, and hyphens allowed'),
  type: z.enum(['district', 'municipality', 'khan']),
  isActive: z.boolean().optional(),
});

export const communeFormSchema = z.object({
  id: z.number().int().positive('Commune ID must be a positive integer'),
  districtId: z.number().int().positive('District is required'),
  nameEn: z.string().trim().min(1, 'English name is required').max(120),
  nameKm: z.string().trim().min(1, 'Khmer name is required').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(slugPattern, 'Only lowercase letters, numbers, and hyphens allowed'),
  type: z.enum(['commune', 'sangkat']),
  isActive: z.boolean().optional(),
});

export type ProvinceFormValues = z.infer<typeof provinceFormSchema>;
export type DistrictFormValues = z.infer<typeof districtFormSchema>;
export type CommuneFormValues = z.infer<typeof communeFormSchema>;
