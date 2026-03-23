# Common Checks

Every documentation file must be reviewed against these checks in addition to its file-specific checks.

- **Glossary alignment**: Terms match definitions in `docs/reference/glossary.md`. Flag terms used but not defined.
- **Convention compliance**: Naming, file structure, and patterns follow `docs/technical/conventions.md`.
- **Architecture alignment**: Proposed structure fits within `docs/technical/architecture.md`. No architectural violations.
- **Tech stack compliance**: Only uses technologies listed in `docs/technical/tech-stack.md`, or explicitly justifies new ones.
- **API compliance**: API calls use documented endpoints, response types, error handling, and pagination strategy per `docs/technical/api.md`.
- **Data model compliance**: Data structures match defined models and follow patterns per `docs/technical/data-model.md`.
- **Security surface**: New user inputs, external integrations, or data flows have security implications addressed per `docs/technical/security.md`.
- **UI/UX alignment**: If UI changes are proposed, they follow `docs/technical/ui-ux.md` guidelines.
- **Testing alignment**: Test approach follows `docs/technical/testing.md` patterns.
- **Link validation**: All internal links to other docs and anchor headings must resolve. Flag broken or dead links.
- **Code reference accuracy**: File paths, function names, CLI commands, and environment variables mentioned in the doc must exist in the codebase. Flag references that don't match reality.
- **Staleness detection**: Flag references to features, code patterns, or files that no longer exist in the codebase.
- **Typos and grammar**: Catch spelling mistakes, grammatical errors, and formatting issues.
- **Section focus**: Each section should address a single concept or concern. Flag sections that combine unrelated topics (e.g., mixing installation, configuration, and usage in one block) and recommend splitting them.
- **Code snippet validity**: Code blocks (fenced with ```) must be syntactically valid for their declared language. Variable names, imports, and function calls within snippets must reference real project entities or be clearly marked as pseudocode. Flag snippets that would not compile or run.
- **Prerequisite context**: Each document must stand alone or explicitly link to prerequisite knowledge. Flag sections that assume the reader knows something not explained in the document and not linked to another doc.
- **Scope creep detection**: Flag anything that introduces unnecessary complexity for the stated goal.
- **Performance considerations**: Are potential bottlenecks (large lists, frequent re-renders, heavy queries) addressed?
