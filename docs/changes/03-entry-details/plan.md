# Plan

## Phase 0: Prerequisites

### 0.1 Create Detail Schemas

- [ ] Create `MovieDetailSchema` in `src/domain/movie.schema.ts`
  - Fields: `id`, `title`, `overview`, `tagline`, `release_date`, `runtime`, `poster_path`, `backdrop_path`, `vote_average`, `imdb_id`, `budget`, `revenue`, `status`, `homepage`, `genres`, `spoken_languages`, `production_companies`, `production_countries`, `belongs_to_collection`, `credits`, `videos`, `watch/providers`, `release_dates`
  - Export inferred type: `MovieDetail`
- [ ] Create `ShowDetailSchema` in `src/domain/show.schema.ts`
  - Fields: `id`, `name`, `overview`, `tagline`, `first_air_date`, `last_air_date`, `number_of_seasons`, `number_of_episodes`, `episode_run_time`, `poster_path`, `backdrop_path`, `vote_average`, `status`, `homepage`, `genres`, `spoken_languages`, `production_companies`, `production_countries`, `origin_country`, `networks`, `created_by`, `credits`, `videos`, `watch/providers`, `content_ratings`, `next_episode_to_air`
  - Export inferred type: `ShowDetail`

### 0.2 Create Shared Sub-schemas

- [ ] Create `src/domain/shared.schema.ts` with the following schemas:
  - `GenreSchema`: `{ id: number, name: string }`
  - `CastMemberSchema`: `{ id: number, name: string, character: string, profile_path: string | null, order: number }`
  - `CrewMemberSchema`: `{ id: number, name: string, job: string, department: string, profile_path: string | null }`
  - `VideoSchema`: `{ id: string, key: string, name: string, site: string, type: string, official: boolean }`
  - `StreamingProviderSchema`: `{ provider_id: number, provider_name: string, logo_path: string }`
  - `WatchProviderRegionSchema`: `{ link: string, flatrate?: StreamingProvider[], rent?: StreamingProvider[], buy?: StreamingProvider[] }`
  - `SpokenLanguageSchema`: `{ iso_639_1: string, name: string, english_name: string }`
  - Export inferred types for all schemas

### 0.3 Create Storage Service

- [ ] Create `src/infrastructure/storage.service.ts` with:
  - `STORAGE_KEY = 'plot-twisted-library'`
  - `getLibraryEntry(id: number, mediaType: 'movie' | 'tv'): LibraryEntry | null` - reads from localStorage, returns entry matching id and mediaType or null
  - `saveLibraryEntry(entry: LibraryEntry): void` - upserts entry to localStorage by id and mediaType
  - `getAllLibraryEntries(): LibraryEntry[]` - returns all entries
  - Validate with `LibraryEntrySchema` on read per `docs/technical/data-model.md`
  - Rollback: file can be removed without affecting other infrastructure

### 0.4 Update Settings Composable

- [ ] Update `src/application/use-settings.ts` to add `preferredRegion`:
  - Add `preferredRegion: ref('US')` to the returned object
  - Note: This is a stub with default value until Settings feature (roadmap 11) is implemented
  - ED-05 (StreamingBadges) depends on this value for region filtering

## Phase 1: Testing - Domain Layer

### 1.1 Write Detail Schema Tests

- [ ] Create `tests/domain/movie-detail.schema.test.ts` (covering: ED-02, ED-03, ED-04, ED-05; implementation detail)
  - Test `MovieDetailSchema` parses valid movie detail response with all appended relations
  - Test schema handles null values for optional fields (`backdrop_path`, `imdb_id`, `tagline`)
  - Test `credits.cast` and `credits.crew` arrays parse correctly
  - Test `videos.results` array parses video objects
  - Test `watch/providers.results` parses region-keyed provider data
  - Run tests: expect failure (schema not yet implemented)

- [ ] Create `tests/domain/show-detail.schema.test.ts` (covering: ED-02, ED-03, ED-04, ED-05; implementation detail)
  - Test `ShowDetailSchema` parses valid TV show detail response
  - Test schema handles TV-specific fields (`number_of_seasons`, `number_of_episodes`, `episode_run_time`, `created_by`)
  - Run tests: expect failure (schema not yet implemented)

### 1.2 Create Detail Schemas

