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

- Phase 00 (Setup) complete — vue-i18n installed, locale files exist with `app.title` key.

## Decisions

| Decision                          | Choice                                                | Rationale                                                                                                                                                                                                             |
| :-------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Namespace pattern for shared keys | `common.*` (e.g., `common.error.*`, `common.empty.*`) | Distinguishes global reusable strings from feature-scoped keys (e.g., `library.empty.title`). Keeps shared error and empty state text under a single top-level namespace rather than scattering across feature areas. |

## Scope

### In Scope

- Add `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` keys to `en.json`, `es.json`, `fr.json`.

### Out of Scope

- Vue component creation or modification.
- vue-i18n instance configuration or locale switching logic.
- i18n keys beyond the scaffolding namespaces listed above (e.g., `library.*`, `details.*`).

## Functional Requirements

| ID    | Requirement | Description                                                                                                                                                                                                                                | Priority |
| :---- | :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-12 | i18n keys   | Navigation labels (`nav.*`), page titles (`page.*.title`), empty state text (`common.empty.*`), error text (`common.error.*`), and toast labels (`toast.*`) added to en.json, es.json, fr.json. See plan.md for the complete key manifest. | P0       |

## Non-Functional Requirements

### Key Structure Compliance

- **camelCase nesting:** All key paths follow the camelCase nested structure defined in [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n).

## Acceptance Criteria

- [ ] All three locale files (`en.json`, `es.json`, `fr.json`) contain the new key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
- [ ] All three files have identical key paths
- [ ] All translation values are non-empty strings in all three files
- [ ] Existing `app.title` key is preserved in all three files
- [ ] All locale files are valid JSON after modification
- [ ] All key paths follow camelCase nested structure per conventions.md Section 11
