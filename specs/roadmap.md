# Movie and TV Show Tracker

## Screens

### Home
* Search for movies and TV shows
* Trending/popular sections
* Open the details of an entry
* Filters on various fields
* Grid vs. list view
* **Key components:** SearchBar, TrendingCarousel, PopularGrid, MovieCard

### Library
* Toggle between watchlist and watched
* View details of movies in your library
* Open the details of an entry
* **Key components:** TabToggle (watchlist/watched/lists), FilterBar, SortDropdown, EntryGrid

### Entry details
* Properties
  * Name
  * Sinopsis
  * Image (or images)
  * Type? (movie/tv)
  * Year
  * Languages
  * Duration
  * Genres
  * Directors
  * Writers
  * Cast
  * Peggy rating
  * IMDB rating and open IMDB page
  * Box office
  * Tech specs
  * Favorite?
  * 5 star rating
  * In watchlist / watched / none
  * Streaming availability
  * Watch trailer
* Share link
* **Key components:** HeroBackdrop, MetadataPanel, CastCarousel, TrailerEmbed, StreamingBadges, RatingStars

### Release Calendar Sync
* A calendar view with upcoming release dates for movies
* **Key components:** CalendarGrid, ReleaseCard

### Recommendations
* "If you liked X" suggestions + trending/popular sections (both powered by TMDB endpoints)

### Stats
* Overview charts and lists for the user's library
* **Key components:** StatCards, GenreChart, MonthlyChart, TopRated list

### Settings
* Theme toggle (dark/light)
* Language
* Default home screen section (trending vs. popular vs. search)
* Import/export library as JSON (could live here instead of a separate screen)
* Preferred region for streaming availability (e.g. US, UK, ES)

## APIs
https://developer.themoviedb.org/docs/getting-started
https://www.omdbapi.com
https://imdbapi.dev

### Order
1. Menu scaffold and navigation
2. Home screen: search
3. Entry details: basic info and images
4. Home screen: trending and popular sections 
5. Library: watchlist and watched tabs
6. Home screen: filters and grid/list view
7. Library: sort and filter within the user's saved items
8. Stats: charts and insights over the library (needs library data first)
9. Recommendations: "if you liked X" + TMDB suggestions
10. Release Calendar Sync: calendar view for upcoming releases
11. Settings: theme, language, region, import/export