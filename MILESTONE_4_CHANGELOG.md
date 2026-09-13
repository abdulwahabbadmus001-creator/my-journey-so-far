# Milestone 4 Changelog — Firebase Activation & Content Studio

## Public experience
- Added approved guestbook wall.
- Added real curated Letters to Wahab sourced from Firestore.
- Added open/read letter overlay.
- Added a functioning Birthday Time Capsule form.
- Time-capsule submissions are private and marked for October 30, 2027.
- Expanded project enquiry form with organisation, phone/WhatsApp and preferred contact method.
- Added code splitting so pre-birthday visitors do not load the full birthday/admin experience unnecessarily.

## Photo storytelling
- Added editing for photo title, caption, story, category, date, alt text, display order and publish state.
- Existing photo media remains intact while text/content is edited.
- Image replacement remains intentionally separate to avoid orphaned Storage objects.

## Admin studio
- Added Letters tab.
- Added Time Capsule tab.
- Added letter create/edit/publish/hide/delete workflow.
- Added private viewing of time-capsule notes.
- Leads now show organisation, phone and preferred contact channel.
- Overview now reports letters and time-capsule counts.
- Expanded navigation to seven management areas.

## Security
- Strengthened Firestore field validation for public writes.
- Added strict rules for letters and time-capsule submissions.
- Kept client leads and time-capsule content owner-only.
- Added optional Firebase App Check initialisation using reCAPTCHA Enterprise.
- Kept image write access restricted to the owner and images below 5 MB.

## Setup
- Added a complete `FIREBASE_SETUP.md` activation guide.
- Added explicit production environment guidance.
- Added current Cloud Storage billing-plan warning.
- Added final pre-launch test checklist.
