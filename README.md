# Birthday Chapter — Milestone 4

A date-gated October 30 digital birthday experience for **Wahab Opeyemi Badmus**, designed as both a personal celebration and a subtle demonstration of product-building capability.

## Public launch behavior

- **Before October 30, 2026:** only the “In Addy to Wahab Opeyemi Badmus” floating-balloon/countdown experience is shown.
- **October 30, 2026 — Africa/Lagos:** the complete birthday experience unlocks automatically.
- **After October 30:** the experience remains as a birthday archive.
- **Age is never displayed.**
- The app is code-split so the complete birthday/admin bundles are not loaded for ordinary pre-birthday visitors.

## Main birthday experience

- Birthday hero and editorial story
- Moderated birthday wishes
- Personal journey
- “Things I Built Along the Way” portfolio storytelling
- Photo Stories / Moments Behind the Journey
- Long-form Letters to Wahab
- Moderated public guestbook
- Optional OPay birthday gift card
- Private Birthday Time Capsule for October 30, 2027
- Creator profile
- Project enquiry / customer lead capture

## Private `/admin` studio

- Overview
- Photo Stories
- Wishes
- Letters
- Time Capsule
- Leads
- Guestbook

## Firebase-backed data

- Firebase Authentication for owner login
- Cloud Firestore for wishes, guestbook, leads, letters, time capsule and photo metadata
- Cloud Storage for photo files
- Owner authorisation through `admins/{uid}`
- Firestore and Storage security rules included
- Optional Firebase App Check support using reCAPTCHA Enterprise

## Run locally

```bash
npm install
npm run dev
```

For the complete Firebase activation sequence, read:

```text
FIREBASE_SETUP.md
```

## Development previews

Create `.env.local`.

Birthday preview:

```env
VITE_PREVIEW_MODE=birthday
```

Pre-birthday preview:

```env
VITE_PREVIEW_MODE=pre
```

Admin interface without Firebase, local development only:

```env
VITE_ADMIN_DEMO=true
```

Never deploy preview overrides or `VITE_ADMIN_DEMO=true`.

## Gift details in the unlocked experience

- **Bank:** OPay
- **Account name:** Wahab Opeyemi Badmus
- **Account number:** 9042044060

## Build validation note

External dependency installation is unavailable in the current build environment, so a full dependency-backed Vite bundle could not be executed here. The TypeScript/TSX source was structurally checked with temporary local module declarations after Milestone 4 changes. Run this on your computer after extraction:

```bash
npm install
npm run build
```
