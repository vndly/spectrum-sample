# Settings

* Theme toggle (dark/light)
* Language (controls both UI translations via vue-i18n and media provider API content; supports en, es, fr)
* Default home screen section (trending vs. popular vs. search)
* Import/export library as JSON (could live here instead of a separate screen)
* Preferred region for streaming availability (e.g. US, UK, ES)

## Import / Export Specification

### Export Format

Export produces a single JSON file containing the full user data set (no cached API responses):

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

- `exportVersion` — Tracks the export format itself, independent of `schemaVersion`.
- `exportedAt` — ISO timestamp of when the export was created.
- The remaining keys mirror the localStorage schema (see [Data Model](../technical/data-model.md#localstorage-schema)).
- All top-level keys are always present. Empty collections use `{}` for objects and `[]` for arrays.

### Import Validation Rules

1. Parse the file as JSON; reject if malformed.
2. Validate the top-level structure with a Zod schema (`exportVersion`, `schemaVersion`, `library`, `lists`, `tags`, `settings` all present and correctly typed).
3. Validate each `LibraryEntry` and `CustomList` individually with their Zod schemas; collect per-entry errors.
4. If `schemaVersion` is older than the current version, run schema migrations before importing.
5. Reject entries that fail validation; report skipped entries to the user with reasons.

### Merge vs. Overwrite

The user chooses one of two strategies before importing:

- **Merge** — Existing data is kept as the base. Imported data is layered on top:
  - **Library entries** — Added by provider ID. If a duplicate exists, the user is prompted to keep the existing entry or replace it.
  - **Custom lists** — Added by UUID. If a list with the same UUID exists, the imported version replaces it.
  - **Tags** — Union-merged (existing tags are kept, new tags are appended).
  - **Settings** — Existing settings are kept; imported settings are ignored.
- **Overwrite** — All existing user data is replaced with the imported data. A confirmation dialog warns that this is destructive.
