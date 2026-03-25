---
id: R-01h
title: App Scaffolding — Error Handling
status: draft
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

None specific to this sub-phase.

## Scope

- Create `src/presentation/components/error/error-boundary.vue`.
- Add `app.config.errorHandler` to `src/main.ts`.
- Write tests for both.

## Functional Requirements

| ID    | Requirement          | Description                                                                                                                                                                                                                                                                                    | Priority |
| :---- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-18 | Error boundary       | `onErrorCaptured` wrapper component. Normal state: renders slot. Error state: centered fallback with translated heading, description, and reload button (calls `window.location.reload()`). The error boundary returns `false` from `onErrorCaptured` to prevent propagation to the global error handler (SC-19), since the boundary already handles the error visually. | P0       |
| SC-19 | Global error handler | `app.config.errorHandler` in `main.ts` logs errors and dispatches an error toast via `useToast()`.                                                                                                                                                                                             | P0       |
| SC-24 | UI primitive tests (partial) | Component test for ErrorBoundary (renders slot normally, shows fallback on error).                                                                                                                                                                                                      | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **main.ts exception:** `main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision. The global error handler must call `useToast()` outside component `setup()`.

## Acceptance Criteria

- [ ] Error boundary renders slot content in normal state
- [ ] Error boundary shows fallback UI with translated error heading, description, and "Reload" button when a child component throws
- [ ] Error boundary returns `false` from `onErrorCaptured` to prevent propagation
- [ ] Reload button calls `window.location.reload()`
- [ ] Global error handler logs errors to `console.error`
- [ ] Global error handler dispatches an error toast via `useToast()`
- [ ] Error boundary component tests pass
- [ ] Global error handler test passes
