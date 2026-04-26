import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './client';
import {
  paymentDoc,
  paymentsCol,
  reservationDoc,
  reservationsCol,
} from './collections';
import { computePayment } from '@/lib/utils/format';
import type {
  Locale,
  Property,
  Reservation,
  ReservationGuestInfo,
} from '@/types';
import type { PlainProperty } from '@/lib/utils/serialize';
import {
  buildLocalReservation,
  getLocalReservation,
  isPermissionError,
  saveLocalReservation,
  updateLocalReservation,
} from './local-fallback';
import { toPlainReservation, type PlainReservation } from '@/lib/utils/serialize';

const ID_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function shortId(len = 10) {
  let id = '';
  for (let i = 0; i < len; i++) {
    id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return id;
}

export async function createReservation(input: {
  property: PlainProperty | Property;
  guestInfo: ReservationGuestInfo;
  checkIn: Date;
  checkOut: Date;
  guestUid?: string;
}): Promise<{ reservation: PlainReservation; persisted: 'firestore' | 'local' }> {
  const { property, guestInfo, checkIn, checkOut, guestUid } = input;
  const ms = checkOut.getTime() - checkIn.getTime();
  const nights = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  const calc = computePayment({
    pricePerNight: property.pricePerNight,
    nights,
    cleaningFee: property.cleaningFee,
  });

  const reservationId = shortId();
  const propertySnapshot = {
    title: property.title,
    city: property.address.city,
    country: property.address.country,
    coverImage: property.images[0]?.url ?? '',
  };
  const payment = { ...calc, currency: property.currency };

  // Try Firestore first.
  try {
    const ref = reservationDoc(reservationId);
    const payload: DocumentData = {
      propertyId: property.id,
      propertySnapshot,
      ownerId: property.ownerId,
      guestInfo,
      dates: {
        checkIn: Timestamp.fromDate(checkIn),
        checkOut: Timestamp.fromDate(checkOut),
        nights,
      },
      payment,
      status: 'pending_commission',
      ownerContactRevealed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (guestUid) payload.guestUid = guestUid;
    await setDoc(ref, payload);
    const snap = await getDoc(ref);
    return {
      reservation: toPlainReservation(snap.data() as Reservation),
      persisted: 'firestore',
    };
  } catch (err) {
    if (!isPermissionError(err)) throw err;
    // Fall back to localStorage so the demo flow keeps working when Firestore
    // rules aren't deployed yet.
    const local = buildLocalReservation({
      id: reservationId,
      propertyId: property.id,
      propertySnapshot,
      ownerId: property.ownerId,
      guestInfo,
      checkIn,
      checkOut,
      payment,
      guestUid,
    });
    return { reservation: saveLocalReservation(local), persisted: 'local' };
  }
}

export async function getReservationFromAnywhere(
  id: string
): Promise<PlainReservation | null> {
  try {
    const snap = await getDoc(reservationDoc(id));
    if (snap.exists()) return toPlainReservation(snap.data());
  } catch {
    // ignore — fall through to local lookup
  }
  return getLocalReservation(id);
}

export async function getReservation(
  id: string
): Promise<Reservation | null> {
  const snap = await getDoc(reservationDoc(id));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function recordCommissionPayment(input: {
  reservationId: string;
  amount: number;
  currency: string;
  guestUid?: string;
}): Promise<{ paymentId: string; persisted: 'firestore' | 'local' }> {
  const { reservationId, amount, currency, guestUid } = input;
  const reservationRef = reservationDoc(reservationId);

  try {
    const reservationSnap = await getDoc(reservationRef);
    if (!reservationSnap.exists()) throw new Error('reservation_not_found');
    const reservation = reservationSnap.data();

    const paymentId = `pay_${reservationId}_${Date.now()}`;
    const pRef = paymentDoc(paymentId);
    const paymentData: DocumentData = {
      reservationId,
      propertyId: reservation.propertyId,
      kind: 'commission',
      amount,
      currency,
      status: 'succeeded',
      provider: 'demo',
      providerRef: `demo_${Date.now()}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (guestUid) paymentData.guestUid = guestUid;
    await setDoc(pRef, paymentData);

    await updateDoc(reservationRef, {
      status: 'reserved',
      ownerContactRevealed: true,
      'payment.commissionPaidAt': serverTimestamp(),
      'payment.commissionPaymentId': paymentId,
      updatedAt: serverTimestamp(),
    });

    return { paymentId, persisted: 'firestore' };
  } catch (err) {
    if (!isPermissionError(err)) throw err;
    const paymentId = `pay_${reservationId}_${Date.now()}`;
    updateLocalReservation(reservationId, {
      status: 'reserved',
      ownerContactRevealed: true,
      payment: {
        ...(getLocalReservation(reservationId)?.payment ?? {
          nightlyTotal: 0,
          cleaningFee: 0,
          subtotal: 0,
          commissionRate: 0,
          commissionAmount: amount,
          remainingAtProperty: 0,
          currency,
        }),
        commissionPaidAt: new Date().toISOString(),
        commissionPaymentId: paymentId,
      },
    } as Partial<PlainReservation>);
    return { paymentId, persisted: 'local' };
  }
}
