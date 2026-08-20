# Put SetFlow on your phone

This SetFlow build is an installable Progressive Web App (PWA) with optional multi-user accounts and cloud sync.

## Recommended deployment: Render Blueprint

Use the included `render.yaml` so Render creates both the web app and its PostgreSQL database.

1. Create a GitHub repository and upload the contents of this folder.
2. In Render, create a new **Blueprint** from that repository.
3. Render creates the `setflow` web service and `setflow-db` PostgreSQL database automatically.
4. `SESSION_SECRET` is generated automatically.
5. Optional: add `OPENAI_API_KEY` to enable connected AI coaching and requested progress-photo feedback.
6. Deploy and open the generated HTTPS URL on your phone.

See `DEPLOY-ACCOUNTS.md` for the account architecture, database notes, and production checklist.

## iPhone installation

1. Open the SetFlow HTTPS URL in Safari.
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Turn on **Open as Web App** if shown.
5. Tap **Add**.

## Android installation

1. Open the SetFlow HTTPS URL in Chrome.
2. Open the browser menu.
3. Choose **Install app** or **Add to Home screen**.
4. Confirm.

## Offline behavior

Signed-in workout data is saved locally first, so logging can continue offline. When connectivity returns, SetFlow attempts to sync the account's workout data to PostgreSQL.

Guest mode remains device-only.

Progress-photo files remain on the device in this build and do not sync between phones.

## Backups

Even with cloud sync, use **Settings -> Backup & portability -> Export full backup** periodically. A manual backup is useful before major imports, resets, or app changes.

## App Store later

This PWA can later be wrapped with Capacitor for native iOS/Android distribution. That is the next step for App Store / Google Play publishing, push notifications, Apple Health / Health Connect, subscriptions, native camera workflows, and Apple Watch support.
