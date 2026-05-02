# Cast Information — Implementation Plan

Feature ID: R-09

## Phase 1: Domain Testing

- [x] **1.1** Create `tests/domain/person.schema.test.ts`:
  - Test valid `PersonDetailWithCreditsSchema` parsing for profile, name, department, biography, birth/death fields, combined credits, and external IDs (covering: CI-03-01, CI-04-01, CI-05-01, CI-06-01, CI-06-02, CI-07-01)
  - Test movie and TV cast-credit `PersonCreditSchema` variants with concrete TMDB fields (`title`/`release_date` for movies, `name`/`first_air_date` for TV) and no crew-credit dependency (covering: CI-08-03, CI-10-01, CI-10-02)
  - Test null profile, null external IDs, null dates, and empty credits parse correctly (covering: CI-03-02, CI-07-03, CI-09-02, CI-14-01)
  - (implementation detail) Test invalid API response data is rejected by Zod

- [x] **1.2** Create `tests/domain/person.logic.test.ts`:
  - Test `sortCreditsByDate` with mixed movie/TV dates and null dates (covering: CI-09-01, CI-09-02)
  - Test `deduplicateCredits` uses `(media_type, id)`, keeps the lowest numeric `order` entry for duplicate roles in the same title, and keeps the first API entry when all duplicate orders are null (covering: CI-08-06)
  - Test `normalizePersonDates` returns locale-neutral birthday, deathday, and birthplace fields for complete, partial, and missing dates (covering: CI-06-01, CI-06-02, CI-06-03)
  - Test `hasExternalLinks` true/false cases and `buildExternalUrl` for IMDB, Instagram, and Twitter (covering: CI-07-01, CI-07-02, CI-07-03, CI-07-04)

- [x] **1.3** Run `npm run test -- tests/domain/person.schema.test.ts tests/domain/person.logic.test.ts` and confirm the new tests fail before implementation.

## Phase 2: Domain Layer

- [x] **2.1** Create `src/domain/person.schema.ts` with Zod schemas:
  - `PersonDetailSchema` — `id` (number), `name` (string), `biography` (string), `birthday` (string|null), `deathday` (string|null), `place_of_birth` (string|null), `profile_path` (string|null), `known_for_department` (string), `also_known_as` (string[]), `homepage` (string|null)
  - `ExternalIdsSchema` — `imdb_id` (string|null), `instagram_id` (string|null), `twitter_id` (string|null)
  - `PersonMovieCreditSchema` — `id` (number), `media_type` (`'movie'`), `title` (string), `character` (string|null), `release_date` (string|null), `poster_path` (string|null), `order` (number|null)
  - `PersonTvCreditSchema` — `id` (number), `media_type` (`'tv'`), `name` (string), `character` (string|null), `first_air_date` (string|null), `poster_path` (string|null), `order` (number|null)
  - `PersonCreditSchema` — discriminated union of movie and TV credit schemas
  - `PersonDetailWithCreditsSchema` — extends `PersonDetailSchema` with `combined_credits.cast` (`PersonCreditSchema[]`) and `external_ids` (`ExternalIdsSchema`); `combined_credits.crew` is ignored for this feature
  - Export inferred types: `PersonDetail`, `ExternalIds`, `PersonCredit`, `PersonDetailWithCredits`

- [x] **2.2** Create `src/domain/person.logic.ts` with pure functions:
  - `sortCreditsByDate(credits: PersonCredit[]): PersonCredit[]` — sorts descending by `release_date`/`first_air_date`, nulls last
  - `deduplicateCredits(credits: PersonCredit[]): PersonCredit[]` — removes duplicate `(media_type, id)` entries, keeping the lowest `order` value
  - `normalizePersonDates(birthday: string|null, deathday: string|null, placeOfBirth: string|null): PersonDateInfo` — returns raw ISO date strings and birthplace without localized display text
  - `hasExternalLinks(externalIds: ExternalIds): boolean` — returns true if any of `imdb_id`, `instagram_id`, or `twitter_id` is non-null
  - `buildExternalUrl(type: 'imdb'|'instagram'|'twitter', id: string): string` — returns the full external URL
  - Add JSDoc to every exported function, including parameters and return values

