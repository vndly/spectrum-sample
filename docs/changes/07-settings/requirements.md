# Requirements - Settings

- **ID**: FEAT-07
- **Title**: User Settings & Data Management
- **Status**: draft
- **Importance**: high
- **Type**: functional
- **Tags**: [settings, preferences, data, i18n]

## Intent

Empower users to customize their experience (theme, language, region) and manage their data (import/export).

## Context & Background

### Problem Statement
Users have different preferences for UI appearance and content language. They also need a way to backup and restore their library data.

### User Stories
- As a user, I want to switch between dark and light themes.
- As a multilingual user, I want to change the app language.
- As a user, I want to set my region for accurate release dates and streaming info.
- As a power user, I want to export my library to a file and import it on another device.

## Scope

### In Scope
- Settings screen with sections for:
    - Appearance (Theme toggle).
    - Content & UI (Language select, Preferred Region).
    - Default View (Home section select).
    - Data Management (Import/Export buttons).
- Implementation of the Import/Export logic.
- Integration with existing `useSettings` and `storageService`.

### Out of Scope
- Automatic cloud sync.
- Multiple user profiles.

## Functional Requirements

| ID | Requirement | Description | Priority |
|---|---|---|---|
| FR-07-01 | Theme Toggle | Switch between dark and light modes. | P0 |
| FR-07-02 | Language Select | Change UI and API content language (en, es, fr). | P0 |
| FR-07-03 | Region Select | Set preferred region for streaming and releases. | P1 |
| FR-07-04 | Home Section | Select default section for the Home screen (trending, popular, search). | P2 |
| FR-07-05 | Export Data | Download a JSON file containing all user data. | P1 |
| FR-07-06 | Import Data | Upload a JSON file to restore user data (Merge or Overwrite). | P1 |
| FR-07-07 | Validation | Validate imported JSON schema and version. | P0 |

## Import / Export Specification

### Export Format

The export produces a single JSON file containing the full user data set:

```json
{
  "exportVersion": 1,
  "exportedAt": "2026-03-21T12:00:00.000Z",
  "schemaVersion": 1,
  "library": { "550": { "...LibraryEntry" } },
  "lists": { "uuid-1": { "...CustomList" } },
  "tags": ["horror", "90s"],
  "settings": { "...Settings" }
}
```

- `exportVersion`: Tracks the format version.
- `schemaVersion`: Tracks the data schema version (for migrations).

### Import Validation Rules

1. Parse as JSON; reject if malformed.
2. Validate top-level structure with Zod.
3. Validate each `LibraryEntry` and `CustomList` individually.
4. Run schema migrations if `schemaVersion` is old.
5. Report skipped entries with reasons.

### Merge vs. Overwrite

- **Merge**: Existing data kept. Imported library entries and lists replace duplicates (by ID/UUID). Tags are unioned. Settings are ignored.
- **Overwrite**: ALL existing data is replaced. Requires a destructive action confirmation.

## Non-Functional Requirements

### Security
- Validate all imported data with Zod schemas before applying to localStorage.

### UI/UX
- Settings should be easily accessible from the sidebar.
- Confirmation dialog for destructive actions (Overwrite import).

## Acceptance Criteria

- [ ] Theme toggle updates the app's visual style instantly.
- [ ] Language select updates UI translations and re-fetches API data if needed.
- [ ] Region select is used as a parameter in relevant API calls (e.g., calendar).
- [ ] Export produces a valid JSON file as specified in the roadmap.
- [ ] Import correctly handles "Merge" and "Overwrite" strategies.
- [ ] Import rejects malformed or invalid JSON.
