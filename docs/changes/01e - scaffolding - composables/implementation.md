# Implementation: App Scaffolding — Composables

## Overview

Implemented the `useToast` and `useModal` composables as module-level singleton reactive state managers for toast notifications and modal dialogs. Both composables live in `src/presentation/composables/` — a new directory in the Presentation layer for UI-only state composables that have no domain or infrastructure dependencies. The module-level pattern ensures both composables work outside Vue component `setup()`, which is required by the global error handler (01h).

Unit tests were written test-first in `tests/presentation/composables/`, covering all functional requirements. Architecture and reference documentation was updated to reflect the new `composables/` directory and the distinction between Application-layer and Presentation-layer composables.

## Files Changed

### Created

- `src/presentation/composables/use-toast.ts` — Toast notification composable with `addToast()`, `removeToast()`, auto-dismiss timers, and `MAX_VISIBLE_TOASTS` eviction.
- `src/presentation/composables/use-modal.ts` — Modal dialog composable with `open()`, `close()`, single-instance replacement, and callback storage.
- `tests/presentation/composables/use-toast.test.ts` — 13 unit tests covering add, remove, auto-dismiss, eviction, timer cleanup, type variants, and ID uniqueness.
- `tests/presentation/composables/use-modal.test.ts` — 8 unit tests covering open, close, replacement, callback storage, label storage, and no-op close.

### Modified

- `src/domain/constants.ts` — Added `MAX_VISIBLE_TOASTS = 5` constant.
- `docs/technical/architecture.md` — Added `composables/` to the Presentation-layer folder structure and description.
- `docs/technical/testing.md` — Added `tests/presentation/composables/` to the test directory tree example.
- `docs/technical/data-model.md` — Added `MAX_VISIBLE_TOASTS` to the constants table.
- `docs/reference/glossary.md` — Updated "Composable" entry to distinguish Application-layer and Presentation-layer composables.

## Key Decisions

- **`_resetForTesting()` helper**: Both composables export a `_resetForTesting()` function (prefixed with underscore, marked `@internal`) to reset module-level singleton state between tests. This avoids test coupling from shared state leaking across tests.
- **`shallowRef` for modal props**: `use-modal.ts` uses `shallowRef` for the props ref because props are always replaced wholesale via `open()`, never mutated in place. This avoids unnecessary deep reactivity tracking.
- **Timer map for cleanup**: `use-toast.ts` tracks auto-dismiss timers in a `Map<string, ReturnType<typeof setTimeout>>` keyed by toast ID, ensuring `removeToast()` and eviction both properly clear timers to prevent leaked timeouts.
- **String IDs from incrementing counter**: Toast IDs use `String(nextId++)` for simplicity and uniqueness. The counter resets in `_resetForTesting()` for deterministic test behavior.

## Deviations from Plan

None — implementation followed the plan exactly.

## Testing

- `tests/presentation/composables/use-toast.test.ts` — 13 tests covering: add toast (SC-23-01), remove toast (SC-23-09), auto-dismiss (SC-23-02), action preservation (SC-13-03), max-toast eviction (SC-23-08), no-op remove (SC-23-12), type variants (SC-23-03), timer cleanup (SC-23-11), ID uniqueness (SC-23-13), eviction timer cleanup, and action-less toast.
- `tests/presentation/composables/use-modal.test.ts` — 8 tests covering: open/close (SC-23-04), replacement (SC-23-07), confirm callback (SC-23-05), cancel callback (SC-23-06), no-op close (SC-23-10), label storage (SC-12-05), and full props.
- All 21 tests pass. Type checking (`tsc --noEmit`) and linting (`eslint`) report zero errors.

## Dependencies

No new dependencies.
