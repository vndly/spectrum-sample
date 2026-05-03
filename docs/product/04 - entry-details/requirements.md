---
id: R-04
title: 'Entry Details: Movie and Show Detail Pages'
status: released
importance: high
type: functional
tags: [details, movie, show, library, media, api, navigation, ui]
---

## Intent

Provide users with a comprehensive detail view for movies and TV shows, displaying rich metadata, cast information, trailers, streaming availability, and actions to manage their library.

Enable users to explore detailed information about cast members directly from movie and TV show detail pages. Cast cards navigate to person detail pages with biography, career information, external links, and filmography.

## Context & Background

### Problem Statement

Users browsing or searching for media need a dedicated page to view complete information about a title before deciding to add it to their library. The detail page serves as the central hub for all metadata, media assets, and library management actions for a specific movie or TV show.

### User Stories

- As a user, I want to see comprehensive details about a movie including title, synopsis, release date, runtime, and genres.
- As a user, I want to see the cast and crew of a movie or show to discover familiar actors and directors.
- As a user, I want to watch trailers directly on the detail page to preview content.
- As a user, I want to see where I can stream a title in my region.
- As a user, I want to add a title to my watchlist or mark it as watched directly from the detail page.
- As a user, I want to share a title with friends via a shareable link.
- As a user, I want to navigate to external sites (IMDb, official homepage, social media) for more information.
- As a user, I want to browse poster and backdrop images in a gallery.
- As a user viewing a movie's cast, I want to click an actor to see their biography and career context.
- As a user exploring an actor's profile, I want to see their filmography so that I can discover related movies and shows.
- As a user viewing an actor's profile, I want supported external links so that I can find more information elsewhere.

### Dependencies

- `R-01`: Search (provides navigation to detail pages from search results).
- `R-05`: Library Management (provides library entry persistence for watchlist/watched status).
- TMDB API: External data source for movie, show, and person metadata.
- TMDB Person API: Provides localized person details, combined cast credits, and external IDs.

## Decisions

| Decision            | Choice                                   | Rationale                                                                                                   |
| :------------------ | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| Routing             | Separate routes for movies and shows     | `/movie/:id` and `/show/:id` allow type-specific handling and clear URL semantics.                          |
| Data Fetching       | Composables with appended relations      | Single API call fetches all related data (credits, videos, providers, images) to minimize network requests. |
| Library Integration | Lazy initialization                      | Library entry is initialized only after detail data loads to ensure metadata sync.                          |
| Share Functionality | Native Share API with clipboard fallback | Provides best UX on mobile while ensuring desktop compatibility.                                            |
| Image Gallery       | Lightbox with keyboard navigation        | Standard UX pattern for image viewing with accessibility support.                                           |
| Content Rating      | Region-based extraction                  | Uses user's preferred region setting to show relevant certification.                                        |
| Person Routing      | Contextual `/person/:id` route           | Keeps person discovery deep-linkable without adding actors to primary navigation.                           |
| Person API Strategy | Single localized call with credits       | Fetches person details, cast credits, and external IDs in one request.                                      |
| Person Filmography  | Combined cast-credit grid                | Shows movie and TV cast work together, sorted by newest release date.                                       |
| Person Credit Scope | `combined_credits.cast` only             | Matches cast-carousel discovery and avoids crew/job ambiguity in the first release.                         |

## Scope

**In Scope:**

