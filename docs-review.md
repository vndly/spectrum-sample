# Docs Review

## Structural Issues

### 1. Inconsistent roadmap item structure

- Most roadmap items follow a clear template: description, Acceptance Criteria (with checkboxes), Key Decisions.
- `03-entry-details.md` and `05-library-watchlist-and-watched.md` are missing both Acceptance Criteria and Key Decisions. They're noticeably less structured than every other roadmap item.

## Missing Documentation

### 2. Share link

- Roadmap `03` lists *"Share link"* as a feature, but no other document describes how this works (native share API? clipboard URL? deep link format?).

### 3. Stats navigation path

- Stats is excluded from the nav bar (`ui-ux.md` line 68), but there's no documentation on how users actually reach the Stats screen. Presumably a link from Library, but it's undocumented.

### 4. API error responses

- `technical/api.md` documents all endpoints and success response shapes, but says nothing about error responses — status codes, error body shape, or how TMDB reports errors.

### 5. Rate limit handling

- `api.md` mentions TMDB's ~40 req/10s limit, but there's no documentation on what the app does if it hits the limit (retry with backoff? show a toast? silently fail?).

### 6. `*.test.vue` naming

- `technical/testing.md` (line 35) shows `MovieCard.test.vue` as an example. Vitest component tests are typically `.test.ts` files that import and mount the component — `.test.vue` files aren't a standard Vitest convention and may not work as expected.

## Suggestions

### 7. project.md could be richer

The product vision doc is quite brief. It could benefit from:

- Guiding principles / design tenets
- Non-goals (what the app explicitly won't do — e.g., no social features, no backend, no user accounts)

### 8. Roadmap status tracking

- All acceptance criteria checkboxes are unchecked. There's no way to tell which phases are done, in progress, or not started. A status indicator per phase would help.
