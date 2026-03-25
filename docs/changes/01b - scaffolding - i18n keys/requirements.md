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

## Prerequisites

- Phase 00 (Setup) complete — vue-i18n installed, locale files exist with `app.title` key.

## Scope

- Add `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` keys to `en.json`, `es.json`, `fr.json`.

## Functional Requirements

| ID    | Requirement | Description                                                                                                                                                                     | Priority |
| :---- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-12 | i18n keys   | Navigation labels (`nav.*`), page titles (`page.*.title`), empty state text (`common.empty.*`), error text (`common.error.*`), and toast labels (`toast.*`) added to en.json, es.json, fr.json. | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **i18n mandatory:** All user-facing strings use `$t()` or `useI18n()`.

## Acceptance Criteria

- [ ] All three locale files (`en.json`, `es.json`, `fr.json`) contain the new key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
- [ ] All three files have identical key paths
