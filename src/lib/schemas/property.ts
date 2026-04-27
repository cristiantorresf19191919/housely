import { z } from 'zod';

export const PROPERTY_TYPES = [
  'villa',
  'apartment',
  'house',
  'cabin',
  'loft',
  'estate',
] as const;

export const newPropertySchema = z.object({
  title: z.string().min(3, 'Give it a name').max(80),
  tagline: z.string().min(6, 'A short tagline helps').max(120),
  description: z.string().min(40, 'Describe the place — at least 40 characters').max(1200),
  type: z.enum(PROPERTY_TYPES),
  city: z.string().min(2),
  region: z.string().min(2),
  country: z.string().min(2),
  countryCode: z.string().length(2, 'Use a two-letter code (e.g. IT)'),
  pricePerNight: z.coerce.number().int().positive(),
  currency: z.string().length(3, '3-letter ISO code'),
  cleaningFee: z.coerce.number().int().nonnegative().default(0),
  maxGuests: z.coerce.number().int().min(1).max(20),
  bedrooms: z.coerce.number().int().min(0).max(20),
  beds: z.coerce.number().int().min(1).max(40),
  bathrooms: z.coerce.number().min(0).max(20),
  amenities: z.array(z.string()).default([]),
  coverImageUrl: z.string().url('Use a full https URL'),
  coverImageAlt: z.string().max(120).optional(),
});

export type NewPropertyInput = z.infer<typeof newPropertySchema>;

export const AMENITIES_CATALOG = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'pool', label: 'Pool' },
  { key: 'jacuzzi', label: 'Jacuzzi' },
  { key: 'parking', label: 'Parking' },
  { key: 'air-conditioning', label: 'Air conditioning' },
  { key: 'workspace', label: 'Workspace' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'fireplace', label: 'Fireplace' },
  { key: 'ocean-view', label: 'Ocean view' },
  { key: 'mountain-view', label: 'Mountain view' },
  { key: 'garden', label: 'Garden' },
  { key: 'pet-friendly', label: 'Pet friendly' },
  { key: 'breakfast', label: 'Breakfast included' },
  { key: 'concierge', label: 'Concierge' },
] as const;
