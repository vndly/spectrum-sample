# Cast Information — Implementation Plan

Feature ID: R-09

## Phase 1: Domain Layer

- [ ] **1.1** Create `src/domain/person.schema.ts` with Zod schemas:
  - `PersonDetailSchema` — id (number), name (string), biography (string), birthday (string|null), deathday (string|null), place_of_birth (string|null), profile_path (string|null), known_for_department (string), also_known_as (string[]), homepage (string|null)
  - `ExternalIdsSchema` — imdb_id (string|null), instagram_id (string|null), twitter_id (string|null)
  - `PersonCreditSchema` — id (number), title/name (string), media_type ('movie'|'tv'), character (string|null), release_date/first_air_date (string|null), poster_path (string|null), order (number|null)
  - `PersonDetailWithCreditsSchema` — extends PersonDetailSchema with combined_credits.cast (PersonCreditSchema[]) and external_ids (ExternalIdsSchema)
  - Export inferred types: `PersonDetail`, `ExternalIds`, `PersonCredit`, `PersonDetailWithCredits`

- [ ] **1.2** Create `src/domain/person.logic.ts` with pure functions:
  - `sortCreditsByDate(credits: PersonCredit[]): PersonCredit[]` — sorts descending by release_date/first_air_date, nulls last
  - `deduplicateCredits(credits: PersonCredit[]): PersonCredit[]` — removes duplicate media_id entries, keeping lowest order value
  - `formatBirthInfo(birthday: string|null, placeOfBirth: string|null): string|null` — formats as "Month DD, YYYY • City, Country" or partial
  - `formatDeathInfo(deathday: string|null): string|null` — formats as "Month DD, YYYY"
  - `hasExternalLinks(externalIds: ExternalIds): boolean` — returns true if any of imdb_id, instagram_id, twitter_id is non-null
  - `buildExternalUrl(type: 'imdb'|'instagram'|'twitter', id: string): string` — returns full external URL

## Phase 2: Domain Testing

- [ ] **2.1** Create `tests/domain/person.schema.test.ts`:
  - Test valid PersonDetailSchema parsing (covering: CI-08-01)
  - Test invalid data rejection (covering: CI-08-02)
  - Test external_ids parsing with null values (covering: CI-07-01, CI-07-02)
  - Test combined_credits parsing (covering: CI-08-03)

- [ ] **2.2** Create `tests/domain/person.logic.test.ts`:
  - Test `sortCreditsByDate` with mixed dates and nulls (covering: CI-09-01, CI-09-02)
  - Test `deduplicateCredits` keeping lowest order (covering: CI-08-04)
  - Test `formatBirthInfo` with all combinations (covering: CI-06-01, CI-06-02)
  - Test `formatDeathInfo` (covering: CI-06-03)
  - Test `hasExternalLinks` true/false cases (covering: CI-07-03)
  - Test `buildExternalUrl` for each platform (covering: CI-07-04)

- [ ] **2.3** Run `npm run test` — confirm new tests fail (test-first)

## Phase 3: Infrastructure Layer

- [ ] **3.1** Update `src/infrastructure/provider.client.ts`:
  - Add `getPersonDetails(id: number): Promise<PersonDetailWithCredits>` method
  - Endpoint: `/person/{id}?append_to_response=combined_credits,external_ids`
  - Parse response with `PersonDetailWithCreditsSchema`
  - Follow existing error handling patterns (404, 429, network errors)

## Phase 4: Infrastructure Testing

- [ ] **4.1** Create `tests/infrastructure/provider.client.person.test.ts`:
  - Test successful person fetch (covering: CI-03-01, CI-04-01)
  - Test 404 response handling (covering: CI-12-01)
  - Test network error handling (covering: CI-12-02)
  - (implementation detail) Test Zod validation failure

- [ ] **4.2** Run `npm run test` — confirm new tests fail (test-first)

## Phase 5: Application Layer

