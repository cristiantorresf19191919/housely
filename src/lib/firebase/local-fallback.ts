'use client';

import { Timestamp } from 'firebase/firestore';
import type { Reservation } from '@/types';
import { toPlainReservation, type PlainReservation } from '@/lib/utils/serialize';

/**
 * When Firestore writes are denied (e.g. rules not yet deployed in this demo
 * project), we still want the booking flow to be testable end-to-end. We
 * persist reservations in localStorage as a fallback so the checkout and
 * confirmation pages can read them back.
 */

const KEY = 'housely:reservations:v1';

export function saveLocalReservation(reservation: Reservation): PlainReservation {
  const plain = toPlainReservation(reservation);
  try {
    const all = readAll();
    all[reservation.id] = plain;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('[housely] localStorage unavailable', err);
  }
  return plain;
}

export function getLocalReservation(id: string): PlainReservation | null {
  try {
    return readAll()[id] ?? null;
  } catch {
    return null;
  }
}

export function updateLocalReservation(
  id: string,
  patch: Partial<PlainReservation>
): PlainReservation | null {
  try {
    const all = readAll();
    if (!all[id]) return null;
    all[id] = { ...all[id], ...patch } as PlainReservation;
    localStorage.setItem(KEY, JSON.stringify(all));
    return all[id];
  } catch {
    return null;
  }
}

function readAll(): Record<string, PlainReservation> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, PlainReservation>;
  } catch {
    return {};
  }
}

export function isPermissionError(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  if (typeof code === 'string' && code.includes('permission')) return true;
  const message = err instanceof Error ? err.message : '';
  return /permission|insufficient/i.test(message);
}

/** Build a fully-formed Reservation in memory without touching Firestore. */
export function buildLocalReservation(input: {
  id: string;
  propertyId: string;
  propertySnapshot: Reservation['propertySnapshot'];
  ownerId: string;
  guestInfo: Reservation['guestInfo'];
  checkIn: Date;
  checkOut: Date;
  payment: Reservation['payment'];
  guestUid?: string;
}): Reservation {
  const now = Timestamp.fromDate(new Date());
  return {
    id: input.id,
    propertyId: input.propertyId,
    propertySnapshot: input.propertySnapshot,
    ownerId: input.ownerId,
    guestUid: input.guestUid,
    guestInfo: input.guestInfo,
    dates: {
      checkIn: Timestamp.fromDate(input.checkIn),
      checkOut: Timestamp.fromDate(input.checkOut),
      nights: Math.max(
        1,
        Math.round(
          (input.checkOut.getTime() - input.checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),
    },
    payment: input.payment,
    status: 'pending_commission',
    ownerContactRevealed: false,
    createdAt: now,
    updatedAt: now,
  };
}
