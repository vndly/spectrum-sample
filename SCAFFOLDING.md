# Scaffolding Plan

Everything needed before implementing any roadmap features.

## Decisions

- **Tailwind v4** — CSS-based `@theme` config, no `tailwind.config.ts`
- **No semicolons** — `semi: false` in Prettier
- **lucide-vue-next** — tree-shakeable icon library for navigation icons

---

## Step 1 — package.json & dependencies

Create `package.json` manually (`name: "movie-tracker"`, `version: "0.1.0"`, `private: true`, `type: "module"`).

**Scripts:** `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`, `type-check`

**Production deps:** `vue@^3`, `vue-router@^4`, `zod`, `lucide-vue-next`

**Dev deps:** `typescript@~5.7`, `vite@^6`, `@vitejs/plugin-vue`, `@tailwindcss/vite`, `tailwindcss`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`, `prettier`, `eslint-config-prettier`, `vue-tsc`

Run `npm install`.

## Step 2 — TypeScript configuration

- `tsconfig.json` — project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — `strict: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`, path alias `@/* → ./src/*`, `include: ["src/**/*"]`
- `tsconfig.node.json` — covers `vite.config.ts`, `eslint.config.js`

## Step 3 — Vite configuration

`vite.config.ts` with `@vitejs/plugin-vue`, `@tailwindcss/vite` plugin, and `@` path alias → `./src`.

## Step 4 — ESLint + Prettier

`eslint.config.js` (flat config):
- Extends `@eslint/js` recommended, `typescript-eslint` strict, `eslint-plugin-vue` recommended, `eslint-config-prettier`
- `@typescript-eslint/no-explicit-any: "error"`
- `vue/block-order: ["error", { order: ["script", "template", "style"] }]`

`prettier.config.js`:
- `semi: false`, `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100`

## Step 5 — index.html

Root HTML entry with `<div id="app">`, dark background `style="background-color: #0f1923"` to prevent flash, `<script type="module" src="/src/main.ts">`.

## Step 6 — Directory structure

```
src/
├── main.ts
├── App.vue
├── env.d.ts
├── assets/
│   └── main.css
├── presentation/
├── application/
├── domain/
└── infrastructure/
```

Empty directories get `.gitkeep` files until real files are added.

## Step 7 — Tailwind CSS theme

`src/assets/main.css` with `@import "tailwindcss"` and a `@theme` block defining:
- `--color-bg-primary: #0f1923`
- `--color-bg-secondary: #1a2332`
- `--color-surface: #1e293b`
- `--color-accent: #14b8a6`
- `--font-sans: Inter, system-ui, -apple-system, sans-serif`

## Step 8 — env.d.ts

`src/env.d.ts` — declares `ImportMetaEnv` with `VITE_TMDB_TOKEN: string` for typed env access.

## Step 9 — Vue entry point

`src/main.ts` — creates the Vue app, imports `./assets/main.css`, and mounts to `#app`. No router installed yet.

`src/App.vue` — minimal component with `bg-bg-primary` and `min-h-screen`. No router, no layout.

## Step 10 — Firebase config

- `firebase.json` — hosting with `dist` public dir, SPA rewrite (`** → /index.html`)
- `.firebaserc` — placeholder project ID

## Step 11 — VS Code settings

- `.vscode/settings.json` — format on save, ESLint auto-fix, Tailwind IntelliSense

## Step 12 — Verify

Run and confirm all pass:
- `npm run dev` — app loads with blank dark screen
- `npm run build` — production build succeeds
- `npm run lint` — zero errors
- `npm run type-check` — zero TS errors