- `MovieScreen` and `ShowScreen` view components with full metadata display.
- `HeroBackdrop` component with poster overlay and action buttons.
- `ActionButtons` component for watchlist, watched, and share actions.
- `MetadataPanel` component showing year, runtime/seasons, language, genres, and directors.
- `Synopsis` component for overview text.
- `BoxOffice` component for budget and revenue (movies only).
- `CastCarousel` component with scrollable cast list; cast cards navigate to `/person/:id` while preserving the existing billing-order sort and 20-member cap.
- Contextual `PersonScreen` route at `/person/:id`, lazy-loaded and guarded with the same numeric ID pattern as movie/show detail routes.
- Person detail page with profile hero, biography, birth/death info, supported external links, and combined movie/TV cast filmography.
- Filmography items that navigate back to `/movie/:id` and `/show/:id` detail pages.
- `TrailerEmbed` component with YouTube integration.
- `StreamingBadges` component showing regional streaming providers.
- `ExternalLinks` component for IMDb, homepage, and social media links.
- `ImagesGallery` component with poster/backdrop tabs and lightbox viewer.
- `DetailSkeleton` loading state component.
- Error handling for 404 and API failures.
- Integration with `useLibraryEntry` for status management.

**Out of Scope:**

- User reviews or ratings from external sources.
- Recommendations or similar titles.
- Episode-level details for TV shows.
- Download or offline viewing features.
- Following or favoriting actors.
- Actor-related notifications, awards, comparisons, galleries, or dedicated actor search.
- Filtering or virtualizing person filmography.
- Crew-only person filmography and director/writer navigation from the metadata panel.

## Functional Requirements

### Data Display

| ID    | Requirement     | Description                                                                                                                               | Priority |
| :---- | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| ED-01 | Movie Metadata  | The system SHALL display title, tagline, release year, runtime, original language, genres, and directors for movies.                      | P0       |
| ED-02 | Show Metadata   | The system SHALL display name, tagline, first air date year, season/episode counts, original language, genres, and creators for TV shows. | P0       |
| ED-03 | Synopsis        | The system SHALL display the full overview/synopsis text when available.                                                                  | P0       |
| ED-04 | Provider Rating | The system SHALL display the TMDB vote average as a rating badge when greater than zero.                                                  | P0       |
| ED-05 | Content Rating  | The system SHALL display the content certification (e.g., PG-13, R) for the user's preferred region when available.                       | P1       |
| ED-06 | Box Office      | The system SHALL display budget and revenue for movies when either value is greater than zero.                                            | P2       |

### Cast and Crew

| ID    | Requirement      | Description                                                                                               | Priority |
| :---- | :--------------- | :-------------------------------------------------------------------------------------------------------- | :------- |
| EC-01 | Cast Display     | The system SHALL display up to 20 cast members sorted by billing order.                                   | P0       |
| EC-02 | Cast Information | Each cast member SHALL show profile image, actor name, and character name, and navigate to `/person/:id`. | P0       |
| EC-03 | Cast Scrolling   | The cast list SHALL be horizontally scrollable with navigation buttons when content overflows.            | P1       |
| EC-04 | Missing Profiles | The system SHALL display a placeholder icon for cast members without profile images.                      | P1       |

### Person Details

| ID    | Requirement            | Description                                                                                                                                                              | Priority |
| :---- | :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| CI-01 | Clickable cast cards   | Cast member cards in `CastCarousel` SHALL navigate to `/person/:id` when clicked or keyboard-activated.                                                                  | P0       |
| CI-02 | Person route           | The system SHALL provide a named `/person/:id` route with numeric ID guard, lazy-loaded component, and `meta.titleKey: "page.person.title"`.                             | P0       |
| CI-03 | Profile hero           | The person page SHALL display the person's profile image prominently and show a placeholder avatar when no profile image is available.                                   | P0       |
| CI-04 | Basic info             | The person page SHALL display the person's name and known-for department.                                                                                                | P0       |
| CI-05 | Biography              | The person page SHALL display biography text and handle empty biographies with a localized empty state.                                                                  | P0       |
| CI-06 | Birth info             | The person page SHALL display birthday, place of birth, and death date when available.                                                                                   | P1       |
| CI-07 | External links         | The person page SHALL display IMDb, Instagram, and Twitter links when available and hide missing links.                                                                  | P1       |
| CI-08 | Filmography grid       | The person page SHALL display combined movie and TV cast credits as a responsive grid with poster, title, year, media type, and character.                               | P0       |
| CI-09 | Filmography sorting    | Filmography SHALL be sorted by release date descending, with missing release dates at the end and localized "TBA" text.                                                  | P0       |
| CI-10 | Filmography navigation | Each filmography item SHALL navigate to `/movie/:id` or `/show/:id` as appropriate.                                                                                      | P0       |
| CI-11 | Loading state          | The person page SHALL show a skeleton loader while person data is fetched.                                                                                               | P0       |
| CI-12 | Error handling         | The person page SHALL distinguish 404, 429 rate limits, network errors, and 500+ server errors; recoverable network/server failures SHALL provide a manual Retry action. | P0       |
| CI-13 | Back navigation        | Browser back and the person page back button SHALL return users to the previous page, with Home fallback on direct entry.                                                | P1       |
| CI-14 | Empty filmography      | The person page SHALL handle empty filmography with a localized empty message.                                                                                           | P1       |
| CI-15 | Language refresh       | Changing `Settings.language` while the person page is mounted SHALL refetch the active person details without changing the route.                                        | P0       |

