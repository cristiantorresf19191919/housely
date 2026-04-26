import {
  collection,
  collectionGroup,
  doc,
  type CollectionReference,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore';
import { db } from './client';
import type {
  Payment,
  Property,
  Reservation,
  Review,
  UserProfile,
} from '@/types';

/**
 * Firestore collection layout:
 *
 *  users/{uid}                                  → UserProfile
 *  properties/{propertyId}                      → Property
 *  properties/{propertyId}/reviews/{reviewId}   → Review
 *  reservations/{reservationId}                 → Reservation
 *  payments/{paymentId}                         → Payment
 *
 * Owner contact lives on the property doc but is gated by security rules:
 * a guest can only read it after a commission payment is recorded against
 * a reservation that references the property.
 */

function withId<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data) => {
      const { id: _id, ...rest } = data as { id?: string } & Record<string, unknown>;
      return rest;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
      return { id: snapshot.id, ...snapshot.data(options) } as T;
    },
  };
}

export const usersCol = collection(db, 'users').withConverter(withId<UserProfile>()) as CollectionReference<UserProfile>;
export const propertiesCol = collection(db, 'properties').withConverter(withId<Property>()) as CollectionReference<Property>;
export const reservationsCol = collection(db, 'reservations').withConverter(withId<Reservation>()) as CollectionReference<Reservation>;
export const paymentsCol = collection(db, 'payments').withConverter(withId<Payment>()) as CollectionReference<Payment>;

export const userDoc = (uid: string): DocumentReference<UserProfile> =>
  doc(usersCol, uid);
export const propertyDoc = (id: string): DocumentReference<Property> =>
  doc(propertiesCol, id);
export const reservationDoc = (id: string): DocumentReference<Reservation> =>
  doc(reservationsCol, id);
export const paymentDoc = (id: string): DocumentReference<Payment> =>
  doc(paymentsCol, id);

export const reviewsCol = (propertyId: string) =>
  collection(db, 'properties', propertyId, 'reviews').withConverter(
    withId<Review>()
  ) as CollectionReference<Review>;

export const allReviewsGroup = collectionGroup(db, 'reviews').withConverter(withId<Review>());
