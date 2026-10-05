import { z } from 'zod';

export const settingsFormSchema = z.object({
  marketplaceName: z.string().trim().min(1, 'Platform name is required').max(120),
  supportEmail: z.string().trim().email('Enter a valid email').or(z.literal('')),
  supportPhone: z.string().trim().max(30),
  primaryLanguage: z.enum(['km', 'en']),
  timezone: z.string().trim().min(1, 'Timezone is required').max(60),
  defaultCurrency: z.enum(['USD', 'KHR']),
  freeActiveListingLimit: z.number().int().positive().max(1000),
  listingExpiryDays: z.number().int().positive().max(365),
  listingExpiryReminderDays: z.number().int().positive().max(60),
  maxListingImages: z.number().int().positive().max(30),
  subscriptionExpiryWarningDays: z.number().int().positive().max(60),
  maintenanceMode: z.boolean(),
  allowRegistrations: z.boolean(),
  allowSellerVerification: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
