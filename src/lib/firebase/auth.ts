'use client';

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './client';
import type { Locale, UserRole } from '@/types';

export const googleProvider = new GoogleAuthProvider();

export function watchAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signOut() {
  await fbSignOut(auth);
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function register(input: {
  email: string;
  password: string;
  fullName: string;
  preferredLanguage: Locale;
  role?: UserRole;
}) {
  const cred = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );
  await ensureUserDoc(cred.user, {
    fullName: input.fullName,
    preferredLanguage: input.preferredLanguage,
    role: input.role ?? 'guest',
  });
  return cred.user;
}

async function ensureUserDoc(
  user: User,
  defaults?: { fullName?: string; preferredLanguage?: Locale; role?: UserRole }
) {
  // The Firebase Auth account has already been created — writing the
  // companion profile document is best-effort. If Firestore rules deny the
  // write (e.g. demo project without rules deployed), we don't want to fail
  // the entire sign-up flow.
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return;
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? '',
      fullName: defaults?.fullName ?? user.displayName ?? '',
      preferredLanguage: defaults?.preferredLanguage ?? 'en',
      role: defaults?.role ?? 'guest',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[housely] could not write user profile doc', err);
  }
}
