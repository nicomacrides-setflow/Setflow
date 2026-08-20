# SetFlow 1.1 - multi-user account build

**Train. Track. Evolve.**

SetFlow is a mobile-first workout tracker for gym-goers at any level. This version keeps the original workout logging, analytics, coaching, body metrics, progress photos, backups, PWA install support, and optional connected AI, and adds real user accounts plus PostgreSQL cloud sync.

## New in 1.1

- email/password account creation and sign-in
- per-user local caches so different accounts do not share workout data
- PostgreSQL cloud sync for training data
- automatic migration of current guest workouts into a newly created account
- offline-friendly signed-in use
- sync conflict detection for multiple devices
- account sign-out and password-confirmed account deletion
- server-side `scrypt` password hashing
- signed 30-day sessions
- authentication required for connected AI when account mode is enabled
- per-user progress-photo ownership on the device

Progress-photo image files remain device-local in this build. They are intentionally excluded from cloud account sync.

## Run locally without accounts

Node 20 or newer:

```bash
npm start
```

Open `http://localhost:4173`.

Without `DATABASE_URL`, SetFlow runs in local-only mode and does not require the `pg` package at runtime.

## Run with accounts

Install dependencies:

```bash
npm install
```

Set:

```text
DATABASE_URL=postgresql://...
SESSION_SECRET=your-long-random-secret
```

Then:

```bash
npm start
```

The server automatically creates its required PostgreSQL tables.

## Deploy for other people

See **`DEPLOY-ACCOUNTS.md`**. The included `render.yaml` can provision the web service and PostgreSQL database together.

## Optional connected AI

Add:

```text
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4.1-mini
```

When accounts are enabled, `/api/coach` and `/api/analyze-progress` require a valid signed-in account so anonymous visitors cannot consume the server owner's AI key.

## Synced data

The account cloud copy includes workouts, active workout, profile, preferences, templates, custom exercises, body measurements, and coach messages. Photos themselves do not sync.

## Privacy model

Workout data is cached locally for offline use. Signed-in workout state also syncs to the configured PostgreSQL database. Each account uses a separate local storage key. Progress photos use an owner tag in IndexedDB and are filtered to the current account.

Use **Settings -> Backup & portability -> Export full backup** for an additional portable copy.

## Useful commands

```bash
npm start
npm run check
```

## Files

```text
index.html              App shell
styles.css              Responsive UI and account screens
app.js                  Workout UI, auth client, offline cache and cloud sync
server.mjs              Static server, accounts API, sync API and optional AI API
render.yaml             Render web service + PostgreSQL Blueprint
DEPLOY-ACCOUNTS.md       Multi-user deployment guide
.env.example             Environment variable template
manifest.webmanifest    PWA metadata
sw.js                    Offline asset cache
icons/                   PWA and iOS icons
```

## Product boundary

This is a functional multi-user MVP suitable for personal use, private beta testing, and a small controlled group. Before a broad commercial launch, add email verification, password recovery, durable paid database backups, production rate limiting, legal/privacy documents, monitoring, and a formal security review.
