---
id: R-08
title: Recommendations
status: approved
importance: medium
type: functional
tags: [recommendations, api, home, discovery, library]
---

## Intent

Enhance content discovery by providing personalized "Because you liked {title}" recommendations based on the user's library entries, with a fallback to trending and popular content when no library data is available.

## Context & Background

### Problem Statement

Users who have built a library of movies and TV shows often look for similar content to watch next. Currently, the home screen only shows general trending and popular titles, which may not align with the user's specific tastes. By leveraging the user's existing library (ratings and watch history), the app can provide more relevant suggestions, increasing user engagement and utility.

### User Stories

- As a user, I want to see movies and TV shows similar to the ones I've highly rated so that I can discover new content I'm likely to enjoy.
- As a user, I want to see recommendations based on my recently watched titles so that I can find related series or films.
- As a user, I want the recommendations to be clearly labeled so that I understand why they are being suggested to me.
- As a user, I want the recommendations to exclude items already in my library so that I don't see content I've already seen or tracked.
- As a user, I want to see trending and popular content if I haven't added anything to my library yet so that the home screen isn't empty.

### Personas

- **Collector**: Has a large library with many ratings; expects highly personalized recommendations based on their curated taste.
- **New User**: Has an empty library; expects a high-quality "cold start" experience with trending and popular content.
- **Binge Watcher**: Frequently adds items to their library and wants fresh suggestions based on their latest activity.

### Dependencies

- **R-02**: Home screen (Recommendations are integrated into the discovery flow).
- **R-03**: Library (Requires access to library entries for seeding).
- **TMDB API**: Provides the recommendations endpoint (`/movie/{id}/recommendations` and `/tv/{id}/recommendations`).

## Decisions

| Decision          | Choice                                | Rationale                                                                                                                                            |
| :---------------- | :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seed selection    | Top 5 highest-rated, then most recent | Highly rated entries are better taste signals than recency alone. If ratings are tied or missing, recency serves as a secondary signal.              |
| Deduplication     | Client-side across all seeds          | API may return the same movie for different seeds (e.g., two similar sci-fi movies both recommending a third one). Deduplicating ensures a clean UI. |
| Library exclusion | Client-side filtering                 | Users should not be recommended titles they already have in their library (watchlist, watched, or favorited).                                        |
| Placement         | Above Trending/Popular                | Personalized content is more relevant and should be prioritized in the discovery hierarchy.                                                          |

## Scope

### In Scope

- Logic to select up to 5 seed entries from the library based on rating and recency.
- Integration with TMDB recommendations API for both movies and TV shows.
- Deduplication of recommendations across multiple seeds and filtering against user library.
- "Because you liked {title}" carousel sections on the home screen.
- Independent loading and error states for each recommendation section.
- Fallback to Trending/Popular when the library is empty or lacks suitable seeds.

### Out of Scope

- Recommendations based on genres alone (without seed items).
- "Similar titles" on the detail page (covered by R-02 "Out of Scope" but could be a future extension).
- Machine learning-based collaborative filtering (out of scope for local-first client).
- Infinite scrolling for recommendation carousels.

## Functional Requirements

| ID    | Requirement             | Description                                                                                                                                                                                                                                                            | Priority |
| :---- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| RE-01 | Seed Selection Logic    | The app SHALL select up to 5 seed entries from the library. Prioritize highest `rating` first. For ties or unrated items, prioritize the most recent `addedAt` or the _latest_ date in the `watchDates` array. If library has < 5 entries, use all available as seeds. | P0       |
| RE-02 | Recommendations API     | For each seed entry, the app SHALL call `GET /movie/{id}/recommendations` or `GET /tv/{id}/recommendations` based on the seed's `mediaType`.                                                                                                                           | P0       |
| RE-03 | Deduplication           | The app SHALL deduplicate recommendations across all seed results using the provider `id`. A title SHALL NOT appear twice across the recommendations sections. Deduplication does NOT apply against the Trending/Popular sections.                                     | P0       |
| RE-04 | Library Exclusion       | The app SHALL filter out any recommendation that exists in the user's library (matching by provider `id`).                                                                                                                                                             | P0       |
| RE-05 | Labeled Sections        | Each recommendation group SHALL be displayed in a carousel labeled "Because you liked {title}", where `{title}` is the title of the seed entry. These sections SHALL be grouped under a "Recommended for You" heading.                                                 | P0       |
| RE-06 | Home Screen Integration | Recommendations SHALL be displayed on the Home screen, positioned above the "Trending" and "Popular" sections.                                                                                                                                                         | P0       |
| RE-07 | Fallback Behavior       | If the library is empty or no seeds can be determined, the app SHALL display the standard "Trending" and "Popular" sections without the "Recommended for You" heading.                                                                                                 | P0       |
| RE-08 | Independent States      | Each recommendation carousel SHALL handle its own loading and error states. A failure to fetch recommendations for one seed SHALL NOT prevent others from displaying.                                                                                                  | P1       |
| RE-09 | Empty Result Handling   | If a seed entry returns no recommendations from the API, that specific section SHALL NOT be rendered.                                                                                                                                                                  | P1       |

## Non-Functional Requirements

### Performance

- **Seed Processing**: Selecting seeds from the library SHALL complete in < 50ms.
- **API Parallelism**: Recommendation requests for multiple seeds SHALL be fired in parallel.
- **UI Responsiveness**: The home screen SHALL remain interactive while recommendations are loading; scrolling and navigation SHALL NOT be blocked.

### Testing

- **Unit Tests**: Logic for seed selection and deduplication must be unit tested.
- **Mocking**: API responses must be mocked for various scenarios (no results, error, overlapping results).
- **Transitions**: The transition between loading skeletons and content SHALL be smooth (200-300ms fade).

## UI/UX Specs

- Recommendations sections SHALL use the same `TrendingCarousel` or a similar horizontal scroll component for consistency.
- Labels SHALL use a consistent heading style (e.g., `h3` for seed labels, `h2` for "Recommended for You").
- Skeleton loaders SHALL match the MovieCard dimensions and layout.

## Risks & Assumptions

- **Risk**: API Rate Limits. Fetching 5 recommendation sets in parallel plus trending/popular might hit TMDB limits. _Mitigation_: Use existing retry logic and consider lazy-loading recommendation carousels only when they enter the viewport.
- **Assumption**: Users prefer seeing recommendations based on their library over general trending content.
- **Assumption**: `LibraryEntry` contains enough data (ratings/dates) to form a meaningful seed.

## Acceptance Criteria

- [ ] Up to 5 seed entries are selected from the library (highest rated first, then most recently watched/added).
- [ ] Recommendation carousels are labeled "Because you liked {title}".
- [ ] Results are deduplicated across all seeds.
- [ ] Library entries are excluded from recommendations.
- [ ] Home screen displays recommendations above trending/popular content.
- [ ] If the library is empty, only trending/popular content is shown.
- [ ] Individual carousels show loading skeletons and handle errors gracefully.
- [ ] API rate limits (429) are handled with existing retry logic and surface a toast if all retries fail.
