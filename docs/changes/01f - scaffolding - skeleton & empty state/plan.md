# Implementation Plan: Skeleton & Empty State

---

## Step 1 — Write empty-state tests

- [ ] Create `tests/presentation/components/common/empty-state.test.ts` covering:

- **SC-16-01** — Renders icon, title, and description when all provided
- **SC-16-02** — With only title prop, icon and description are absent
- **SC-16-03** — CTA button renders when `ctaLabel` is provided; clicking invokes `ctaAction`

---

## Step 2 — Write skeleton-loader tests

- [ ] Create `tests/presentation/components/common/skeleton-loader.test.ts` covering:

- **SC-17-01** — Renders with default dimensions
- **SC-17-02** — Applies custom `width`, `height`, and `rounded` props

---

## Step 3 — Create skeleton-loader component

- [ ] Create `src/presentation/components/common/skeleton-loader.vue`:

- Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`)
- Single `<div>` with `animate-pulse bg-surface` and configured dimensions

---

## Step 4 — Create empty-state component

- [ ] Create `src/presentation/components/common/empty-state.vue`:

- Props: `icon` (component, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional)
- Centered vertically and horizontally
- Icon in `text-slate-500`, title in `text-white font-bold`, description in `text-slate-400`
- CTA button rendered only when `ctaLabel` is provided; clicking invokes `ctaAction`