- [x] **2.3** Run `npm run test -- tests/domain/person.schema.test.ts tests/domain/person.logic.test.ts`; domain tests should pass.

## Phase 3: Infrastructure Testing

- [x] **3.1** Create `tests/infrastructure/provider.client.person.test.ts`:
  - Test successful person fetch passes both `language={Settings.language}` and `append_to_response=combined_credits,external_ids` (covering: CI-04-02; validates CI-NFR-04)
  - Test successful response parsing through `PersonDetailWithCreditsSchema` (covering: CI-03-01, CI-04-01, CI-08-03)
  - Test 404 response handling preserves status information for inline not-found handling (covering: CI-12-01)
  - Test 429 response handling uses automatic exponential backoff before surfacing an error (covering: CI-12-05)
  - Test network error handling without automatic retry (covering: CI-12-02)
  - Test 500+ server error handling without automatic retry (covering: CI-12-04)
  - (implementation detail) Test Zod validation failure

- [x] **3.2** Run `npm run test -- tests/infrastructure/provider.client.person.test.ts` and confirm the new tests fail before implementation.

## Phase 4: Infrastructure Layer

- [x] **4.1** Update `src/infrastructure/provider.client.ts`:
  - Add `getPersonDetail(id: number, language: string): Promise<PersonDetailWithCredits>`
  - Endpoint path: `/person/{id}`
  - Query params: `language` from `Settings.language` and `append_to_response=combined_credits,external_ids`
  - Parse response with `PersonDetailWithCreditsSchema`
  - Preserve status-aware errors so callers can distinguish 404 inline not-found, 429 automatic backoff, network errors, and 500+ manual retry errors
  - Follow existing provider error handling patterns: 404 passes through for inline not-found handling, 429 uses automatic backoff, network and 500+ server errors surface to callers for manual retry
  - Add JSDoc for the exported `getPersonDetail` function

- [x] **4.2** Run `npm run test -- tests/infrastructure/provider.client.person.test.ts`; infrastructure tests should pass.

## Phase 5: Application Testing

- [x] **5.1** Create `tests/application/use-person.test.ts`:
  - Test loading state transitions: idle → loading → success with `data` populated (covering: CI-11-01)
  - Test loading state transitions: idle → loading → error with `error` populated (covering: CI-12-02)
  - Test server error state exposes `error` for manual retry (covering: CI-12-04)
  - Test `refresh` re-fetches data after an error (covering: CI-12-03)
  - Test current `Settings.language` is passed to `getPersonDetail` (covering: CI-04-02; validates CI-NFR-04)
  - Test changing `Settings.language` while mounted re-fetches the same person ID without changing the route (covering: CI-15-01)
  - Test returned `data.filmography` is deduplicated and sorted before Presentation receives it (covering: CI-08-06, CI-09-01, CI-09-02)
  - Test returned view data includes locale-aware formatted birth/death info, external link URLs, profile URL, and poster URLs (covering: CI-03-01, CI-06-01, CI-06-02, CI-07-02, CI-08-08)
  - (implementation detail) Test id reactivity triggers a new fetch

- [x] **5.2** Run `npm run test -- tests/application/use-person.test.ts` and confirm the new tests fail before implementation.

## Phase 6: Application Layer

- [x] **6.1** Create `src/application/use-person.ts`:
  - Export `usePerson(id: MaybeRef<number>)`
  - Import `useSettings()` and call `getPersonDetail(toValue(id), language.value)`
  - Use Domain functions to deduplicate, sort, normalize dates, and build external URLs inside the Application layer
  - Format birth/death dates in the Application layer with `Intl.DateTimeFormat(language.value, ...)` so month names follow the active locale
  - Build `profileUrl` and filmography `posterUrl` fields in the Application layer with `buildImageUrl` and the configured image sizes
  - Return the standard shape `{ data, loading, error, refresh }`
  - `data` is `Ref<PersonPageData|null>` where `PersonPageData` is an Application-facing view model containing profile fields, ready-to-render image URLs, locale-aware formatted birth/death strings, external link view models, and sorted/deduplicated filmography view models
  - Export Application-facing types such as `PersonPageData`, `PersonExternalLinkViewModel`, and `PersonCreditViewModel` for Presentation props; Presentation must not import Domain types or Domain functions
  - Watch both the id ref and `Settings.language` for changes and re-fetch on change
  - Add JSDoc for the exported `usePerson` composable

