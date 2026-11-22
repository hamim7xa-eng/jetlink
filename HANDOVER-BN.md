# JetLink Project Handover

Last updated: 2026-11-18

## Project summary

JetLink is a functional URL-shortener website inspired by the layout and workflow of urljetz.com, but built with original branding and original code. It must not be rebuilt from scratch unless the user explicitly asks.

Owner identity:

- Owner/developer name: **Dev X Sabbir**
- Footer credit: **Developed By Sabbir**
- Main host plan: **GitHub + Vercel** (permanent free `*.vercel.app` domain first; custom domain later if possible)
- Backend: **Firebase Authentication + Firestore only**. Firebase Hosting is not the primary host.

## Files in this folder

- `index.html` — complete single-file website (HTML, CSS and JavaScript in one file)
- `DEPLOY-GUIDE-BN.md` — full Bengali step-by-step deployment guide
- `README.md` — project/build documentation and honest feature status
- `firestore.rules` — Firestore security rules to publish in Firebase Console
- `vercel.json` — Vercel rewrites for SPA routes and short-link paths such as `/abc123` and `/abc123.mp4`
- `firebase.json` — alternative Firebase Hosting config only; Vercel is the chosen host
- `server.js` and `package.json` — optional Node/Express backend with true server-side redirect/API; not required for the Vercel + Firebase plan
- `HANDOVER-BN.md` — this continuation note

## Work already completed

- Full website built in `index.html`.
- Features include:
  - Short Link, Image Card and Media Link tabs
  - Link endings: `.mp4`, `.stream`, `.video`, `.link`, `.vip`, `.xyz`
  - Domain dropdown and editable domain pool
  - Custom alias for signed-in users
  - QR code view/download
  - Bulk shortening and CSV export
  - Pricing, Blog, Help, FAQ, About, Contact and Report Abuse pages
  - Legal template pages
  - Email/password registration and login
  - Google sign-in buttons on Login and Register pages using Firebase `signInWithPopup`
  - User dashboard, link management, click analytics, API-key page
  - Admin view for users with Firestore `role: "admin"`
  - Redirect handling through both `#/r/<code>` and Vercel path form `/<code>`
  - Click recording with country/device/referrer where available
- Branding/credit verified in `index.html`:
  - “Developed By Sabbir” is present.
  - “Dev X Sabbir” is present in owner/About/Contact content.
- QA already reported: 61/61 checks passed, including 19 rendered routes, link/button checks and JavaScript syntax checks. A canvas null-guard bug was fixed during QA.
- Firebase project was created by the user:
  - Project ID: `jetlink-6c450`
  - The Firebase web config has already been inserted into `index.html`.
  - Do not ask the user for the Firebase config again unless the config block in `index.html` is missing or the user creates a different Firebase project.
  - Do not copy Firebase config values into chat summaries, GitHub issues or other documents unnecessarily.
- The user enabled Firebase Authentication providers:
  - Email/Password: enabled
  - Google: enabled
- Google sign-in code was added after the provider was enabled. A first Google sign-in should create the matching `users/{uid}` Firestore profile through the existing `authGoogle()` flow.

## Remaining work / status not fully confirmed

Complete or verify these in order:

1. **Firebase public-facing name**
   - In Firebase Authentication → Google provider/project settings, change the public-facing name from the default project identifier to **JetLink** and Save.
   - The user was shown this step; completion was not independently confirmed.
   - The project support email was already selected by the user in Firebase settings.

2. **Firestore Database**
   - Confirm Firestore Database exists for project `jetlink-6c450`.
   - If not created: Build → Firestore Database → Create database → Production mode → Enable.
   - Publish the contents of `firestore.rules` in Firestore → Rules.
   - Do not claim this is done until it is visible in Firebase Console or a live signup creates a user document successfully.

3. **GitHub upload**
   - Create a GitHub repository and upload all files from this project folder, including `index.html`, `vercel.json`, `firestore.rules`, `README.md` and `DEPLOY-GUIDE-BN.md`.
   - Keep `vercel.json` at the repository root with `index.html`.

4. **Vercel deploy**
   - Import the GitHub repository into Vercel and deploy as a static project.
   - Confirm the free `*.vercel.app` URL loads the homepage.

5. **Firebase Authorized domains — critical after Vercel deploy**
   - Copy the exact Vercel hostname, for example `project-name.vercel.app`.
   - Firebase Console → Authentication → Settings → Authorized domains → Add domain.
   - Add the Vercel hostname there. Without this, email login and Google login can fail on the live domain.

6. **Live end-to-end test after deploy**
   Test all of these on the live Vercel URL:
   - Homepage opens with no console-breaking error.
   - Guest short link can be created.
   - Short link opens and redirects to the destination.
   - A short link with `.mp4` ending redirects correctly.
   - Image Card link opens the card first and clicking it goes to the destination.
   - Email/password registration and login work.
   - Google registration/login work.
   - Dashboard shows the user’s links.
   - Click count increases after opening a short link.
   - QR code appears and downloads.
   - Bulk shorten works.
   - Contact and Report Abuse forms submit.
   - Mobile layout and hamburger menu work.

7. **Contact information placeholder**
   - `index.html` still contains `[Your Support Email]` in the About/Contact content.
   - Ask the user for the real support email and/or Telegram link; do not invent one.
   - Replace every `[Your Support Email]` occurrence with the address/link the user provides.
   - Rebuild the ZIP and redeploy after changing it.

8. **Optional later work**
   - Connect a custom domain in Vercel if the user buys/uses one.
   - If a custom domain is used for the website, also add that exact hostname to Firebase Authorized domains.
   - Short-link domains in `DOMAIN_POOL` are UI/domain choices; only domains actually owned and connected should be presented as real working short-link domains.
   - Make the first admin only after signup: find the user document in Firestore `users/{uid}` and set `role` to `admin`.

## Important instructions for the next AI

- Continue from the existing files; do not discard the completed website or start a new clone.
- Read `README.md` and `DEPLOY-GUIDE-BN.md` before changing deployment code.
- The user prefers short Bengali explanations and step-by-step guidance.
- Be honest about what has been tested locally versus what has been proven on the live Firebase/Vercel deployment.
- Firebase web config is already in `index.html`; do not ask for it again as a routine step.
- Do not invent the user’s contact email, Telegram link, custom domain or Firebase status.
- If Firestore or rules status is unknown, say it needs verification in Firebase Console.
- Preserve the exact credit “Developed By Sabbir” and owner name “Dev X Sabbir”.

## Copy-paste prompt for another AI

```text
Continue the existing JetLink project from the attached ZIP/folder. Do not rebuild it from scratch. First read HANDOVER-BN.md, README.md and DEPLOY-GUIDE-BN.md. The single-file website is index.html, hosting is GitHub + Vercel, and Firebase Auth + Firestore is the backend. The Firebase project is jetlink-6c450 and its web config is already inserted in index.html, so do not ask for the config again. Email/Password and Google providers were enabled by the user, and Google sign-in buttons/code are already added. Help me verify/finish the remaining steps: set Firebase public-facing name to JetLink, confirm Firestore exists and publish firestore.rules, upload to GitHub, deploy to Vercel, add the exact Vercel hostname to Firebase Authentication Authorized domains, then run the live end-to-end tests listed in HANDOVER-BN.md. The contact email/Telegram is still a placeholder; ask me for it instead of inventing one. Preserve the credit “Developed By Sabbir” and owner name “Dev X Sabbir”. Reply in Bengali with short step-by-step instructions.
```
