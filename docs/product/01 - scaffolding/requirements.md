---
id: R-01a
title: App Scaffolding — Dependencies & Test Infrastructure
status: released
type: infrastructure
importance: critical
tags: [dependencies, testing, dx, i18n, localization, tailwind, transitions, constants]
---

## Intent

Install vue-router and @vue/test-utils, configure the Vitest test infrastructure so all subsequent scaffolding phases can write and run tests. Add all i18n keys needed by the scaffolding phases (navigation labels, page titles, empty state text, error text, toast labels) to all three locale files.

Add Tailwind theme color tokens (success, error), all transition/animation CSS (fade, toast, modal, reduced-motion), and the domain constant for toast auto-dismiss, preparing the visual foundation for subsequent components.

## Context & Background

### Problem Statement

Downstream scaffolding features (01b through 01k) need test infrastructure and routing/test-utils dependencies before they can write or validate code. Without a configured Vitest setup and the required npm packages, no tests can be authored in subsequent phases.

### User Stories

- As a developer working on phases 01b–01k, I need Vitest globals and `@vue/test-utils` available so I can write component and unit tests without additional setup.
- As a developer working on phase 01d (Router), I need `vue-router` installed so I can configure routing without additional dependency setup.

### Visual Foundation

This phase is part of the Phase 01 scaffolding sequence. It delivers the visual foundation that downstream phases depend on:

- **R-01e** (Composables): Consumes `TOAST_DISMISS_MS` from `src/domain/constants.ts`.
- **R-01g** (Toast Container & Modal Dialog): Consumes `--color-success` and `--color-error` theme colors.
- **R-01k** (App Shell & Assembly): Wires the fade transition CSS into `<Transition>` around `<RouterView>`.

### Dependencies

- Phase 00 ([R-00](../../product/00%20-%20setup/requirements.md)) complete — Vue 3, Vite, TypeScript, Tailwind v4, vue-i18n, lucide-vue-next all installed.
- [Phase 00 (Setup)](../../product/00%20-%20setup/) complete — vue-i18n installed, locale files exist with `app.title` key.
- R-01a (Dependencies & Test Infrastructure) complete — Vitest, `@vue/test-utils`, and test configuration available.

### Dependents

- **01d (Router)** — uses `page.*.title` keys for document title.
- **01e (Composables)** — consumes `TOAST_DISMISS_MS` from `src/domain/constants.ts`.
- **01g (Toast Container & Modal Dialog)** — consumes `--color-success` and `--color-error` theme colors.
- **01h (Error Handling)** — uses `common.error.*` and `toast.error` keys.
- **01i (Navigation Components)** — uses `nav.*` keys for sidebar and bottom nav labels.
- **01j (Placeholder Views)** — uses `page.*.title` and `common.empty.*` keys.
- **01k (App Shell & Assembly)** — wires the fade transition CSS into `<Transition>` around `<RouterView>`.

## Decisions

| Decision                          | Choice                                                    | Rationale                                                                                                                                                                                                             |
| :-------------------------------- | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testing approach                  | Unit + component tests (Vitest + jsdom)                   | Conformance with existing project standard ([docs/technical/testing.md](../../technical/testing.md)). Vitest already configured with jsdom; this phase extends that configuration.                                    |
| Vitest globals                    | `globals: true`                                           | Enables `describe`, `it`, `expect`, `beforeEach` in test files without explicit imports. Reduces boilerplate across all test files in downstream phases.                                                              |
| Namespace pattern for shared keys | `common.*` (e.g., `common.error.*`, `common.empty.*`)     | Distinguishes global reusable strings from feature-scoped keys (e.g., `library.empty.title`). Keeps shared error and empty state text under a single top-level namespace rather than scattering across feature areas. |
| Page title namespace              | `page.*` (e.g., `page.home.title`, `page.settings.title`) | Separates document/page titles from nav labels (`nav.*`). Allows titles to diverge independently (e.g., subtitles, contextual prefixes) without affecting nav items.                                                  |
| Toast action labels               | `toast.*` (e.g., `toast.dismiss`, `toast.retry`)          | Groups toast-related labels under a dedicated top-level namespace. Avoids nesting under `common.*` since toasts are a distinct UI pattern used across many features.                                                  |
| Transition CSS in main.css        | Global CSS exception                                      | Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule.                                                                       |
| Domain file in scaffolding        | Early creation                                            | `src/domain/constants.ts` is introduced during a Presentation-focused scaffolding phase because downstream phases (R-01e, R-01g) depend on `TOAST_DISMISS_MS`.                                                        |

