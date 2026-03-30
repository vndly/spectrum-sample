---
id: R-01h
title: App Scaffolding — Error Handling
status: approved
type: infrastructure
importance: critical
tags: [error-handling, error-boundary, toast]
---

## Intent

Create the ErrorBoundary component (catches component errors, shows fallback UI) and the global error handler (dispatches error toasts for uncaught errors).

## Prerequisites

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).
- **01b** — i18n keys for error messages (`common.error.*`, `toast.error`).
- **01e** — `useToast` composable for global error handler.

## Decisions

| Decision                   | Choice                                                         | Rationale                                                                                                       |
| :------------------------- | :------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| main.ts layer exception    | Allow `main.ts` to import from `src/presentation/composables/` | Global error handler must call `useToast()` outside component `setup()`; consistent with module-level singleton |
| Error boundary propagation | Return `false` from `onErrorCaptured`                          | Prevents double-handling: boundary shows fallback UI, global handler should not also show toast                 |

## Scope

### In Scope

- Create `src/presentation/components/error/error-boundary.vue`.
- Add `app.config.errorHandler` to `src/main.ts`.
- Write tests for both.

### Out of Scope

- Recovery strategies beyond page reload.
- Error reporting to external services.
- Custom error types or error categorization.

## Functional Requirements

| ID    | Requirement                  | Description                                                                                                                                                                                                                                                                                                                                                              | Priority |
| :---- | :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-18 | Error boundary               | `onErrorCaptured` wrapper component. Normal state: renders slot. Error state: centered fallback with translated heading, description, and reload button (calls `window.location.reload()`). The error boundary returns `false` from `onErrorCaptured` to prevent propagation to the global error handler (SC-19), since the boundary already handles the error visually. | P0       |
| SC-19 | Global error handler         | `app.config.errorHandler` in `main.ts` logs errors and dispatches an error toast via `useToast()`.                                                                                                                                                                                                                                                                       | P0       |
| SC-24 | UI primitive tests (partial) | Component test for ErrorBoundary (renders slot normally, shows fallback on error).                                                                                                                                                                                                                                                                                       | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **NFR-01h-01 — main.ts exception:** `main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision. The global error handler must call `useToast()` outside component `setup()`. _Threshold: No additional cross-layer imports beyond this documented exception._

### Accessibility

- **NFR-01h-02 — Fallback UI accessibility:** The error boundary fallback UI should use `role="alert"` to announce the error to screen readers. _Threshold: Error message is announced by assistive technology when displayed._

## Acceptance Criteria

- [ ] [SC-18] Error boundary renders slot content in normal state
- [ ] [SC-18] Error boundary shows fallback UI with translated error heading, description, and "Reload" button when a child component throws
- [ ] [SC-18] Error boundary returns `false` from `onErrorCaptured` to prevent propagation
- [ ] [SC-18] Reload button calls `window.location.reload()`
- [ ] [SC-19] Global error handler logs errors to `console.error`
- [ ] [SC-19] Global error handler dispatches an error toast via `useToast()`
- [ ] [SC-24] Error boundary component tests pass
- [ ] [SC-19] Global error handler test passes
- [ ] [NFR-01h-02] Error boundary fallback UI uses `role="alert"` for accessibility
