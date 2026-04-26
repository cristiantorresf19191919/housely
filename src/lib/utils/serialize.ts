import type { Timestamp } from 'firebase/firestore';
import type { Property, Reservation } from '@/types';

/**
 * Plain (server→client safe) version of types whose Firestore Timestamps
 * cannot cross the RSC boundary. We strip the audit fields the client
 * components never read, since they only contain Timestamps.
 */
export type PlainProperty = Omit<Property, 'createdAt' | 'updatedAt'>;
export type PlainReservation = Omit<
  Reservation,
  'createdAt' | 'updatedAt' | 'dates' | 'payment'
> & {
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  payment: Omit<Reservation['payment'], 'commissionPaidAt'> & {
    commissionPaidAt?: string;
  };
};

export function toPlainProperty(p: Property): PlainProperty {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, ...rest } = p;
  return rest;
}

export function toPlainProperties(list: Property[]): PlainProperty[] {
  return list.map(toPlainProperty);
}

const tsToISO = (t: Timestamp | undefined): string | undefined =>
  t ? t.toDate().toISOString() : undefined;

export function toPlainReservation(r: Reservation): PlainReservation {
  const {
    createdAt: _c,
    updatedAt: _u,
    dates,
    payment,
    ...rest
  } = r;
  return {
    ...rest,
    dates: {
      checkIn: dates.checkIn.toDate().toISOString(),
      checkOut: dates.checkOut.toDate().toISOString(),
      nights: dates.nights,
    },
    payment: {
      ...payment,
      commissionPaidAt: tsToISO(payment.commissionPaidAt),
    },
  };
}
