# Plan - User Settings & Data Management

Implementation plan for user settings and import/export functionality.

## Phase 1: Infrastructure Layer

- [ ] **Step 1.1**: Add `exportData()` and `importData(data: unknown, strategy: 'merge' | 'overwrite')` to `src/infrastructure/storage.service.ts`.
- [ ] **Step 1.2**: Create a Zod schema for the export format in `src/domain/settings.schema.ts` (e.g., `ExportDataSchema`).
- [ ] **Step 1.3**: Add unit tests for `exportData` and `importData` in `tests/infrastructure/storage.service.import-export.test.ts`.

## Phase 2: Application Layer

- [ ] **Step 2.1**: Update `src/application/use-settings.ts` to expose methods for exporting and importing data.
- [ ] **Step 2.2**: Update `src/application/use-settings.ts` to handle language change effect (triggering re-renders or API calls if necessary).
- [ ] **Step 2.3**: Write tests for updated `use-settings`.

## Phase 3: Presentation Layer

- [ ] **Step 3.1**: Update `src/presentation/views/settings-screen.vue` with UI components for:
    - [ ] Appearance (ThemeToggle)
    - [ ] Content & UI (LanguageSelect, RegionSelect)
    - [ ] Default View (HomeSectionSelect)
    - [ ] Data Management (ImportButton, ExportButton)
- [ ] **Step 3.2**: Add internationalization keys for all new labels and descriptions in `src/presentation/i18n/locales/en.json` (and others).
- [ ] **Step 3.3**: Implement components for specific settings like `ThemeToggle`, `LanguageSelect`, etc., if they don't exist.

## Verification Phase

- [ ] **Run all tests**: `npm run test`
- [ ] **Visual check**: Open `/settings` and verify all sections are present and functional.
- [ ] **Export/Import check**: Verify export produces a valid file and import restores data correctly.
- [ ] **Validation check**: Try importing malformed JSON and verify error message.

## Rollback Plan

Reverting to the previous state involves deleting the new settings components and removing the newly added methods from `storage.service.ts` and `use-settings.ts`.
