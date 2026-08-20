# SetFlow multi-user deployment

This build adds real SetFlow user accounts and cloud sync while keeping the workout experience local-first.

## What syncs

When a user is signed in, SetFlow syncs:

- profile and goals
- workout history and the active workout
- custom templates and custom exercises
- body measurements
- settings
- coach conversation history

Progress-photo image files stay in that device's IndexedDB. They are not uploaded as part of account sync. A photo is sent to the optional AI endpoint only when the user explicitly requests AI photo feedback.

## Recommended first deployment: Render Blueprint

The included `render.yaml` creates both the Node web service and a PostgreSQL database and wires `DATABASE_URL` into the app automatically.

1. Put the contents of this folder in a GitHub repository.
2. In Render, create a new **Blueprint** from that repository.
3. Render reads `render.yaml` and creates:
   - the `setflow` web service
   - the `setflow-db` PostgreSQL database
   - a generated `SESSION_SECRET`
4. `OPENAI_API_KEY` is optional. Leave it blank if you only want local coaching.
5. Deploy.
6. Open the generated HTTPS URL on a phone.

The server creates the `users` and `user_states` tables automatically the first time it connects to the database.

### Important Render free-database note

The Blueprint uses Render's `free` PostgreSQL plan so you can test accounts without paying immediately. Render currently limits free Postgres databases to 1 GB and they expire after 30 days. Before inviting real users or depending on the data long-term, change the database plan in `render.yaml` from:

```yaml
plan: free
```

to a current paid Postgres plan such as:

```yaml
plan: basic-256mb
```

Then sync the Blueprint in Render. Check Render's current pricing before upgrading.

## Manual hosting

Set these environment variables on any Node host:

```text
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=a-long-random-secret
OPENAI_API_KEY=optional
OPENAI_MODEL=gpt-4.1-mini
```

Then run:

```bash
npm install
npm start
```

`SESSION_SECRET` should be stable across restarts. Changing it signs every user out.

## Account behavior

### Create account

A new account takes the user's current guest workout data and makes it the initial cloud copy. The old guest copy is removed from localStorage so signing out does not reveal that history to the next person using the device.

### Sign in

SetFlow loads the user's latest cloud workout state and keeps a user-specific local cache for offline use.

### Offline use

A signed-in user can keep logging workouts while offline. Local changes are saved immediately and SetFlow attempts to sync when connectivity returns.

### Multiple devices

Cloud writes use a revision number. If another device changed the same account since this device last synced, SetFlow refuses to silently overwrite the newer cloud copy and marks sync as needing attention. Use **Settings -> SetFlow account -> Reload cloud** before syncing again.

### Delete account

Deleting an account requires the current password and permanently removes the user row and synced state from PostgreSQL. Device-local progress photos for that account are also removed from the current device.

## Security included in this MVP

- passwords are one-way hashed with Node's `scrypt` and a per-user random salt
- sessions are signed server-side with HMAC-SHA256
- sessions expire after 30 days
- bearer sessions are required for cloud sync
- connected AI endpoints require authentication whenever accounts are enabled
- basic IP-based throttling is applied to login/sign-up attempts
- database queries are parameterized
- account data is separated by the authenticated user ID
- progress photos remain device-local unless AI feedback is explicitly requested

## Before a large public launch

This is a functional multi-user MVP, but a commercial launch should additionally add:

- email verification
- password reset / account recovery
- transactional email provider
- stronger distributed rate limiting
- automated database backups and paid durable database hosting
- object storage if you want progress photos synced across devices
- privacy policy and terms of service
- observability/error reporting
- admin abuse controls
- billing/subscriptions if monetized
- security review and dependency scanning

## Install on a phone

After deployment, open the HTTPS SetFlow URL.

**iPhone:** Safari -> Share -> Add to Home Screen.

**Android:** Chrome -> menu -> Install app / Add to Home screen.

The existing PWA manifest, icons, safe-area layout, and service worker remain included in this account-enabled build.
