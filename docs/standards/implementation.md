# implementation.md

## Review Checks

### Completeness

- If the file is empty or a stub, flag as **Critical**.
- Must have a clear overview section describing the implementation approach — flag as **Warning** if missing.
- Must list all files created or modified — flag as **Warning** if missing.
- Must document key implementation decisions and their rationale — flag as **Warning** if missing.
- New dependencies introduced must be documented — flag as **Warning** if missing.
- Error handling approach should be described for non-trivial features — flag as **Suggestion** if missing.

### Content Accuracy

- File paths referenced must exist in the codebase — flag as **Critical** if not found.
- Function, class, or component names mentioned must exist in the codebase — flag as **Warning** if not found.
- Described patterns or approaches must match what is actually in the code — flag as **Critical** on mismatch.

### Traceability

- Must trace back to requirements: every functional requirement should have corresponding implementation notes — flag as **Warning** on gaps.
- Must align with `plan.md` phases and steps — flag deviations as **Warning** unless rationale is provided.
- Any deviations from the original plan must be noted with justification — flag as **Warning** if missing.

### Technical Quality

- Should not contain vague or hand-wavy descriptions (e.g., "handle errors appropriately") — flag as **Suggestion**.
- Should reference specific code locations, not just general descriptions — flag as **Suggestion**.

### Testing Coverage

- Must describe the testing approach (unit, integration, e2e) for the feature — flag as **Warning** if missing.
- Must reference specific test files or describe where tests will live — flag as **Suggestion** if missing.
- Edge cases and failure scenarios should have corresponding test coverage noted — flag as **Suggestion** if missing.

### Migration & Rollback

- Data model changes must include migration steps — flag as **Critical** if missing.
- API or config changes must describe backward compatibility impact — flag as **Warning** if missing.
- Must describe rollback strategy for non-trivial changes — flag as **Warning** if missing.

### Performance Impact

- Performance-sensitive code paths must be identified — flag as **Warning** if present but undocumented.
- Expected load or scale considerations should be noted for user-facing features — flag as **Suggestion** if missing.
- Any new database queries, API calls, or loops over large datasets should note expected performance characteristics — flag as **Suggestion** if missing.

### Security Considerations

- New user inputs must document validation and sanitization approach — flag as **Critical** if missing.
- Changes to authentication or authorization flows must be explicitly described — flag as **Critical** if missing.
- Data exposure risks (logging sensitive data, new API response fields) should be addressed — flag as **Warning** if present but undocumented.

### Configuration & Environment

- New environment variables must be documented with expected values and defaults — flag as **Warning** if missing.
- New feature flags must be documented with their intended lifecycle — flag as **Warning** if missing.
- Changes to build or deployment configuration must be noted — flag as **Suggestion** if missing.

### Cross-cutting Concerns

- Changes affecting logging, monitoring, or observability should be documented — flag as **Suggestion** if missing.
- Error reporting changes (new error types, alerting implications) should be noted — flag as **Suggestion** if missing.

### Concurrency & State Management

- Race conditions in async flows (parallel requests, optimistic updates) must be identified and addressed — flag as **Warning** if present but undocumented.
- Shared state mutations must document synchronization strategy — flag as **Warning** if missing.
- Stale data scenarios (caching, background refreshes) should be described — flag as **Suggestion** if missing.

### Error UX

- User-facing error states must describe what the user sees (error messages, fallback UI, empty states) — flag as **Warning** if missing.
- Retry and recovery flows should be documented for operations that can fail — flag as **Suggestion** if missing.
- Destructive or irreversible actions must document confirmation and undo mechanisms — flag as **Warning** if missing.

### Internationalization

- New user-facing strings must use the localization system — flag as **Warning** if hardcoded.
- Locale-sensitive formats (dates, numbers, currency) must use the appropriate formatting utilities — flag as **Warning** if raw formatting is used.
- Text that affects layout (varying string lengths across locales) should note any UI implications — flag as **Suggestion** if missing.

### Known Limitations

- Intentional shortcuts or deferred work must be explicitly listed — flag as **Warning** if discovered but undocumented.
- Scope boundaries should be clear: what this implementation does and does not cover — flag as **Suggestion** if missing.