## Scope

### In Scope

- Install `vue-router@^4.5` as a runtime dependency.
- Install `@vue/test-utils@^2.4` as a dev dependency.
- Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block.
- Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach` and `/// <reference types="vitest/globals" />` for TypeScript global recognition.
- Add `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` keys to `en.json`, `es.json`, `fr.json`.
- Verify that vue-i18n fallback to English works correctly for the scaffolded keys.
- Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block in `src/assets/main.css`.
- Add fade transition CSS (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`).
- Add toast transition CSS (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`).
- Add modal transition CSS for the content card (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`).
- Add `prefers-reduced-motion` override disabling all transitions, animations, and `animate-pulse` shimmer.
- Create `src/domain/constants.ts` with `TOAST_DISMISS_MS = 4000`.

> **Note:** `nav.recommendations` and `page.recommendations.title` are included for forward compatibility with the Recommendations feature phase, even though no scaffolding sibling currently consumes them.

> **Follow-up:** After implementation, update [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n) to document the `page.*` namespace pattern alongside `nav.*`, `common.*`, and `toast.*`.

### Out of Scope

- Router configuration and route definitions (handled in 01d).
- No composables or components are introduced in this phase.
- No application tests are written in this phase — only the test infrastructure is set up.
- Vue component creation or modification.
- vue-i18n instance configuration or locale switching logic (fallback verification for scaffolded keys is in scope).
- i18n keys beyond the scaffolding namespaces listed above (e.g., `library.*`, `details.*`).
- Light-theme color variants (deferred to future theme-switching phase).
- `<Transition>` wiring in the app shell (covered by R-01k).
- Toast and modal components (covered by R-01g).
- Additional domain constants beyond `TOAST_DISMISS_MS` (added in their respective feature phases).
- Modal backdrop transition CSS (backdrop uses a simple opacity toggle managed by the modal component in R-01g).

> All subsequent scaffolding features (01b through 01k) depend on the infrastructure established here.

## Functional Requirements

> Requirement IDs use a feature-scoped prefix (`SC-01a-`, `SC-01c-`) to avoid collisions with IDs in sibling features that share the scaffolding numbering space.

| ID        | Requirement              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Priority |
| :-------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-01a-01 | Dependency installation  | `vue-router@^4.5` installed as runtime dependency; `@vue/test-utils@^2.4` installed as dev dependency.                                                                                                                                                                                                                                                                                                                                                              | P0       |
| SC-01a-02 | Vitest configuration     | Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block. Update the code example in `docs/technical/testing.md` to remove explicit Vitest imports, aligning with the `globals: true` convention.                                                                                                                                                             | P0       |
| SC-01a-03 | Test setup file          | Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top for TypeScript global recognition and `localStorage.clear()` in `beforeEach`. Note: `localStorage.clear()` is a direct call, intentionally exempt from the [conventions.md](../../technical/conventions.md) guardrail requiring all localStorage access to go through the typed storage service (section 6) — this is test-infrastructure teardown, not application data access. | P0       |
| SC-01b-12 | i18n keys                | Add 18 i18n keys across 5 namespaces to `en.json`, `es.json`, `fr.json`: **nav** — `home`, `recommendations`, `calendar`, `library`, `settings`; **page.\*.title** — `home`, `recommendations`, `calendar`, `library`, `settings`; **common.empty** — `title`, `description`; **common.error** — `title`, `description`, `reload`; **toast** — `error`, `dismiss`, `retry`. Existing `app.title` key must be preserved.                                             | P0       |
| SC-01c-21 | Tailwind theme additions | Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block for toast type accents. Note: these colors target the current dark theme only; light-theme counterparts will be added in the future theme-switching feature phase.                                                                                                                                                                                                                | P1       |
| SC-01c-09 | Fade transition CSS      | Define `.fade-*` CSS classes for route transitions: 200ms opacity fade with `ease-in-out`. Note: this phase covers only the CSS definitions — the `<Transition>` wiring in the app shell is in R-01k.                                                                                                                                                                                                                                                               | P1       |
| SC-01c-22 | Toast transition CSS     | Define `.toast-*` CSS classes: slide in horizontally from off-screen right with simultaneous opacity fade on enter (300ms `ease-out`), fade out on leave (200ms `ease-in`).                                                                                                                                                                                                                                                                                         | P1       |
| SC-01c-23 | Modal transition CSS     | Define `.modal-*` CSS classes for the content card: fade in with slight scale-up on enter (200ms `ease-out`), reverse on leave (150ms `ease-in`). Backdrop transition is managed separately by the modal component (R-01g).                                                                                                                                                                                                                                         | P1       |
| SC-01c-24 | Reduced-motion override  | Add `@media (prefers-reduced-motion: reduce)` block that disables all `.fade-*`, `.toast-*`, `.modal-*` transitions and `animate-pulse` animations.                                                                                                                                                                                                                                                                                                                 | P1       |
| SC-01c-25 | Domain constants         | Create `src/domain/constants.ts` with `export const TOAST_DISMISS_MS = 4000` (auto-dismiss timeout in milliseconds for toast notifications).                                                                                                                                                                                                                                                                                                                        | P1       |

> **Note:** `src/domain/constants.ts` is created in this phase with `TOAST_DISMISS_MS` only (additional constants will be added in their respective feature phases). See Decisions table for rationale.

## Non-Functional Requirements

### Testing

- **NFR-01a-01 (CI integration):** `npm run check` must pass with zero failures. This script runs the following sub-commands in sequence: `format`, `lint:fix`, `type-check`, `test`, `build`. It applies auto-formatting and auto-linting before type-check, test, and build — it mutates files on disk rather than performing read-only verification.
- **NFR-01a-02 (File naming):** All test files must use the `*.test.ts` naming convention under a dedicated `tests/` directory at the project root, mirroring the `src/` directory structure.

### NFR-01b-01 — Key Structure Compliance

- **camelCase key segments:** Zero violations — every dot-separated segment of each key in all locale JSON files must be a camelCase identifier (matching `^[a-z][a-zA-Z0-9]*$`). Verified by a unit test to be created at `tests/presentation/i18n/locale-keys.test.ts` per [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n).

### Transitions & Animation

- **NFR-01c-01 — Route fade:** 200ms opacity transition, `ease-in-out`.
- **NFR-01c-02 — Toast enter:** Slide in horizontally from off-screen right with opacity fade, 300ms `ease-out`.
- **NFR-01c-03 — Toast leave:** Fade out, 200ms `ease-in`.
- **NFR-01c-04 — Modal enter:** Fade in + scale from 0.95 to 1 (content card only), 200ms `ease-out`.
- **NFR-01c-05 — Modal leave:** Fade out + scale from 1 to 0.95 (content card only), 150ms `ease-in`. Note: 150ms is below the UI/UX spec's 200–300ms guideline; intentional for snappier leave feel.
- **NFR-01c-06 — Motion sensitivity:** All transitions and `animate-pulse` animation disabled when `prefers-reduced-motion` is set.
- **NFR-01c-07 — Duration cap:** No transition exceeds 300ms.

### Architecture Compliance

- **CSS centralization:** No CSS files other than `src/assets/main.css` shall exist in the project. All transition and animation styles are centralized in the single Tailwind entry point.

## Risks & Assumptions

### Assumptions

- Phase 00 (Setup) is fully released and the base tooling is stable.
- `vitest.config.ts` uses the `mergeConfig(viteConfig, defineConfig({ test: {} }))` pattern and the `test: {}` block can be extended with additional properties.
- The `@` path alias (`@ → ./src`) configured in `vite.config.ts` is inherited by Vitest via `mergeConfig` and does not need separate configuration.
- Phase 00 (Setup) is complete: vue-i18n is installed, `src/presentation/i18n/index.ts` exists, and all three locale files contain the `app.title` key.
- Spanish and French translations use standard UI terminology; native speaker review is deferred to a later phase.
- Tailwind v4 `@theme` block supports arbitrary CSS custom properties for extending the design token set.
- Vue 3 `<Transition>` class naming convention (`name-enter-active`, `name-leave-active`, etc.) is stable and will not change in minor versions.

### Risks

- **`globals: true` may conflict with explicit Vitest imports:** If a downstream test file explicitly imports `describe`/`it`/`expect` from `vitest` while globals are enabled, TypeScript may flag duplicate declarations. Likelihood: Low. Impact: Medium (TypeScript compile errors in downstream tests). Mitigation: project convention should mandate using globals without imports; the code example in `docs/technical/testing.md` will be updated as part of this phase to remove the explicit import and align with this convention.
- **TypeScript global type recognition:** Enabling `globals: true` in Vitest does not automatically make `describe`/`it`/`expect` visible to the TypeScript compiler. Likelihood: Low. Impact: High (all downstream test files would fail type-checking). Mitigation: add `/// <reference types="vitest/globals" />` directive at the top of `tests/setup.ts` (specified in SC-01a-03).
- **Translation accuracy** (low likelihood, low impact): Translations cannot be verified in context until downstream features (01i, 01j) render the keys in UI components. Mitigation: translations use standard, well-known UI terms.
- **Key path mismatch** (medium likelihood, medium impact): Downstream features (01d, 01h, 01i, 01j) may reference key paths that do not match the exact paths defined here. Mitigation: downstream requirements explicitly list the keys they consume; the locale key parity test catches missing keys.
- **Low likelihood, low impact:** If Tailwind v4 changes the `@theme` block syntax in a future update, the custom property declarations may need to be moved. Mitigation: pin Tailwind version in `package.json`.

## Acceptance Criteria

- [ ] [SC-01a-01] `package.json` lists `vue-router@^4.5` under `dependencies`
- [ ] [SC-01a-01] `package.json` lists `@vue/test-utils@^2.4` under `devDependencies`
- [ ] [SC-01a-02] `vitest.config.ts` updated with `globals: true`, `include`, and `setupFiles` inside the existing `test: {}` block
- [ ] [SC-01a-03] `tests/setup.ts` exists with `localStorage.clear()` in `beforeEach`
- [ ] [SC-01a-03] `tests/setup.ts` includes `/// <reference types="vitest/globals" />` for TypeScript global recognition
- [ ] [SC-01a-02] `npm run test` runs without config errors
- [ ] [SC-01a-02, NFR-01a-01] `npm run check` passes with zero failures (note: the `check` script runs `format` and `lint:fix` which may auto-fix files — this is inherited behavior from Phase 00, not introduced by this phase)
- [ ] [SC-01a-02] `docs/technical/testing.md` code example updated to use Vitest globals without explicit imports, aligning with the `globals: true` convention
- [ ] [SC-01b-12] All three locale files (`en.json`, `es.json`, `fr.json`) contain the new key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
- [ ] [SC-01b-12] All three files have identical key paths
- [ ] [SC-01b-12] All translation values are non-empty strings in all three files
- [ ] [SC-01b-12] Existing `app.title` key is preserved in all three files
- [ ] [SC-01b-12] All locale files are valid JSON after modification
- [ ] [SC-01b-12] All key paths follow flat dot-notation with camelCase segments per conventions.md Section 11
- [ ] [SC-01b-12] Each locale file contains exactly 18 new keys across the 5 specified namespaces
- [ ] [SC-01b-12, NFR-01b-01] Unit test at `tests/presentation/i18n/locale-keys.test.ts` passes, confirming all key segments match camelCase regex
- [ ] [SC-01b-12] vue-i18n fallback to English is verified for the scaffolded keys (e.g., removing a key from `es.json` causes vue-i18n to fall back to the English value)
- [ ] [SC-01c-21] `--color-success` (`#22c55e`) and `--color-error` (`#ef4444`) exist in the `@theme` block of `src/assets/main.css`
- [ ] [SC-01c-09] Fade transition classes (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`) are defined
- [ ] [SC-01c-22] Toast transition classes (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`) are defined
- [ ] [SC-01c-23] Modal transition classes (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`) are defined for the content card
- [ ] [SC-01c-24] `prefers-reduced-motion` disables all transitions and `animate-pulse` animation
- [ ] [NFR-01c-07] No transition duration exceeds 300ms
- [ ] [SC-01c-25] `TOAST_DISMISS_MS` constant exists in `src/domain/constants.ts` with value `4000`
- [ ] Existing theme variables (`--color-bg-primary`, `--color-bg-secondary`, `--color-surface`, `--color-accent`, `--font-sans`) in `src/assets/main.css` are preserved
- [ ] Unit test verifies `TOAST_DISMISS_MS` value and type
- [ ] `npm run check` passes with no errors

## Constraints

- **Runtime dependencies:** No new runtime dependencies beyond `vue-router@^4.5`. All other tools (Tailwind, vue-i18n, lucide-vue-next, Zod) are already installed from Phase 00.
- **Dev dependencies:** `@vue/test-utils@^2.4` is the only new dev dependency.
