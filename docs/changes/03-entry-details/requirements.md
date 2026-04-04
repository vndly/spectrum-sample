# Requirements

---

id: 03-entry-details
title: Entry Details
status: in_development
importance: high
type: functional
tags: [details, movie, show, api, library]

---

## Intent

Enable users to view comprehensive details about a movie or TV show, including metadata, cast, trailer, streaming availability, and personal tracking features (rating, favorite, watch status).

## Context & Background

### Problem Statement

Users can search for movies and TV shows from the home screen, but cannot view detailed information or interact with entries beyond navigating to a stub detail page. Users need to see full metadata, cast information, streaming options, and the ability to track their personal viewing preferences.

### User Stories

- As a user, I want to see complete information about a movie or TV show so that I can decide whether to watch it.
- As a user, I want to see where a title is available for streaming so that I can watch it on my preferred service.
- As a user, I want to rate movies and shows I've watched so that I can remember my opinions.
- As a user, I want to mark titles as favorites so that I can quickly find content I love.
- As a user, I want to add titles to my watchlist so that I can track what I plan to watch.
- As a user, I want to watch the official trailer inline so that I can preview the content.
- As a user, I want to share a title with friends so that I can recommend content I enjoy.

### Personas

- **Casual viewer**: Wants quick access to streaming availability and trailers before deciding what to watch.
- **Collector**: Rates and organizes watched content, uses favorites and watchlist extensively.
- **Social viewer**: Shares recommendations with friends via the share feature.

### Dependencies

- **R-01a (Scaffolding)**: Provides SkeletonLoader, EmptyState, useToast, useModal, and ErrorBoundary used by this feature.
- **R-02 (Home Search)**: Provides navigation to detail routes via MovieCard clicks.
- **Architecture**: Uses `append_to_response` API pattern per `docs/technical/api.md`.
- **Data Model**: Uses `LibraryEntry` schema for persisting user data per `docs/technical/data-model.md`.

## Decisions

| Decision             | Choice                                    | Rationale                                                                                                                              |
| -------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| API strategy         | Single call with `append_to_response`     | Fetches credits, videos, watch/providers, and release_dates in one request to minimize latency. Documented in `docs/technical/api.md`. |
| Share implementation | Web Share API with clipboard fallback     | Provides native sharing on supported devices without third-party dependencies. Falls back to clipboard copy with toast confirmation.   |
| Trailer embed        | YouTube iframe with privacy-enhanced mode | Uses `youtube-nocookie.com` domain to reduce tracking. Only loads when user clicks play.                                               |
| Rating storage       | localStorage via `LibraryEntry.rating`    | Consistent with local-first architecture. No backend required.                                                                         |
| Streaming region     | User's `Settings.preferredRegion`         | Uses ISO 3166-1 region code from settings to filter streaming providers.                                                               |

## Scope

### In Scope

- Movie and TV show detail views at `/movie/:id` and `/show/:id`
- Hero backdrop with gradient overlay and title
- Metadata panel: year, runtime/seasons, genres, directors, writers, languages
- Cast carousel with horizontally scrollable headshots and character names
- Trailer embed playing official YouTube trailer inline
- Streaming badges showing available providers for user's region
- Rating stars (1-5 scale) persisted in localStorage
- Favorite toggle persisted in localStorage
- Watch status toggle (watchlist/watched/none) persisted in localStorage
- IMDB link opening external IMDB page
- Share button with Web Share API and clipboard fallback
- Loading skeleton matching detail layout
- Error handling with inline retry action
- Box office data (budget and revenue) for movies

### Out of Scope

- Season/episode browser for TV shows (future feature)
- Full image gallery/lightbox
- User reviews or comments
- Social features (following, sharing activity)
- Collection/franchise navigation
- Similar/recommended titles section (separate feature in roadmap)

## Functional Requirements

