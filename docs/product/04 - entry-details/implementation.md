# Implementation: Entry Details: Movie and Show Detail Pages (R-04)

## Overview

Implemented comprehensive detail pages for movies and TV shows that display rich metadata, cast information, trailers, streaming availability, and image galleries. The pages integrate with the library system for watchlist and watched status management, and support sharing via native APIs or clipboard.

Cast information was extended into person detail discovery. Cast cards now link to a lazy-loaded `/person/:id` route, and the person page fetches TMDB person details, external IDs, and combined cast credits through a dedicated Application composable and Infrastructure client method.

## Component Hierarchy

```
Detail View (movie-screen.vue / show-screen.vue)
├── DetailSkeleton (loading state)
├── HeroBackdrop
│   └── ActionButtons (slot)
│       ├── Watchlist toggle
│       ├── Watched toggle
│       └── Share button
├── Rating badges section
│   ├── ProviderRatingBadge (TMDB score)
│   └── ContentRatingBadge (content certification)
├── MetadataPanel
│   ├── Year badge
│   ├── Runtime/Season info badge
│   ├── Original language badge
│   ├── Genre pills
│   └── Director(s) info
├── Synopsis
├── BoxOffice (budget/revenue - movies only)
├── CastCarousel
│   ├── Scroll buttons
│   └── Cast member cards
├── TrailerEmbed
│   ├── Thumbnail with play overlay
│   └── YouTube iframe (on click)
├── StreamingBadges
│   └── Provider logos
├── ExternalLinks
│   └── IMDb, Homepage, Social links
└── ImagesGallery
    ├── Tab switcher (posters/backdrops)
    ├── Thumbnail carousel
    └── Lightbox modal viewer

Person Detail View (person-screen.vue)
├── PersonSkeleton (loading state)
├── PersonHero
│   ├── Profile image or User icon fallback
│   └── Name and known-for department
├── PersonBio
│   └── Biography with read-more/read-less expansion
├── PersonInfo
│   └── Birth and death information
├── PersonLinks
│   └── IMDb, Instagram, and Twitter links
└── FilmographyGrid
    └── FilmographyCard links to movie or show details
```

## Files

### Created

**Domain Layer:**

- `src/domain/movie.schema.ts` — Zod schema for `MovieDetail` type with all appended relations.
- `src/domain/show.schema.ts` — Zod schema for `ShowDetail` type with all appended relations.
- `src/domain/shared.schema.ts` — Shared types: Genre, CastMember, CrewMember, Video, Image, ExternalIds, etc.
- `src/domain/person.schema.ts` — Zod schemas and inferred types for person details, external IDs, and movie/TV cast credits.
- `src/domain/person.logic.ts` — Pure helpers for credit sorting, credit deduplication, date normalization, external-link detection, and external URL construction.

**Infrastructure Layer:**

- `src/infrastructure/provider.client.ts` — API functions `getMovieDetail()` and `getShowDetail()` with retry logic.
- `src/infrastructure/image.helper.ts` — Image URL builders for TMDB images with srcset support.

**Application Layer:**

- `src/application/use-movie-detail.ts` — Composable for fetching movie details.
- `src/application/use-show-detail.ts` — Composable for fetching show details.
- `src/application/use-person.ts` — Reactive composable that fetches localized person data and exposes `PersonPageData` view models.

**Presentation Layer - Components:**

- `src/presentation/components/details/hero-backdrop.vue` — Full-width backdrop with poster overlay.
- `src/presentation/components/details/action-buttons.vue` — Watchlist, watched, and share toggles.
- `src/presentation/components/details/provider-rating-badge.vue` — TMDB rating display.
- `src/presentation/components/details/content-rating-badge.vue` — Content certification badge.
- `src/presentation/components/details/metadata-panel.vue` — Metadata display (year, runtime, genres, etc.).
- `src/presentation/components/details/synopsis.vue` — Overview text display.
- `src/presentation/components/details/box-office.vue` — Budget and revenue display.
- `src/presentation/components/details/cast-carousel.vue` — Scrollable cast list.
- `src/presentation/components/details/trailer-embed.vue` — YouTube trailer integration.
- `src/presentation/components/details/streaming-badges.vue` — Regional streaming providers.
- `src/presentation/components/details/external-links.vue` — IMDb and social media links.
- `src/presentation/components/details/images-gallery.vue` — Poster/backdrop gallery with lightbox.
- `src/presentation/components/details/detail-skeleton.vue` — Loading state skeleton.
- `src/presentation/components/details/person-hero.vue` — Person profile image, placeholder avatar, name, and known-for department.
- `src/presentation/components/details/person-bio.vue` — Biography section with empty state and read-more/read-less expansion.
- `src/presentation/components/details/person-info.vue` — Birth and death information section.
- `src/presentation/components/details/person-links.vue` — IMDb, Instagram, and Twitter external links.
- `src/presentation/components/details/filmography-card.vue` — Movie/TV credit card linking to the correct detail route.
- `src/presentation/components/details/filmography-grid.vue` — Responsive combined filmography grid with empty state.
- `src/presentation/components/details/person-skeleton.vue` — Person detail skeleton loading state.

**Presentation Layer - Views:**

- `src/presentation/views/movie-screen.vue` — Movie detail page view.
- `src/presentation/views/show-screen.vue` — Show detail page view.
- `src/presentation/views/person-screen.vue` — Person detail page view with loading, 404, retry, content, and back-navigation states.

