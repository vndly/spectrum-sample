# Implementation Plan: Skeleton & Empty State

---

## Phase 1 — Tests

### Step 1 — Write empty-state tests

- [ ] Create `tests/presentation/components/common/empty-state.test.ts` covering:

- **SC-16-01** — Renders icon, title, and description when all provided
- **SC-16-02** — With only title prop, icon and description are absent
- **SC-16-03** — CTA button renders when `ctaLabel` is provided; clicking invokes `ctaAction`
- **SC-16-04** — No CTA button rendered when `ctaLabel` is provided without `ctaAction`
- Also covers **SC-24-01** (EmptyState component test exists and verifies props)

Tests use `@vue/test-utils` `mount()` (provided by prerequisite 01a). Type-check is expected to fail until Phase 2 completes (test-first approach).

---

### Step 2 — Write skeleton-loader tests

- [ ] Create `tests/presentation/components/common/skeleton-loader.test.ts` covering:

- **SC-17-01** — Renders with specified dimensions and `animate-pulse bg-surface` classes
- **SC-17-02** — Applies custom `rounded` prop
- **SC-17-03** — Renders with default prop values (width `'100%'`, height `'1rem'`, `rounded-md`)
- Also covers **SC-24-02** (SkeletonLoader component test exists and verifies props)

---

## Phase 2 — Implementation

### Step 3 — Create skeleton-loader component

- [ ] Create `src/presentation/components/common/skeleton-loader.vue`:

- Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`)
- Single `<div>` with `animate-pulse bg-surface` and configured dimensions

---

### Step 4 — Create empty-state component

- [ ] Create `src/presentation/components/common/empty-state.vue`:

- Props: `icon` (component, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional)
- Centered vertically and horizontally
- Icon in `text-slate-500`, title in `text-white font-bold`, description in `text-slate-400`
- CTA button styled as primary teal: `bg-accent text-white rounded-md px-4 py-2`; rendered only when both `ctaLabel` and `ctaAction` are provided; clicking invokes `ctaAction`
- All string props (`title`, `description`, `ctaLabel`) receive pre-translated values from the parent via `$t()` — this component does not perform translation internally

---

## Phase 3 — Verification

### Step 5 — Verify

- [ ] `npm run type-check` passes with no errors
- [ ] `npm run test` — all tests pass including the new empty-state and skeleton-loader test files
- [ ] `npm run build` succeeds with no warnings