- [ ] Create/update `src/domain/movie.schema.ts` with `MovieDetailSchema`
  - Define schema with all fields per `docs/technical/api.md#MovieDetail`
  - Import and use shared sub-schemas for nested objects
  - Run tests: expect pass

- [ ] Create/update `src/domain/show.schema.ts` with `ShowDetailSchema`
  - Define schema with all fields per `docs/technical/api.md#ShowDetail`
  - Import and use shared sub-schemas for nested objects
  - Run tests: expect pass

### 1.3 Write Library Entry Tests

- [ ] Create `tests/domain/library-entry.schema.test.ts` (covering: ED-06, ED-07, ED-08; implementation detail)
  - Test `LibraryEntrySchema` validates all fields
  - Test rating range validation (0-5)
  - Test status enum validation (`watchlist`, `watched`, `none`)
  - Run tests: expect failure or pass depending on existing implementation

## Phase 2: Testing - Infrastructure Layer

### 2.1 Write Detail API Tests

- [ ] Create `tests/infrastructure/provider.client.movie-detail.test.ts` (covering: ED-12; scenario IDs: ED-12-01 through ED-12-05)
  - Test `getMovieDetail(id)` constructs correct URL with `append_to_response` parameter
  - Test `getMovieDetail(id)` returns validated `MovieDetail` response
  - Test `getMovieDetail(id)` handles 404 response (returns specific error type)
  - Test `getMovieDetail(id)` handles network errors
  - Test `getMovieDetail(id)` handles rate limiting with retry
  - Run tests: expect failure (method not yet implemented)

- [ ] Create `tests/infrastructure/provider.client.show-detail.test.ts` (covering: ED-12; scenario IDs: ED-12-01 through ED-12-05)
  - Test `getShowDetail(id)` constructs correct URL with `append_to_response` parameter
  - Test `getShowDetail(id)` returns validated `ShowDetail` response
  - Test `getShowDetail(id)` handles 404 response
  - Run tests: expect failure (method not yet implemented)

### 2.2 Add Detail API Methods

- [ ] Update `src/infrastructure/provider.client.ts`
  - Add `getMovieDetail(id: number, language: string): Promise<MovieDetail>`
    - URL: `${API_BASE_URL}/movie/${id}?language=${language}&append_to_response=credits,videos,watch/providers,release_dates`
    - Validate response with `MovieDetailSchema.parse()`
  - Add `getShowDetail(id: number, language: string): Promise<ShowDetail>`
    - URL: `${API_BASE_URL}/tv/${id}?language=${language}&append_to_response=credits,videos,watch/providers,content_ratings`
    - Validate response with `ShowDetailSchema.parse()`
  - Rollback: methods can be removed without affecting other client methods
  - Run tests: expect pass

### 2.3 Write Storage Tests

- [ ] Create/update `tests/infrastructure/storage.service.test.ts` (covering: ED-06, ED-07, ED-08; scenario IDs: ED-06-01 through ED-06-04, ED-07-01 through ED-07-03, ED-08-01 through ED-08-04)
  - Test `getLibraryEntry()` returns null for non-existent entry
  - Test `saveLibraryEntry()` creates new entry
  - Test `saveLibraryEntry()` updates existing entry
  - Test entry persists rating, favorite, and status fields
  - Run tests: expect pass if storage already implemented

## Phase 3: Testing - Application Layer

### 3.1 Write Movie Detail Composable Tests

- [ ] Create `tests/application/use-movie-detail.test.ts` (covering: ED-01 through ED-15; scenario IDs: ED-01-01, ED-02-01 through ED-02-06, ED-11-01 through ED-11-03, ED-12-01 through ED-12-05)
  - Test `useMovieDetail(id)` returns `{ data, loading, error, refresh }`
  - Test loading state transitions: idle -> loading -> success
  - Test loading state transitions: idle -> loading -> error
  - Test error state for 404 response sets specific error type
  - Test error state for network error
  - Test refresh re-fetches data
  - Test data includes all expected fields from MovieDetail
  - Run tests: expect failure (composable not yet implemented)

### 3.2 Write Show Detail Composable Tests

