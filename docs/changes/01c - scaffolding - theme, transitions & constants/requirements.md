---
id: R-01c
title: App Scaffolding — Theme, Transitions & Constants
status: approved
type: infrastructure
importance: high
tags: [tailwind, transitions, constants]
---

## Intent

Add Tailwind theme color tokens (success, error), all transition/animation CSS (fade, toast, modal, reduced-motion), and the domain constant for toast auto-dismiss, preparing the visual foundation for subsequent components.

## Context & Background

This phase is part of the Phase 01 scaffolding sequence. It delivers the visual foundation that downstream phases depend on:

- **R-01e** (Composables): Consumes `TOAST_DISMISS_MS` from `src/domain/constants.ts`.
- **R-01g** (Toast Container & Modal Dialog): Consumes `--color-success` and `--color-error` theme colors.
- **R-01k** (App Shell & Assembly): Wires the fade transition CSS into `<Transition>` around `<RouterView>`.

### Dependencies

- Phase 00 (Setup) complete — Tailwind v4, Vue 3, Vite all installed and configured.

## Decisions

| Decision                   | Choice               | Rationale                                                                                                                                       |
| :------------------------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Transition CSS in main.css | Global CSS exception | Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule. |

## Scope

### In Scope

- Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block in `src/assets/main.css`.
- Add fade transition CSS (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`).
- Add toast transition CSS (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`).
- Add modal transition CSS for the content card (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`).
- Add `prefers-reduced-motion` override disabling all transitions, animations, and `animate-pulse` shimmer.
- Create `src/domain/constants.ts` with `TOAST_DISMISS_MS = 4000`.

### Out of Scope

- Light-theme color variants (deferred to future theme-switching phase).
- `<Transition>` wiring in the app shell (covered by R-01k).
- Toast and modal components (covered by R-01g).
- Additional domain constants beyond `TOAST_DISMISS_MS` (added in their respective feature phases).
- Modal backdrop transition CSS (backdrop uses a simple opacity toggle managed by the modal component in R-01g).

## Functional Requirements

| ID     | Requirement              | Description                                                                                                                                                                                                                                          | Priority |
| :----- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-21  | Tailwind theme additions | Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block for toast type accents. Note: these colors target the current dark theme only; light-theme counterparts will be added in the future theme-switching feature phase. | P1       |
| SC-09a | Fade transition CSS      | Define `.fade-*` CSS classes for route transitions: 200ms opacity fade with `ease-in-out`. Note: this phase covers only the CSS definitions — the `<Transition>` wiring in the app shell is in R-01k.                                                | P1       |
| SC-22  | Toast transition CSS     | Define `.toast-*` CSS classes: slide in horizontally from off-screen right (300ms `ease-out`), fade out on leave (200ms `ease-in`).                                                                                                                  | P1       |
| SC-23  | Modal transition CSS     | Define `.modal-*` CSS classes for the content card: fade in with slight scale-up on enter (200ms `ease-out`), reverse on leave (150ms `ease-in`). Backdrop transition is managed separately by the modal component (R-01g).                          | P1       |
| SC-24  | Reduced-motion override  | Add `@media (prefers-reduced-motion: reduce)` block that disables all `.fade-*`, `.toast-*`, `.modal-*` transitions and `animate-pulse` animations.                                                                                                  | P1       |
| SC-25  | Domain constants         | Create `src/domain/constants.ts` with `export const TOAST_DISMISS_MS = 4000` (auto-dismiss timeout in milliseconds for toast notifications).                                                                                                         | P1       |

> **Note:** `src/domain/constants.ts` is created in this phase with `TOAST_DISMISS_MS` only (additional constants defined in `data-model.md` will be added in their respective feature phases). This is an acknowledged architectural exception — a Domain layer file introduced during a Presentation-focused scaffolding phase. See Decisions table for rationale.

## Non-Functional Requirements

### Transitions & Animation

- **NFR-01c-01 — Route fade:** 200ms opacity transition, `ease-in-out`.
- **NFR-01c-02 — Toast enter:** Slide in horizontally from off-screen right, 300ms `ease-out`.
- **NFR-01c-03 — Toast leave:** Fade out, 200ms `ease-in`.
- **NFR-01c-04 — Modal enter:** Fade in + scale from 0.95 to 1 (content card only), 200ms `ease-out`.
- **NFR-01c-05 — Modal leave:** Fade out + scale from 1 to 0.95 (content card only), 150ms `ease-in`.
- **NFR-01c-06 — Motion sensitivity:** All transitions and `animate-pulse` animation disabled when `prefers-reduced-motion` is set.
- **NFR-01c-07 — Duration cap:** No transition exceeds 300ms.

### Architecture Compliance

- **Transition CSS in main.css:** Acknowledged exception to the "Tailwind only" rule. See Decisions table for rationale.

## Risks & Assumptions

### Assumptions

- Tailwind v4 `@theme` block supports arbitrary CSS custom properties for extending the design token set.
- Vue 3 `<Transition>` class naming convention (`name-enter-active`, `name-leave-active`, etc.) is stable and will not change in minor versions.

### Risks

- **Low likelihood, low impact:** If Tailwind v4 changes the `@theme` block syntax in a future update, the custom property declarations may need to be moved. Mitigation: pin Tailwind version in `package.json`.

## Acceptance Criteria

- [ ] [SC-21] `--color-success` (`#22c55e`) and `--color-error` (`#ef4444`) exist in the `@theme` block of `src/assets/main.css`
- [ ] [SC-09a] Fade transition classes (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`) are defined
- [ ] [SC-22] Toast transition classes (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`) are defined
- [ ] [SC-23] Modal transition classes (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`) are defined for the content card
- [ ] [SC-24] `prefers-reduced-motion` disables all transitions and `animate-pulse` animation
- [ ] [SC-24] No transition duration exceeds 300ms
- [ ] [SC-25] `TOAST_DISMISS_MS` constant exists in `src/domain/constants.ts` with value `4000`
- [ ] Existing theme variables in `src/assets/main.css` are preserved
- [ ] Unit test verifies `TOAST_DISMISS_MS` value and type
- [ ] `npm run check` passes with no errors
