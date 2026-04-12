# Plan - User Settings & Data Management

Implementation plan for user settings and import/export functionality.

## Phase 1: Infrastructure Layer (Data Portability)

- [ ] **Step 1.1 (Test-First)**: Create `tests/infrastructure/storage.service.import-export.test.ts` to verify `exportData` and `importData` logic.
  - covering: FR-07-05-01, FR-07-06-01, FR-07-06-02, FR-07-07-01
- [ ] **Step 1.2**: Update `src/domain/settings.schema.ts` to include `ExportDataSchema` and `ImportValidationRules`.
  - [ ] Add Zod `transform` logic for version-to-version schema migrations.
  - covering: FR-07-07
- [ ] **Step 1.3**: Implement `exportData()` and `importData(data: unknown, strategy: 'merge' | 'overwrite')` in `src/infrastructure/storage.service.ts`.
  - [ ] Ensure `overwrite` strategy automatically triggers a "Safety Export" download before applying destructive changes.
  - covering: FR-07-05, FR-07-06, NFR-07-04

## Phase 2: Application Layer (Business Logic)

- [ ] **Step 2.1 (Test-First)**: Create `tests/application/use-settings.test.ts` for new settings methods.
  - covering: FR-07-01-01, FR-07-02-01, FR-07-03-01, FR-07-04-01
- [ ] **Step 2.2**: Update `src/application/use-settings.ts` to expose `exportLibrary`, `importLibrary`, and reactive state for `layoutMode`, `region`, and `homeSection`.
  - [ ] Implement `watchEffect` for language and region changes to propagate re-fetch signals to other composables (e.g., `useBrowse`, `useCalendar`).
  - covering: FR-07-01, FR-07-02, FR-07-03, FR-07-04

## Phase 3: Presentation Layer (UI/UX)

- [ ] **Step 3.1**: Create settings components in `src/presentation/components/settings/`.
  - [ ] `ThemeToggle.vue`: Props: `modelValue: 'light' | 'dark'`. Emits: `update:modelValue`.
  - [ ] `LayoutModeToggle.vue`: Props: `modelValue: 'grid' | 'list'`. Emits: `update:modelValue`.
  - [ ] `LanguageSelect.vue`: Props: `modelValue: string`, `options: string[]`. Emits: `update:modelValue`.
  - [ ] `RegionSelect.vue`: Props: `modelValue: string`, `options: Region[]`. Emits: `update:modelValue`.
  - [ ] `HomeSectionSelect.vue`: Props: `modelValue: string`, `options: string[]`. Emits: `update:modelValue`.
  - covering: FR-07-01, FR-07-02, FR-07-03, FR-07-04
- [ ] **Step 3.2**: Create `src/presentation/views/settings-screen.vue` (following `-screen.vue` naming convention) to compose these components into sections.
  - [ ] Add `ImportButton` and `ExportButton` with secondary confirmation dialogs for "Overwrite".
  - covering: FR-07-05, FR-07-06, NFR-07-03, NFR-07-04
- [ ] **Step 3.3**: Update `src/presentation/i18n/locales/` with new keys for all settings labels and tooltips.
  - covering: FR-07-02

## Verification Phase

- [ ] **Build Check**: `npm run build` to ensure no type errors in new components.
- [ ] **Automated Tests**: `npm run test` (must pass all infrastructure and application tests).
  - covering: SC-07-01-01, SC-07-02-01, SC-07-05-01, SC-07-06-01, SC-07-06-02, SC-07-07-01
- [ ] **Visual Verification**:
  - [ ] Toggle theme and verify instant CSS variable updates (< 100ms).
  - [ ] Change language and verify UI translates and active view metadata re-fetches.
  - [ ] Change region and verify Release Calendar displays regional premieres (e.g., "Premiere: [Date] (France)").
- [ ] **Data Integrity**:
  - [ ] Perform "Export", modify local data, then "Import (Merge)" and verify union of results.
  - [ ] Perform "Import (Overwrite)", verify "Safety Export" download triggers, and verify old data is replaced.
  - [ ] Verify secondary confirmation dialog appears and correctly handles "Cancel" action.

## Rollback Plan

- **Code**: Revert to the previous git commit.
- **Data Safety**: Before any "Overwrite" import, the application triggers a "Safety Export" download. If the user regrets the decision, they can re-import this file using the "Overwrite" strategy to restore their previous state.