### Media Content

| ID    | Requirement         | Description                                                                            | Priority |
| :---- | :------------------ | :------------------------------------------------------------------------------------- | :------- |
| EM-01 | Trailer Display     | The system SHALL display the first official YouTube trailer when available.            | P0       |
| EM-02 | Trailer Interaction | Clicking the trailer thumbnail SHALL embed the YouTube player (privacy-enhanced mode). | P0       |
| EM-03 | Image Gallery       | The system SHALL display a gallery with separate tabs for posters and backdrops.       | P1       |
| EM-04 | Gallery Lightbox    | Clicking a gallery thumbnail SHALL open a full-size lightbox viewer.                   | P1       |
| EM-05 | Lightbox Navigation | The lightbox SHALL support keyboard navigation (arrow keys, Escape to close).          | P1       |

### Streaming and Links

| ID    | Requirement         | Description                                                                                          | Priority |
| :---- | :------------------ | :--------------------------------------------------------------------------------------------------- | :------- |
| ES-01 | Streaming Providers | The system SHALL display streaming provider logos for the user's preferred region.                   | P1       |
| ES-02 | Provider Filtering  | Only subscription (flatrate) providers SHALL be displayed.                                           | P1       |
| ES-03 | External Links      | The system SHALL display links to IMDb, official homepage, and social media profiles when available. | P1       |

### User Actions

| ID    | Requirement        | Description                                                                                            | Priority |
| :---- | :----------------- | :----------------------------------------------------------------------------------------------------- | :------- |
| EA-01 | Watchlist Toggle   | The user SHALL be able to add/remove a title from their watchlist.                                     | P0       |
| EA-02 | Watched Toggle     | The user SHALL be able to mark/unmark a title as watched.                                              | P0       |
| EA-03 | Share Action       | The user SHALL be able to share the title via native share API or clipboard copy.                      | P1       |
| EA-04 | Status Persistence | Library status changes SHALL be persisted to localStorage immediately.                                 | P0       |
| EA-05 | Metadata Sync      | When viewing a detail page, the library entry metadata (poster, rating, release date) SHALL be synced. | P1       |

### Loading and Error States

| ID    | Requirement      | Description                                                                             | Priority |
| :---- | :--------------- | :-------------------------------------------------------------------------------------- | :------- |
| EL-01 | Loading Skeleton | The system SHALL display a skeleton UI while fetching detail data.                      | P0       |
| EL-02 | 404 Handling     | The system SHALL display a "Not Found" message with navigation to home for invalid IDs. | P0       |
| EL-03 | Error Recovery   | The system SHALL display an error message with a retry button for API failures.         | P0       |
| EL-04 | Route Validation | The system SHALL redirect to home for non-numeric route IDs.                            | P1       |

## Non-Functional Requirements

### Performance

