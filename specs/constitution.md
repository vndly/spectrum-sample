# Project Constitution: Aurora Framework

## 1. Mission Statement
To provide a lightweight, type-safe interface for distributed systems that prioritizes developer ergonomics without sacrificing performance.

## 2. Core Principles
* **Predictability over Magic:** Explicit configuration is preferred over "magic" background behavior.
* **Performance is a Feature:** No feature shall be merged if it introduces a regression of >5% in latency.
* **Documentation as Code:** If a feature isn't documented in the SpecKit tree, it doesn't exist.

## 3. Technical Standards

### 3.1 Language & Tooling
* **Primary Language:** TypeScript 5.x+
* **Strict Mode:** Always enabled. No `any` types allowed without a suppressed lint rule and a documented reason.
* **Testing:** Minimum 80% branch coverage for all PRs.

### 3.2 Architectural Patterns
* We follow a **Modular Monolith** structure. 
* All external API calls must be wrapped in a Circuit Breaker pattern.

## 4. Decision Making (The RFC Process)
Significant changes to the API or architecture require a **Request for Comments (RFC)**:
1.  **Proposal:** Draft a `.md` file in the `/rfcs` directory.
2.  **Review:** Open a PR for 7 days.
3.  **Resolution:** Requires approval from at least two "Maintainers" (listed in `CODEOWNERS`).

## 5. Contribution & Conduct
* **Civility:** We follow the Contributor Covenant.
* **Commit Messages:** Must follow [Conventional Commits](https://www.conventionalcommits.org/).

**API:** TMDB (themoviedb.org) — richest free API with images, trailers, streaming, trending, and recommendation endpoints.
**Visual style:** Dark cinematic — immersive dark backgrounds, hero images, inspired by mockups `bbb.png` and `eee.png`.
**Storage:** Local only — all user data in localStorage (watchlist, ratings, lists, tags, watch history).

## Implementation Order
1. **Project setup** — Vite + Vue 3 + TypeScript + Tailwind, dark theme config
2. **TMDB service** — API client with circuit breaker + caching layer
3. **Storage service** — typed localStorage wrapper
4. **Home screen** — search + trending/popular
5. **Details screen** — full entry view with hero backdrop
6. **Library screen** — watchlist/watched + add/remove + rating
7. **Custom lists & tags** — CRUD for lists, tag management
8. **Stats dashboard** — charts and computed stats from library data
9. **Release calendar** — upcoming releases view
10. **Recommendations** — TMDB similar/recommended endpoints
11. **Import/export** — JSON download/upload with validation
12. **Polish** — transitions, loading states, responsive design, keyboard shortcuts

## Tech Stack
- **Framework:** Vue 3 + TypeScript (Composition API + `<script setup>`)
- **Routing:** Vue Router
- **Styling:** Tailwind CSS with dark cinematic theme
- **Storage:** localStorage with a typed composable wrapper
- **API:** TMDB REST API with circuit breaker pattern (per constitution)
- **Charts:** Chart.js + vue-chartjs for stats dashboard
- **Build:** Vite
- **API Key:** User needs to sign up at themoviedb.org — app will read from `.env` (`VITE_TMDB_API_KEY`)

---

## Architecture

### Data Layer
- `StorageService` — typed localStorage wrapper with JSON serialization, handles migration
- `TMDBService` — API client with circuit breaker, response caching (cache in localStorage to reduce API calls)
- Models: `Movie`, `TVShow`, `LibraryEntry` (user data: rating, watchlist status, lists, tags)

### Key Screens & Components
| Screen | Key Components |
|--------|---------------|
| Home | SearchBar, TrendingCarousel, PopularGrid, MovieCard |
| Library | TabToggle (watchlist/watched/lists), FilterBar, SortDropdown, EntryGrid |
| Details | HeroBackdrop, MetadataPanel, CastCarousel, TrailerEmbed, StreamingBadges, RatingStars |
| Calendar | CalendarGrid, ReleaseCard |
| Stats | StatCards, GenreChart, MonthlyChart, TopRated list |

### localStorage Schema
```json
{
  "library": {
    "[tmdb_id]": {
      "tmdbId": number,
      "mediaType": "movie" | "tv",
      "status": "watchlist" | "watched" | "none",
      "rating": 0-5,
      "favorite": boolean,
      "lists": ["list-id-1"],
      "tags": ["tag1", "tag2"],
      "notes": "",
      "watchDates": ["2026-03-08"],
      "addedAt": "ISO date",
      "cachedData": { /* TMDB response snapshot */ }
    }
  },
  "lists": {
    "[list-id]": { "name": "...", "createdAt": "..." }
  },
  "tags": ["tag1", "tag2"],
  "settings": { "theme": "dark" }
}
```