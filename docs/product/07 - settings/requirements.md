# Requirements - Settings

- **ID**: FEAT-07
- **Title**: User Settings & Data Management
- **Status**: released
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

### Dependencies

- **R-01a: App Scaffolding**: Provides the sidebar/navigation and global layouts.
- **02-home: Home Screen**: Uses the 'Home Section' and 'Layout Mode' settings.
- **R-05: Library Management: Sorting and Filtering**: Provides the data (library entries and tags) for import/export.
- **FEAT-06: Release Calendar Sync**: Uses the 'Region' setting for filtering.

## Decisions

| Decision         | Choice          | Rationale                                                                      |
| ---------------- | --------------- | ------------------------------------------------------------------------------ |
| Data Portability | JSON Format     | Human-readable, native to JS, and easy to validate with Zod.                   |
| Storage Strategy | localStorage    | Simple, client-side only, and fits the current project's offline-first nature. |
| Import Strategy  | Merge/Overwrite | Gives users control over how they want to handle existing data.                |

## Scope

### In Scope

- Settings screen with sections for:
  - Appearance (Theme toggle, Layout Mode: grid vs list).
  - Content & UI (Language select, Preferred Region).
  - Default View (Home section select).
  - Data Management (Import/Export buttons).
- Implementation of the Import/Export logic.
- Integration with existing `useSettings` and `storageService`.

### Out of Scope

- Automatic cloud sync.
- Multiple user profiles.

## Functional Requirements

| ID       | Requirement     | Description                                                                                                                                 | Priority |
| -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-07-01 | Theme Toggle    | Switch between dark and light modes.                                                                                                        | P0       |
| FR-07-02 | Language Select | Change UI and API content language (en, es, fr). Triggers a re-fetch of the current page of active view metadata (e.g., trending, popular). | P0       |
| FR-07-03 | Region Select   | Set preferred region for streaming and releases.                                                                                            | P1       |
| FR-07-04 | Home Section    | Select default section for the Home screen (trending, popular, search).                                                                     | P2       |
| FR-07-05 | Export Data     | Download a JSON file containing all user data.                                                                                              | P1       |
| FR-07-06 | Import Data     | Upload a JSON file to restore user data (Merge or Overwrite).                                                                               | P1       |
| FR-07-07 | Validation      | Validate imported JSON structure (export version) and internal data schemas (schema version).                                               | P0       |
| FR-07-08 | Layout Mode     | Select preferred layout for grids and lists (grid vs list). Updates views immediately without re-fetching data.                             | P0       |

## Import / Export Specification

### Export Format

The export produces a single JSON file containing the full user data set:

```json
{
  "exportVersion": 1,
  "exportedAt": "2026-03-21T12:00:00.000Z",
  "schemaVersion": 1,
  "library": { "550": { "...LibraryEntry" } },
  "tags": ["horror", "90s"],
  "settings": { "...Settings" }
}
```

- `exportVersion`: Tracks the format version.
- `schemaVersion`: Tracks the data schema version (for migrations).

### Import Validation Rules

1. Parse as JSON; reject if malformed.
2. Validate top-level structure with Zod.
3. Validate each `LibraryEntry` individually.
4. Run schema migrations if `schemaVersion` is old.
5. Report skipped entries with reasons.

### Merge vs. Overwrite

- **Merge**: Existing data kept. Imported library entries replace duplicates by ID. Tags are unioned. Settings are ignored.
- **Overwrite**: ALL existing data is replaced. Requires a destructive action confirmation.

## Non-Functional Requirements

### Security

- **NFR-07-01 (Data Integrity)**: Validate all imported data with Zod schemas before applying to localStorage.
- **NFR-07-02 (Malicious Payloads)**: Sanitize any user-provided names or tags to prevent XSS.

### UI/UX

- **NFR-07-03 (Navigation)**: Settings should be easily accessible from the primary sidebar navigation.
- **NFR-07-04 (Destruction Safety)**: Confirmation dialog for destructive actions (Overwrite import).

## Constraints

- **Data Size**: The exported JSON file must stay within the 5MB browser `localStorage` limit.
- **Persistence**: All settings changes must persist across page reloads and browser sessions.

## Risks & Assumptions

### Risks

- **Data Loss (High)**: Users might accidentally overwrite their library during import. _Mitigation_: Forced JSON download or local snapshot backup before overwrite.
- **Schema Drift (Medium)**: Export files from old versions might be incompatible. _Mitigation_: Version-based migration logic in import.

### Assumptions

- Users understand that "Overwrite" is permanent.
- Browser storage limits (5MB) are sufficient for library exports.

## Acceptance Criteria

- [ ] Theme toggle updates the app's visual style within 100ms without a page reload.
- [ ] Layout Mode (grid vs list) updates library and search views immediately (within 100ms) without re-fetching data.
- [ ] Language select updates UI translations and triggers a refresh of active view metadata.
- [ ] Region select is used as a parameter in relevant API calls (e.g., calendar).
- [ ] Export produces a valid JSON file as specified.
- [ ] Import correctly handles "Merge" and "Overwrite" strategies.
- [ ] Import rejects malformed or invalid JSON.
- [ ] Import validation fails if version is unsupported or schema is invalid (NFR-07-01).
- [ ] Sanitization logic prevents XSS from malicious payloads in imported names (NFR-07-02).
- [ ] Settings icon is visible and functional in the primary sidebar (NFR-07-03).
- [ ] Overwrite import requires a secondary confirmation (NFR-07-04).
- [ ] Default home section selection persists and is applied on the next app load (FR-07-04).
