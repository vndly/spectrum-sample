# Plan: Entry Details: Movie and Show Detail Pages (R-04)

Implement comprehensive detail pages for movies and TV shows, displaying rich metadata, cast information, media content, streaming availability, and library management actions.

## Phase 1: Infrastructure and Data Layer

1. [x] **Define Data Schemas**: Create Zod schemas for `MovieDetail` and `ShowDetail` in `src/domain/`.
   - Include all appended relations (credits, videos, watch/providers, images, external_ids).
   - Define shared types (CastMember, CrewMember, Video, Image, etc.).
   - (covering: `ED-01`, `ED-02`)
2. [x] **Implement API Client**: Create API functions in `src/infrastructure/provider.client.ts`.
   - `getMovieDetail(id, language)` with appended relations.
   - `getShowDetail(id, language)` with appended relations.
   - Implement retry logic with exponential backoff for rate limiting.
   - (covering: `EN-01`)
3. [x] **Create Image Helper**: Implement `src/infrastructure/image.helper.ts`.
   - `buildImageUrl(path, size)` for TMDB image URLs.
   - `buildImageSrcSet(path, sizes)` for responsive images.
   - (covering: `EN-03`)

## Phase 2: Application Layer (Composables)

1. [x] **Create `useMovieDetail` Composable**: Implement `src/application/use-movie-detail.ts`.
   - Accept reactive or static ID.
   - Expose `data`, `loading`, `error`, and `refresh` function.
   - Respect user's language setting.
   - (covering: `ED-01`, `EL-01`)
2. [x] **Create `useShowDetail` Composable**: Implement `src/application/use-show-detail.ts`.
   - Mirror structure of movie composable for shows.
   - (covering: `ED-02`, `EL-01`)
3. [x] **Extend `useLibraryEntry` Composable**: Update `src/application/use-library-entry.ts`.
   - Support metadata syncing (poster, rating, release date).
   - Provide `setStatus` method for watchlist/watched toggling.
   - (covering: `EA-01`, `EA-02`, `EA-04`, `EA-05`)

## Phase 3: Presentation Layer (Components)

1. [x] **Create `HeroBackdrop` Component**: Implement backdrop display with poster overlay.
   - Slot for action buttons.
   - Responsive aspect ratio handling.
   - (covering: `ED-01`, `ED-02`)
2. [x] **Create `ActionButtons` Component**: Implement `src/presentation/components/details/action-buttons.vue`.
   - Watchlist toggle (bookmark icon).
   - Watched toggle (eye icon).
   - Share button with native API fallback.
   - (covering: `EA-01`, `EA-02`, `EA-03`)
3. [x] **Create `ProviderRatingBadge` Component**: Display TMDB vote average.
   - Only show when rating > 0.
   - (covering: `ED-04`)
4. [x] **Create `ContentRatingBadge` Component**: Display content certification.
   - Extract from release_dates (movies) or content_ratings (shows).
   - Use user's preferred region.
   - (covering: `ED-05`)
5. [x] **Create `MetadataPanel` Component**: Implement `src/presentation/components/details/metadata-panel.vue`.
   - Display year, runtime/seasons, language, genres, directors.
   - Use Intl.DisplayNames for language names.
   - (covering: `ED-01`, `ED-02`)
6. [x] **Create `Synopsis` Component**: Display overview text.
   - (covering: `ED-03`)
7. [x] **Create `BoxOffice` Component**: Display budget and revenue.
   - Only for movies with non-zero values.
   - (covering: `ED-06`)
8. [x] **Create `CastCarousel` Component**: Implement `src/presentation/components/details/cast-carousel.vue`.
   - Display up to 20 cast members.
   - Horizontal scroll with navigation buttons.
   - Lazy load profile images.
   - Placeholder for missing profiles.
   - (covering: `EC-01`, `EC-02`, `EC-03`, `EC-04`, `EN-02`)
9. [x] **Create `TrailerEmbed` Component**: Implement `src/presentation/components/details/trailer-embed.vue`.
   - Find first official YouTube trailer.
   - Show thumbnail with play overlay.
   - Embed YouTube player on click.
   - (covering: `EM-01`, `EM-02`)
10. [x] **Create `StreamingBadges` Component**: Display provider logos.
    - Filter to flatrate providers only.
    - Use user's preferred region.
    - (covering: `ES-01`, `ES-02`)
11. [x] **Create `ExternalLinks` Component**: Display links to external sites.
    - IMDb, homepage, Facebook, Instagram, Twitter.
    - (covering: `ES-03`)
12. [x] **Create `ImagesGallery` Component**: Implement `src/presentation/components/details/images-gallery.vue`.
    - Tab switcher for posters/backdrops.
    - Thumbnail carousel.
    - Lightbox modal with keyboard navigation.
    - (covering: `EM-03`, `EM-04`, `EM-05`, `EN-07`)
13. [x] **Create `DetailSkeleton` Component**: Loading state skeleton.
    - (covering: `EL-01`)

## Phase 4: View Integration

1. [x] **Implement `MovieScreen` View**: Create `src/presentation/views/movie-screen.vue`.
   - Integrate all detail components.
   - Initialize library entry on data load.
   - Extract content rating for user's region.
   - Generate shareable URL.
   - Handle 404 and error states.
   - (covering: `ED-01`, `EL-02`, `EL-03`)
2. [x] **Implement `ShowScreen` View**: Create `src/presentation/views/show-screen.vue`.
   - Mirror movie screen structure for shows.
   - Use show-specific fields (first_air_date, seasons, episodes).
   - (covering: `ED-02`, `EL-02`, `EL-03`)
3. [x] **Configure Routes**: Add routes in `src/presentation/router.ts`.
   - `/movie/:id` → `MovieScreen`
   - `/show/:id` → `ShowScreen`
   - Numeric ID guard with redirect to home.
   - (covering: `EL-04`)