| ID        | Requirement             | Description                                                                                                    |
| :-------- | :---------------------- | :------------------------------------------------------------------------------------------------------------- |
| EN-01     | Single Request          | All detail data SHALL be fetched in a single API call using appended relations.                                |
| EN-02     | Lazy Images             | Cast profile images SHALL use lazy loading to improve initial render time.                                     |
| EN-03     | Responsive Images       | Images SHALL use srcset for optimal loading on different screen densities.                                     |
| CI-NFR-04 | Person API Efficiency   | Person details SHALL be fetched in one localized call with `append_to_response=combined_credits,external_ids`. |
| CI-NFR-05 | Person Code Splitting   | The person route component SHALL be lazy-loaded through a dynamic import.                                      |
| CI-NFR-06 | Filmography Lazy Images | Filmography poster images SHALL use lazy loading.                                                              |

### UI/UX Consistency

| ID        | Requirement              | Description                                                                                                |
| :-------- | :----------------------- | :--------------------------------------------------------------------------------------------------------- |
| EN-04     | Visual Style             | Components SHALL use existing Tailwind theme tokens and Lucide icons.                                      |
| EN-05     | Responsive Layout        | The detail page SHALL adapt gracefully to mobile and desktop viewports.                                    |
| EN-06     | Smooth Scrolling         | Carousel navigation SHALL use smooth scroll behavior.                                                      |
| CI-NFR-01 | Profile Image Sizing     | Person profile images SHALL measure 160x160px below `md` and 200x200px at `md` and above.                  |
| CI-NFR-02 | Filmography Grid Columns | Person filmography SHALL use 2 columns below `md`, 3 at `md`, 4 at `lg`, and 6 at `xl` and above.          |
| CI-NFR-03 | Biography Width          | Person biography text SHALL use `max-w-prose` or max 72ch with at least 16px horizontal padding on mobile. |

### Accessibility

| ID        | Requirement                     | Description                                                                                                          |
| :-------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| EN-07     | Keyboard Navigation             | Lightbox and carousels SHALL be navigable via keyboard.                                                              |
| EN-08     | Focus Management                | Modal dialogs SHALL trap focus appropriately.                                                                        |
| EN-09     | Alt Text                        | Images SHALL include descriptive alt text.                                                                           |
| CI-NFR-07 | Person Semantic HTML            | Person page root SHALL use `<article>`; biography, info, links, and filmography SHALL use `<section>` with headings. |
| CI-NFR-08 | Person External Link Security   | Person external links SHALL open in a new tab with `rel="noopener noreferrer"`.                                      |
| CI-NFR-09 | Person Focus Visibility         | Person page interactive elements SHALL keep visible focus states.                                                    |
| CI-NFR-10 | Filmography Keyboard Navigation | Filmography links SHALL be reachable by Tab and activatable with Enter.                                              |
| CI-NFR-11 | Person Screen Reader Support    | Person loading and error states SHALL use live regions and alert semantics.                                          |

### Internationalization

| ID        | Requirement               | Description                                                                                                                                            |
| :-------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| EN-10     | Localized Labels          | All UI labels and messages SHALL be localized via `vue-i18n`.                                                                                          |
| EN-11     | Localized Data            | Genre names and language names SHALL be displayed in the user's language.                                                                              |
| EN-12     | Regional Content          | Content ratings and streaming providers SHALL respect the user's region setting.                                                                       |
| CI-NFR-12 | Person i18n Coverage      | All person UI strings, media labels, external-link labels, image alt text, fallback text, and `page.person.title` SHALL have mirrored `en/es/fr` keys. |
| CI-NFR-13 | Person Documentation Sync | API, architecture, entry-details, and glossary documentation SHALL document person detail behavior.                                                    |
| CI-NFR-14 | Person Image URL Boundary | Person Application view models SHALL expose ready-to-render image URLs so Presentation does not call image helpers directly.                           |

## Constraints

