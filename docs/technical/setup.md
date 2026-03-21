# Setup

## Prerequisites

- **Node.js** — v18 LTS or later (`node -v` to check)
- **npm** — Included with Node.js (`npm -v` to check)

## Install Dependencies

```bash
npm install
```

## Environment Configuration

The app requires a TMDB API access token to fetch movie and TV data.

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** in your TMDB account dashboard.
3. Copy the **API Read Access Token** (not the API Key).
4. Create a `.env` file in the project root:

```env
VITE_TMDB_TOKEN=your_tmdb_read_access_token_here
```

The `VITE_` prefix is required — Vite only exposes environment variables with this prefix to client-side code.

## Commands

> **Note:** These commands will be available after the project is scaffolded and `package.json` is created (e.g., via `npm create vue@latest`). Until then, `npm install` and the scripts below will not work.

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with hot module reload |
| `npm run build`   | Production build to `dist/`                      |
| `npm run preview` | Preview the production build locally             |
| `npm run lint`    | Run ESLint across the project                    |
| `npm run test`    | Run Vitest test suite                            |