**Tests:**

- `tests/infrastructure/provider.client.movie-detail.test.ts`
- `tests/infrastructure/provider.client.show-detail.test.ts`
- `tests/application/use-movie-detail.test.ts`
- `tests/application/use-show-detail.test.ts`
- `tests/domain/person.schema.test.ts`
- `tests/domain/person.logic.test.ts`
- `tests/infrastructure/provider.client.person.test.ts`
- `tests/application/use-person.test.ts`
- `tests/presentation/router.person.test.ts`
- `tests/presentation/components/details/person-hero.test.ts`
- `tests/presentation/components/details/person-bio.test.ts`
- `tests/presentation/components/details/person-links.test.ts`
- `tests/presentation/components/details/filmography-card.test.ts`
- `tests/presentation/views/person-screen.test.ts`

### Modified

- `src/application/use-library-entry.ts` — Added metadata sync and `setStatus()` method.
- `src/presentation/router.ts` — Added `/movie/:id`, `/show/:id`, and `/person/:id` routes with numeric ID guards.
- `src/presentation/i18n/locales/*.json` — Added detail page localization strings.
- `src/infrastructure/provider.client.ts` — Added `getPersonDetail()` and status-aware `ProviderRequestError` support for caller-visible HTTP status handling.
- `src/presentation/components/details/cast-carousel.vue` — Converted cast member cards to `RouterLink` targets for `/person/:id` while preserving layout, ordering, and fallbacks.
- `tests/presentation/components/details/cast-carousel.test.ts` — Added link and keyboard navigation coverage for cast cards.
- `tests/presentation/i18n/locale-keys.test.ts` — Required mirrored person keys across supported locales.
- `tests/presentation/router.test.ts` — Updated aggregate router expectations for the new person route.
- `src/presentation/components/recommendations/RecommendationCarousel.vue` — Removed existing `any` casts with typed guards so required full-project lint verification passes.
- `docs/technical/api.md` — Documented person response types and `GET /person/{id}` parameters and example.
- `docs/technical/architecture.md` — Documented `/person/:id` routing, deep linking, and component hierarchy.
- `docs/product/04 - entry-details/requirements.md` — Documented cast card navigation to person pages while keeping the 20-member billing-order behavior.
- `docs/reference/glossary.md` — Added or aligned Person, Cast Member, and Filmography terms.

## Key Decisions

- **Single API Request**: All related data (credits, videos, providers, images, external_ids) is fetched in one call using TMDB's append_to_response feature, minimizing network requests.
- **Lazy Library Initialization**: Library entry is only initialized after detail data loads to ensure proper metadata syncing.
- **Privacy-Enhanced YouTube**: Trailers use `youtube-nocookie.com` domain for privacy-enhanced embedding.
- **Region-Based Content**: Content ratings and streaming providers respect the user's preferred region setting.
- **Graceful Degradation**: Components hide gracefully when data is unavailable (no trailer, no cast, no streaming providers, etc.).
- **Application view models as the person UI boundary**: `usePerson()` builds formatted dates, routes, external URLs, profile URLs, and poster URLs so Presentation stays independent from Domain and Infrastructure.
- **Status-aware person provider errors**: `ProviderRequestError` preserves HTTP status for 404 inline states while keeping existing retry behavior for 429 and manual retry behavior for network/server failures.
- **Cast links use native router links**: `RouterLink` provides keyboard focus and activation without custom click handlers.
- **Crew credits excluded from person filmography**: Filmography uses only `combined_credits.cast`, matching the feature scope and avoiding crew/job ambiguity.

## Deviations from Plan

- The base movie/show detail implementation followed the original plan exactly.
- The `/person/:id` route initially required a temporary `person-screen.vue` placeholder so route tests could resolve the dynamic import. The full view replaced it during person presentation implementation.
- `tests/presentation/router.test.ts` was updated in addition to the planned person-specific router test because aggregate route-count and route-meta tests are directly affected by the new route.
- `docs/product/02 - home/requirements.md` was reviewed but not changed; home search still intentionally filters person search results out.
- `src/presentation/components/recommendations/RecommendationCarousel.vue` received a narrow type-only cleanup because existing `any` casts blocked required full-project lint verification.

## Testing

- **Infrastructure**: API client tests verify correct URL construction and response parsing.
- **Application**: Composable tests verify reactive data fetching and error handling.
- **Presentation**: Component and view tests verify rendering, interactions, and state management.
- **Type Safety**: All changes verified with `vue-tsc`.
- **Formatting**: Applied project-wide Prettier formatting.
- **Person Detail**: Domain, Infrastructure, Application, routing, i18n, component, and view tests verify person data parsing, view-model construction, navigation, localized UI, error handling, accessibility, and cast/filmography links.
- **Promotion Verification**: `npm run build`, `npm run type-check`, and `npm run lint` passed during promotion. The first `npm run test` attempt had one full-suite timeout in `tests/App.test.ts`; the same file passed when rerun directly with `npm run test -- tests/App.test.ts`, and the later delta-review `npm run test` passed 98 test files and 804 tests.

## Dependencies

No new dependencies were added. The implementation uses existing libraries:

- Vue 3 (composition API)
- Vue Router
- Vue I18n
- Zod (schema validation)
- Lucide Vue (icons)
- Tailwind CSS