- **API Rate Limits**: TMDB API has rate limiting; the client implements retry with exponential backoff.
- **Regional Data**: Streaming providers and content ratings may not be available for all regions.
- **Video Availability**: Not all titles have official YouTube trailers.
- **Image Availability**: Some titles may lack poster or backdrop images.
- **Person API Rate Limits**: Person details share the TMDB rate limit and retry behavior with other API calls.
- **Person Data Completeness**: Biography, dates, profile images, external IDs, and release dates may be missing.
- **Filmography Source**: Person filmography uses `combined_credits.cast` only; crew credits are excluded.
- **Filmography Deduplication**: Duplicate credits for the same `(media_type, id)` keep the lowest numeric billing `order`, falling back to first API response order when all orders are null.
- **Image URL Boundary**: Person profile and poster URLs are built by Application view models before Presentation rendering.

## Risks & Assumptions

### Risks

- **Missing Metadata**: Some titles may have incomplete data (no synopsis, no cast, no trailer). _Mitigation_: Components gracefully hide when data is unavailable.
- **API Changes**: TMDB API structure changes could break parsing. _Mitigation_: Zod schemas provide validation and clear error messages.
- **Empty Biographies**: Some actors have no biography. _Mitigation_: The person page shows a localized empty state.
- **Large Filmographies**: Some actors have 100+ credits. _Mitigation_: Credits are deduplicated and sorted once before rendering; virtualization is deferred.
- **Missing External IDs**: Lesser-known actors may have no external links. _Mitigation_: Missing links and empty external-link sections are hidden.

### Assumptions

- **TMDB Availability**: The TMDB API is available and responsive.
- **TMDB Person Endpoint**: `/person/{id}` with `append_to_response=combined_credits,external_ids` remains stable.
- **Browser Support**: Users have modern browsers supporting the Intersection Observer API for lazy loading.
- **localStorage**: The browser allows localStorage for library persistence.
- **Known-for Department**: `known_for_department` is returned as a string by the TMDB person endpoint.

## Acceptance Criteria

- [ ] Movie detail page displays all metadata fields correctly.
- [ ] Show detail page displays all metadata fields correctly.
- [ ] Cast carousel shows up to 20 members with proper images and names.
- [ ] Cast carousel cards navigate to the corresponding person detail page.
- [ ] Trailer plays when thumbnail is clicked.
- [ ] Image gallery shows posters and backdrops in separate tabs.
- [ ] Lightbox opens on thumbnail click and supports keyboard navigation.
- [ ] Streaming providers show for the user's region.
- [ ] External links navigate to correct destinations.
- [ ] Watchlist and watched buttons toggle correctly and persist.
- [ ] Share button copies URL to clipboard (or opens native share on mobile).
- [ ] Loading skeleton displays while fetching data.
- [ ] 404 page displays for invalid IDs with navigation to home.
- [ ] Error state displays with retry button on API failure.
- [ ] All text is localized and responds to language changes.
- [ ] Page is fully responsive on mobile and desktop.
- [ ] Clicking a cast member card navigates to `/person/:id`.
- [ ] `/person/:id` renders the person detail page and rejects non-numeric IDs.
- [ ] Person route is named `person` and uses `meta.titleKey: "page.person.title"`.
- [ ] Person profile image, placeholder, name, known-for department, biography, birth/death info, and external links display correctly.
- [ ] Person profile and filmography image URLs are built before Presentation renders them.
- [ ] Missing person biography, external links, profile images, and filmography display localized fallback or hidden states.
- [ ] Person filmography displays combined movie and TV cast credits, deduplicated and sorted by release date descending.
- [ ] Filmography items navigate to the correct movie or show detail page.
- [ ] Person loading skeleton, 404 state, network retry toast, server retry toast, and 429 automatic backoff behave correctly.
- [ ] Person page back navigation works for in-app and direct-entry flows.
- [ ] Changing `Settings.language` while viewing `/person/:id` refetches the same person in the new language.
- [ ] Person page layout, keyboard navigation, focus states, live regions, and localized copy meet the documented non-functional requirements.
- [ ] Technical API, architecture, entry-details, and glossary documentation describe person detail behavior.
