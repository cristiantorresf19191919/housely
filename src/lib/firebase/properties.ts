import {
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  type QueryConstraint,
} from 'firebase/firestore';
import { propertiesCol, propertyDoc } from './collections';
import type { Property } from '@/types';

export async function getProperty(id: string): Promise<Property | null> {
  const snap = await getDoc(propertyDoc(id));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function listProperties(opts?: {
  featured?: boolean;
  max?: number;
  country?: string;
  type?: string;
}): Promise<Property[]> {
  const constraints: QueryConstraint[] = [where('active', '==', true)];
  if (opts?.featured) constraints.push(where('featured', '==', true));
  if (opts?.country) constraints.push(where('address.countryCode', '==', opts.country));
  if (opts?.type) constraints.push(where('type', '==', opts.type));
  constraints.push(orderBy('rating', 'desc'));
  if (opts?.max) constraints.push(limit(opts.max));

  const q = query(propertiesCol, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
