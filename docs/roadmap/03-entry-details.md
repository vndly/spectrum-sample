# Entry Details

* Properties
  * Name
  * Synopsis
  * Image (or images)
  * Type? (movie/tv)
  * Year
  * Languages
  * Duration
  * Genres
  * Directors
  * Writers
  * Cast
  * TMDB rating
  * IMDB link (via `imdb_id`)
  * Box office (revenue/budget from TMDB)
  * Favorite?
  * 5 star rating
  * In watchlist / watched / none
  * Streaming availability
  * Watch trailer
* Share link — uses the Web Share API when available; falls back to copying the entry detail URL (`/movie/:id` or `/tv/:id`) to the clipboard. Displays a success toast on copy.
* **Key components:** HeroBackdrop, MetadataPanel, CastCarousel, TrailerEmbed, StreamingBadges, RatingStars

## Acceptance Criteria

- [ ] `HeroBackdrop` displays the backdrop image with gradient overlay and title text
- [ ] `MetadataPanel` shows year, runtime/seasons, genres, directors, writers, and spoken languages
- [ ] `CastCarousel` renders a horizontally scrollable list of cast members with headshots and character names
- [ ] `TrailerEmbed` plays the official YouTube trailer inline via the `videos` relation
- [ ] `StreamingBadges` displays available streaming providers for the user's region via `watch/providers`
- [ ] `RatingStars` allows the user to set a 1–5 star personal rating, persisted in localStorage
- [ ] Favorite toggle persists state in localStorage
- [ ] Watchlist / Watched / None status toggle persists in localStorage
- [ ] IMDB link opens the correct IMDB page using `imdb_id`
- [ ] Share button uses the Web Share API when supported; falls back to clipboard copy with a success toast
- [ ] Loading skeleton matches the detail layout while the API request is in flight
- [ ] API errors display an inline error message with a Retry action

## Key Decisions

* **Single API call with `append_to_response`** — credits, videos, watch/providers, and release_dates are fetched in one request to minimize latency
* **Web Share API with clipboard fallback** — provides native sharing on supported devices without requiring a third-party library