- [ ] Create `tests/application/use-show-detail.test.ts` (covering: ED-01 through ED-15; scenario IDs: same as movie but for TV)
  - Test `useShowDetail(id)` returns `{ data, loading, error, refresh }`
  - Test loading and error state transitions
  - Test data includes TV-specific fields
  - Run tests: expect failure (composable not yet implemented)

### 3.3 Create Detail Composables

- [ ] Create `src/application/use-movie-detail.ts`
  - Signature: `useMovieDetail(id: Ref<number> | number)` returns `{ data, loading, error, refresh }`
  - Fetch from `providerClient.getMovieDetail(id, language)`
  - Pass `Settings.language` from `useSettings()`
  - Run tests: expect pass

- [ ] Create `src/application/use-show-detail.ts`
  - Signature: `useShowDetail(id: Ref<number> | number)` returns `{ data, loading, error, refresh }`
  - Fetch from `providerClient.getShowDetail(id, language)`
  - Run tests: expect pass

### 3.4 Write Library Composable Tests

- [ ] Create `tests/application/use-library-entry.test.ts` (covering: ED-06, ED-07, ED-08; scenario IDs: ED-06-01 through ED-06-04, ED-07-01 through ED-07-03, ED-08-01 through ED-08-04)
  - Test `useLibraryEntry(id, mediaType)` returns current entry or null
  - Test `setRating(value)` updates entry and persists
  - Test `toggleFavorite()` toggles and persists
  - Test `setStatus(status)` updates and persists
  - Test entry is created if it doesn't exist when first action taken
  - Run tests: expect failure (composable not yet implemented)

### 3.5 Create Library Entry Composable

- [ ] Create `src/application/use-library-entry.ts`
  - Signature: `useLibraryEntry(id: number, mediaType: 'movie' | 'tv')` returns `{ entry, setRating, toggleFavorite, setStatus }`
  - `entry`: `Ref<LibraryEntry | null>` - current entry from storage
  - `setRating(value: number)`: updates `entry.rating`, persists to storage
  - `toggleFavorite()`: toggles `entry.favorite`, persists to storage
  - `setStatus(status: 'watchlist' | 'watched' | 'none')`: updates `entry.status`, persists to storage
  - Creates entry with defaults if not exists on first mutation
  - Run tests: expect pass

## Phase 4: Testing - Presentation Layer

### 4.1 Write HeroBackdrop Component Tests

- [ ] Create `tests/presentation/components/details/hero-backdrop.test.ts` (covering: ED-01; scenario IDs: ED-01-01 through ED-01-05)
  - Test renders backdrop image when `backdrop_path` provided
  - Test renders gradient overlay
  - Test renders title text
  - Test renders tagline when provided (ED-14)
  - Test renders solid gradient when `backdrop_path` is null
  - Run tests: expect failure (component not yet implemented)

### 4.2 Create HeroBackdrop Component

- [ ] Create `src/presentation/components/details/hero-backdrop.vue`
  - Props: `backdropPath: string | null`, `title: string`, `tagline?: string`
  - Template: backdrop image with gradient overlay, title positioned at bottom-left
  - Use `buildImageUrl()` with `w780` size for backdrop
  - Fallback to solid gradient when no image
  - Run tests: expect pass

### 4.3 Write MetadataPanel Component Tests

- [ ] Create `tests/presentation/components/details/metadata-panel.test.ts` (covering: ED-02; scenario IDs: ED-02-01 through ED-02-06)
  - Test renders year from release_date
  - Test renders runtime formatted as hours/minutes for movies
  - Test renders season/episode count for TV shows
  - Test renders genres as comma-separated list
  - Test renders directors list
  - Test renders writers list
  - Test renders spoken languages
  - Test omits missing fields instead of showing empty
  - Run tests: expect failure (component not yet implemented)

### 4.4 Create MetadataPanel Component

- [ ] Create `src/presentation/components/details/metadata-panel.vue`
  - Props: movie-specific or show-specific metadata object
  - Conditionally render each section only if data exists
  - Format runtime: `{hours}h {minutes}m`
  - Extract directors: `crew.filter(c => c.job === 'Director')`
  - Extract writers: `crew.filter(c => c.department === 'Writing')`
  - Run tests: expect pass

### 4.5 Write CastCarousel Component Tests

