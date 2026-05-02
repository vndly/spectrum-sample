# Implementation: Cast Information

## Overview

Implemented cast member detail discovery across the existing four-layer architecture. Cast cards now link to a lazy-loaded `/person/:id` route, and the person page fetches TMDB person details, external IDs, and combined cast credits through a new Application composable and Infrastructure client method.

The page renders a profile hero, biography, birth/death info, supported external links, and a responsive filmography grid. Domain logic handles parsing, deduplication, sorting, date normalization, and external URL construction before Presentation receives ready-to-render view models.

## Files Changed

### Created

**Domain**

- `src/domain/person.schema.ts` - Zod schemas and inferred types for person details, external IDs, and movie/TV cast credits.
- `src/domain/person.logic.ts` - Pure helpers for credit sorting, credit deduplication, date normalization, external-link detection, and external URL construction.

**Application**

- `src/application/use-person.ts` - Reactive `usePerson()` composable that fetches localized person data and exposes `PersonPageData` view models.

**Presentation**

- `src/presentation/views/person-screen.vue` - Route-level person detail view with loading, 404, retry, content, and back-navigation states.
- `src/presentation/components/details/person-hero.vue` - Profile image, placeholder avatar, name, and known-for department.
- `src/presentation/components/details/person-bio.vue` - Biography section with empty state and read-more/read-less expansion.
- `src/presentation/components/details/person-info.vue` - Birth and death information section.
- `src/presentation/components/details/person-links.vue` - IMDB, Instagram, and Twitter external links.
- `src/presentation/components/details/filmography-card.vue` - Movie/TV credit card linking to the correct detail route.
- `src/presentation/components/details/filmography-grid.vue` - Responsive combined filmography grid with empty state.
- `src/presentation/components/details/person-skeleton.vue` - Person detail skeleton loading state.

**Tests**

- `tests/domain/person.schema.test.ts` - Person API schema parsing and rejection coverage.
- `tests/domain/person.logic.test.ts` - Credit sorting, deduplication, date normalization, and external URL coverage.
- `tests/infrastructure/provider.client.person.test.ts` - Person endpoint URL, parsing, and status-aware error coverage.
- `tests/application/use-person.test.ts` - Reactive loading, refresh, language refetch, and view-model coverage.
- `tests/presentation/router.person.test.ts` - Person route, numeric guard, metadata, and lazy-loading coverage.
- `tests/presentation/components/details/person-hero.test.ts` - Profile rendering, fallback, alt text, and sizing coverage.
- `tests/presentation/components/details/person-bio.test.ts` - Biography expansion and empty-state coverage.
- `tests/presentation/components/details/person-links.test.ts` - External link rendering and attributes coverage.
- `tests/presentation/components/details/filmography-card.test.ts` - Credit display, poster fallback, links, badges, and lazy image coverage.
- `tests/presentation/views/person-screen.test.ts` - Person view content, loading, 404, retry, empty filmography, semantics, and back-navigation coverage.

### Modified

- `src/infrastructure/provider.client.ts` - Added `getPersonDetail()` and status-aware `ProviderRequestError` support for caller-visible HTTP status handling.
- `src/presentation/router.ts` - Added the named lazy-loaded `/person/:id` route using the existing numeric ID guard.
- `src/presentation/components/details/cast-carousel.vue` - Converted cast member cards to `RouterLink` targets for `/person/:id` while preserving existing layout, ordering, and fallbacks.
- `src/presentation/i18n/locales/en.json` - Added person page translation keys.
- `src/presentation/i18n/locales/es.json` - Added Spanish person page translation keys.
- `src/presentation/i18n/locales/fr.json` - Added French person page translation keys.
- `tests/presentation/components/details/cast-carousel.test.ts` - Added link and keyboard navigation coverage for cast cards.
- `tests/presentation/i18n/locale-keys.test.ts` - Required mirrored person keys across supported locales.
- `tests/presentation/router.test.ts` - Updated aggregate router expectations for the new person route.
- `src/presentation/components/recommendations/RecommendationCarousel.vue` - Removed existing `any` casts with typed guards so the required lint verification passes.
- `docs/technical/api.md` - Documented person response types and `GET /person/{id}` parameters and example.
- `docs/technical/architecture.md` - Documented `/person/:id` routing, deep linking, and component hierarchy.
- `docs/product/04 - entry-details/requirements.md` - Documented that cast cards navigate to person pages while keeping the 20-member billing-order behavior.
- `docs/reference/glossary.md` - Added or aligned Person, Cast Member, and Filmography terms.
- `docs/roadmap/cast-details/requirements.md` - Moved implementation status to `under_test`.
- `docs/roadmap/cast-details/plan.md` - Checked off completed implementation and automated verification steps.

## Requirement Notes

