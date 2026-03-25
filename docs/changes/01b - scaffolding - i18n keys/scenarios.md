# Verification Scenarios: App Scaffolding — i18n Keys

Feature: App Scaffolding — i18n Keys

### Requirement: SC-12 — i18n

All user-facing text SHALL be translated via vue-i18n.

#### Scenario: SC-12-01 — Nav labels are translated

GIVEN the app language is set to French
WHEN I view the sidebar navigation
THEN the nav items display "Accueil", "Calendrier", "Bibliothèque", "Paramètres"

#### Scenario: SC-12-02 — Page header is translated

GIVEN the app language is set to Spanish
WHEN I navigate to `/library`
THEN the page header displays "Biblioteca"

#### Scenario: SC-12-03 — i18n key completeness

GIVEN all locale files for en, es, and fr
WHEN I inspect their contents
THEN each file contains keys in the app.title, nav.*, page.*.title, common.empty.*, common.error.*, and toast.* namespaces
AND all three locale files contain the identical set of key paths
