import type { Timestamp } from 'firebase/firestore';

export type Locale = 'en' | 'es' | 'fr';

export type UserRole = 'guest' | 'owner' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  country?: string;
  preferredLanguage: Locale;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PropertyType = 'villa' | 'apartment' | 'house' | 'cabin' | 'loft' | 'estate';

export interface PropertyAddress {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat?: number;
  lng?: number;
}

export interface PropertyImage {
  url: string;
  alt: string;
  order: number;
}

export interface PropertyAmenity {
  key: string;
  label: string;
}

/**
 * Owner contact details are stored on the property document but should be
 * read-protected. The client only sees them after a confirmed reservation
 * (commission paid). See firestore.rules for the access boundary.
 */
export interface PropertyOwnerContact {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredLanguage: Locale;
  contactHours: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  tagline: string;
  description: string;
  type: PropertyType;
  address: PropertyAddress;
  pricePerNight: number;
  currency: string;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  amenities: PropertyAmenity[];
  images: PropertyImage[];
  ownerContact: PropertyOwnerContact;
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ReservationStatus =
  | 'pending_commission'
  | 'reserved'
  | 'checked_in'
  | 'completed'
  | 'cancelled';

export interface ReservationGuestInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  preferredLanguage: Locale;
  guestCount: number;
  notes?: string;
}

export interface ReservationDates {
  checkIn: Timestamp;
  checkOut: Timestamp;
  nights: number;
}

export interface ReservationPayment {
  nightlyTotal: number;
  cleaningFee: number;
  subtotal: number;
  commissionRate: number;
  commissionAmount: number;
  remainingAtProperty: number;
  currency: string;
  commissionPaidAt?: Timestamp;
  commissionPaymentId?: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  propertySnapshot: {
    title: string;
    city: string;
    country: string;
    coverImage: string;
  };
  ownerId: string;
  guestUid?: string;
  guestInfo: ReservationGuestInfo;
  dates: ReservationDates;
  payment: ReservationPayment;
  status: ReservationStatus;
  ownerContactRevealed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type PaymentKind = 'commission';

export interface Payment {
  id: string;
  reservationId: string;
  propertyId: string;
  guestUid?: string;
  kind: PaymentKind;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'demo' | 'stripe';
  providerRef?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  propertyId: string;
  reservationId: string;
  guestUid: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}
