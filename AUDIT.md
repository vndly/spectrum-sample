# Documentation Audit Report

## Part 1: Findings by File

### `docs/technical/security.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 1 | **Accuracy** | Line 12: "`.env` is gitignored to prevent accidental commits." | `.gitignore` does not contain a `.env` rule. The current `.gitignore` only has Firebase-specific entries (`.firebase/`, `firebase-debug.log`) and whitelist rules (`!.vscode/`, `!.claude/`). A `.env` file committed today would be tracked. | Add `.env` and `.env.*` (except `.env.example`) to `.gitignore`. Update the claim or add the rule before any code is written. |

### `docs/technical/data-model.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 2 | **Consistency** | Line 47: `preferredRegion: string // ISO 3166-1, e.g. "US" — for streaming availability` | The inline comment says "for streaming availability" only, but `preferredRegion` is also used for the release calendar's `region` query parameter (confirmed in `docs/roadmap/10-release-calendar.md`: "Region filter uses the `region` query parameter from the user's preferred region setting"). The description is narrower than the actual scope of the field. | Change the comment to: `// ISO 3166-1, e.g. "US" — for streaming availability and release calendar region filtering` |
| 3 | **Consistency** | Line 45: `language: string // ISO 639-1, e.g. "en"` | `Settings.language` is documented as ISO 639-1 (`"en"`), but all TMDB endpoint parameter tables in `api.md` show the default as `en-US` (ISO 639-1 + ISO 3166-1 format, e.g., lines 369, 393, 432). `conventions.md` § 10 says "All API calls pass the user's `Settings.language` value… as the `language` query parameter." While TMDB accepts both formats, the documentation is internally inconsistent about which format is used. | Either (a) change `Settings.language` to accept the full locale code (`"en-US"`) and update the data-model type/comment, or (b) clarify in `api.md` that the app passes ISO 639-1 codes and note that TMDB accepts this shorter format. Pick one format and document it consistently. |

### `docs/glossary.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 4 | **Consistency** | Line 27, Watch Status notes: "`"none"` entries appear only in the All view." | No "All view" or "All" tab is described anywhere in the UI documentation. `ui-ux.md` § 5 defines the Library tabs as "Watchlist / Watched / Lists" (line 100). `architecture.md`'s component hierarchy shows `TabToggle (watchlist / watched / lists)` (line 193). There is no tab or view where `status: "none"` entries are visible. | Either (a) add an "All" tab to the Library screen design in `ui-ux.md` and `architecture.md`, or (b) remove the "All view" reference from the glossary and clarify where/whether `"none"` status entries are accessible in the UI. |
| 5 | **Consistency** | Line 46, Recommendations notes: "Powers the Recommendations screen." | The glossary describes recommendations at the individual-endpoint level ("based on similarity to a given entry"), but the actual app behavior documented in `data-model.md` line 146 is more complex: "Selects up to 5 seed entries from the user's library (highest-rated first) and fetches recommendations for each… Deduplicates results across seeds and excludes entries already in the library." The glossary definition omits this aggregation behavior, which could confuse readers who use the glossary as their primary reference. | Add a brief note to the glossary entry: e.g., "The app fetches recommendations from multiple seed entries and deduplicates; see [Data Model](./technical/data-model.md) for aggregation logic." |

### `docs/technical/ui-ux.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 6 | **Accuracy** | Line 125: `"IMDb badge — 'IMDb' label + score (e.g., '8.1/10') + 'REVIEWS' link."` | The TMDB API only provides `imdb_id` (a link ID, e.g., `"tt1234567"`) — it does not return the IMDb score. The roadmap (`docs/roadmap/03-entry-details.md` line 6) confirms the intent is "Display TMDB rating and link to the IMDB page via `imdb_id`." Showing an "IMDb score" as described in ui-ux.md has no data source; the available score is TMDB's `vote_average`. Labeling TMDB's score with an "IMDb" badge would be misleading. | Clarify the detail screen spec. Options: (a) Show the TMDB `vote_average` score with a TMDB label/badge, and separately link to the IMDb page via `imdb_id`. (b) If IMDb score display is actually intended, document the additional data source (e.g., OMDB API) in `api.md`. |
| 7 | **Completeness** | § 9 Empty States, line 170–176 | The table covers Library, Watchlist, Watched, Search results, and Stats. Missing empty states for: **Recommendations** (user has no rated entries to seed recommendations), **Release Calendar** (no upcoming releases for the selected region), and **Custom Lists** (a list with no entries). These screens all have plausible empty states. | Add empty state entries for Recommendations, Release Calendar, and Custom Lists (or at minimum note that they follow the general pattern). |
| 8 | **Cross-Reference** | § 4 Nav Items, line 68: "Stats is reached via a 'View Stats' link on the Library screen (visible when the user has watched entries)." | This behavioral detail (conditional visibility based on watched entries) is not documented anywhere else — not in the Library screen UI spec (§ 5), component hierarchy (`architecture.md`), or routing section. A developer implementing the Library screen would miss this requirement. | Document the "View Stats" link as a component or note in the Library screen section of this file, and/or in the architecture.md component hierarchy under LibraryScreen. |