- [x] **6.2** Run `npm run test -- tests/application/use-person.test.ts`; application tests should pass.

## Phase 7: Routing Testing

- [x] **7.1** Create `tests/presentation/router.person.test.ts`:
  - Test `/person/500` resolves to the person route (covering: CI-02-01)
  - Test `/person/abc` redirects to `/` (covering: CI-02-02)
  - Test `/person/123abc` redirects to `/` (covering: CI-02-03)
  - Test the person route has `name: 'person'` and `meta.titleKey: 'page.person.title'` (covering: CI-02-04)
  - (implementation detail) Test route component is lazy-loaded via dynamic import (validates CI-NFR-05)

- [x] **7.2** Run `npm run test -- tests/presentation/router.person.test.ts` and confirm the new tests fail before implementation.

## Phase 8: Routing

- [x] **8.1** Update `src/presentation/router.ts`:
  - Add route `{ path: '/person/:id', name: 'person', component: () => import('./views/person-screen.vue'), meta: { titleKey: 'page.person.title' }, beforeEnter: numericIdGuard }`
  - Add navigation guard: reject non-numeric `:id`, redirect to `/`
  - Place route alongside existing `/movie/:id` and `/show/:id` routes

- [x] **8.2** Run `npm run test -- tests/presentation/router.person.test.ts`; routing tests should pass.

## Phase 9: i18n

- [x] **9.1** Update locale-key tests to require the new person keys in `en.json`, `es.json`, and `fr.json`:
  - Page title: `page.person.title`
  - Text keys: `person.biography`, `person.biographyEmpty`, `person.readMore`, `person.readLess`, `person.born`, `person.died`, `person.filmography`, `person.filmographyCount`, `person.creditsEmpty`, `person.notFound`, `person.backToHome`, `person.retry`, `person.tba`
  - Media labels: `person.media.movie`, `person.media.tv`
  - External link labels: `person.external.imdb`, `person.external.instagram`, `person.external.twitter`
  - Error/back labels: `person.error`, `person.error.network`, `person.error.server`, `person.back`
  - Image alt text: `person.profileAlt`, `person.posterAlt`

- [x] **9.2** Run `npm run test -- tests/presentation/i18n/locale-keys.test.ts` and confirm the locale-key tests fail before implementation.

- [x] **9.3** Add all person keys to `src/presentation/i18n/locales/en.json`, `es.json`, and `fr.json`; rerun locale-key tests.

## Phase 10: Presentation Testing

- [x] **10.1** Create component tests for person detail components, mocking only Application-facing data shapes:
  - `tests/presentation/components/details/person-hero.test.ts` covers profile URL rendering, fallback icon, localized alt text, and responsive sizing (covering: CI-03-01, CI-03-02, CI-NFR-01, CI-NFR-14)
  - `tests/presentation/components/details/person-bio.test.ts` covers truncation, expansion, empty state, and localized controls (covering: CI-05-01, CI-05-02, CI-05-03, CI-05-04, CI-05-05)
  - `tests/presentation/components/details/person-links.test.ts` covers available/missing links, `target="_blank"`, `rel="noopener noreferrer"`, and accessible labels (covering: CI-07-01, CI-07-02, CI-07-03, CI-07-04; validates CI-NFR-08)
  - `tests/presentation/components/details/filmography-card.test.ts` covers displayed fields, localized media badges, lazy Application-provided poster URLs, keyboard activation, localized alt text, and mobile touch target sizing (covering: CI-08-03, CI-08-04, CI-08-05, CI-08-08, CI-10-01, CI-10-02, CI-10-03, CI-10-04; validates CI-NFR-06, CI-NFR-10, CI-NFR-14)

