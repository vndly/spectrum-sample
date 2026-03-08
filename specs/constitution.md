# Constitution

## 1. Core Principles

**Mission:** A personal, offline-first movie and TV tracker.

- **Privacy first** — All user data stays in localStorage. No accounts, no server, no telemetry.
- **Dark cinematic aesthetic** — Immersive dark backgrounds, hero images, and rich media.
- **TMDB-powered** — [TMDB](https://developer.themoviedb.org/docs/getting-started) is the sole data API: images, trailers, streaming, trending, and recommendations.

## 2. Tech Stack

- **Language:** TypeScript 5 (strict mode)
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite
- **Routing:** Vue Router
- **Styling:** Tailwind CSS (dark theme config)
- **Storage:** localStorage via a typed composable wrapper
- **API:** TMDB REST API with response caching in localStorage

## 3. Guardrails

- **No `any`** — Every `any` requires a suppressed lint rule and a documented reason.
- **No server state** — All persistence is localStorage. No backend, no cookies, no IndexedDB.
- **Typed everywhere** — All localStorage access goes through a typed service. Raw `JSON.parse` / `JSON.stringify` calls outside that service are prohibited.
- **Tailwind only** — No inline styles or separate CSS files. All styling through Tailwind utility classes and the theme config.
