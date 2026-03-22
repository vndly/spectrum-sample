# scenarios.md

## Review Checks

### Structure & Syntax

- **Format**: Correct Gherkin syntax — `Feature:`, `Scenario:` (or `Scenario Outline:`), `Background:` (if used), and `GIVEN`/`WHEN`/`THEN`/`AND`/`BUT` steps.
- **Requirement grouping**: Scenarios are organized under their parent requirement heading, with horizontal rules (`---`) separating requirement groups.
- **Scenario naming**: Each scenario has a descriptive, unique name that summarizes the behavior under test.
- **Data variation**: `Scenario Outline:` with `Examples:` tables are used when the same flow applies to multiple inputs, instead of duplicating nearly identical scenarios.
- **Background deduplication**: When multiple scenarios under the same requirement share identical GIVEN steps, a `Background:` block should be used instead of repeating them in each scenario.

### Step Quality

- **Step consistency**: Reusable steps use identical phrasing across scenarios (e.g., always "GIVEN the app is running" — not "GIVEN the app has loaded" elsewhere).
- **Step atomicity**: Each GIVEN/WHEN/THEN/AND/BUT step performs exactly one action or asserts one outcome. Compound steps (two actions joined by "and" within a single step) should be split into separate steps.
- **Precondition completeness**: GIVEN steps fully describe the starting state needed to run the scenario. No implicit setup is assumed (e.g., viewport size, language setting, existing data).
- **Observable assertions**: `THEN` steps assert user-visible outcomes or measurable state, not internal implementation details.

### Scenario Design

- **Single responsibility**: Each scenario tests exactly one behavior. Multiple unrelated assertions in one scenario should be split.
- **Independence**: Scenarios do not depend on execution order or state from a previous scenario.
- **Testability**: Each scenario is specific enough to write an automated test from. No vague assertions.

### Coverage

- **Completeness against requirements**: Cross-reference the sibling `requirements.md` — every `SHALL`/`MUST` statement has at least one matching scenario.
- **Edge cases**: Error paths, empty states, boundary values, invalid inputs, concurrent operations — are these covered?
- **Negative scenarios**: "What should NOT happen" cases are included.
- **Error message specificity**: `THEN` steps for error paths assert the specific message or error type shown to the user, not just "an error is shown" or "an error occurs."
- **Async state coverage**: For features involving network requests or async operations, scenarios cover all three states: loading (skeleton/spinner visible), success (data rendered), and error (error toast or fallback UI displayed).
- **Persistence verification**: For features that write to `localStorage`, at least one scenario verifies that data survives a page reload.
- **Destructive action safety**: Scenarios for irreversible operations (delete, clear data, overwrite) include a confirmation step and, where applicable, a cancel/undo path.
- **i18n coverage**: For features with user-facing text, at least one scenario verifies translated output in a non-default language.