- [x] **10.2** Create `tests/presentation/views/person-screen.test.ts`, mocking `usePerson()` and `useToast()`:
  - Test skeleton displays during loading with live region semantics and respects reduced-motion settings (covering: CI-11-01, CI-11-02; validates CI-NFR-11)
  - Test person data renders profile image/name/department/biography/birth info/filmography (covering: CI-03-01, CI-03-02, CI-04-01, CI-05-01, CI-06-01, CI-08-01, CI-08-02, CI-08-03)
  - Test large filmography renders without duplicate or ordering regressions (covering: CI-08-06, CI-08-07, CI-09-01, CI-09-02)
  - Test 404 state displays localized `person.notFound` text with Home link and alert semantics (covering: CI-12-01; validates CI-NFR-11)
  - Test network error dispatches a localized toast with Retry action, and clicking Retry calls `refresh` (covering: CI-12-02, CI-12-03)
  - Test 500+ server error dispatches a localized toast with Retry action (covering: CI-12-04)
  - Test empty filmography message (covering: CI-14-01)
  - Test browser back, back arrow behavior, direct-entry Home fallback, and minimum touch target sizing (covering: CI-13-01, CI-13-02, CI-13-03, CI-13-04)
  - (implementation detail) Test semantic article/section/link structure and visible focus states (validates CI-NFR-07, CI-NFR-09)

- [x] **10.3** Run `npm run test -- tests/presentation/components/details/person-hero.test.ts tests/presentation/components/details/person-bio.test.ts tests/presentation/components/details/person-links.test.ts tests/presentation/components/details/filmography-card.test.ts tests/presentation/views/person-screen.test.ts` and confirm the new tests fail before implementation.

## Phase 11: Presentation Components and View

- [x] **11.1** Create `src/presentation/components/details/person-hero.vue`:
  - Props: `name: string`, `knownForDepartment: string`, `profileUrl: string|null`
  - Display circular profile image (200×200px desktop, 160×160px mobile) with User icon fallback
  - Display name (`text-2xl font-bold text-white`) and known-for department (`text-sm text-slate-400`)
  - Responsive layout: centered on mobile, left-aligned on desktop
  - Use localized `person.profileAlt` alt text when `profileUrl` exists

- [x] **11.2** Create `src/presentation/components/details/person-bio.vue`:
  - Props: `biography: string|null`
  - Section heading with i18n key `person.biography`
  - Display biography text with `line-clamp-6`, `person.readMore` / `person.readLess` expansion button
  - Empty state with i18n key `person.biographyEmpty`

- [x] **11.3** Create `src/presentation/components/details/person-info.vue`:
  - Props: `birthInfo: string|null`, `deathInfo: string|null`
  - Display formatted birth info and death info from Application-provided strings
  - Hide section entirely if both values are null
  - i18n keys: `person.born`, `person.died`

- [x] **11.4** Create `src/presentation/components/details/person-links.vue`:
  - Props: `links: PersonExternalLinkViewModel[]` imported from `src/application/use-person.ts`
  - Display row of icon links for IMDB, Instagram, and Twitter entries present in `links`
  - Hide entire section when `links.length === 0`
  - Open links in new tab with `target="_blank" rel="noopener noreferrer"`
  - Use localized accessible labels such as `person.external.imdb`

- [x] **11.5** Create `src/presentation/components/details/filmography-card.vue`:
  - Props: `credit: PersonCreditViewModel` imported from `src/application/use-person.ts`
  - Display Application-provided `credit.posterUrl` with placeholder fallback
  - Display title, localized year label (or `person.tba` if null), localized media type badge (`person.media.movie` / `person.media.tv`), and character name
  - Render as `RouterLink` to the Application-provided route (`/movie/:id` or `/show/:id`)
  - Hover state uses `transition-transform duration-200 ease-in-out`
  - Lazy load poster image with `loading="lazy"`
  - Use localized `person.posterAlt` alt text when `posterUrl` exists

- [x] **11.6** Create `src/presentation/components/details/filmography-grid.vue`:
  - Props: `credits: PersonCreditViewModel[]`
  - Section heading with i18n key `person.filmographyCount` and count
  - Responsive grid: 2 columns below `md`, 3 at `md`, 4 at `lg`, 6 at `xl` and above
  - Render `FilmographyCard` for each credit
  - Empty state with i18n key `person.creditsEmpty`

- [x] **11.7** Create `src/presentation/components/details/person-skeleton.vue`:
  - Skeleton layout matching `PersonScreen`
  - Circular profile placeholder, text lines for name/bio, grid of card skeletons
  - Use `animate-pulse` for shimmer effect and disable pulse animation under `prefers-reduced-motion`

