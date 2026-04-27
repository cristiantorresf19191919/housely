import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { fallbackProperties } from '../src/lib/data/fallback';
import { config as dotenv } from 'dotenv';

dotenv({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const SEED_OWNER_EMAIL = process.env.SEED_OWNER_EMAIL ?? 'owner@housely.test';
const SEED_OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD ?? 'Housely2026!';

async function main() {
  const app = initializeApp(firebaseConfig as { apiKey: string });
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`Signing in as ${SEED_OWNER_EMAIL}...`);
  const cred = await signInWithEmailAndPassword(
    auth,
    SEED_OWNER_EMAIL,
    SEED_OWNER_PASSWORD
  );
  const ownerId = cred.user.uid;
  console.log(`  ✓ uid=${ownerId}`);

  console.log('Seeding properties...');
  for (const p of fallbackProperties) {
    const { id, createdAt: _c, updatedAt: _u, ownerId: _o, ...rest } = p;
    await setDoc(doc(db, 'properties', id), {
      ...rest,
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  ✓ ${id} — ${p.title}`);
  }
  console.log('Done.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
