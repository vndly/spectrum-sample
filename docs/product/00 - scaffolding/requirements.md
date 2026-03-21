---
id: R-000
title: Project scaffolding
status: not started
type: infrastructure
importance: critical
tags: [tooling, config, dx, build]
---

## Intent

Establish a reliable, fully configured project foundation so that every subsequent feature starts from a working dev environment with consistent tooling, strict type safety, and a clear directory structure.

## Context & Background

### Problem Statement

The project exists only as documentation — there is no source code, no build pipeline, no dev server, and no tooling. Before any roadmap feature can be implemented, the entire development environment must be created from scratch.

### Dependencies

- Node.js and npm installed locally
- Media provider API token for environment variable typing
- Firebase project for hosting configuration

## Decisions

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| CSS framework config | Tailwind v4 with CSS-based `@theme` | No `tailwind.config.ts` needed — theme is defined directly in CSS. |
| Code style | No semicolons (`semi: false`) | Cleaner visual style with less noise; enforced by Prettier. |
| Icon library | `lucide-vue-next` | Tree-shakeable — only icons actually used are included in the bundle. |

## Scope

**In scope:**

- Package management and dependency installation
- TypeScript configuration with strict mode
- Vite dev server and production build pipeline
- ESLint and Prettier for code quality and formatting
- Tailwind CSS v4 with dark theme variables
- Directory structure matching the 4-layer architecture
- Minimal Vue entry point (blank dark screen)
- Firebase hosting configuration for SPA
- VS Code editor settings for DX
- Typed environment variables

**Out of scope:**

- Routing (added with the first feature)
- Any UI beyond a blank dark screen
- API client or data layer implementation
- CI/CD pipeline

## Functional Requirements

| ID   | Requirement                    | Description                                                                                      | Priority |
| :--- | :----------------------------- | :----------------------------------------------------------------------------------------------- | :------- |
| S-01 | Package management             | `package.json` with all production and dev dependencies (`vue-i18n`, `@intlify/unplugin-vue-i18n`, etc.), `type: "module"`, npm scripts defined. | P0       |
| S-02 | TypeScript configuration       | Strict mode, ES2022 target, bundler module resolution, `@/*` path alias, project references.     | P0       |
| S-03 | Vite dev server & build        | HMR dev server, production build, Vue and Tailwind plugins, `@` path alias.                      | P0       |
| S-04 | ESLint + Prettier              | Flat config with strict TypeScript rules, Vue block order, no-`any`, Prettier integration.       | P0       |
| S-05 | Tailwind CSS v4 dark theme     | CSS-based `@theme` config with custom color variables and font stack.                            | P0       |
| S-06 | Directory structure            | `src/` with `presentation/`, `application/`, `domain/`, `infrastructure/`, and `assets/`.        | P0       |
| S-07 | Vue entry point                | `main.ts` and `App.vue` rendering a minimal dark screen. No router.                              | P0       |
| S-08 | HTML entry                     | `index.html` with `#app` mount point and dark background to prevent flash.                       | P0       |
| S-09 | Environment variable typing    | `env.d.ts` declaring `VITE_MEDIA_PROVIDER_TOKEN` for typed access via `import.meta.env`.                   | P1       |
| S-10 | Firebase hosting config        | `firebase.json` and `.firebaserc` (project: `plot-twisted`) with SPA rewrite and `dist` as public dir. | P1       |
| S-11 | VS Code settings               | Format on save, ESLint auto-fix, Tailwind IntelliSense.                                          | P1       |
| S-12 | i18n scaffolding               | vue-i18n instance in `src/presentation/i18n/index.ts`, translation JSON files for en/es/fr in `locales/`, Vite plugin configured, plugin registered in `main.ts`. | P0       |

## Non-Functional Requirements

### Developer Experience

- **Fast feedback loop:** Vite HMR must reflect changes in under 1 second during development.
- **Format on save:** Prettier runs automatically when a file is saved in VS Code.
- **Lint on save:** ESLint auto-fixes on save in VS Code.

### Strictness

- **No implicit `any`:** TypeScript `strict: true` and ESLint `@typescript-eslint/no-explicit-any: "error"`.
- **Consistent style:** Prettier enforces no semicolons, single quotes, trailing commas, 100-char line width.
- **Vue conventions:** `<script setup>` with script-first block order enforced by ESLint.

### Build

- **Zero-warning build:** `npm run build` must produce zero errors and zero warnings.
- **Tree-shaking:** Production builds must tree-shake unused code (Vite default).

## Acceptance Criteria

- [ ] `npm run dev` starts a dev server and loads a blank dark screen
- [ ] `npm run build` completes with zero errors
- [ ] `npm run lint` reports zero errors
- [ ] `npm run type-check` reports zero TypeScript errors
- [ ] `npm run format:check` reports zero formatting issues
- [ ] Path alias `@/` resolves to `src/` in imports
- [ ] Tailwind theme classes (`bg-bg-primary`, `text-accent`, etc.) render correct colors
- [ ] All `src/` layer directories exist (`presentation/`, `application/`, `domain/`, `infrastructure/`)
