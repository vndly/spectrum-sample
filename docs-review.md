# Docs Review

## Things to Fix

### 1. `file-structure.md` is nearly redundant

It's 5 lines that `architecture.md` covers in much more detail. Either flesh it out to include config files, `tests/`, `docs/`, `public/`, etc., or remove it and let `architecture.md` own the folder structure.

### 2. `conventions.md:51` example `api-service.ts`

The actual infrastructure files use dot notation (`tmdb.client.ts`, `storage.service.ts`). The naming convention example should reflect this pattern, or clarify the dot-separator rule.

### 3. Domain schema file naming

Architecture shows `movie.schema.ts` and `movie.logic.ts` (dot notation), but there's no rule in conventions explaining when to use dots vs. hyphens in file names. Should be clarified.

## Things to Improve

### 1. Roadmap items are very thin

Most phases (01, 02, 04, 06, 07, 08, 09, 10) are 2-4 bullet points. Compare with 03 (Entry Details) and 05 (Library) which have much more detail. The sparse phases could benefit from acceptance criteria or key decisions.

### 2. Circuit breaker parameters undefined

Mentioned in glossary, architecture, and conventions, but no doc specifies the actual thresholds (failure count, cooldown period, recovery strategy).

### 3. `project.md` title says "Product Vision Document"

But `docs/index.md` links to it as "Product Vision Document" while the file is named `project.md`. The naming is a bit confusing — consider renaming the file to `vision.md` or the title to "Project Overview".

## Missing Documentation

### 1. Genre list endpoints

The filter bar needs genre data (`/genre/movie/list`, `/genre/tv/list`), but these aren't documented in `api.md`. Without them, home and library filters can't show genre names.

### 2. i18n strategy

Settings include "Language" and the API supports a `language` parameter, but there's no doc on how the app handles language switching (UI strings, TMDB locale, etc.).

### 3. Image handling strategy

No guidance on responsive image sizes (when to use `w185` vs `w342` vs `w500`), lazy loading images, or fallback placeholders for missing posters/backdrops.

### 4. Caching / performance

No mention of route lazy loading, API response caching, or deduplication of concurrent requests to the same endpoint.

### 5. URL / deep linking behavior

What happens when a user navigates directly to `/movie/550`? Is there offline handling? How are invalid IDs handled?
