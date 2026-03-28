# Implementation Details: Project Setup

---

## Overview

All setup was implemented as specified in the [plan](./plan.md), fulfilling every requirement in [requirements.md](./requirements.md). The project went from documentation-only to a fully functional Vue 3 development environment with strict tooling.

---

## Phase 1 — Package & Config

### package.json

Created with `name: "plot-twisted"`, `version: "0.0.1"`, `private: true`, `type: "module"`.

**Scripts defined:**

| Script          | Command                          |
| :-------------- | :------------------------------- |
| `dev`           | `vite`                           |
| `build`         | `vue-tsc --noEmit && vite build` |
| `preview`       | `vite preview`                   |
| `lint`          | `eslint .`                       |
| `lint:fix`      | `eslint . --fix`                 |
| `format`        | `prettier --write .`             |
| `format:check`  | `prettier --check .`             |
| `test`          | `vitest run`                     |
| `test:coverage` | `vitest run --coverage`          |
| `type-check`    | `vue-tsc --noEmit`               |
| `deploy`        | `firebase deploy --only hosting` |

**Production dependencies:** `vue@^3.5.31`, `zod@^4.3.6`, `lucide-vue-next@^1.0.0`, `vue-i18n@^11.3.0`, `vue-router@^5.0.4`

**Dev dependencies:** `typescript@~5.9.3`, `vite@^8.0.3`, `vitest@^4.1.2`, `@vitejs/plugin-vue@^6.0.5`, `@tailwindcss/vite@^4.2.2`, `tailwindcss@^4.2.2`, `@intlify/unplugin-vue-i18n@^11.0.7`, `eslint@^10.1.0`, `@eslint/js@^10.0.1`, `typescript-eslint@^8.57.2`, `eslint-plugin-vue@^10.8.0`, `eslint-config-prettier@^10.1.8`, `prettier@^3.8.1`, `vue-tsc@^3.2.6`, `jsdom@^29.0.1`, `@types/node@^25.5.0`, `@vue/test-utils@^2.4.6`

296 packages installed, 0 vulnerabilities.

### TypeScript configuration

Four config files using project references:

