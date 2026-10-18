import { z } from 'zod';

export const broadcastFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    titleKm: z.string().trim().max(200).nullable().optional(),
    body: z.string().trim().min(1, 'Message body is required').max(2000),
    bodyKm: z.string().trim().max(2000).nullable().optional(),
    audience: z.enum(['all_users', 'buyers', 'sellers', 'dealers', 'specific_user']),
    specificUserId: z.string().uuid('Must be a valid user UUID').optional().or(z.literal('')),
  })
  .refine(
    (data) => (data.audience === 'specific_user' ? !!data.specificUserId : true),
    { message: 'User ID is required for specific_user audience', path: ['specificUserId'] }
  )
  .refine(
    (data) => (data.audience !== 'specific_user' ? !data.specificUserId : true),
    { message: 'User ID should only be set for specific_user audience', path: ['specificUserId'] }
  );

export type BroadcastFormValues = z.infer<typeof broadcastFormSchema>;
