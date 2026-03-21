# Implementation Plan: Project Scaffolding

---

## Phase 1 — Package & Config

### Step 1 — package.json & dependencies

- [ ] Create `package.json` manually (`name: "plot-twisted"`, `version: "0.1.0"`, `private: true`, `type: "module"`).

**Scripts:** `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`, `type-check`

**Production deps:** `vue@^3`, `vue-router@^4`, `zod`, `lucide-vue-next`

**Dev deps:** `typescript@~5.7`, `vite@^6`, `@vitejs/plugin-vue`, `@tailwindcss/vite`, `tailwindcss`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`, `prettier`, `eslint-config-prettier`, `vue-tsc`

Run `npm install`.

### Step 2 — TypeScript configuration

- [ ] Create TypeScript config files:

- `tsconfig.json` — project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — `strict: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`, path alias `@/* → ./src/*`, `include: ["src/**/*"]`
- `tsconfig.node.json` — covers `vite.config.ts`, `eslint.config.js`

### Step 3 — Vite configuration

- [ ] Create `vite.config.ts` with `@vitejs/plugin-vue`, `@tailwindcss/vite` plugin, and `@` path alias → `./src`.

### Step 4 — ESLint + Prettier

- [ ] Create `eslint.config.js` (flat config):

- Extends `@eslint/js` recommended, `typescript-eslint` strict, `eslint-plugin-vue` recommended, `eslint-config-prettier`
- `@typescript-eslint/no-explicit-any: "error"`
- `vue/block-order: ["error", { order: ["script", "template", "style"] }]`

- [ ] Create `prettier.config.js`:

- `semi: false`, `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100`

---

## Phase 2 — App Shell

### Step 5 — index.html

- [ ] Create root HTML entry with `<div id="app">`, dark background `style="background-color: #0f1923"` to prevent flash, `<script type="module" src="/src/main.ts">`.

### Step 6 — Directory structure

- [ ] Create `src/` directory structure:

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

### Step 7 — Tailwind CSS theme

- [ ] Create `src/assets/main.css` with `@import "tailwindcss"` and a `@theme` block defining:

- `--color-bg-primary: #0f1923`
- `--color-bg-secondary: #1a2332`
- `--color-surface: #1e293b`
- `--color-accent: #14b8a6`
- `--font-sans: Inter, system-ui, -apple-system, sans-serif`

### Step 8 — env.d.ts

- [ ] Create `src/env.d.ts` — declares `ImportMetaEnv` with `VITE_MEDIA_PROVIDER_TOKEN: string` for typed env access.

### Step 9 — Vue entry point

- [ ] Create `src/main.ts` — creates the Vue app, imports `./assets/main.css`, and mounts to `#app`. No router installed yet.
- [ ] Create `src/App.vue` — minimal component with `bg-bg-primary` and `min-h-screen`. No router, no layout.

---

## Phase 3 — Infrastructure & DX

### Step 10 — Firebase config

- [ ] Create `firebase.json` — hosting with `dist` public dir, SPA rewrite (`** → /index.html`)
- [ ] Create `.firebaserc` — placeholder project ID

### Step 11 — VS Code settings

- [ ] Create `.vscode/settings.json` — format on save, ESLint auto-fix, Tailwind IntelliSense

---

## Phase 4 — Verification

### Step 12 — Verify

- [ ] Run and confirm all pass:
  - `npm run dev` — app loads with blank dark screen
  - `npm run build` — production build succeeds
  - `npm run lint` — zero errors
  - `npm run type-check` — zero TS errors
