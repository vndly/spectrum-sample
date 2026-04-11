# API: Stats: Insights and Overview (R-07)

## Overview

The Stats feature does not introduce new external API endpoints. It utilizes the existing TMDB metadata already fetched by the search and detail views.

## Metadata Consumption

The `runtime` field is sourced from:

- **Movies**: `MovieDetail.runtime` (minutes).
- **TV Shows**: `ShowDetail.episode_run_time[0]` (minutes - the first element is used as the average episode duration for simplification in this initial version).

This data is persisted into the local `LibraryEntry` snapshot.
