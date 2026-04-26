---
id: R-09
title: Cast Information
status: approved
importance: medium
type: functional
tags: [details, api, navigation, ui]
---

## Intent

Enable users to explore detailed information about cast members directly from movie and TV show detail pages. When a user clicks on an actor in the cast carousel, they navigate to a dedicated person detail page showing the actor's biography, career information, and filmography — enhancing discovery and providing context about the people behind the content.

## Context & Background

### Problem Statement

Currently, cast members are displayed in a carousel on movie/show detail pages with only basic information (name, character, profile photo). Users cannot learn more about actors or discover other movies/shows they've appeared in without leaving the app.

### User Stories

- As a user viewing a movie's cast, I want to click on an actor to see their biography so that I can learn more about them.
- As a user exploring an actor's profile, I want to see their filmography so that I can discover other movies and shows they've appeared in.
- As a user viewing an actor's profile, I want to see external links (IMDB, social media) so that I can find more information elsewhere.

### Dependencies

- **R-02 (Home Screen)**: Detail pages with cast carousel. This feature modifies the existing `CastCarousel` component to make cast member cards clickable. The change is additive (click handler) with no breaking changes to existing usage. Existing `CastCarousel` tests will need updates to verify click handlers and navigation behavior. The component's semantic HTML will change from `<div>` to `<RouterLink>` for cast member cards.

### Affected Documents

