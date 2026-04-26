# Housely

A luxury, editorial property-rental platform built with Next.js 15 (App Router), Firebase, Framer Motion, and next-intl. Hand-picked residences with a single, distinctive payment rule:

> **Reserve online, pay the keys at the door.** Guests pay only the platform reservation fee online; the rest is settled directly with the host before keys are handed over.

## Stack

- **Next.js 15** App Router with React 19, TypeScript, dynamic imports for lazy loading
- **Firebase 11** — Auth (email/password + Google) + Firestore + Storage on the client
- **Tailwind CSS 3** with a custom luxury palette (cream, ink, terracotta, sage, gold)
- **Fraunces** (variable serif, display) + **Geist Sans** (body) + **JetBrains Mono** (eyebrows / labels)
- **Framer Motion** for cascading reveal/stagger animations, parallax, and micro-interactions
- **next-intl** for full route-prefixed i18n (EN / ES) with a header language toggle
- **React Hook Form** + **Zod** for type-safe forms

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000 (auto-redirects to /en)
npm run seed         # seeds 6 sample residences into Firestore
```

The repo ships with a fallback property catalog so the UI renders before
Firestore is seeded; once seeded, the live data takes over.

## Routes

| Path | Purpose |
| ---- | ------- |
| `/[locale]` | Editorial landing (hero, marquee, featured, how-it-works, trust band) |
| `/[locale]/listings` | Searchable register with type / country / guest filters |
| `/[locale]/properties/[id]` | Property detail + sticky reserve card |
| `/[locale]/properties/[id]/book` | Guest info form (full name, email, phone, country, language, dates, # guests) |
| `/[locale]/checkout/[reservationId]` | Reservation-fee checkout (demo, no real charge) |
| `/[locale]/reservations/[reservationId]` | Confirmation, reveals owner contact + balance due at the property |
| `/[locale]/auth/login` · `/[locale]/auth/register` | Authentication |
| `/[locale]/account` | Guest dashboard with reservation list |

## Firestore collections

```
users/{uid}                                 → UserProfile
properties/{propertyId}                     → Property (incl. ownerContact, gated by rules)
properties/{propertyId}/reviews/{reviewId}  → Review
reservations/{reservationId}                → Reservation (split payment, dates, guestInfo)
payments/{paymentId}                        → Payment (commission)
```

See `firestore.rules` for access control. Owner contact reveals only after a
commission payment has been recorded against the matching reservation.

## Payment split

Configurable via `NEXT_PUBLIC_PLATFORM_COMMISSION_RATE` (defaults to `0.10`).
The booking flow shows three line-items at every step:

1. **Amount paid now** — platform reservation fee (10 % of subtotal)
2. **Remaining balance** — paid at the property
3. **Deadline** — before key delivery / before check-in

## Design notes

- Editorial-luxury aesthetic: generous whitespace, asymmetric grids, oversized
  Fraunces with optical-size + soft variable axes, terracotta as the only
  saturated accent.
- Cascading reveals on scroll (Framer Motion `useInView` + staggered children).
- All non-critical sections are dynamically imported on the home page for
  faster initial paint.
- Responsive from 360 px to 1920 px+, with reduced-motion fallbacks.
