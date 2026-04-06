# Scenarios: Home Screen

## Contents

### Search & Browse Base

- **[HS-01: Debounced Search Input](./HS-01.feature)**: Debounce user input by 300 ms.
- **[HS-02: Multi-Search API Call](./HS-02.feature)**: Call /search/multi with query and language.
- **[HS-03: Person Result Filtering](./HS-03.feature)**: Filter out person results from search.
- **[HS-04: Search Results Display](./HS-04.feature)**: Display results in a responsive grid.
- **[HS-05: Result Navigation](./HS-05.feature)**: Navigate to details on card click.
- **[HS-06: Empty State](./HS-06.feature)**: Show message when no results found.
- **[HS-07: Loading Skeleton](./HS-07.feature)**: Show skeletons during API call.
- **[HS-08: Error Handling](./HS-08.feature)**: Show inline error with retry on failure.
- **[HS-09: Browse Mode](./HS-09.feature)**: Display browse sections when query empty.
- **[HS-10: Search Mode](./HS-10.feature)**: Display search results when query non-empty.
- **[HS-11: Mode Transition](./HS-11.feature)**: Smooth transition between modes.
- **[HB-01: Trending Data Fetch](./HB-01.feature)**: Fetch and display trending items.

### Filtering & View Toggle

- **[HF-01: Genre Multi-Select](./HF-01.feature)**: Filter browse results by multiple genres.
- **[HF-02: Media Type Toggle](./HF-02.feature)**: Filter browse results by media type (Movies/TV).
- **[HF-03: Year Range Inputs](./HF-03.feature)**: Filter browse results by a range of years.
- **[HF-04: Composite Filtering](./HF-04.feature)**: Apply multiple filters using AND logic.
- **[HF-05: Client-Side Filtering](./HF-05.feature)**: Ensure filtering happens without extra API calls.
- **[HF-06: Layout Toggle](./HF-06.feature)**: Switch between grid and list layouts.
- **[HF-07: Preference Persistence](./HF-07.feature)**: Ensure layout choice survives page reload.
- **[HF-08: URL Sync](./HF-08.feature)**: Reflect and restore filter state via URL query parameters.
- **[HF-09: Clear All Filters](./HF-09.feature)**: Reset filters manually or on search.

### Entry Details

- **[ED-01: Hero Backdrop](./ED-01.feature)**: Display backdrop with gradient and title.
- **[ED-02: Metadata Panel](./ED-02.feature)**: Display year, runtime, genres, etc.
- **[ED-03: Cast Carousel](./ED-03.feature)**: Display horizontally scrollable cast list.
- **[ED-04: Trailer Embed](./ED-04.feature)**: Play YouTube trailer inline.
- **[ED-05: Streaming Badges](./ED-05.feature)**: Display streaming providers by region.
- **[ED-06: Rating Stars](./ED-06.feature)**: Set and persist personal 0-5 star rating.
- **[ED-07: Favorite Toggle](./ED-07.feature)**: Toggle and persist favorite status.
- **[ED-08: Watch Status](./ED-08.feature)**: Set and persist watch status (watchlist/watched).
- **[ED-09: IMDB Link](./ED-09.feature)**: Open external IMDB page.
- **[ED-10: Share Button](./ED-10.feature)**: Share title via Web Share API or clipboard.
- **[ED-11: Loading Skeleton](./ED-11.feature)**: Show skeleton matching detail layout.
- **[ED-12: Error Handling](./ED-12.feature)**: Show inline error with retry.
- **[ED-13: TMDB Rating](./ED-13.feature)**: Display vote average badge.
- **[ED-14: Tagline](./ED-14.feature)**: Display tagline below title.
- **[ED-15: Synopsis](./ED-15.feature)**: Display full overview text.
- **[ED-16: Box Office Data](./ED-16.feature)**: Display budget and revenue for movies.