- [ ] **5.1** Create `src/application/use-person.ts`:
  - Export `usePerson(id: Ref<number>)` composable
  - Return shape: `{ person: Ref<PersonDetailWithCredits|null>, loading: Ref<boolean>, error: Ref<Error|null>, refresh: () => void }`
  - On mount: fetch person details, set loading states
  - On error: set error ref, trigger toast via `useToast()`
  - Watch id ref for route changes, re-fetch on change

## Phase 6: Application Testing

- [ ] **6.1** Create `tests/application/use-person.test.ts`:
  - Test loading state transitions: idle → loading → success (covering: CI-11-01)
  - Test loading state transitions: idle → loading → error (covering: CI-12-03)
  - Test refresh re-fetches data (implementation detail)
  - Test id reactivity triggers new fetch (implementation detail)

- [ ] **6.2** Run `npm run test` — confirm new tests fail (test-first)

## Phase 7: Routing

- [ ] **7.1** Update `src/presentation/router.ts`:
  - Add route `{ path: '/person/:id', component: () => import('./views/person-screen.vue') }`
  - Add navigation guard: reject non-numeric `:id`, redirect to `/`
  - Place route alongside existing `/movie/:id` and `/show/:id` routes

## Phase 8: Presentation Components

- [ ] **8.1** Create `src/presentation/components/details/person-hero.vue`:
  - Props: `person: PersonDetail`
  - Display circular profile image (200×200px desktop, 160×160px mobile) with User icon fallback
  - Display name (`text-2xl font-bold text-white`) and known_for_department (`text-sm text-slate-400`)
  - Responsive layout: centered on mobile, left-aligned on desktop

- [ ] **8.2** Create `src/presentation/components/details/person-bio.vue`:
  - Props: `biography: string|null`
  - Section heading "Biography" with i18n key `person.biography`
  - Display biography text with `line-clamp-6`, "Read more" expansion button
  - Empty state: "No biography available." with i18n key `person.biographyEmpty`
  - Use `ref` to toggle expanded state

- [ ] **8.3** Create `src/presentation/components/details/person-info.vue`:
  - Props: `birthday: string|null, placeOfBirth: string|null, deathday: string|null`
  - Display formatted birth info and death info (if applicable)
  - Hide section entirely if all values null
  - i18n keys: `person.born`, `person.died`

- [ ] **8.4** Create `src/presentation/components/details/person-links.vue`:
  - Props: `externalIds: ExternalIds`
  - Display row of icon buttons: IMDB, Instagram, Twitter (using lucide-vue-next icons)
  - Only render icons for non-null IDs
  - Hide entire section if `hasExternalLinks()` returns false
  - Open links in new tab with `target="_blank" rel="noopener noreferrer"`

- [ ] **8.5** Create `src/presentation/components/details/filmography-card.vue`:
  - Props: `credit: PersonCredit`
  - Display poster thumbnail (w185 size) with placeholder fallback
  - Display title, year (or "TBA" if null), media type badge (teal for movie, violet for TV), character name
  - RouterLink to `/movie/:id` or `/show/:id` based on media_type
  - Hover state: `scale-105` transition
  - Lazy load image with `loading="lazy"`

- [ ] **8.6** Create `src/presentation/components/details/filmography-grid.vue`:
  - Props: `credits: PersonCredit[]`
  - Section heading "Filmography" with count, i18n key `person.filmography`
  - Responsive grid: 2 cols max-sm, 3 cols max-md, 4 cols max-lg, 6 cols base
  - Render `FilmographyCard` for each credit
  - Empty state: "No credits available." with i18n key `person.creditsEmpty`

- [ ] **8.7** Create `src/presentation/components/details/person-skeleton.vue`:
  - Skeleton layout matching PersonScreen structure
  - Circular profile placeholder, text lines for name/bio, grid of card skeletons
  - Use `animate-pulse` for shimmer effect

## Phase 9: Presentation View