- [x] **11.8** Create `src/presentation/views/person-screen.vue`:
  - Use `usePerson()` composable with route param and read `data`, `loading`, `error`, and `refresh`
  - Conditional rendering: skeleton (loading), inline 404 state, network and 500+ server error state, content
  - Compose `PersonHero`, `PersonBio`, `PersonInfo`, `PersonLinks`, and `FilmographyGrid` from Application-provided view data
  - Do not import Domain types, Domain functions, or Infrastructure
  - Back button uses `router.back()` when history exists and falls back to `/` on direct entry
  - Network and 500+ server errors dispatch localized toasts with a localized `person.retry` action that calls `refresh`
  - Semantic HTML: page root `<article>`; biography, info, links, and filmography use `<section>` with headings
  - `aria-live="polite"` on loading region; `role="alert"` on error region

## Phase 12: CastCarousel Testing

- [x] **12.1** Update `tests/presentation/components/details/cast-carousel.test.ts`:
  - Test click on cast member navigates to `/person/:id` (covering: CI-01-01)
  - Test cast member card is a focusable RouterLink and Enter activates it (covering: CI-01-02)

- [x] **12.2** Run `npm run test -- tests/presentation/components/details/cast-carousel.test.ts` and confirm the new tests fail before implementation.

## Phase 13: CastCarousel Update

- [x] **13.1** Update `src/presentation/components/details/cast-carousel.vue`:
  - Change cast member container from `<div>` to a `<RouterLink>` whose `to` target is `/person/${member.id}`
  - Add pointer affordance and hover styling consistent with existing card hover patterns
  - Maintain existing layout, cast ordering, profile fallback, and text rendering

- [x] **13.2** Run `npm run test -- tests/presentation/components/details/cast-carousel.test.ts`; CastCarousel tests should pass.

## Phase 14: Documentation

- [x] **14.1** Update `docs/technical/api.md`:
  - Add Person endpoint section: `GET /person/{id}` with `language={Settings.language}` and `append_to_response=combined_credits,external_ids`
  - Document `PersonDetail`, `PersonCredit`, and `ExternalIds` response types
  - Add curl example including `language`

- [x] **14.2** Update `docs/technical/architecture.md`:
  - Add `/person/:id` to routing table with purpose "Person details"
  - Note that it follows the same numeric guard, lazy loading, skeleton, inline 404, and manual retry behavior as movie/show detail routes

- [x] **14.3** Update `docs/product/04 - entry-details/requirements.md`:
  - Document that `CastCarousel` cast cards navigate to `/person/:id`
  - Note that the existing cast display remains capped and sorted by billing order

- [x] **14.4** Review `docs/product/02 - home/requirements.md` and update only if its detail-page navigation text needs a cross-reference to person pages; confirm `HS-03` still filters person search results out.

- [x] **14.5** Update `docs/reference/glossary.md` with Person, Cast member, and Filmography terms, or align these terms with existing glossary entries if equivalent terms already exist.

## Phase 15: Verification

- [x] **15.1** Run `npm run test` — all tests pass
- [x] **15.2** Run `npm run build` — no build errors
- [x] **15.3** Run `npm run type-check` — no type errors
- [x] **15.4** Run `npm run lint` — no lint errors
- [ ] **15.5** Manual verification:
  - Navigate to movie detail → click cast member → person page loads
  - Verify profile image, name, department display correctly
  - Verify biography with Read more expansion
  - Verify birth/death info displays when available
  - Verify external links open in new tabs
  - Verify filmography grid with correct sorting and deduplication
  - Verify responsive layout at all breakpoints
  - Verify skeleton loader during API fetch
  - Verify numeric missing person ID shows 404 state
  - Verify non-numeric person ID redirects home
  - Verify Retry action re-fetches after a network error
  - Verify Retry action re-fetches after a 500+ server error
  - Verify 429 rate-limit responses use automatic backoff
  - Verify changing language while on a person page re-fetches the active person details
  - Verify back navigation works from in-app and direct-entry flows
  - Verify the person route has the expected localized document title
  - Verify new public Domain, Infrastructure, and Application exports include JSDoc