## Phase 5: Internationalization

1. [x] **Add i18n Strings**: Update locale files in `src/presentation/i18n/locales/`.
   - Detail page labels, button text, error messages.
   - Share feedback messages.
   - (covering: `EN-10`, `EN-11`)

## Phase 6: Testing

1. [x] **API Client Tests**: `tests/infrastructure/provider.client.movie-detail.test.ts` and `provider.client.show-detail.test.ts`.
2. [x] **Composable Tests**: `tests/application/use-movie-detail.test.ts` and `use-show-detail.test.ts`.
3. [x] **Component Tests**: Tests for detail components verifying rendering and interactions.
4. [x] **View Tests**: Tests for movie and show screens verifying data display and error states.

## Phase 7: Final Verification

1. [x] **Responsive Check**: Verify layout on mobile and desktop viewports.
2. [x] **Accessibility Check**: Verify keyboard navigation and focus management.
3. [x] **Localization Check**: Verify all labels in multiple languages.
4. [x] **Error Handling Check**: Verify 404 and API error states.

## Phase 8: Cast Information Extension - Domain and Infrastructure

1. [x] **Create Person Domain Tests**: Add `tests/domain/person.schema.test.ts` and `tests/domain/person.logic.test.ts` for person schema parsing, mixed movie/TV credits, null fields, date sorting, credit deduplication, date normalization, and supported external-link URL building.
2. [x] **Implement Person Domain Types**: Add `src/domain/person.schema.ts` with `PersonDetail`, `PersonExternalIds`, movie/TV `PersonCredit`, and `PersonDetailWithCredits` schemas.
3. [x] **Implement Person Domain Logic**: Add pure helpers for credit sorting, deduplication by `(media_type, id)`, date normalization, external-link detection, and external URL construction.
4. [x] **Create Person Provider Tests**: Add `tests/infrastructure/provider.client.person.test.ts` for endpoint URL construction, Zod parsing, 404 status preservation, 429 backoff, network errors, 500+ errors, and validation failures.
5. [x] **Implement Person Provider API**: Add `getPersonDetail(id, language)` to `src/infrastructure/provider.client.ts`, using `/person/{id}` with `append_to_response=combined_credits,external_ids` and status-aware error handling.

## Phase 9: Cast Information Extension - Application and Routing

1. [x] **Create Person Application Tests**: Add `tests/application/use-person.test.ts` for loading transitions, error states, manual refresh, language-aware requests, language refetching, sorted/deduplicated filmography, and ready-to-render view-model fields.
2. [x] **Implement `usePerson`**: Add `src/application/use-person.ts` to fetch localized person data, build profile/poster/external URLs, format birth/death dates, deduplicate and sort filmography, and refetch when ID or language changes.
3. [x] **Create Person Route Tests**: Add `tests/presentation/router.person.test.ts` for valid numeric routes, invalid ID redirects, route metadata, and lazy loading.
4. [x] **Add Person Route**: Update `src/presentation/router.ts` with named lazy route `/person/:id`, `meta.titleKey: 'page.person.title'`, and the existing numeric ID guard.

## Phase 10: Cast Information Extension - i18n and Presentation

1. [x] **Extend Locale Coverage Tests**: Require mirrored person page keys in `en.json`, `es.json`, and `fr.json`.
2. [x] **Add Person Locale Keys**: Add labels, fallback copy, media labels, external-link labels, image alt text, page title, error copy, and retry/back labels for all supported locales.
3. [x] **Create Person Component Tests**: Add component tests for `person-hero`, `person-bio`, `person-links`, and `filmography-card`, covering rendering, fallbacks, localization, accessibility, links, badges, lazy images, and keyboard access.
4. [x] **Create Person View Tests**: Add `tests/presentation/views/person-screen.test.ts` for loading skeleton, success content, 404, network/server retry, empty filmography, back navigation, semantic structure, focus states, and live regions.
5. [x] **Implement Person Components**: Add `person-hero.vue`, `person-bio.vue`, `person-info.vue`, `person-links.vue`, `filmography-card.vue`, `filmography-grid.vue`, and `person-skeleton.vue`.
6. [x] **Implement Person Screen**: Add `src/presentation/views/person-screen.vue`, composing Application view models with loading, not-found, retry, content, and back-navigation states.

## Phase 11: Cast Information Extension - Cast Links and Documentation

1. [x] **Update CastCarousel Tests**: Extend `tests/presentation/components/details/cast-carousel.test.ts` for `/person/:id` links and keyboard activation.
2. [x] **Update CastCarousel**: Convert cast member cards in `src/presentation/components/details/cast-carousel.vue` to `RouterLink` targets while preserving sorting, layout, and fallbacks.
3. [x] **Update Technical API Docs**: Document `GET /person/{id}`, response types, query parameters, and localized usage.
4. [x] **Update Architecture Docs**: Add `/person/:id` routing, deep linking, skeleton, inline 404, and retry behavior.
5. [x] **Update Product and Glossary Docs**: Document cast card person navigation in entry details and align Person, Cast Member, and Filmography glossary terms.

## Phase 12: Cast Information Extension - Verification

1. [x] **Run Full Test Suite**: Run `npm run test`.
2. [x] **Run Production Build**: Run `npm run build`.
3. [x] **Run Type Check**: Run `npm run type-check`.
4. [x] **Run Lint**: Run `npm run lint`.
5. [x] **Manual Verification**: Verify movie-to-person navigation, person content, biography expansion, external links, filmography sorting and deduplication, responsive layout, skeletons, 404/redirect behavior, retry handling, 429 backoff, language refetching, back navigation, localized document title, and JSDoc on new exports.
