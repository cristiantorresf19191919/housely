import {
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore';
import {
  propertiesCol,
  propertyDoc,
  reservationsCol,
} from './collections';
import { toPlainProperties, toPlainReservation } from '@/lib/utils/serialize';
import type { PlainProperty, PlainReservation } from '@/lib/utils/serialize';
import type {
  PropertyAmenity,
  PropertyImage,
  PropertyOwnerContact,
  PropertyType,
} from '@/types';

export async function listOwnerProperties(
  ownerId: string
): Promise<PlainProperty[]> {
  const q = query(propertiesCol, where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  // Sort client-side so we don't need a composite index for ownerId+createdAt
  const docs = snap.docs.map((d) => d.data());
  docs.sort((a, b) => {
    const aMs = a.createdAt?.toMillis?.() ?? 0;
    const bMs = b.createdAt?.toMillis?.() ?? 0;
    return bMs - aMs;
  });
  return toPlainProperties(docs);
}

export async function listOwnerReservations(
  ownerId: string
): Promise<PlainReservation[]> {
  const q = query(
    reservationsCol,
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPlainReservation(d.data()));
}

const SLUG_RE = /[^a-z0-9]+/g;
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(SLUG_RE, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

function shortSuffix(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 5; i += 1) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return s;
}

export interface CreatePropertyInput {
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  title: string;
  tagline: string;
  description: string;
  type: PropertyType;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  pricePerNight: number;
  currency: string;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: PropertyAmenity[];
  coverImageUrl: string;
  coverImageAlt: string;
}

export async function createOwnerProperty(
  input: CreatePropertyInput
): Promise<{ id: string }> {
  const id = `${slugify(input.title)}-${shortSuffix()}`;
  const ref = propertyDoc(id);

  const ownerContact: PropertyOwnerContact = {
    fullName: input.ownerName,
    email: input.ownerEmail,
    phone: '',
    preferredLanguage: 'en',
    contactHours: 'Mon–Fri, 9:00 – 19:00 local time',
  };

  const images: PropertyImage[] = input.coverImageUrl
    ? [
        {
          url: input.coverImageUrl,
          alt: input.coverImageAlt || input.title,
          order: 0,
        },
      ]
    : [];

  const payload: DocumentData = {
    ownerId: input.ownerId,
    title: input.title,
    tagline: input.tagline,
    description: input.description,
    type: input.type,
    address: {
      city: input.city,
      region: input.region,
      country: input.country,
      countryCode: input.countryCode.toUpperCase(),
    },
    pricePerNight: input.pricePerNight,
    currency: input.currency.toUpperCase(),
    cleaningFee: input.cleaningFee,
    maxGuests: input.maxGuests,
    bedrooms: input.bedrooms,
    beds: input.beds,
    bathrooms: input.bathrooms,
    amenities: input.amenities,
    images,
    ownerContact,
    rating: 0,
    reviewCount: 0,
    featured: false,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload);
  return { id };
}

/** Compute aggregate revenue + counts for an owner's reservations. */
export function summarizeReservations(reservations: PlainReservation[]) {
  const reserved = reservations.filter((r) => r.status === 'reserved');
  const pending = reservations.filter((r) => r.status === 'pending_commission');
  const completed = reservations.filter(
    (r) => r.status === 'completed' || r.status === 'checked_in'
  );

  const totalCommission = reservations
    .filter((r) => r.payment.commissionPaymentId)
    .reduce((sum, r) => sum + r.payment.commissionAmount, 0);

  const totalRemaining = reserved.reduce(
    (sum, r) => sum + r.payment.remainingAtProperty,
    0
  );

  // Currency display: pick the most common one in the set, default USD
  const currencyCount = reservations.reduce<Record<string, number>>((acc, r) => {
    const c = r.payment.currency;
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});
  const currency =
    Object.entries(currencyCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'USD';

  return {
    counts: {
      total: reservations.length,
      reserved: reserved.length,
      pending: pending.length,
      completed: completed.length,
    },
    totalCommission,
    totalRemaining,
    currency,
  };
}

// Re-export for ergonomic import sites
export type { PlainProperty, PlainReservation };
export { Timestamp };