- [ ] Create `tests/presentation/components/details/cast-carousel.test.ts` (covering: ED-03; scenario IDs: ED-03-01 through ED-03-05)
  - Test renders horizontally scrollable container
  - Test renders cast members sorted by order
  - Test renders profile image for each cast member
  - Test renders placeholder when profile_path is null
  - Test renders actor name and character name
  - Test limits to 20 cast members maximum
  - Run tests: expect failure (component not yet implemented)

### 4.6 Create CastCarousel Component

- [ ] Create `src/presentation/components/details/cast-carousel.vue`
  - Props: `cast: CastMember[]`
  - Template: horizontal scroll container with cast cards
  - Use `buildImageUrl()` with `w185` size for profile images
  - Limit to first 20 members
  - Run tests: expect pass

### 4.7 Write TrailerEmbed Component Tests

- [ ] Create `tests/presentation/components/details/trailer-embed.test.ts` (covering: ED-04; scenario IDs: ED-04-01 through ED-04-04)
  - Test renders play button overlay initially
  - Test clicking play embeds YouTube iframe
  - Test uses privacy-enhanced domain (youtube-nocookie.com)
  - Test component not rendered when no trailer available
  - Run tests: expect failure (component not yet implemented)

### 4.8 Create TrailerEmbed Component

- [ ] Create `src/presentation/components/details/trailer-embed.vue`
  - Props: `videos: Video[]`
  - Computed: find first video where `type === 'Trailer'` and `site === 'YouTube'`
  - State: `isPlaying` ref to track embed state
  - Template: thumbnail with play button, replaced by iframe on click
  - Use `youtube-nocookie.com` for privacy
  - Run tests: expect pass

### 4.9 Write StreamingBadges Component Tests

- [ ] Create `tests/presentation/components/details/streaming-badges.test.ts` (covering: ED-05; scenario IDs: ED-05-01 through ED-05-04)
  - Test renders provider logos for given region
  - Test displays "Not available" when no providers for region
  - Test handles missing region data gracefully
  - Run tests: expect failure (component not yet implemented)

### 4.10 Create StreamingBadges Component

- [ ] Create `src/presentation/components/details/streaming-badges.vue`
  - Props: `providers: Record<string, WatchProviderRegion>`, `region: string`
  - Computed: extract `flatrate` array for user's region
  - Template: row of provider logos or "Not available" text
  - Use `buildImageUrl()` for provider logos
  - Run tests: expect pass

### 4.11 Write BoxOffice Component Tests

- [ ] Create `tests/presentation/components/details/box-office.test.ts` (covering: ED-16; scenario IDs: ED-16-01 through ED-16-05)
  - Test renders budget and revenue when both available
  - Test renders only budget when revenue is 0
  - Test renders only revenue when budget is 0
  - Test component not rendered when both are 0
  - Test values formatted as currency with commas
  - Run tests: expect failure (component not yet implemented)

### 4.12 Create BoxOffice Component

- [ ] Create `src/presentation/components/details/box-office.vue`
  - Props: `budget: number`, `revenue: number`
  - Template: labeled values for budget and revenue
  - Format values as currency: `$${value.toLocaleString()}`
  - Conditionally render only if budget > 0 or revenue > 0
  - Run tests: expect pass

### 4.13 Write ProviderRatingBadge Component Tests

- [ ] Create `tests/presentation/components/details/provider-rating-badge.test.ts` (covering: ED-13; scenario IDs: ED-13-01 through ED-13-03)
  - Test renders vote average as badge (e.g., "8.4")
  - Test formats value to one decimal place
  - Test rounds correctly (7.856 → "7.9")
  - Test displays star icon alongside the number
  - Test uses teal accent styling
  - Run tests: expect failure (component not yet implemented)

### 4.14 Create ProviderRatingBadge Component

- [ ] Create `src/presentation/components/details/provider-rating-badge.vue`
  - Props: `voteAverage: number`
  - Template: badge with star icon and formatted rating
  - Format: `voteAverage.toFixed(1)`
  - Style: teal accent background, white text
  - Run tests: expect pass

### 4.15 Write Synopsis Component Tests

- [ ] Create `tests/presentation/components/details/synopsis.test.ts` (covering: ED-15; scenario IDs: ED-15-01 through ED-15-02)
  - Test renders full overview text when provided
  - Test component not rendered when overview is empty
  - Test component not rendered when overview is null
  - Run tests: expect failure (component not yet implemented)