### `docs/technical/conventions.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 9 | **Consistency** | § 6 Testing, line 40: `"*.test.ts (or *.test.vue for component tests)"` | `testing.md` line 35 shows a component test file named `MovieCard.test.ts` (not `.test.vue`). The two docs disagree on the file extension convention for component tests. | Pick one convention and apply it consistently across both files. Since `testing.md` is the dedicated testing doc, update `conventions.md` to match, or vice versa. |

### `docs/technical/api.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 10 | **Completeness** | § Response Types, line 84: "All response types are defined as Zod schemas in `src/domain/`" | This states it as a present-tense fact, but `src/domain/` does not exist — the project is in planning phase. While understandable for a spec document, mixing present-tense claims ("are defined in") with aspirational design can confuse a developer who reads this before scaffolding. Multiple other docs have this pattern (e.g., architecture.md's folder structure, security.md's `.env` handling). | Consider adding a brief note at the top of the technical docs index (or each file) clarifying these are design specifications for the planned implementation. Alternatively, use future tense ("will be defined") for sections referencing code that doesn't exist yet. |
| 11 | **Glossary** | § Endpoints, line 569–612: Genre List endpoints (`/genre/movie/list`, `/genre/tv/list`) | These endpoints and the `GenreListResponse` type are documented here but the term "Genre List" is not in the glossary. The glossary defines "Genre" but not the list endpoint concept or `GenreListResponse` type. | Add "Genre List" to the glossary, or add a note to the existing "Genre" entry mentioning the genre list endpoints used for resolving `genre_ids` to names. |

### `docs/technical/architecture.md`

| # | Category | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 12 | **Completeness** | § Component Hierarchy, lines 173–207 | The hierarchy tree lists `RecommendationsScreen` and `SettingsScreen` without any child components, unlike other screens which show their internal component structure. These screens have documented UI patterns (ui-ux.md § 5 describes Settings as a toggle; data-model.md describes recommendations aggregation) but the hierarchy gives no indication of their internal structure. | Either add placeholder child components for these screens or mark them as TBD in the hierarchy. |

---

## Part 2: Missing Documentation

| # | Topic | Justification |
|---|-------|---------------|
| 1 | **`.env.example` file** | `setup.md` instructs developers to create a `.env` file with `VITE_TMDB_TOKEN`, and `security.md` describes the token handling — but there is no `.env.example` file in the repo to serve as a template. Standard practice for any project with env vars. |
| 2 | **`.gitignore` for a Vite/Vue project** | The current `.gitignore` only covers Firebase artifacts. When scaffolding begins, it will need rules for `node_modules/`, `dist/`, `.env`, `*.local`, coverage output, and editor files. `security.md` already assumes `.env` is gitignored. This should be set up before any code is committed. |
| 3 | **Genre list caching/fetching strategy** | `api.md` documents the `/genre/movie/list` and `/genre/tv/list` endpoints, and `conventions.md` § 11 / `ui-ux.md` mention the Filter Bar using genre names. However, no doc describes *when* or *how often* genre lists are fetched (on app load? cached? stored in localStorage?). This is a data-access pattern that differs from the standard composable model since genre lists are reference data, not user-triggered queries. |
| 4 | **`useGenres()` composable** | The composable list in `data-model.md` does not include a composable for fetching/managing genre data, despite genre lists being needed by the Filter Bar (documented in `ui-ux.md` and `glossary.md`). Either this should be a new composable or the fetching strategy should be documented within an existing one. |
| 5 | **Custom List management UI** | The data model documents `CustomList` (creation, membership), and the Library screen has a "Lists" tab, but no UI doc describes how users create, rename, delete, or manage custom lists. The ui-ux.md detail screen doesn't show how entries are added to lists. |