- [ ] **9.1** Create `src/presentation/views/person-screen.vue`:
  - Use `usePerson()` composable with route param
  - Conditional rendering: skeleton (loading), error state (error), content (success)
  - Compose: PersonHero, PersonBio, PersonInfo, PersonLinks, FilmographyGrid
  - Process credits: deduplicate, then sort by date
  - Back button in header using router.back() or link to Home
  - 404 state: "Person not found" with link to Home, i18n key `person.notFound`
  - Semantic HTML: `<article>`, `<section>` elements
  - `aria-live="polite"` on loading/error regions, `role="alert"` on error

## Phase 10: CastCarousel Update

- [ ] **10.1** Update `src/presentation/components/details/cast-carousel.vue`:
  - Change cast member container from `<div>` to `<RouterLink :to="`/person/${member.id}`"`
  - Add cursor-pointer and hover styles
  - Maintain existing layout and styling

## Phase 11: Presentation Testing

- [ ] **11.1** Update `tests/presentation/components/details/cast-carousel.test.ts`:
  - Test click on cast member navigates to `/person/:id` (covering: CI-01-01)
  - Test RouterLink renders with correct path (covering: CI-01-02)

- [ ] **11.2** Create `tests/presentation/views/person-screen.test.ts`:
  - Test skeleton displays during loading (covering: CI-11-02)
  - Test person data renders correctly (covering: CI-03-02, CI-04-02, CI-05-01, CI-08-05)
  - Test 404 state displays (covering: CI-12-04)
  - Test filmography grid renders with sorted, deduplicated credits (covering: CI-08-06, CI-09-03)
  - Test empty filmography message (covering: CI-14-01)
  - Test external links render only for available IDs (covering: CI-07-05)
  - Test back button exists (covering: CI-13-01)

- [ ] **11.3** Run `npm run test` — confirm new tests fail (test-first)

## Phase 12: i18n

- [ ] **12.1** Add i18n keys to `src/presentation/i18n/locales/en.json`:
  - `person.biography`, `person.biographyEmpty`, `person.readMore`, `person.readLess`
  - `person.born`, `person.died`
  - `person.filmography`, `person.creditsEmpty`
  - `person.notFound`, `person.backToHome`

- [ ] **12.2** Add corresponding keys to `es.json` and `fr.json`

## Phase 13: Implementation

- [ ] **13.1** Implement Domain layer (person.schema.ts, person.logic.ts)
- [ ] **13.2** Run `npm run test` — domain tests should pass
- [ ] **13.3** Implement Infrastructure layer (provider.client.ts update)
- [ ] **13.4** Run `npm run test` — infrastructure tests should pass
- [ ] **13.5** Implement Application layer (use-person.ts)
- [ ] **13.6** Run `npm run test` — application tests should pass
- [ ] **13.7** Implement Routing (router.ts update)
- [ ] **13.8** Implement Presentation components (person-hero, person-bio, person-info, person-links, filmography-card, filmography-grid, person-skeleton)
- [ ] **13.9** Implement Presentation view (person-screen.vue)
- [ ] **13.10** Implement CastCarousel update
- [ ] **13.11** Run `npm run test` — all tests should pass

## Phase 14: Documentation

- [ ] **14.1** Update `docs/technical/api.md`:
  - Add Person endpoint section: `GET /person/{id}` with `append_to_response=combined_credits,external_ids`
  - Document PersonDetail, PersonCredit, ExternalIds response types
  - Add curl example

- [ ] **14.2** Update `docs/technical/architecture.md`:
  - Add `/person/:id` to routing table with purpose "Person details"

## Phase 15: Verification

- [ ] **15.1** Run `npm run test` — all tests pass
- [ ] **15.2** Run `npm run build` — no build errors
- [ ] **15.3** Run `npm run check` — no type errors
- [ ] **15.4** Run `npm run lint` — no lint errors
- [ ] **15.5** Manual verification:
  - Navigate to movie detail → click cast member → person page loads
  - Verify profile image, name, department display correctly
  - Verify biography with Read more expansion
  - Verify birth/death info displays when available
  - Verify external links open in new tabs
  - Verify filmography grid with correct sorting
  - Verify responsive layout at all breakpoints
  - Verify skeleton loader during API fetch
  - Verify 404 state with invalid person ID
  - Verify back navigation works
