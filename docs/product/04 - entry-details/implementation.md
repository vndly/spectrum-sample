# Implementation: Entry Details: Movie and Show Detail Pages (R-04)

## Overview

Implemented comprehensive detail pages for movies and TV shows that display rich metadata, cast information, trailers, streaming availability, and image galleries. The pages integrate with the library system for watchlist and watched status management, and support sharing via native APIs or clipboard.

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
```

## Files

### Created

**Domain Layer:**

- `src/domain/movie.schema.ts` — Zod schema for `MovieDetail` type with all appended relations.
- `src/domain/show.schema.ts` — Zod schema for `ShowDetail` type with all appended relations.
- `src/domain/shared.schema.ts` — Shared types: Genre, CastMember, CrewMember, Video, Image, ExternalIds, etc.

**Infrastructure Layer:**

- `src/infrastructure/provider.client.ts` — API functions `getMovieDetail()` and `getShowDetail()` with retry logic.
- `src/infrastructure/image.helper.ts` — Image URL builders for TMDB images with srcset support.

**Application Layer:**

- `src/application/use-movie-detail.ts` — Composable for fetching movie details.
- `src/application/use-show-detail.ts` — Composable for fetching show details.

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

**Presentation Layer - Views:**

- `src/presentation/views/movie-screen.vue` — Movie detail page view.
- `src/presentation/views/show-screen.vue` — Show detail page view.

**Tests:**

- `tests/infrastructure/provider.client.movie-detail.test.ts`
- `tests/infrastructure/provider.client.show-detail.test.ts`
- `tests/application/use-movie-detail.test.ts`
- `tests/application/use-show-detail.test.ts`

### Modified

- `src/application/use-library-entry.ts` — Added metadata sync and `setStatus()` method.
- `src/presentation/router.ts` — Added `/movie/:id` and `/show/:id` routes with numeric ID guard.
- `src/presentation/i18n/locales/*.json` — Added detail page localization strings.

## Key Decisions

- **Single API Request**: All related data (credits, videos, providers, images, external_ids) is fetched in one call using TMDB's append_to_response feature, minimizing network requests.
- **Lazy Library Initialization**: Library entry is only initialized after detail data loads to ensure proper metadata syncing.
- **Privacy-Enhanced YouTube**: Trailers use `youtube-nocookie.com` domain for privacy-enhanced embedding.
- **Region-Based Content**: Content ratings and streaming providers respect the user's preferred region setting.
- **Graceful Degradation**: Components hide gracefully when data is unavailable (no trailer, no cast, no streaming providers, etc.).

## Deviations from Plan

- None — Implementation followed the plan exactly.

## Testing

- **Infrastructure**: API client tests verify correct URL construction and response parsing.
- **Application**: Composable tests verify reactive data fetching and error handling.
- **Presentation**: Component and view tests verify rendering, interactions, and state management.
- **Type Safety**: All changes verified with `vue-tsc`.
- **Formatting**: Applied project-wide Prettier formatting.

## Dependencies

No new dependencies were added. The implementation uses existing libraries:

- Vue 3 (composition API)
- Vue Router
- Vue I18n
- Zod (schema validation)
- Lucide Vue (icons)
- Tailwind CSS
