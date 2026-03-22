# scenarios.md

## Review Checks

- **Format**: Correct Gherkin syntax — `Feature:`, `Scenario:` (or `Scenario Outline:`), `Background:` (if used), and `GIVEN`/`WHEN`/`THEN`/`AND`/`BUT` steps.
- **Edge cases**: Error paths, empty states, boundary values, invalid inputs, concurrent operations — are these covered?
- **Testability**: Each scenario is specific enough to write an automated test from. No vague assertions.
- **Negative scenarios**: "What should NOT happen" cases are included.
- **Single responsibility**: Each scenario tests exactly one behavior. Multiple unrelated assertions in one scenario should be split.
- **Independence**: Scenarios do not depend on execution order or state from a previous scenario.
- **Step consistency**: Reusable steps use identical phrasing across scenarios (e.g., always "GIVEN the app is running" — not "GIVEN the app has loaded" elsewhere).
- **Observable assertions**: `THEN` steps assert user-visible outcomes or measurable state, not internal implementation details.
- **Scenario naming**: Each scenario has a descriptive, unique name that summarizes the behavior under test.
- **Data variation**: `Scenario Outline:` with `Examples:` tables are used when the same flow applies to multiple inputs, instead of duplicating nearly identical scenarios.
- **Completeness against requirements**: Cross-reference the sibling `requirements.md` — every `SHALL`/`MUST` statement has at least one matching scenario.
