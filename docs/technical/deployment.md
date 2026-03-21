# Deployment

## Hosting

The app is deployed to **Firebase Hosting**, which provides a CDN, automatic SSL, and a generous free tier suitable for a personal project.

## Prerequisites

- [Firebase CLI](https://firebase.google.com/docs/cli) installed globally: `npm install -g firebase-tools`
- A Firebase project created at [console.firebase.google.com](https://console.firebase.google.com/)
- Logged in via `firebase login`

## Project Setup

If setting up Firebase Hosting for the first time:

```bash
firebase init hosting
```

When prompted:

- **Public directory:** `dist`
- **Single-page app:** Yes (rewrite all URLs to `/index.html`)
- **Automatic builds with GitHub:** No (manual deploy)

This generates `firebase.json` and `.firebaserc` in the project root.

## Deploy

Build and deploy in two steps:

```bash
npm run build
firebase deploy --only hosting
```

The CLI outputs the live URL after a successful deploy.

## CI/CD

There is no automated CI/CD pipeline. The project does not use GitHub Actions, pre-push hooks, or any other automated build/test/deploy workflow.

The deploy process is fully manual:

1. Run `npm run build` locally.
2. Run `firebase deploy --only hosting`.

Linting (`npm run lint`) and tests (`npm run test`) are available as local commands but are not enforced automatically before deploy.

## Rollback

Firebase Hosting keeps a history of previous deploys. To roll back:

1. Open the Firebase Console → Hosting.
2. Select a previous release from the release history.
3. Click **Rollback** to make it live.
