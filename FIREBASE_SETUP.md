# Firebase Activation Guide — Birthday Chapter

This milestone is ready for real Firebase data. The only missing values are the credentials generated inside your own Firebase project.

## 1. Create the Firebase project

1. Open the Firebase Console.
2. Create a project, for example: `birthday-chapter`.
3. Register a **Web App** inside the project.
4. Firebase will show a configuration object containing `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId`.
5. Create `.env.local` in the project root and copy the values into it:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Keep these off in production:
VITE_PREVIEW_MODE=
VITE_ADMIN_DEMO=false

# Add later after App Check is configured:
VITE_FIREBASE_APPCHECK_SITE_KEY=
```

## 2. Enable owner login

In Firebase Console:

1. Open **Authentication**.
2. Select **Get started**.
3. Open **Sign-in method**.
4. Enable **Email/Password**.
5. In the Users tab, create the owner email/password account you will use for `/admin`.
6. Copy the new user's **UID**.

Do not put your admin password anywhere in source code, GitHub, `.env.example`, or Vercel public variables.

## 3. Create Firestore

1. Open **Firestore Database**.
2. Create the database.
3. Use production mode.
4. Select your preferred database location.
5. After creation, create a collection called `admins`.
6. Create a document whose document ID is the exact Firebase Authentication UID copied above.
7. Add this field:

```text
role = owner
```

This is what authorises the signed-in account to use the private studio.

## 4. Deploy the included security rules

The repository already contains:

- `firestore.rules`
- `storage.rules`
- `firebase.json`

Install Firebase CLI if needed:

```bash
npm install -g firebase-tools
```

Then:

```bash
firebase login
firebase use --add
```

Choose the Firebase project you just created.

Deploy rules:

```bash
firebase deploy --only firestore:rules,storage
```

The Firestore rules enforce:

- public visitors can submit wishes, guestbook entries, time-capsule notes and project enquiries;
- only approved wishes/guestbook entries are publicly readable;
- time-capsule notes and client leads remain owner-only;
- only the owner can manage photo stories and letters;
- only the owner can moderate public submissions.

## 5. Cloud Storage and photographs

Photo uploads currently use **Cloud Storage for Firebase**.

Current Firebase policy requires a project on the pay-as-you-go **Blaze** plan to use Cloud Storage. If you activate Storage:

1. Open **Storage** in Firebase Console.
2. Follow the activation flow.
3. Keep the Storage Rules in this repository deployed.
4. Set a billing budget alert before production use.

The application restricts owner photo uploads to images below 5 MB and accepted image MIME types.

If you do not want to attach a billing account, the rest of the app can still use Firebase Authentication + Firestore. The photo provider can later be switched to a separate no-card media provider without changing the content model.

## 6. Run locally

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/admin
```

Sign in using the Firebase Authentication account you created.

To preview the birthday page before October 30 locally only:

```env
VITE_PREVIEW_MODE=birthday
```

To preview the pre-birthday state:

```env
VITE_PREVIEW_MODE=pre
```

Never deploy either preview override.

## 7. Populate your birthday content

From `/admin` you can now prepare:

### Photo Stories
Upload photographs and add:
- title;
- caption;
- longer story;
- category;
- date/label;
- alt text;
- display order;
- publish/hide status.

Existing photo story text can be edited later.

### Wishes
Approve, reject, feature or delete visitor wishes.

### Letters
Create longer curated messages and publish/hide them.

### Time Capsule
Review private notes intended for October 30, 2027.

### Leads
Review project enquiries and move them through:

```text
New → Contacted → Negotiating → Won → Closed
```

### Guestbook
Approve or reject guestbook signatures.

## 8. App Check before public launch

The code supports Firebase App Check using reCAPTCHA Enterprise.

After you have your final Vercel/custom domain:

1. Create a score-based reCAPTCHA Enterprise web key for that production domain.
2. Register the web app in **Firebase → App Check**.
3. Add the public site key to:

```env
VITE_FIREBASE_APPCHECK_SITE_KEY=
```

4. Deploy and verify requests.
5. Only then enable App Check enforcement for the Firebase products you want to protect.

Do not configure a production reCAPTCHA key for `localhost`.

## 9. Production Vercel environment

Add these in Vercel Project Settings → Environment Variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_APPCHECK_SITE_KEY   (after configured)
```

Do **not** add:

```text
VITE_ADMIN_DEMO=true
VITE_PREVIEW_MODE=birthday
VITE_PREVIEW_MODE=post
```

## 10. Required production tests

Before sharing the link publicly:

1. Visit the production URL before October 30 — only the In Addy screen should load.
2. Confirm `/admin` requires owner authentication.
3. Upload one test photo and edit its caption.
4. Submit a test birthday wish and approve it.
5. Submit a guestbook entry and approve it.
6. Add and publish a letter.
7. Submit a time-capsule note and confirm it is visible only inside admin.
8. Submit a project enquiry and move its lead status.
9. Preview birthday mode locally.
10. Remove all preview flags before production deployment.

The public app is code-split: pre-birthday visitors load the pre-birthday experience, while the complete birthday and private-admin bundles are loaded only when needed.