| ID    | Requirement      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Priority |
| ----- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ED-01 | Hero Backdrop    | The `HeroBackdrop` component SHALL display the backdrop image (`backdrop_path`) with a gradient overlay from transparent to the page background color. The movie/show title SHALL be overlaid on the image with sufficient contrast for readability. If no backdrop is available, a solid dark gradient matching the app background SHALL be displayed.                                                                                                                                         | P0       |
| ED-02 | Metadata Panel   | The `MetadataPanel` component SHALL display: (a) release year extracted from `release_date` or `first_air_date`, (b) runtime in hours and minutes for movies or season/episode count for TV shows, (c) genres as comma-separated list, (d) directors extracted from `credits.crew` where `job === "Director"`, (e) writers extracted from `credits.crew` where `department === "Writing"`, (f) spoken languages as comma-separated list. Missing data SHALL be omitted, not displayed as empty. | P0       |
| ED-03 | Cast Carousel    | The `CastCarousel` component SHALL render a horizontally scrollable list of cast members from `credits.cast`, sorted by `order` (billing order). Each cast item SHALL display: profile headshot (or placeholder icon if `profile_path` is null), actor name, and character name. The carousel SHALL display up to 20 cast members.                                                                                                                                                              | P0       |
| ED-04 | Trailer Embed    | The `TrailerEmbed` component SHALL display a play button over a thumbnail. When clicked, it SHALL embed the official YouTube trailer using the first video from `videos.results` where `type === "Trailer"` and `site === "YouTube"`. If no trailer is available, the component SHALL NOT be rendered. The embed SHALL use privacy-enhanced mode (`youtube-nocookie.com`).                                                                                                                      | P0       |
| ED-05 | Streaming Badges | The `StreamingBadges` component SHALL display available streaming providers from `watch/providers.results[region].flatrate`, where `region` matches `Settings.preferredRegion`. Each badge SHALL display the provider logo. If no streaming providers are available for the region, the component SHALL display "Not available for streaming" text.                                                                                                                                             | P0       |
| ED-06 | Rating Stars     | The `RatingStars` component SHALL allow the user to set a 0-5 star personal rating (0 means unrated). The rating SHALL be persisted in localStorage via `LibraryEntry.rating`. Hovering over stars SHALL preview the selection. Clicking a star SHALL confirm the rating. Clicking the same star again SHALL clear the rating (set to 0).                                                                                                                                                       | P0       |
| ED-07 | Favorite Toggle  | A favorite button SHALL toggle the `LibraryEntry.favorite` boolean in localStorage. The button SHALL display a filled heart icon when favorited and an outline heart icon when not favorited.                                                                                                                                                                                                                                                                                                   | P0       |
| ED-08 | Watch Status     | A watch status control SHALL allow the user to set `LibraryEntry.status` to one of: `watchlist`, `watched`, or `none`. The control SHALL provide separate buttons for each state (not a cycling control). Clicking a button sets that status; clicking the active status button clears it to `none`.                                                                                                                                                                                            | P0       |
| ED-09 | IMDB Link        | If `imdb_id` is present, an IMDB button/link SHALL open `https://www.imdb.com/title/{imdb_id}` in a new tab. If `imdb_id` is null, the IMDB link SHALL NOT be rendered.                                                                                                                                                                                                                                                                                                                         | P0       |
| ED-10 | Share Button     | A share button SHALL invoke the Web Share API with the entry title and URL (`/movie/:id` or `/show/:id`). If the Web Share API is not available, clicking SHALL copy the URL to the clipboard and display a success toast "Link copied to clipboard".                                                                                                                                                                                                                                           | P0       |
| ED-11 | Loading Skeleton | While the API request is in flight, the view SHALL display a skeleton matching the detail layout: backdrop placeholder, metadata text lines, cast headshot circles, and action button placeholders.                                                                                                                                                                                                                                                                                             | P0       |
| ED-12 | Error Handling   | If the API request fails (network error, 404, or server error), the view SHALL display an inline error message with a "Retry" button. Clicking Retry SHALL re-attempt the API call. A 404 response SHALL display "Not found" with a link back to Home.                                                                                                                                                                                                                                          | P0       |
| ED-13 | TMDB Rating      | The TMDB community rating (`vote_average`) SHALL be displayed as a badge, formatted to one decimal place (e.g., "8.4").                                                                                                                                                                                                                                                                                                                                                                         | P1       |
| ED-14 | Tagline          | If `tagline` is present and non-empty, it SHALL be displayed below the title in the hero area.                                                                                                                                                                                                                                                                                                                                                                                                  | P2       |
| ED-15 | Synopsis         | The `overview` text SHALL be displayed in full below the metadata panel. If `overview` is empty, the synopsis section SHALL NOT be rendered.                                                                                                                                                                                                                                                                                                                                                    | P0       |
| ED-16 | Box Office Data  | For movies, the `BoxOffice` component SHALL display budget and revenue from the API response. Values SHALL be formatted as currency (e.g., "$200,000,000"). If both `budget` and `revenue` are 0 or unavailable, the section SHALL NOT be rendered. This component is only displayed for movies, not TV shows.                                                                                                                                                                                  | P1       |

