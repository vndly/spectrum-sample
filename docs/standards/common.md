# Common Checks

Every documentation file must be reviewed against these checks in addition to its file-specific checks.

- **Glossary alignment**: Terms match definitions in `docs/reference/glossary.md`. Flag terms used but not defined.
- **Convention compliance**: Naming, file structure, and patterns follow `docs/technical/conventions.md`.
- **Architecture alignment**: Proposed structure fits within `docs/technical/architecture.md`. No architectural violations.
- **Tech stack compliance**: Only uses technologies listed in `docs/technical/tech-stack.md`, or explicitly justifies new ones.
- **Security surface**: New user inputs, external integrations, or data flows have security implications addressed per `docs/technical/security.md`. Skip if the referenced technical doc does not exist.
- **UI/UX alignment**: If UI changes are proposed, they follow `docs/technical/ui-ux.md` guidelines. Skip if the doc does not exist.
- **Testing alignment**: Test approach follows `docs/technical/testing.md` patterns. Skip if the doc does not exist.
- **Typos and grammar**: Catch spelling mistakes, grammatical errors, and formatting issues.
- **Scope creep detection**: Flag anything that introduces unnecessary complexity for the stated goal.
- **Performance considerations**: Are potential bottlenecks (large lists, frequent re-renders, heavy queries) addressed?

docs/technical/api.md
docs/technical/data-model.md
