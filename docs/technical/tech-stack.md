# Tech Stack

## Core

- **TypeScript 5** (strict mode) — Catches bugs at compile time; strict mode enforces no implicit `any` and stricter null checks.
- **Vue 3** (Composition API, `<script setup>`) — Lightweight, fast, and the Composition API pairs naturally with TypeScript for type-safe reactive logic.
- **Vue Router** — Official Vue router — handles SPA navigation, route guards, and lazy loading.
- **Zod** — Runtime schema validation with TypeScript type inference (`z.infer<>`). Used at every data boundary (API responses, localStorage reads, user input).
- **Tailwind CSS v4** (dark theme config) — Utility-first CSS that keeps styles co-located with markup. Dark theme configured via CSS-based `@theme` block in `src/assets/main.css` — no `tailwind.config.ts`.
- **vue-i18n v10** — Official Vue internationalization library. Composition API mode (`legacy: false`) with pre-compiled messages via `@intlify/unplugin-vue-i18n`. Provides `$t()` in templates and `useI18n()` in `<script setup>`.
- **lucide-vue-next** — Tree-shakeable icon library for navigation and UI icons.

## Dev Tooling

- **Vite** — Near-instant HMR during development, optimized Rollup-based production builds.
- **ESLint** — Enforces code quality rules, including the no-`any` guardrail defined in conventions.
- **Prettier** — Consistent code formatting across the project, integrated with ESLint.
- **Vitest** — Vite-native test runner — fast, compatible with Vue components, and shares the same config as the dev build.
- **@intlify/unplugin-vue-i18n** — Vite plugin that pre-compiles translation JSON at build time, stripping the runtime message compiler from production bundles.

## Infrastructure

- **Firebase Hosting** — Free tier covers a personal project, with CDN and automatic SSL.
- **localStorage** — All user data stays on-device — no backend, no auth, no server costs. Accessed through a typed `storage.service.ts` wrapper in the Infrastructure layer with Zod validation.
- **Media provider REST API** — Comprehensive, free-tier API for metadata, images, trending, and search. See [API](./api.md).

## Browser Support

Modern evergreen browsers only: Chrome, Firefox, Safari, Edge. No IE or legacy polyfills.
