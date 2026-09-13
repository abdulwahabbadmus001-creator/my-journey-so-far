# Milestone 3 Changelog

## Photo storytelling
- Replaced static memory placeholders with a Firestore-driven “Moments Behind the Journey” system.
- Added cinematic irregular photo cards with captions and category/date metadata.
- Added click-to-open full-screen story view.
- Added admin photo upload and publication workflow.
- Added title, caption, story, category, date label, alt text and display order fields.

## Firebase foundation
- Added modular Firebase initialization.
- Added Authentication, Firestore and Storage services.
- Added public submissions for wishes, guestbook entries and project enquiries.
- Added public subscriptions for approved wishes and published memories.

## Private admin studio
- Added `/admin` route outside the public October 30 gate.
- Added Email/Password owner login.
- Added UID-based owner authorization.
- Added Overview, Photo Stories, Wishes, Leads and Guestbook screens.
- Added wish moderation, featured-wish state, lead status pipeline and guestbook moderation.

## Security
- Added Firestore rules for public approved-only reads and owner-only management.
- Added validation on public writes.
- Added Storage rules limiting photo writes to owner accounts and image MIME types under 5 MB.
- Added development-only admin preview mode.

## Conversion
- “Build something with me” now stores real lead data when Firebase is configured.
- Leads can move through New → Contacted → Negotiating → Won → Closed in admin.
