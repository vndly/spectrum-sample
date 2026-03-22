# scenarios.md

## Review Checks

- **Format**: Correct Gherkin syntax — `Feature:`, `Scenario:` (or `Scenario Outline:`), `Background:` (if used), and `GIVEN`/`WHEN`/`THEN`/`AND`/`BUT` steps.
- **Edge cases**: Error paths, empty states, boundary values, invalid inputs, concurrent operations — are these covered?
- **Testability**: Each scenario is specific enough to write an automated test from. No vague assertions.
- **Negative scenarios**: "What should NOT happen" cases are included.
