---
id: R-04
title: 'Entry Details: Movie and Show Detail Pages'
status: released
importance: high
type: functional
tags: [details, movie, show, library, media]
---

## Intent

Provide users with a comprehensive detail view for movies and TV shows, displaying rich metadata, cast information, trailers, streaming availability, and actions to manage their library.

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

### Dependencies

- `R-01`: Search (provides navigation to detail pages from search results).
- `R-05`: Library Management (provides library entry persistence for watchlist/watched status).
- TMDB API: External data source for all movie and show metadata.

## Decisions

| Decision            | Choice                                   | Rationale                                                                                                   |
| :------------------ | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| Routing             | Separate routes for movies and shows     | `/movie/:id` and `/show/:id` allow type-specific handling and clear URL semantics.                          |
| Data Fetching       | Composables with appended relations      | Single API call fetches all related data (credits, videos, providers, images) to minimize network requests. |
| Library Integration | Lazy initialization                      | Library entry is initialized only after detail data loads to ensure metadata sync.                          |
| Share Functionality | Native Share API with clipboard fallback | Provides best UX on mobile while ensuring desktop compatibility.                                            |
| Image Gallery       | Lightbox with keyboard navigation        | Standard UX pattern for image viewing with accessibility support.                                           |
| Content Rating      | Region-based extraction                  | Uses user's preferred region setting to show relevant certification.                                        |

## Scope

**In Scope:**

- `MovieScreen` and `ShowScreen` view components with full metadata display.
- `HeroBackdrop` component with poster overlay and action buttons.
- `ActionButtons` component for watchlist, watched, and share actions.
- `MetadataPanel` component showing year, runtime/seasons, language, genres, and directors.
- `Synopsis` component for overview text.
- `BoxOffice` component for budget and revenue (movies only).
- `CastCarousel` component with scrollable cast list; cast cards navigate to `/person/:id` while preserving the existing billing-order sort and 20-member cap.
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

| ID    | Requirement       | Description                                                                     |
| :---- | :---------------- | :------------------------------------------------------------------------------ |
| EN-01 | Single Request    | All detail data SHALL be fetched in a single API call using appended relations. |
| EN-02 | Lazy Images       | Cast profile images SHALL use lazy loading to improve initial render time.      |
| EN-03 | Responsive Images | Images SHALL use srcset for optimal loading on different screen densities.      |

### UI/UX Consistency

| ID    | Requirement       | Description                                                             |
| :---- | :---------------- | :---------------------------------------------------------------------- |
| EN-04 | Visual Style      | Components SHALL use existing Tailwind theme tokens and Lucide icons.   |
| EN-05 | Responsive Layout | The detail page SHALL adapt gracefully to mobile and desktop viewports. |
| EN-06 | Smooth Scrolling  | Carousel navigation SHALL use smooth scroll behavior.                   |

### Accessibility

| ID    | Requirement         | Description                                             |
| :---- | :------------------ | :------------------------------------------------------ |
| EN-07 | Keyboard Navigation | Lightbox and carousels SHALL be navigable via keyboard. |
| EN-08 | Focus Management    | Modal dialogs SHALL trap focus appropriately.           |
| EN-09 | Alt Text            | Images SHALL include descriptive alt text.              |

### Internationalization

| ID    | Requirement      | Description                                                                      |
| :---- | :--------------- | :------------------------------------------------------------------------------- |
| EN-10 | Localized Labels | All UI labels and messages SHALL be localized via `vue-i18n`.                    |
| EN-11 | Localized Data   | Genre names and language names SHALL be displayed in the user's language.        |
| EN-12 | Regional Content | Content ratings and streaming providers SHALL respect the user's region setting. |

## Constraints

- **API Rate Limits**: TMDB API has rate limiting; the client implements retry with exponential backoff.
- **Regional Data**: Streaming providers and content ratings may not be available for all regions.
- **Video Availability**: Not all titles have official YouTube trailers.
- **Image Availability**: Some titles may lack poster or backdrop images.

## Risks & Assumptions

### Risks

- **Missing Metadata**: Some titles may have incomplete data (no synopsis, no cast, no trailer). _Mitigation_: Components gracefully hide when data is unavailable.
- **API Changes**: TMDB API structure changes could break parsing. _Mitigation_: Zod schemas provide validation and clear error messages.

### Assumptions

- **TMDB Availability**: The TMDB API is available and responsive.
- **Browser Support**: Users have modern browsers supporting the Intersection Observer API for lazy loading.
- **localStorage**: The browser allows localStorage for library persistence.

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
