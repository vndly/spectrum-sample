---
id: R-01b
title: App Scaffolding — i18n Keys
status: draft
type: infrastructure
importance: critical
tags: [i18n, localization]
---

## Intent

Add all i18n keys needed by the scaffolding phases (navigation labels, page titles, empty state text, error text, toast labels) to all three locale files.

## Context & Background

### Dependencies

- [Phase 00 (Setup)](../../product/00%20-%20setup/) complete — vue-i18n installed, locale files exist with `app.title` key.

### Dependents

- **01d (Router)** — uses `page.*.title` keys for document title.
- **01h (Error Handling)** — uses `common.error.*` and `toast.error` keys.
- **01i (Navigation Components)** — uses `nav.*` keys for sidebar and bottom nav labels.
- **01j (Placeholder Views)** — uses `page.*.title` and `common.empty.*` keys.

## Decisions

| Decision                          | Choice                                                | Rationale                                                                                                                                                                                                             |
| :-------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Namespace pattern for shared keys | `common.*` (e.g., `common.error.*`, `common.empty.*`) | Distinguishes global reusable strings from feature-scoped keys (e.g., `library.empty.title`). Keeps shared error and empty state text under a single top-level namespace rather than scattering across feature areas. |
| Page title namespace              | `page.*` (e.g., `page.home.title`, `page.settings.title`)   | Separates document/page titles from nav labels (`nav.*`). Allows titles to diverge independently (e.g., subtitles, contextual prefixes) without affecting nav items.                                                  |
| Toast action labels               | `toast.*` (e.g., `toast.dismiss`, `toast.retry`)            | Groups toast-related labels under a dedicated top-level namespace. Avoids nesting under `common.*` since toasts are a distinct UI pattern used across many features.                                                  |

## Scope

### In Scope

- Add `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` keys to `en.json`, `es.json`, `fr.json`.
- Verify that vue-i18n fallback to English works correctly for the scaffolded keys.

> **Note:** `nav.recommendations` and `page.recommendations.title` are included for forward compatibility with the Recommendations feature phase, even though no scaffolding sibling currently consumes them.

> **Follow-up:** After implementation, update [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n) to document the `page.*` namespace pattern alongside `nav.*`, `common.*`, and `toast.*`.

### Out of Scope

- Vue component creation or modification.
- vue-i18n instance configuration or locale switching logic (fallback verification for scaffolded keys is in scope).
- i18n keys beyond the scaffolding namespaces listed above (e.g., `library.*`, `details.*`).

## Functional Requirements

| ID    | Requirement | Description                                                                                                                                                                                                                                                                                                                                                                                                             | Priority |
| :---- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-12 | i18n keys   | Add 18 i18n keys across 5 namespaces to `en.json`, `es.json`, `fr.json`: **nav** — `home`, `recommendations`, `calendar`, `library`, `settings`; **page.\*.title** — `home`, `recommendations`, `calendar`, `library`, `settings`; **common.empty** — `title`, `description`; **common.error** — `title`, `description`, `reload`; **toast** — `error`, `dismiss`, `retry`. Existing `app.title` key must be preserved. | P0       |

## Non-Functional Requirements

### NFR-01b-01 — Key Structure Compliance

- **camelCase nesting:** Zero violations — every key segment in all locale JSON files must be a camelCase identifier (matching `^[a-z][a-zA-Z0-9]*$`). Verified by a unit test to be created at `tests/presentation/i18n/locale-keys.test.ts` per [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n).

## Risks & Assumptions

### Assumptions

- Phase 00 (Setup) is complete: vue-i18n is installed, `src/presentation/i18n/index.ts` exists, and all three locale files contain the `app.title` key.
- Spanish and French translations use standard UI terminology; native speaker review is deferred to a later phase.

### Risks

- **Translation accuracy** (low likelihood, low impact): Translations cannot be verified in context until downstream features (01i, 01j) render the keys in UI components. Mitigation: translations use standard, well-known UI terms.
- **Key path mismatch** (medium likelihood, medium impact): Downstream features (01d, 01h, 01i, 01j) may reference key paths that do not match the exact paths defined here. Mitigation: downstream requirements explicitly list the keys they consume; the locale key parity test catches missing keys.

## Acceptance Criteria

- [ ] All three locale files (`en.json`, `es.json`, `fr.json`) contain the new key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
- [ ] All three files have identical key paths
- [ ] All translation values are non-empty strings in all three files
- [ ] Existing `app.title` key is preserved in all three files
- [ ] All locale files are valid JSON after modification
- [ ] All key paths follow camelCase nested structure per conventions.md Section 11
- [ ] Each locale file contains exactly 18 new keys across the 5 specified namespaces
- [ ] Unit test at `tests/presentation/i18n/locale-keys.test.ts` passes, confirming all key segments match camelCase regex (NFR-01b-01)
- [ ] vue-i18n fallback to English is verified for the scaffolded keys (e.g., removing a key from `es.json` causes vue-i18n to fall back to the English value)