## Non-Functional Requirements

### Performance

| ID        | Requirement        | Threshold                                                                                         |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| ED-NFR-01 | API Response Time  | Detail API call SHALL complete and render initial content within 1500 ms.                         |
| ED-NFR-02 | Trailer Load       | Trailer iframe SHALL only load after user interaction (click), not on initial page load.          |
| ED-NFR-03 | Image Lazy Loading | Cast headshots and secondary images SHALL use `loading="lazy"`. Hero backdrop SHALL load eagerly. |

### Responsive Design

| ID        | Requirement    | Threshold                                                                                                               |
| --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ED-NFR-04 | Mobile Layout  | On screens below `md` breakpoint, the layout SHALL stack vertically: hero, metadata, actions, cast, trailer, streaming. |
| ED-NFR-05 | Desktop Layout | On screens `md` and above, metadata and actions MAY be displayed in a two-column layout alongside the poster.           |
| ED-NFR-06 | Touch Targets  | All interactive elements (buttons, stars, carousel items) SHALL be at least 44x44px on mobile.                          |

### Accessibility

| ID        | Requirement    | Threshold                                                                                                       |
| --------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| ED-NFR-07 | Star Rating    | Rating stars SHALL be keyboard navigable using arrow keys. Current rating SHALL be announced to screen readers. |
| ED-NFR-08 | Share Button   | Share button SHALL have `aria-label="Share"`.                                                                   |
| ED-NFR-09 | External Links | IMDB link SHALL have `rel="noopener noreferrer"` and indicate it opens in a new tab.                            |

## Constraints

- **API rate limit**: approximately 40 requests per 10 seconds; mitigated by `append_to_response` combining multiple data types in one call.
- **YouTube embed privacy**: Use `youtube-nocookie.com` to comply with privacy best practices.
- **localStorage quota**: `LibraryEntry` data is small; quota is not a concern for typical usage.
- **Region availability**: Streaming providers vary by region; users without a configured region see no streaming badges until they set `Settings.preferredRegion`.

## UI/UX Specs

### Hero Backdrop

- Full-width backdrop image with `aspect-ratio: 16/9` or similar cinematic ratio
- Gradient overlay: transparent at top, fading to page background color at bottom
- Title text: `text-2xl` to `text-4xl`, `font-bold`, white, positioned at bottom-left over gradient
- Tagline (if present): `text-sm text-slate-400` below title

### Metadata Panel

- Compact layout with key-value pairs or inline text
- Year, runtime, genres on one line separated by interpuncts or pipes
- Directors and writers as labeled lists
- Spoken languages in parenthetical or secondary position

### Cast Carousel

- Horizontally scrollable container with `overflow-x-auto`
- Each cast item: circular profile image (80-100px), actor name below, character name in muted text
- Placeholder icon (person silhouette) when `profile_path` is null
- Touch/swipe enabled on mobile

### Trailer Embed

- 16:9 aspect ratio container
- Dark overlay with play button icon (centered) before interaction
- On click: replace overlay with YouTube iframe
- Responsive width, max-width on desktop

### Streaming Badges

- Horizontal row of provider logos (32-48px)
- Dark surface background with subtle border
- "Not available" text centered if no providers

### Box Office

- Displayed below metadata panel, movies only
- Two values: "Budget" and "Revenue" with labels
- Currency formatting with dollar sign and commas (e.g., "$200,000,000")
- Muted label text (`text-slate-400`), white value text
- Omit entirely if both values are 0

### Rating Stars

