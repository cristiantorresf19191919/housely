import { z } from 'zod';

export const guestInfoSchema = z.object({
  fullName: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Required'),
  country: z.string().min(2, 'Required'),
  preferredLanguage: z.enum(['en', 'es', 'fr']),
  guestCount: z.coerce.number().int().min(1).max(20),
  notes: z.string().optional(),
});

export type GuestInfoInput = z.infer<typeof guestInfoSchema>;
