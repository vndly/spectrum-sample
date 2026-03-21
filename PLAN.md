# Documentation Fixes Plan

## Phase 2: Missing Documentation

### 2.1 New file: `docs/technical/setup.md`
Covers:
- Prerequisites (Node.js version, package manager)
- Install dependencies
- Environment configuration (`.env` file with `VITE_TMDB_TOKEN`, how to get a TMDB API key)
- Dev server, build, lint, test commands
- Add entry to `docs/technical/index.md`

### 2.2 New file: `docs/technical/deployment.md`
Covers:
- Firebase Hosting project setup
- Build and deploy commands
- Add entry to `docs/technical/index.md`

### 2.3 Add cache strategy section to `docs/technical/architecture.md`
Covers:
- TTL values per data type
- Cache key format
- Eviction strategy

### 2.4 Add circuit breaker section to `docs/technical/architecture.md`
Covers:
- Failure threshold
- Cooldown period
- Recovery behavior

### 2.5 Add schema migration section to `docs/technical/data-model.md`
Covers:
- How to add a new migration
- What triggers migration on startup
- Version bump rules

### 2.6 Add custom list CRUD to roadmap
- Either expand `docs/roadmap/05-library-watchlist-and-watched.md` or create a new phase for custom list management

### 2.7 Add import/export spec to data-model or settings roadmap
- Define export JSON format
- Define import validation rules

### 2.8 New file: `docs/technical/testing.md`
Covers:
- How to run tests
- Coverage expectations
- Test file structure examples
- Add entry to `docs/technical/index.md`