### 4.16 Create Synopsis Component

- [ ] Create `src/presentation/components/details/synopsis.vue`
  - Props: `overview: string | null`
  - Template: paragraph with full overview text
  - Conditionally render only if overview is non-empty
  - Run tests: expect pass

### 4.17 Write RatingStars Component Tests

- [ ] Create `tests/presentation/components/details/rating-stars.test.ts` (covering: ED-06; scenario IDs: ED-06-01 through ED-06-06)
  - Test renders 5 star icons
  - Test filled stars match current rating value
  - Test hover previews selection
  - Test click sets rating and emits update
  - Test clicking same star clears rating
  - Test keyboard navigation (arrow keys, Enter)
  - Run tests: expect failure (component not yet implemented)

### 4.18 Create RatingStars Component

- [ ] Create `src/presentation/components/details/rating-stars.vue`
  - Props: `modelValue: number` (0-5)
  - Emits: `update:modelValue`
  - State: `hoveredValue` ref for preview
  - Template: 5 star icons with hover/click handlers
  - Filled vs outline based on value comparison
  - Keyboard accessibility with arrow keys
  - Run tests: expect pass

### 4.19 Write ActionButtons Component Tests

- [ ] Create `tests/presentation/components/details/action-buttons.test.ts` (covering: ED-07, ED-08, ED-09, ED-10; scenario IDs: ED-07-01 through ED-07-04, ED-08-01 through ED-08-05, ED-09-01 through ED-09-04, ED-10-01 through ED-10-03)
  - Test favorite button toggles state and emits event
  - Test watch status cycles through states
  - Test IMDB button renders when imdb_id present
  - Test IMDB button not rendered when imdb_id null
  - Test IMDB link has `rel="noopener noreferrer"` and indicates new tab (ED-NFR-09)
  - Test share button has `aria-label="Share"` (ED-NFR-08)
  - Test share button triggers Web Share API when available
  - Test share button copies to clipboard when Web Share not available
  - Run tests: expect failure (component not yet implemented)

### 4.20 Create ActionButtons Component

- [ ] Create `src/presentation/components/details/action-buttons.vue`
  - Props: `favorite: boolean`, `status: string`, `imdbId: string | null`, `shareUrl: string`, `shareTitle: string`
  - Emits: `toggle-favorite`, `update-status`, `share`
  - Template: row of icon buttons with tooltips
  - Share button with `aria-label="Share"` (ED-NFR-08)
  - IMDB link with `rel="noopener noreferrer"`, `target="_blank"`, and external link indicator (ED-NFR-09)
  - Run tests: expect pass

### 4.21 Write DetailSkeleton Component Tests

- [ ] Create `tests/presentation/components/details/detail-skeleton.test.ts` (covering: ED-11; scenario IDs: ED-11-01 through ED-11-04)
  - Test renders backdrop placeholder
  - Test renders title line placeholders
  - Test renders metadata line placeholders
  - Test renders cast circle placeholders
  - Test has shimmer animation
  - Run tests: expect failure (component not yet implemented)

### 4.22 Create DetailSkeleton Component

- [ ] Create `src/presentation/components/details/detail-skeleton.vue`
  - No props needed
  - Template: structured skeleton matching detail layout
  - Use `animate-pulse` for shimmer effect
  - Run tests: expect pass

### 4.23 Write MovieScreen View Tests

- [ ] Update `tests/presentation/views/movie-screen.test.ts` (covering: ED-01 through ED-16; scenario IDs: all ED scenarios for movie context)
  - Test renders skeleton while loading
  - Test renders all detail components when data loaded (including ProviderRatingBadge, Synopsis)
  - Test renders error state on API failure
  - Test renders "Not found" on 404
  - Test Retry button triggers refresh
  - Test rating changes persist to storage
  - Test favorite toggle persists
  - Test watch status changes persist
  - Run tests: expect failure (view not yet implemented beyond stub)

### 4.24 Update MovieScreen View

