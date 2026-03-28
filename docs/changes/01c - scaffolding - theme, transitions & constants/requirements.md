---
id: R-01c
title: App Scaffolding — Theme, Transitions & Constants
status: review
type: infrastructure
importance: P1
tags: [tailwind, transitions, constants]
---

## Intent

Add Tailwind theme color tokens (success, error), all transition/animation CSS (fade, toast, modal, reduced-motion), and the domain constant for toast auto-dismiss, preparing the visual foundation for subsequent components.

## Prerequisites

- Phase 00 (Setup) complete — Tailwind v4, Vue 3, Vite all installed and configured.

## Decisions

| Decision                   | Choice               | Rationale                                                                                                                                       |
| :------------------------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Transition CSS in main.css | Global CSS exception | Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule. |

## Scope

- Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block in `src/assets/main.css`.
- Add fade transition CSS (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`).
- Add toast transition CSS (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`).
- Add modal transition CSS (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`).
- Add `prefers-reduced-motion` override disabling all transitions and animations.
- Create `src/domain/constants.ts` with `TOAST_DISMISS_MS = 4000`.

## Functional Requirements

| ID    | Requirement              | Description                                                                                                                                                                                                                                          | Priority |
| :---- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-21 | Tailwind theme additions | Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block for toast type accents. Note: these colors target the current dark theme only; light-theme counterparts will be added in the future theme-switching feature phase. | P1       |
| SC-09 | Route transitions (CSS)  | `<Transition name="fade" mode="out-in">` wrapping `<RouterView>`. 200ms opacity fade between views. Respects `prefers-reduced-motion`. Note: this phase covers only the CSS definitions — the `<Transition>` wiring in the app shell is in 01k.      | P1       |

> **Note:** `src/domain/constants.ts` is created in this phase with `TOAST_DISMISS_MS` only (additional constants defined in `data-model.md` will be added in their respective feature phases). This is an acknowledged architectural exception — a Domain layer file introduced during a Presentation-focused scaffolding phase.

## Non-Functional Requirements

### Transitions & Animation

- **Route fade:** 200ms opacity transition, `ease-in-out`.
- **Toast enter/leave:** Slide from right on enter, fade on leave.
- **Modal:** Fade backdrop + slight scale-up for content card.
- **Motion sensitivity:** All transitions disabled when `prefers-reduced-motion` is set.
- **Duration cap:** No transition exceeds 300ms.

### Architecture Compliance

- **Transition CSS in main.css:** Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule.

## Acceptance Criteria

- [ ] `--color-success` and `--color-error` exist in CSS custom properties (in the `@theme` block of `src/assets/main.css`)
- [ ] All transition classes defined (`.fade-*`, `.toast-*`, `.modal-*`)
- [ ] `prefers-reduced-motion` disables all transitions and animations
- [ ] `TOAST_DISMISS_MS` constant exists in `src/domain/constants.ts` with value `4000`