- **`tsconfig.json`** — root file with references to `tsconfig.app.json`, `tsconfig.node.json`, and `tsconfig.vitest.json`
- **`tsconfig.app.json`** — `strict: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`, path alias `@/* → ./src/*`, includes `src/**/*` and `src/**/*.vue`, enables `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **`tsconfig.node.json`** — covers `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`
- **`tsconfig.vitest.json`** — extends `tsconfig.app.json`, adds `vitest/globals` and `node` types, includes `tests/**/*.ts`

### Vite configuration (`vite.config.ts`)

Plugins registered:

1. `@vitejs/plugin-vue` — Vue SFC support
2. `@tailwindcss/vite` — Tailwind CSS v4 integration
3. `@intlify/unplugin-vue-i18n/vite` — compile-time i18n optimization, pointing at `src/presentation/i18n/locales/**`

Path alias: `@` resolves to `./src`.

### Vitest configuration (`vitest.config.ts`)

Merges the Vite config and adds `jsdom` as the test environment.

### ESLint configuration (`eslint.config.js`)

Flat config extending:

- `@eslint/js` recommended
- `typescript-eslint` strict
- `eslint-plugin-vue` flat/recommended
- `eslint-config-prettier`

Custom rules:

- `@typescript-eslint/no-explicit-any: "error"`
- `vue/block-order: ["error", { order: ["script", "template", "style"] }]`
- `vue/multi-word-component-names: "off"` (needed for `App.vue`)

Ignores: `dist/`, `coverage/`

### Prettier configuration (`prettier.config.js`)

- `semi: false`
- `singleQuote: true`
- `trailingComma: 'all'`
- `printWidth: 100`

---

## Phase 2 — App Shell

### index.html

Root HTML entry at project root with:

- Inline SVG favicon using the 📺 emoji (no external file needed)
- `<div id="app">` mount point
- Inline `style="background-color: #0f1923"` on `<body>` to prevent white flash
- `<script type="module" src="/src/main.ts">`

### Directory structure

```
src/
├── main.ts
├── App.vue
├── env.d.ts
├── assets/
│   └── main.css
├── presentation/
│   └── i18n/
│       ├── index.ts
│       └── locales/
│           ├── en.json
│           ├── es.json
│           └── fr.json
├── application/
│   └── .gitkeep
├── domain/
│   └── .gitkeep
└── infrastructure/
    └── .gitkeep
```

### Tailwind CSS theme (`src/assets/main.css`)

Uses Tailwind v4's CSS-based configuration with `@import 'tailwindcss'` and a `@theme` block defining:

| Variable               | Value                                         |
| :--------------------- | :-------------------------------------------- |
| `--color-bg-primary`   | `#0f1923`                                     |
| `--color-bg-secondary` | `#1a2332`                                     |
| `--color-surface`      | `#1e293b`                                     |
| `--color-accent`       | `#14b8a6`                                     |
| `--font-sans`          | `Inter, system-ui, -apple-system, sans-serif` |

### Environment types (`src/env.d.ts`)

Declares `ImportMetaEnv` with `VITE_MEDIA_PROVIDER_TOKEN: string` for typed `import.meta.env` access.

### i18n setup

- **`src/presentation/i18n/index.ts`** — creates a vue-i18n instance with `legacy: false`, default locale `en`, fallback `en`, messages for `en`, `es`, `fr`
- **Locale files** — `en.json`, `es.json`, `fr.json` each contain `{ "app": { "title": "Plot Twisted" } }`

### Vue entry point

- **`src/main.ts`** — creates the Vue app, imports `main.css`, registers i18n plugin, mounts to `#app`. No router installed.
- **`src/App.vue`** — minimal SFC with `<script setup lang="ts">` and a `<template>` rendering `<div class="min-h-screen bg-bg-primary">`.

---

## Phase 3 — Infrastructure & DX

### Firebase configuration

- **`firebase.json`** — hosting config with `dist` as public directory, SPA rewrite (`** → /index.html`), ignores firebase files, dotfiles, and node_modules
- **`.firebaserc`** — default project set to `plot-twisted`

### VS Code settings (`.vscode/settings.json`)

Merged DX settings into the existing file:

| Setting                        | Value                        |
| :----------------------------- | :--------------------------- |
| `editor.formatOnSave`          | `true` (was `false`)         |
| `editor.defaultFormatter`      | `esbenp.prettier-vscode`     |
| `editor.codeActionsOnSave`     | ESLint auto-fix on save      |
| `tailwindCSS.includeLanguages` | `{ "vue": "html" }`          |
| `files.associations`           | `{ "*.css": "tailwindcss" }` |

Pre-existing settings (theme, font, tab size, etc.) were preserved.

---

## Phase 4 — Verification Results

All checks passed on 2026-03-21:

| Check          | Result                                     |
| :------------- | :----------------------------------------- |
| `type-check`   | Zero TypeScript errors                     |
| `lint`         | Zero ESLint errors                         |
| `format:check` | All files pass Prettier                    |
| `build`        | Successful — 34 modules, output to `dist/` |

Build output:

```
dist/index.html                   0.43 kB │ gzip:  0.30 kB
dist/assets/index-CSaAQhGI.css   12.98 kB │ gzip:  3.23 kB
dist/assets/index-CD4m2BkO.js   110.04 kB │ gzip: 40.61 kB
```

---

## Files Created

| File                                    | Purpose                              |
| :-------------------------------------- | :----------------------------------- |
| `package.json`                          | Project manifest and scripts         |
| `tsconfig.json`                         | TypeScript project references        |
| `tsconfig.app.json`                     | App TypeScript config                |
| `tsconfig.node.json`                    | Node tooling TypeScript config       |
| `tsconfig.vitest.json`                  | Test file TypeScript config          |
| `vite.config.ts`                        | Vite build configuration             |
| `vitest.config.ts`                      | Test runner configuration            |
| `eslint.config.js`                      | Linting rules                        |
| `prettier.config.js`                    | Formatting rules                     |
| `index.html`                            | HTML entry point                     |
| `firebase.json`                         | Firebase hosting config              |
| `.firebaserc`                           | Firebase project config              |
| `src/main.ts`                           | Vue app entry point                  |
| `src/App.vue`                           | Root component                       |
| `src/env.d.ts`                          | Environment type declarations        |
| `src/assets/main.css`                   | Tailwind theme                       |
| `src/presentation/i18n/index.ts`        | i18n instance                        |
| `src/presentation/i18n/locales/en.json` | English translations                 |
| `src/presentation/i18n/locales/es.json` | Spanish translations                 |
| `src/presentation/i18n/locales/fr.json` | French translations                  |
| `src/application/.gitkeep`              | Placeholder for application layer    |
| `src/domain/.gitkeep`                   | Placeholder for domain layer         |
| `src/infrastructure/.gitkeep`           | Placeholder for infrastructure layer |

## Files Modified

| File                    | Change                                                 |
| :---------------------- | :----------------------------------------------------- |
| `.vscode/settings.json` | Added formatOnSave, ESLint auto-fix, Tailwind settings |
