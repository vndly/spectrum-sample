Feature: S-10 — Firebase hosting config

  firebase.json and .firebaserc (project: plot-twisted) with SPA rewrite and dist as public dir.

  Scenario: S-10-01 — SPA rewrite is configured
    Given `firebase.json` exists with a rewrite rule
    When a user navigates directly to `/library` on the deployed app
    Then Firebase serves `index.html` instead of returning a 404
