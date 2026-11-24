# FlowDesk v1.1 — Google Drive edition

A static PWA for Android, iPhone and desktop. Google Identity Services OAuth token authorization identifies the account and grants the narrow `drive.appdata` permission. The Google Drive API stores append-only JSON snapshots in that account's hidden app-data folder. No backend, client secret, API key or Firebase database is needed.

## 1. Publish the files

Extract the ZIP and upload all the contents to the root of your existing `flowdesk` GitHub repository (or a new public repository). Use GitHub Settings → Pages → Deploy from a branch → main → /(root). Keep the same hosting URL and OAuth project for ongoing access. The `.nojekyll` file is optional if your file upload UI hides it. Wait for HTTPS deployment. Example `https://YOUR-USERNAME.github.io/flowdesk/`.

## 2. Configure Google (required)

1. Go to https://console.cloud.google.com/ and create or select a project called FlowDesk.
2. APIs & Services → Library → Google Drive API → Enable.
3. Google Auth Platform → Get started/Branding. Set app name FlowDesk, support email and developer contact. Choose External under Audience for personal Google users. Add your own Google account under Test users while testing. Set the app home URL and privacy policy URL (`https://YOUR-USERNAME.github.io/flowdesk/privacy.html`) when Google requests them. Edit the privacy page to include your actual support contact and review it before publishing. Google may require authorized-domain verification and branding review; if your Pages domain cannot meet verification requirements, you may need a verified custom domain.
4. Data Access → Add or remove scopes. Select `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile` and `https://www.googleapis.com/auth/drive.appdata`. The last one is non-sensitive and limited to FlowDesk's own hidden app-data folder. Do not select full Drive access.
5. Clients → Create client → Web application. Name it FlowDesk Web. Under Authorized JavaScript origins add `https://YOUR-USERNAME.github.io` (origin only; no /flowdesk/ path). This token-model popup flow does not need a callback URL or client secret in the app. For local tests you can separately add `http://localhost:8000` to a development client.
6. Copy the OAuth **Client ID** (ending in `.apps.googleusercontent.com`). Edit `config.js`, replacing the placeholder with that value. Never add the client secret, service account keys or access tokens to GitHub. The OAuth client ID is public by design.
7. Commit the updated config. Open the HTTPS site in Chrome/Safari, wait for Offline ready, and tap Continue with Google. Grant permission for app data. While in testing, only configured test accounts are supported.
8. Test across devices with the same Google account. Complete Google's applicable publishing and verification steps in Google Auth Platform before opening to all customers. Google can require further review even for non-sensitive scopes.

Google documentation:
- https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid
- https://developers.google.com/identity/oauth2/web/guides/use-token-model
- https://developers.google.com/workspace/drive/api/guides/appdata

## 3. Install on phones

Android: open the deployed website in Chrome, use Install app or Add to Home screen. iPhone: open in Safari, Share → Add to Home Screen → Open as Web App if available. First launch online so all files are cached. If Google popup login fails in standalone mode, test in the normal browser; Safari and installed web apps can have separate storage contexts, so browser login does not automatically transfer to the installed PWA. Use the same account in the installed app when supported. Export individual tracker backups to move data if needed.

## 4. How sync works

- Guest records from the previous PWA remain separate. After connecting a Google account, Import guest data explicitly copies them into an empty Google workspace only. The app does not upload guest data automatically.
- Each Google account has separate local storage keys. The last selected account opens offline; this is not an offline password-protected login. Sign out or remove the local profile on shared devices.
- Changes sync while the app is open, online and authorized. It checks after local writes and every 30 seconds. Returning to Home allows a remote restore without interrupting a tracker form. Tokens are memory-only and expire; reconnect after reopening or expiry. No background sync while the app is closed.
- Each save creates a new Drive snapshot, preserving earlier versions. Conflicts pause synchronization until you choose a version. Habit completion is union-merged; expenses and projects are not automatically merged. Avoid simultaneous edits on several devices or browser tabs. Earlier snapshots can be downloaded from Drive history (latest 30 shown). They are combined JSON archives; to restore individual trackers, export using their own format or extract the corresponding data with care. Keep separate regular tracker backups too.
- Snapshots occupy Drive storage and are retained until the user removes the app's hidden data. Data may not appear in My Drive. No other files are accessed. Browser storage can fill or be evicted; local copies aren't encrypted by FlowDesk. Avoid entering confidential data on shared devices.
- Sign out discards the in-memory token and returns to guest. Remove local profile deletes the selected account's local tracker data after confirmation; it leaves Drive data alone. For deleting cloud data use Google Drive's Manage apps settings and revoke access in Google Account connections.
- Use one device at a time, and confirm that sync has finished before switching devices. Drive snapshots are not a transactional database. This app is a beta, not a production security audit.

## 5. Test before public release

With your real OAuth client: connect account A, tick a habit, add an expense and create a project. Wait for Synced; open a second device with the same account and verify all three. Go offline, change today's records, reconnect and sync. Test account B has no account A records, conflicts, sign-out, remove local profile, and restore. Test installed Android and iOS separately, and verify offline launch after the service worker is ready. Do not publish client secrets or customer exports. The Google API integration requires a real configured client ID and has not been end-to-end tested in this build environment.

## Custom habits
Use LifeFlow → Customize habits to add, rename, or remove habits in the existing categories. Changes start the next local calendar day. Historical scores use the checklist effective on that date. Keep the same storage keys and OAuth client ID. Back up before updating. Conflicting schedules that would invalidate existing completed ticks are rejected rather than silently discarded. Older app versions cannot interpret new custom habit IDs. Upload all files together, including habits.js and sw.js.

## v1.1 final release candidate (wallet update)
The displayed version is v1.1, with a new internal service worker cache revision. SpendFlow adds opening balances, cash and bank/UPI accounts, manual income and transfer events, custom categories, a monthly budget and selected-year total. The same ledger key is preserved; old expenses before the opening date do not reduce the new wallet balance. Enter opening balances before today's recorded expenses. Wallet data is included in SpendFlow backup and Drive snapshots. Earlier app versions cannot preserve the new wallet fields; update all devices before syncing. LifeFlow includes seven-day/year summaries and custom habits; EditFlow includes editable project task lists. Reminders and update controls are on Home. Reminder preferences are device-local and alerts only appear in the open app, without external push infrastructure. Full custom/light themes are not included. Google OAuth/Drive, Windows and mobile offline installation still require real-device testing. Windows setup opens this same published web origin in Edge with a dedicated local profile. See START-HERE.txt in the complete project bundle.

## FlowDesk v1.1.2 — Account & Fast Sync Update

What's new in FlowDesk v1.1.2:

- Faster automatic Google Drive synchronization.
- Improved cross-device data synchronization between PC, Android and iOS.
- Automatic sync checks every 8 seconds while the app is open.
- Google account profile remembered after closing the app.
- Improved account reconnection and session management.
- Added logout and account switching options.
- Added last synchronized time.
- Improved expense merging to prevent duplicate records.
- Bug fixes and synchronization improvements.

Existing user records and settings are preserved with compatible storage. Google Drive remains the only cloud storage service. No reinstallation required.
Google may occasionally require renewed authorization.