- [ ] Update `src/presentation/views/movie-screen.vue`
  - Import and use `useMovieDetail(id)` and `useLibraryEntry(id, 'movie')`
  - Get `id` from route params (`useRoute().params.id`)
  - Conditional rendering: skeleton (loading), error (error), content (data)
  - Compose all detail components: HeroBackdrop, ProviderRatingBadge, MetadataPanel, Synopsis, BoxOffice, CastCarousel, TrailerEmbed, StreamingBadges, RatingStars, ActionButtons
  - Wire up library actions (rating, favorite, status) to composable methods
  - Handle share action with Web Share API / clipboard fallback
  - Run tests: expect pass

### 4.25 Write ShowScreen View Tests

- [ ] Update `tests/presentation/views/show-screen.test.ts` (covering: ED-01 through ED-15; scenario IDs: all ED scenarios for TV context)
  - Same tests as MovieScreen but for TV show context
  - Test TV-specific metadata (seasons, episodes, created_by)
  - Run tests: expect failure (view not yet implemented beyond stub)

### 4.26 Update ShowScreen View

- [ ] Update `src/presentation/views/show-screen.vue`
  - Import and use `useShowDetail(id)` and `useLibraryEntry(id, 'tv')`
  - Same structure as MovieScreen with TV-specific adaptations (no BoxOffice)
  - Run tests: expect pass

### 4.27 Add i18n Keys

- [ ] Update `src/presentation/i18n/locales/en.json`
  - Add `details.loading`: "Loading..."
  - Add `details.error.title`: "Something went wrong"
  - Add `details.error.retry`: "Retry"
  - Add `details.notFound.title`: "Not found"
  - Add `details.notFound.message`: "This title doesn't exist or has been removed."
  - Add `details.notFound.home`: "Back to Home"
  - Add `details.streaming.notAvailable`: "Not available for streaming"
  - Add `details.actions.favorite`: "Add to favorites"
  - Add `details.actions.unfavorite`: "Remove from favorites"
  - Add `details.actions.watchlist`: "Add to watchlist"
  - Add `details.actions.watched`: "Mark as watched"
  - Add `details.actions.removeStatus`: "Remove from list"
  - Add `details.actions.share`: "Share"
  - Add `details.actions.imdb`: "View on IMDB"
  - Add `details.share.copied`: "Link copied to clipboard"
  - Add `details.metadata.director`: "Director"
  - Add `details.metadata.directors`: "Directors"
  - Add `details.metadata.writer`: "Writer"
  - Add `details.metadata.writers`: "Writers"
  - Add `details.metadata.seasons`: "Seasons"
  - Add `details.metadata.episodes`: "Episodes"
  - Add `details.cast.title`: "Cast"
  - Add `details.trailer.title`: "Trailer"
  - Add `details.trailer.play`: "Play trailer"
  - Add `details.boxOffice.title`: "Box Office"
  - Add `details.boxOffice.budget`: "Budget"
  - Add `details.boxOffice.revenue`: "Revenue"

- [ ] Update `src/presentation/i18n/locales/es.json`
  - Add Spanish translations for all keys above

- [ ] Update `src/presentation/i18n/locales/fr.json`
  - Add French translations for all keys above

## Phase 5: Verification

- [ ] Run `npm run lint` - no ESLint errors
- [ ] Run `npm run build` - production build succeeds
- [ ] Run `npm run test` - all tests pass
- [ ] Verify touch targets: all interactive elements are at least 44x44px on mobile viewports (ED-NFR-06)
- [ ] Manual verification:
  - Navigate to `/movie/550` (Fight Club), verify all components render
  - Navigate to `/show/1396` (Breaking Bad), verify TV-specific metadata
  - Verify backdrop image loads with gradient overlay
  - Verify metadata panel shows year, runtime, genres, directors, writers
  - Verify box office shows budget and revenue for movies
  - Verify box office section not shown for TV shows
  - Verify cast carousel scrolls horizontally
  - Click trailer play button, verify YouTube embed loads
  - Verify streaming badges show providers for default region
  - Click rating stars, verify rating persists on refresh
  - Click favorite button, verify state persists on refresh
  - Change watch status, verify state persists on refresh
  - Click IMDB link, verify opens correct IMDB page in new tab
  - Click share button, verify Web Share API or clipboard copy with toast
  - Test on mobile viewport, verify responsive layout
  - Disconnect network, verify error state with Retry button
  - Navigate to `/movie/999999999`, verify "Not found" message
  - Test keyboard navigation on rating stars