| Requirement | Implementation notes                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI-01       | `cast-carousel.vue` renders each cast card as a `RouterLink` to `/person/${member.id}`.                                                                     |
| CI-02       | `router.ts` defines the named `person` route with `meta.titleKey: 'page.person.title'`, lazy import, and numeric guard.                                     |
| CI-03       | `person-hero.vue` renders the Application-provided `profileUrl` or a `User` icon fallback.                                                                  |
| CI-04       | `person-hero.vue` displays `name` and `knownForDepartment` from `PersonPageData`.                                                                           |
| CI-05       | `person-bio.vue` displays biography text, an empty state, and localized read-more controls.                                                                 |
| CI-06       | `use-person.ts` formats birthday/deathday with `Intl.DateTimeFormat`; `person-info.vue` displays birth and death fields when present.                       |
| CI-07       | `person-links.vue` renders only available IMDB, Instagram, and Twitter links with new-tab security attributes.                                              |
| CI-08       | `use-person.ts` maps `combined_credits.cast` into `PersonCreditViewModel`; `filmography-grid.vue` and `filmography-card.vue` render the responsive grid.    |
| CI-09       | `person.logic.ts` sorts credits newest first and leaves null dates last; `filmography-card.vue` displays localized TBA text.                                |
| CI-10       | `use-person.ts` builds `/movie/:id` and `/show/:id` routes; `filmography-card.vue` renders them as `RouterLink`s.                                           |
| CI-11       | `person-screen.vue` renders `person-skeleton.vue` while `usePerson()` is loading.                                                                           |
| CI-12       | `ProviderRequestError`, `usePerson()`, and `person-screen.vue` distinguish 404, rate limit, network, and server errors with inline or toast retry behavior. |
| CI-13       | `person-screen.vue` includes a back button that uses browser history and falls back to Home on direct entry.                                                |
| CI-14       | `filmography-grid.vue` displays the localized empty filmography message when there are no credits.                                                          |
| CI-15       | `use-person.ts` watches both the person ID and `Settings.language`, then refetches the same person with the active language.                                |

## Non-Functional Notes

- CI-NFR-01 and CI-NFR-02: Profile and filmography layout use fixed responsive Tailwind sizes and grid breakpoints.
- CI-NFR-03: Biography copy is constrained with `max-w-prose` and responsive spacing.
- CI-NFR-04: `getPersonDetail()` uses one localized request with `append_to_response=combined_credits,external_ids`.
- CI-NFR-05: The person route component uses a dynamic import.
- CI-NFR-06: Filmography poster images use `loading="lazy"`.
- CI-NFR-07 through CI-NFR-11: The page uses semantic article/section structure, native links/buttons, visible focus styling, live loading announcements, and alert error regions.
- CI-NFR-12: Locale-key tests enforce mirrored person keys in `en`, `es`, and `fr`.
- CI-NFR-13: API, architecture, entry-details, and glossary documentation were updated.
- CI-NFR-14: Presentation receives profile/poster URLs through Application view models and does not call image helpers directly.

## Key Decisions

- **Application view models as the UI boundary**: `usePerson()` builds formatted dates, routes, external URLs, and image URLs so Presentation stays independent from Domain and Infrastructure.
- **Status-aware provider errors**: `ProviderRequestError` preserves HTTP status for 404 inline states while keeping existing retry behavior for 429 and manual retry behavior for network/server failures.
- **Cast links use native router links**: `RouterLink` provides keyboard focus and activation without custom click handlers.
- **Crew credits excluded**: Filmography uses only `combined_credits.cast`, matching the feature scope and avoiding crew/job ambiguity.

## Deviations from Plan

- The `/person/:id` route initially required a temporary `person-screen.vue` placeholder so route tests could resolve the dynamic import. The full view replaced it in Phase 11.
- `tests/presentation/router.test.ts` was updated in addition to the planned person-specific router test because the aggregate route-count and route-meta tests are directly affected by the new route.
- `docs/product/02 - home/requirements.md` was reviewed but not changed; `HS-03` still intentionally filters person search results out.
- `src/presentation/components/recommendations/RecommendationCarousel.vue` received a narrow type-only cleanup because existing `any` casts blocked the required full-project lint verification.
- The browser-only manual checklist in plan step 15.5 is pending user confirmation. The same behaviors are covered by unit and component tests, but no browser automation exists in this repo.

## Testing

- `npm run test` - passed: 98 test files, 802 tests.
- `npm run build` - passed: production build completed successfully.
- `npm run type-check` - passed: app and Vitest TypeScript checks completed successfully.
- `npm run lint` - passed: ESLint completed without errors.
- Focused tests were also run during implementation for domain, infrastructure, application, routing, i18n, person components, person view, and `CastCarousel`.

## Security and Error UX

- No authentication or authorization flow changed; the existing TMDB bearer-token flow remains centralized in `provider.client.ts`.
- New API data is validated with Zod before it crosses from Infrastructure into Application.
- External person links open in new tabs with `rel="noopener noreferrer"`.
- User-facing recoverable failures show localized retry affordances; 404 uses an inline not-found state.

## Performance

- Person details use a single TMDB request with appended credits and external IDs.
- The person route is lazy-loaded and creates its own production chunk.
- Filmography poster images are lazy-loaded; filmography is deduplicated once in Application before rendering.

## Rollback

Rollback is local to this feature: remove the person schemas, logic, composable, route, view, person detail components, person tests, locale keys, and documentation additions; then revert `CastCarousel` cards from `RouterLink` back to their previous non-navigating container.

## Dependencies

No new dependencies were added.