- 5 star icons in a row
- Empty stars: outline, muted color
- Filled stars: solid, teal accent
- Hover preview: fill stars up to hovered position
- Click: confirm rating

### Action Buttons

- Row of icon buttons: Favorite, Watchlist, Watched, Share, IMDB
- Icon-only with tooltips on hover
- Teal accent for active states (favorited, in watchlist, watched)

### Loading Skeleton

- Backdrop: full-width dark rectangle with shimmer
- Title: two text-line placeholders
- Metadata: three short text-line placeholders
- Cast: row of circular placeholders
- Actions: row of square button placeholders

### Error State

- Centered message in content area
- Heading: "Something went wrong" or "Not found"
- Retry button (primary) or Home link

## Risks & Assumptions

### Risks

| Risk                                     | Likelihood | Impact                    | Mitigation                                                                         |
| ---------------------------------------- | ---------- | ------------------------- | ---------------------------------------------------------------------------------- |
| Missing streaming data for user's region | Medium     | User sees "Not available" | Show message explaining data depends on region; link to settings to change region. |
| No trailer available for some titles     | Medium     | Empty space in UI         | Conditionally hide trailer section entirely when no video available.               |
| IMDB ID missing for some titles          | Low        | No external link          | Conditionally hide IMDB button when `imdb_id` is null.                             |
| Web Share API not supported              | Medium     | Fallback path needed      | Implement clipboard fallback with toast confirmation.                              |

### Assumptions

- `append_to_response` parameter reliably returns all requested relations in a single API call.
- `Settings.preferredRegion` will be implemented as part of the Settings feature (roadmap item 11); until then, streaming badges will use a default region of 'US'.
- `storage.service.ts` will be created as part of this feature (Phase 0.3 of the plan) to persist `LibraryEntry` data.

## Acceptance Criteria

- [ ] `HeroBackdrop` displays the backdrop image with gradient overlay and title text (ED-01)
- [ ] `HeroBackdrop` displays solid gradient when no backdrop is available (ED-01)
- [ ] `MetadataPanel` shows year, runtime/seasons, genres, directors, writers, and spoken languages (ED-02)
- [ ] `MetadataPanel` omits missing data instead of showing empty values (ED-02)
- [ ] `CastCarousel` renders horizontally scrollable list of cast members with headshots and names (ED-03)
- [ ] `CastCarousel` displays placeholder icon when `profile_path` is null (ED-03)
- [ ] `TrailerEmbed` plays the official YouTube trailer inline when clicked (ED-04)
- [ ] `TrailerEmbed` is not rendered when no trailer is available (ED-04)
- [ ] `StreamingBadges` displays provider logos for user's region (ED-05)
- [ ] `StreamingBadges` displays "Not available" when no providers exist for region (ED-05)
- [ ] `RatingStars` allows setting 0-5 star rating persisted in localStorage (ED-06)
- [ ] `RatingStars` supports keyboard navigation using arrow keys (ED-06, ED-NFR-07)
- [ ] `RatingStars` clears rating when clicking the same star again (ED-06)
- [ ] Favorite toggle persists state in localStorage (ED-07)
- [ ] Watch status toggle (watchlist/watched/none) persists in localStorage (ED-08)
- [ ] IMDB link opens correct IMDB page using `imdb_id` (ED-09)
- [ ] IMDB link is not rendered when `imdb_id` is null (ED-09)
- [ ] Share button uses Web Share API when supported (ED-10)
- [ ] Share button falls back to clipboard copy with success toast (ED-10)
- [ ] Loading skeleton matches the detail layout while API request is in flight (ED-11)
- [ ] API errors display an inline error message with Retry action (ED-12)
- [ ] 404 response displays "Not found" message with link to Home (ED-12)
- [ ] TMDB rating badge displays vote average formatted to one decimal (ED-13)
- [ ] Tagline displays below title when present and non-empty (ED-14)
- [ ] Synopsis displays full `overview` text below metadata (ED-15)
- [ ] Box office data displays budget and revenue formatted as currency for movies (ED-16)
- [ ] Box office section is not rendered when both values are 0 or unavailable (ED-16)
- [ ] Box office section is not rendered for TV shows (ED-16)
