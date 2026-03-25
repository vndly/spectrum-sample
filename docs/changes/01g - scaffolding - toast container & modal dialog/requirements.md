---
id: R-01g
title: App Scaffolding — Toast Container & Modal Dialog
status: draft
type: infrastructure
importance: critical
tags: [components, toast, modal, overlay]
---

## Intent

Create the ToastContainer and ModalDialog overlay components that render the toast queue and modal state managed by the composables from 01e.

## Prerequisites

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).
- **01c** — Theme colors for type-colored borders (`--color-success`, `--color-error`).
- **01e** — `useToast` and `useModal` composables.

## Decisions

None specific to this sub-phase (composable decision was in 01e).

## Scope

- Create `src/presentation/components/common/toast-container.vue` and `modal-dialog.vue`.
- Write component tests for both.

## Functional Requirements

| ID    | Requirement     | Description                                                                                                                                                                                                                                                                                    | Priority |
| :---- | :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-14 | Toast container | Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup>` (slide in from the right into the top-right position, fade-out on dismiss). Each toast has dismiss button and optional action button. Maximum 5 simultaneous toasts; when exceeded, the oldest toast is evicted. | P0       |
| SC-15 | Modal/dialog    | `modal-dialog.vue` with backdrop (`bg-black/50`), centered content card, title, optional body, confirm/cancel buttons. Closes on backdrop click and Escape key. Opening a new modal while one is active replaces the current modal.                                                              | P1       |
| SC-24 | UI primitive tests (partial) | Component tests for ToastContainer (renders toast queue) and ModalDialog (renders title/body/buttons, closes on backdrop click and Escape).                                                                                                                                           | P0       |

## Non-Functional Requirements

### Stacking Order

- Page content: default (`z-0`)
- Bottom nav: `z-10`
- Modal backdrop: `z-40`
- Modal content card: `z-40` (same layer as backdrop; stacks above via DOM order)
- Toast container: `z-50` (renders above modals — toasts remain visible when a modal is open)

## Acceptance Criteria

- [ ] Toast container is fixed top-right with `z-50`
- [ ] Toasts stack vertically without overlapping
- [ ] Each toast has a dismiss button; clicking it removes the toast
- [ ] Toasts display type-colored left borders (error -> red, success -> green, info -> teal)
- [ ] Toast enter/leave uses `<TransitionGroup>` animation
- [ ] Modal renders backdrop overlay (`bg-black/50`) and centered content card
- [ ] Modal displays title, optional body, confirm and cancel buttons
- [ ] Modal closes on backdrop click
- [ ] Modal closes on Escape key
- [ ] Confirm button invokes `onConfirm` callback and closes the modal
- [ ] Cancel button invokes `onCancel` callback and closes the modal
- [ ] Component tests for ToastContainer pass
- [ ] Component tests for ModalDialog pass
