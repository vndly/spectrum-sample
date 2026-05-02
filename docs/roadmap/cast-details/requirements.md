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

### Personas

- **Cinephiles**: Users who follow specific actors' careers and want to explore their complete body of work.
- **Casual viewers**: Users discovering new content through familiar faces they recognize from other productions.

### Dependencies

- **CastCarousel component** (`src/presentation/components/details/cast-carousel.vue`): This feature modifies the existing `CastCarousel` component to make cast member cards clickable. The change is additive (click handler) with no breaking changes to existing usage. Existing `CastCarousel` tests will need updates to verify click handlers and navigation behavior. The component's semantic HTML will change from `<div>` to `<RouterLink>` for cast member cards.
- **[docs/product/04 - entry-details](../../product/04%20-%20entry-details/requirements.md)**: Existing detail-page cast behavior changes because `CastCarousel` cast cards become navigable links.
- **[docs/product/02 - home](../../product/02%20-%20home/requirements.md)**: Related detail-page navigation documentation may need cross-reference updates when person pages are promoted.
- **[docs/technical/api.md](../../technical/api.md)**: New Person endpoint (`/person/{id}` with `language={Settings.language}` and `append_to_response=combined_credits,external_ids`) needs to be documented with response schema (`PersonDetail`, `PersonCredit`, `ExternalIds` types) and usage patterns.
- **[docs/technical/architecture.md](../../technical/architecture.md)**: Routing table updated with `/person/:id` route.
- **[docs/reference/glossary.md](../../reference/glossary.md)**: Person, cast member, and filmography terms added or aligned when this feature is promoted.
- **src/domain/**: New `person.schema.ts` with `PersonDetailSchema` and related types following existing schema patterns.
- **src/infrastructure/provider.client.ts**: New `getPersonDetail` method for the TMDB Person endpoint, following existing auth, retry, status-aware error, and Zod validation patterns.
- **src/presentation/router.ts**: New `/person/:id` route using the existing numeric route guard and lazy loading pattern.
- **src/application/**: New `use-person.ts` composable that is the Presentation layer's only data-access path for person details.
- **src/presentation/i18n/locales/**: New person UI translation keys mirrored across `en.json`, `es.json`, and `fr.json`.
- **src/presentation/composables/use-toast.ts**: Existing toast queue used for manual retry actions on person network and server errors.

In this feature, **Person** means an individual in the TMDB database identified by a unique person ID. **Cast member** means a person's role in a specific movie or show. **Filmography** means the deduplicated movie and TV cast credits sourced from TMDB `combined_credits.cast`; crew-only credits from `combined_credits.crew` are excluded from this release.

## Scope

### In Scope

- Clickable cast member cards in the existing `CastCarousel` component (modification)
- New contextual `/person/:id` route for person detail pages (view component: `src/presentation/views/person-screen.vue`); it follows movie/show detail route behavior and is not added to primary navigation
- Person detail page displaying:
  - Profile image (hero section) with placeholder fallback
  - Name and known-for department (e.g., "Acting", "Directing")
  - Biography with "Read more" expansion
  - Birth date, place of birth, death date (if applicable)
  - External links (IMDB, Instagram, Twitter)
  - Combined cast filmography (movies + TV shows) as a grid
- Filmography displayed as a combined cast-credit grid sorted by release date (newest first)
- Clickable filmography items that navigate to `/movie/:id` or `/show/:id`
- Loading skeleton states
- Error handling (404, 429 rate limits, network errors, 500+ server errors)
- i18n support for all UI text

### Out of Scope

- Following/favoriting actors
- Actor-related notifications
- Comparing actors
- Dedicated person/actor search endpoint or filter; actor search remains unavailable in this feature
- Person images gallery (multiple photos)
- Actor awards and nominations
- Filtering filmography by genre/year
- Infinite scroll for filmography (display all results from single API call)
- Other social links beyond IMDB, Instagram, Twitter (Facebook, TikTok, YouTube, etc. excluded for initial release)
- Person data caching (fresh API request on each navigation per existing guardrails)
- Filmography virtualization (render all items; performance testing may inform future optimizations)
- Clicking directors/writers in MetadataPanel (only cast carousel navigation is in scope)
- Crew-only filmography from TMDB `combined_credits.crew`

## Decisions

| Decision            | Choice                                      | Rationale                                                                                |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Page vs Modal       | Full page (`/person/:id`)                   | Consistent with existing detail page patterns; supports deep linking and browser history |
| Filmography display | Combined grid                               | User preference; simpler UI than tabbed or carousel approach                             |
| Filmography sorting | By release date (newest first)              | Most relevant/recent work appears first                                                  |
| API strategy        | Single localized call with appended credits | Minimizes API calls; consistent with existing movie/show detail fetching                 |
| Poster fallback     | Placeholder image                           | Consistent with existing MovieCard pattern; uses generic media placeholder               |
| Credit source       | `combined_credits.cast` only                | Matches cast-carousel discovery and avoids crew/job ambiguity in the first release       |
| Image URL boundary  | Application view models expose image URLs   | Keeps Presentation components from importing Infrastructure image helpers                |

## Functional Requirements

| ID    | Requirement            | Description                                                                                                                                                                | Priority |
| ----- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| CI-01 | Clickable cast cards   | Cast member cards in `CastCarousel` navigate to `/person/:id` when clicked                                                                                                 | P0       |
| CI-02 | Person route           | New named route `/person/:id` with navigation guard rejecting non-numeric IDs, lazy-loaded component, and `meta.titleKey` for the page title                               | P0       |
| CI-03 | Profile hero           | Display person's profile image prominently at the top of the page; show placeholder avatar when profile image unavailable                                                  | P0       |
| CI-04 | Basic info             | Display person's name and known-for department below the profile image                                                                                                     | P0       |
| CI-05 | Biography              | Display person's biography text; handle empty biographies gracefully with "No biography available" message                                                                 | P0       |
| CI-06 | Birth info             | Display birthday and place of birth; show death date if applicable                                                                                                         | P1       |
| CI-07 | External links         | Display clickable links to IMDB, Instagram, and Twitter when available; hide icons for missing links                                                                       | P1       |
| CI-08 | Filmography grid       | Display combined movie and TV cast credits as a responsive grid; each item shows poster thumbnail, title, release year, media type badge (movie/TV), and character name    | P0       |
| CI-09 | Filmography sorting    | Sort filmography by release date descending (newest first); entries with null release dates appear at the end with "TBA" displayed                                         | P0       |
| CI-10 | Filmography navigation | Each filmography item navigates to `/movie/:id` or `/show/:id` when clicked                                                                                                | P0       |
| CI-11 | Loading state          | Show skeleton loader while person data is being fetched                                                                                                                    | P0       |
| CI-12 | Error handling         | Show appropriate error states for 404 (person not found), 429 rate limits, network errors, and 500+ server errors; network and server errors provide a manual Retry action | P0       |
| CI-13 | Back navigation        | Browser back button works correctly; include a back arrow button in the page header for discoverability                                                                    | P1       |
| CI-14 | Empty filmography      | Handle empty filmography with appropriate message (e.g., "No credits available")                                                                                           | P1       |
| CI-15 | Language refresh       | Changing `Settings.language` while the person page is mounted re-fetches the active person details using the new language without changing the current route               | P0       |

## Non-Functional Requirements

### Responsive Design

| ID        | Requirement              | Threshold                                                                                                 |
| --------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| CI-NFR-01 | Profile image sizing     | 160×160px on mobile, 200×200px on desktop                                                                 |
| CI-NFR-02 | Filmography grid columns | 2 columns below `md`, 3 columns at `md`, 4 columns at `lg`, 6 columns at `xl` and above                   |
| CI-NFR-03 | Biography text width     | Biography text container uses `max-w-prose` (or max 72ch) with at least 16px horizontal padding on mobile |

### Performance

| ID        | Requirement        | Threshold                                                                                                   |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| CI-NFR-04 | API efficiency     | Single API call using `language={Settings.language}` and `append_to_response=combined_credits,external_ids` |
| CI-NFR-05 | Code splitting     | Route lazy-loaded via dynamic import                                                                        |
| CI-NFR-06 | Image lazy loading | Filmography poster images lazy-loaded                                                                       |

### Accessibility

| ID        | Requirement            | Threshold                                                                                                                                 |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| CI-NFR-07 | Semantic HTML          | Person page root uses `<article>`; biography, info, links, and filmography use `<section>` with headings; external links use native `<a>` |
| CI-NFR-08 | External link behavior | Open in new tab with `rel="noopener noreferrer"`                                                                                          |
| CI-NFR-09 | Focus management       | Browser-default focus rings remain visible; do not use `focus:outline-none` unless paired with a visible `focus-visible` replacement      |
| CI-NFR-10 | Keyboard navigation    | Filmography grid navigable via Tab key; Enter activates focused item (browser-default navigation per ui-ux.md accessibility guidelines)   |
| CI-NFR-11 | Screen reader support  | Loading/error states announced via `aria-live="polite"` regions; errors use `role="alert"`                                                |

### Maintainability

| ID        | Requirement        | Threshold                                                                                                                                                                     |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI-NFR-12 | i18n key coverage  | All person UI strings, media labels, external-link labels, image alt text, fallback text, and `page.person.title` have mirrored `en/es/fr` keys enforced by locale-key tests  |
| CI-NFR-13 | Documentation sync | `docs/technical/api.md`, `docs/technical/architecture.md`, `docs/product/04 - entry-details/requirements.md`, and `docs/reference/glossary.md` document the promoted behavior |
| CI-NFR-14 | Image URL boundary | `PersonPageData` and `PersonCreditViewModel` expose ready-to-render image URLs built before Presentation; Presentation components do not call `buildImageUrl`                 |

## Constraints

- TMDB API rate limit: ~40 requests per 10 seconds (shared with other API calls)
- Uses TMDB `/person/{id}` endpoint with `language={Settings.language}` and `append_to_response=combined_credits,external_ids`
- Person API errors must preserve enough status information for the Application/Presentation layers to distinguish 404 inline not-found, 429 automatic backoff, network failure retry toasts, and 500+ retry toasts.
- Biography text may be empty for lesser-known actors
- Some external IDs may be null (no Instagram, no Twitter, etc.)
- Filmography may include entries with null release dates (sort these last, display as "TBA")
- Filmography uses `combined_credits.cast` only. Movies map `title` + `release_date`; TV entries map `name` + `first_air_date`; `character` is the displayed role label.
- Filmography entries where the same person appears multiple times in the same title should be deduplicated by the composite key `(media_type, id)`, keeping the entry with the lowest numeric `order` value (most prominent billing). If all duplicates have null `order`, keep the first API response entry.
- Application view models build profile URLs with `buildImageUrl(profile_path, IMAGE_SIZES.profile.medium)` and filmography poster URLs with `buildImageUrl(poster_path, IMAGE_SIZES.poster.small)`.

## UI/UX Specs

### Layout

- **Mobile**: Single column layout with profile image centered, biography below, filmography as 2-column grid
- **Desktop**: Profile image on left, name/bio/links on right, filmography below as multi-column grid

### Profile Hero

- Circular profile image rendered from the Application-provided `profileUrl`, with fallback placeholder (User icon) if `profileUrl` is null
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
- Each item displays: Application-provided poster URL (with placeholder fallback), title, year (or localized "TBA"), localized media type badge (pill-shaped, `text-xs`, teal background for movies, purple/violet for TV to differentiate media types), character name
- Items styled consistently with existing `MovieCard` component
- Hover state: subtle scale-up consistent with card hover patterns
- Empty state: "No credits available." centered message

### Loading State

- Skeleton matching the page layout: circular profile placeholder, text lines for name/bio, grid of card skeletons for filmography

### Error States

- **404**: "Person not found" centered message with link to Home
- **429**: Automatic exponential backoff; no manual Retry toast while automatic retries are in progress
- **Network error**: Toast notification with Retry action
- **500+ server error**: Toast notification with Retry action

### i18n Keys

The English copy values in this specification are backed by these translation keys:

- `person.biography`: "Biography"
- `person.biographyEmpty`: "No biography available."
- `person.readMore`: "Read more"
- `person.readLess`: "Read less"
- `person.born`: "Born"
- `person.died`: "Died"
- `person.filmography`: "Filmography"
- `person.filmographyCount`: "Filmography ({count})"
- `person.creditsEmpty`: "No credits available."
- `person.notFound`: "Person not found"
- `person.backToHome`: "Back to Home"
- `person.back`: "Back"
- `person.tba`: "TBA"
- `person.media.movie`: "Movie"
- `person.media.tv`: "TV"
- `person.external.imdb`: "Open IMDB profile"
- `person.external.instagram`: "Open Instagram profile"
- `person.external.twitter`: "Open Twitter profile"
- `person.profileAlt`: "{name} profile image"
- `person.posterAlt`: "{title} poster"
- `page.person.title`: "Person Details"
- `person.error.network`: Network error toast message
- `person.error.server`: Server error toast message
- `person.error`: Generic person detail error heading
- `person.retry`: "Retry"

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
- Profile and poster URLs are built through the existing `buildImageUrl` helper with the image sizes specified in Constraints
- `known_for_department` field is always a string (e.g., "Acting", "Directing")

## Acceptance Criteria

- [ ] Clicking a cast member card in the cast carousel navigates to `/person/:id` (CI-01)
- [ ] `/person/:id` route renders the person detail page (CI-02)
- [ ] Non-numeric IDs redirect to Home (CI-02)
- [ ] Person route is named `person` and uses `meta.titleKey: "page.person.title"` (CI-02, CI-NFR-12)
- [ ] Profile image displays correctly (or fallback placeholder if null) (CI-03)
- [ ] Profile image `src` is built before Presentation from `profile_path` using `buildImageUrl` and the configured profile image size (CI-NFR-14)
- [ ] Person name and known-for department display correctly (CI-04)
- [ ] Biography text displays (or empty state message if null/empty) (CI-05)
- [ ] Birth date and place of birth display when available (CI-06)
- [ ] Death date displays when applicable (CI-06)
- [ ] External links (IMDB, Instagram, Twitter) render as clickable icons (CI-07)
- [ ] External links open in new tabs (CI-07)
- [ ] External links use `target="_blank"` and `rel="noopener noreferrer"` (CI-NFR-08)
- [ ] Missing external links are not displayed (no broken icons) (CI-07)
- [ ] External Links section is hidden entirely when no IMDB, Instagram, or Twitter links are available (CI-07)
- [ ] Filmography displays as a combined grid of movie and TV cast credits from `combined_credits.cast` (CI-08)
- [ ] Filmography deduplicates entries where the same person appears in multiple roles (CI-08)
- [ ] Each filmography item shows poster, title, year, media type badge, and character name (CI-08)
- [ ] Filmography is sorted by release date descending (CI-09)
- [ ] Entries with null release dates appear at the end of the list with "TBA" (CI-09)
- [ ] Clicking a filmography item navigates to the correct detail page (CI-10)
- [ ] Skeleton loader displays while data is loading (CI-11)
- [ ] Error toast appears on network failure with Retry action (CI-12)
- [ ] Error toast appears on 500+ server failure with Retry action (CI-12)
- [ ] 429 rate-limit responses use automatic backoff and do not show the manual Retry toast unless retries are exhausted into a non-429 failure (CI-12)
- [ ] Retry action re-attempts the failed network or server person request (CI-12)
- [ ] "Person not found" message appears for numeric person IDs that return 404 (CI-12)
- [ ] Back navigation works correctly (CI-13)
- [ ] Empty filmography shows appropriate message (CI-14)
- [ ] Changing `Settings.language` while viewing `/person/:id` re-fetches the same person in the new language without changing the route (CI-15)
- [ ] Profile image measures 160×160px below `md` and 200×200px at `md` and above (CI-NFR-01)
- [ ] Filmography grid uses 2 columns below `md`, 3 columns at `md`, 4 columns at `lg`, and 6 columns at `xl` and above (CI-NFR-02)
- [ ] Biography text uses `max-w-prose` or max 72ch with at least 16px horizontal padding on mobile (CI-NFR-03)
- [ ] Single API call fetches person details, credits, and external IDs using the current `Settings.language` (CI-NFR-04)
- [ ] Person API call includes `append_to_response=combined_credits,external_ids` (CI-NFR-04)
- [ ] Person route component is lazy-loaded via dynamic import (CI-NFR-05)
- [ ] Filmography poster images use `loading="lazy"` (CI-NFR-06)
- [ ] Person page uses the required semantic article, section, heading, and link structure (CI-NFR-07)
- [ ] A person with 120 unique combined credits renders all sorted, deduplicated filmography items and preserves keyboard focus navigation through the grid (CI-08)
- [ ] Implementation verification: all person UI text keys, media labels, external-link labels, image alt text, fallback text, and `page.person.title` are present in `en.json`, `es.json`, and `fr.json` and enforced by locale-key tests (CI-NFR-12)
- [ ] Keyboard navigation works for filmography grid (CI-NFR-10)
- [ ] Focus states are visible on interactive elements (CI-NFR-09)
- [ ] Loading and error states are announced through the specified live regions and alert role (CI-NFR-11)
- [ ] Biography "Read more" button text uses i18n translation key (CI-NFR-12)
- [ ] Empty biography message uses i18n translation key (CI-NFR-12)
- [ ] Documentation verification: `docs/technical/api.md` documents the `/person/{id}` endpoint, parameters, and response types (CI-NFR-13)
- [ ] Documentation verification: `docs/technical/architecture.md` routing table includes `/person/:id` (CI-NFR-13)
- [ ] Documentation verification: `docs/reference/glossary.md` defines or aligns Person, Cast member, and Filmography terms (CI-NFR-13)
