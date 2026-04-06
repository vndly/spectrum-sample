# Implementation: Home Screen Browse Mode

## Summary

The home screen browse mode has been implemented, providing users with trending and popular content when they are not actively searching.

## Components

### `TrendingCarousel`
- Displays the top 10 trending movies and TV shows for the day.
- Uses backdrop images with a 16:9 aspect ratio.
- Features horizontal snap-scrolling and hover scaling.
- Includes a bottom gradient overlay with the title and media type.

### `PopularGrid`
- Displays the top 20 popular movies or TV shows.
- Reuses the `MovieCard` component for consistency.
- Follows the same responsive grid layout as search results.
- Includes skeleton loading states.

## Application Logic

### `useBrowse` (Composable)
- Fetches trending, popular movies, and popular shows in parallel using `Promise.all`.
- Manages loading and error states for the entire browse view.
- Filters and limits the results as required.
- Provides a retry mechanism for failed requests.

## Infrastructure

### `provider.client.ts`
- Added `getTrending`: Fetches from `/trending/all/day`.
- Added `getPopularMovies`: Fetches from `/movie/popular` and injects `media_type: 'movie'`.
- Added `getPopularShows`: Fetches from `/tv/popular` and injects `media_type: 'tv'`.

## Testing Coverage

- **Unit Tests**:
    - `use-browse.test.ts`: Verifies parallel fetching, filtering, and error handling.
    - `provider.client.browse.test.ts`: Verifies correct API endpoints and data mapping.
- **Component Tests**:
    - `trending-carousel.test.ts`: Verifies rendering of items and navigation.
    - `popular-grid.test.ts`: Verifies rendering of items and loading states.
- **Integration Tests**:
    - `home-screen.test.ts`: Updated to verify correct mode switching and component presence.

## Decisions & Trade-offs

- **Media Type Injection**: Popular endpoints in TMDB don't return `media_type` in the result object. We inject it in the provider client to maintain consistency with `SearchResponseSchema` and the `MovieCard` component which relies on it for navigation logic.
- **Horizontal Scroll**: Used native CSS snap-scrolling for the `TrendingCarousel` for better performance and mobile feel without external libraries.
