# Plan - User Settings & Data Management

Implementation plan for user settings and import/export functionality.

## Phase 1: Infrastructure Layer (Data Portability)

- [ ] **Step 1.1 (Test-First)**: Create `tests/infrastructure/storage.service.import-export.test.ts` to verify `exportData` and `importData` logic.
  - covering: FR-07-05-01, FR-07-06-01, FR-07-06-02, FR-07-07-01
- [ ] **Step 1.2**: Update `src/domain/settings.schema.ts` to include `ExportDataSchema` and `ImportValidationRules`.
  - covering: FR-07-07
- [ ] **Step 1.3**: Implement `exportData()` and `importData(data: unknown, strategy: 'merge' | 'overwrite')` in `src/infrastructure/storage.service.ts`.
  - Ensure `overwrite` includes a mandatory backup export if requested (or as a safety measure).
  - covering: FR-07-05, FR-07-06

## Phase 2: Application Layer (Business Logic)

- [ ] **Step 2.1 (Test-First)**: Create `tests/application/use-settings.test.ts` for new settings methods.
  - covering: FR-07-01-01, FR-07-02-01, FR-07-03-01, FR-07-04-01
- [ ] **Step 2.2**: Update `src/application/use-settings.ts` to expose `exportLibrary`, `importLibrary`, and handlers for `layoutMode`, `region`, and `homeSection`.
  - covering: FR-07-01, FR-07-02, FR-07-03, FR-07-04

## Phase 3: Presentation Layer (UI/UX)

- [ ] **Step 3.1**: Create settings components in `src/presentation/components/settings/`.
  - [ ] `ThemeToggle.vue`: Props: `modelValue: 'light' | 'dark'`. Emits: `update:modelValue`.
  - [ ] `LayoutModeToggle.vue`: Props: `modelValue: 'grid' | 'list'`. Emits: `update:modelValue`.
  - [ ] `LanguageSelect.vue`: Props: `modelValue: string`. Options: `['en', 'es', 'fr']`.
  - [ ] `RegionSelect.vue`: Props: `modelValue: string`. Options from provider API.
  - [ ] `HomeSectionSelect.vue`: Props: `modelValue: string`. Options: `['trending', 'popular', 'search']`.
  - covering: FR-07-01, FR-07-02, FR-07-03, FR-07-04
- [ ] **Step 3.2**: Update `src/presentation/views/SettingsView.vue` to compose these components into sections.
  - Add `ImportButton` and `ExportButton` with appropriate confirmation dialogs for "Overwrite".
  - covering: FR-07-05, FR-07-06, NFR-07-04
- [ ] **Step 3.3**: Update `src/presentation/i18n/locales/` with new keys for all settings labels.
  - covering: FR-07-02

## Verification Phase

- [ ] **Automated Tests**: `npm run test` (must pass all infrastructure and application tests).
  - covering: SC-07-01-01, SC-07-02-01, SC-07-05-01, SC-07-06-01, SC-07-06-02, SC-07-07-01
- [ ] **Visual Verification**:
  - [ ] Toggle theme and verify instant CSS variable updates.
  - [ ] Change language and verify UI translates and API re-fetches.
  - [ ] Change region and verify Release Calendar filters update.
- [ ] **Data Integrity**:
  - [ ] Perform "Export", modify local data, then "Import (Merge)" and verify results.
  - [ ] Perform "Import (Overwrite)" and verify all old data is gone and new data is present.
  - [ ] Verify secondary confirmation dialog appears for "Overwrite".

## Rollback Plan

- **Code**: Revert to the previous git commit.
- **Data Safety**: Before any "Overwrite" import, the application should automatically trigger a "Safety Export" to `localStorage` (or offer a download) that can be restored if the import fails or the user regrets the decision.