- **docs/technical/api.md**: New Person endpoint (`/person/{id}` with `append_to_response=combined_credits,external_ids`) needs to be documented with response schema (`PersonDetail`, `PersonCredit`, `ExternalIds` types) and usage patterns.
- **docs/technical/architecture.md**: Routing table updated with `/person/:id` route.
- **src/domain/**: New `person.schema.ts` with `PersonDetailSchema` and related types following existing schema patterns.

## Scope

### In Scope

- Clickable cast member cards in the existing `CastCarousel` component (modification)
- New `/person/:id` route for person detail pages
- Person detail page displaying:
  - Profile image (hero section) with placeholder fallback
  - Name and known-for department (e.g., "Acting", "Directing")
  - Biography with "Read more" expansion
  - Birth date, place of birth, death date (if applicable)
  - External links (IMDB, Instagram, Twitter)
  - Combined filmography (movies + TV shows) as a grid
- Filmography displayed as a combined grid sorted by release date (newest first)
- Clickable filmography items that navigate to `/movie/:id` or `/show/:id`
- Loading skeleton states
- Error handling (404, network errors)
- i18n support for all UI text

### Out of Scope

- Following/favoriting actors
- Actor-related notifications
- Comparing actors
- Dedicated person/actor search endpoint or filter (users can still find actors via multi-search if TMDB returns person results)
- Person images gallery (multiple photos)
- Actor awards and nominations
- Filtering filmography by genre/year
- Infinite scroll for filmography (display all results from single API call)
- Other social links beyond IMDB, Instagram, Twitter (Facebook, TikTok, YouTube, etc. excluded for initial release)
- Person data caching (fresh API request on each navigation per existing guardrails)
- Filmography virtualization (render all items; performance testing may inform future optimizations)
- Clicking directors/writers in MetadataPanel (only cast carousel navigation is in scope)

## Decisions

| Decision            | Choice                                | Rationale                                                                                |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Page vs Modal       | Full page (`/person/:id`)             | Consistent with existing detail page patterns; supports deep linking and browser history |
| Filmography display | Combined grid                         | User preference; simpler UI than tabbed or carousel approach                             |
| Filmography sorting | By release date (newest first)        | Most relevant/recent work appears first                                                  |
| API strategy        | Single call with `append_to_response` | Minimizes API calls; consistent with existing movie/show detail fetching                 |
| Poster fallback     | Placeholder image                     | Consistent with existing MovieCard pattern; uses generic media placeholder               |

## Functional Requirements

| ID    | Requirement            | Description                                                                                                                                                             | Priority |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| CI-01 | Clickable cast cards   | Cast member cards in `CastCarousel` navigate to `/person/:id` when clicked                                                                                              | P0       |
| CI-02 | Person route           | New route `/person/:id` with navigation guard rejecting non-numeric IDs                                                                                                 | P0       |
| CI-03 | Profile hero           | Display person's profile image prominently at the top of the page; show placeholder avatar when profile image unavailable                                               | P0       |
| CI-04 | Basic info             | Display person's name and known-for department below the profile image                                                                                                  | P0       |
| CI-05 | Biography              | Display person's biography text; handle empty biographies gracefully with "No biography available" message                                                              | P0       |
| CI-06 | Birth info             | Display birthday and place of birth; show death date if applicable                                                                                                      | P1       |
| CI-07 | External links         | Display clickable links to IMDB, Instagram, and Twitter when available; hide icons for missing links                                                                    | P1       |
| CI-08 | Filmography grid       | Display combined movie and TV credits as a responsive grid; each item shows poster thumbnail, title, release year, media type badge (movie/TV), and character/role name | P0       |
| CI-09 | Filmography sorting    | Sort filmography by release date descending (newest first); entries with null release dates appear at the end with "TBA" displayed                                      | P0       |
| CI-10 | Filmography navigation | Each filmography item navigates to `/movie/:id` or `/show/:id` when clicked                                                                                             | P0       |
| CI-11 | Loading state          | Show skeleton loader while person data is being fetched                                                                                                                 | P0       |
| CI-12 | Error handling         | Show appropriate error states for 404 (person not found) and network errors                                                                                             | P0       |
| CI-13 | Back navigation        | Provide a way to navigate back to the previous page                                                                                                                     | P1       |
| CI-14 | Empty filmography      | Handle empty filmography with appropriate message (e.g., "No credits available")                                                                                        | P1       |

## Non-Functional Requirements

### Responsive Design

| ID        | Requirement              | Threshold                                          |
| --------- | ------------------------ | -------------------------------------------------- |
| CI-NFR-01 | Profile image sizing     | 160×160px on mobile, 200×200px on desktop          |
| CI-NFR-02 | Filmography grid columns | 2 columns on mobile, 4-6 columns on desktop        |
| CI-NFR-03 | Biography text width     | Full width, readable line length with 16px padding |

### Performance

| ID        | Requirement        | Threshold                                                                |
| --------- | ------------------ | ------------------------------------------------------------------------ |
| CI-NFR-04 | API efficiency     | Single API call using `append_to_response=combined_credits,external_ids` |
| CI-NFR-05 | Code splitting     | Route lazy-loaded via dynamic import                                     |
| CI-NFR-06 | Image lazy loading | Filmography poster images lazy-loaded                                    |

### Accessibility

| ID        | Requirement            | Threshold                                                                                                                               |
| --------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| CI-NFR-07 | Semantic HTML          | Use `<article>`, `<section>`, `<a>` elements appropriately                                                                              |
| CI-NFR-08 | External link behavior | Open in new tab with `rel="noopener noreferrer"`                                                                                        |
| CI-NFR-09 | Focus management       | Visible focus states on all interactive elements                                                                                        |
| CI-NFR-10 | Keyboard navigation    | Filmography grid navigable via Tab key; Enter activates focused item (browser-default navigation per ui-ux.md accessibility guidelines) |
| CI-NFR-11 | Screen reader support  | Loading/error states announced to screen readers                                                                                        |

## Definitions

- **Person**: An individual (actor, director, etc.) in the TMDB database, identified by a unique person ID. Distinct from "cast member" which refers to a person's role in a specific production.
- **Filmography**: The combined movie and TV credits for a person, sourced from the TMDB `combined_credits` API response.

## Constraints

- TMDB API rate limit: ~40 requests per 10 seconds (shared with other API calls)
- Uses TMDB `/person/{id}` endpoint with `append_to_response=combined_credits,external_ids`
- Biography text may be empty for lesser-known actors
- Some external IDs may be null (no Instagram, no Twitter, etc.)
- Filmography may include entries with null release dates (sort these last, display as "TBA")
- Filmography entries with duplicate media IDs (same person in multiple roles) should be deduplicated, showing only the primary role

## UI/UX Specs

### Layout

- **Mobile**: Single column layout with profile image centered, biography below, filmography as 2-column grid
- **Desktop**: Profile image on left, name/bio/links on right, filmography below as multi-column grid

### Profile Hero

- Circular profile image with fallback placeholder (User icon) if `profile_path` is null
- Person name: `text-2xl font-bold text-white`
- Known-for department: `text-sm text-slate-400`

### Biography Section

- Section heading: "Biography"
- Body text: `text-sm text-slate-300`, truncated with `line-clamp-6` and "Read more" expansion if longer
- Empty state: "No biography available." in muted text

### External Links

- Row of icon buttons (IMDB, Instagram, Twitter)
- Only show icons for links that exist (hide missing ones)
- Icons open external URLs in new tabs

### Filmography Section

- Section heading: "Filmography" with count (e.g., "Filmography (42)")
- Each item displays: poster thumbnail (with placeholder fallback), title, year (or "TBA"), media type badge (pill-shaped, `text-xs`, teal background for movies, purple for TV), character name
- Items styled consistently with existing `MovieCard` component
- Hover state: subtle scale-up consistent with card hover patterns
- Empty state: "No credits available." centered message

### Loading State

- Skeleton matching the page layout: circular profile placeholder, text lines for name/bio, grid of card skeletons for filmography

### Error States

- **404**: "Person not found" centered message with link to Home
- **Network error**: Toast notification with Retry action

## Risks & Assumptions

### Risks

| Risk                                          | Likelihood | Impact | Mitigation                                                                       |
| --------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------- |
| Empty biographies for many actors             | Medium     | Low    | UI handles gracefully with "No biography available" empty state                  |
| Large filmographies (100+ entries)            | Medium     | Medium | Render all items initially; monitor performance and add virtualization if needed |
| All external IDs null for lesser-known actors | Medium     | Low    | External links section hidden entirely when no links available                   |
| TMDB rate limiting during rapid navigation    | Low        | Medium | Existing exponential backoff retry; user sees loading state                      |

### Assumptions

- TMDB `/person/{id}` endpoint with `append_to_response` is stable and returns consistent data structure
- Profile images use the same image URL patterns as movie/show posters
- `known_for_department` field is always a string (e.g., "Acting", "Directing")

## Acceptance Criteria

- [ ] Clicking a cast member card in the cast carousel navigates to `/person/:id` (CI-01)
- [ ] `/person/:id` route renders the person detail page (CI-02)
- [ ] Non-numeric IDs redirect to Home (CI-02)
- [ ] Profile image displays correctly (or fallback placeholder if null) (CI-03)
- [ ] Person name and known-for department display correctly (CI-04)
- [ ] Biography text displays (or empty state message if null/empty) (CI-05)
- [ ] Birth date and place of birth display when available (CI-06)
- [ ] Death date displays when applicable (CI-06)
- [ ] External links (IMDB, Instagram, Twitter) render as clickable icons (CI-07)
- [ ] External links open in new tabs (CI-07)
- [ ] Missing external links are not displayed (no broken icons) (CI-07)
- [ ] Filmography displays as a combined grid of movies and TV shows (CI-08)
- [ ] Each filmography item shows poster, title, year, media type badge, and character name (CI-08)
- [ ] Filmography is sorted by release date descending (CI-09)
- [ ] Entries with null release dates appear at the end of the list with "TBA" (CI-09)
- [ ] Clicking a filmography item navigates to the correct detail page (CI-10)
- [ ] Skeleton loader displays while data is loading (CI-11)
- [ ] Error toast appears on network failure with Retry action (CI-12)
- [ ] "Person not found" message appears for invalid person IDs (CI-12)
- [ ] Back navigation works correctly (CI-13)
- [ ] Empty filmography shows appropriate message (CI-14)
- [ ] Page is responsive across all breakpoints (CI-NFR-01, CI-NFR-02, CI-NFR-03)
- [ ] All UI text uses i18n translation keys
- [ ] Keyboard navigation works for filmography grid (CI-NFR-10)
- [ ] Focus states are visible on interactive elements (CI-NFR-09)
- [ ] Biography "Read more" button text uses i18n translation key
- [ ] Empty biography message uses i18n translation key
- [ ] `docs/technical/api.md` updated with `/person/{id}` endpoint documentation
- [ ] `docs/technical/architecture.md` routing table includes `/person/:id`
