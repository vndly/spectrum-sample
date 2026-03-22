# requirements.md

Requirements define specific, testable conditions that a feature must satisfy. A requirement should answer: **What** + **Why** + **Success**.

## Writing Guidelines

Requirements should describe:

- Observable behavior users or downstream systems rely on
- Inputs, outputs, and error conditions
- External constraints (security, privacy, reliability, compatibility)
- Scenarios that can be tested or explicitly validated
- Business rules: cascading deletes, state transitions, resource limits

A good requirement is:

- **Unambiguous**: No room for interpretation.
- **Complete**: Covers all necessary details.
- **Consistent**: No contradictions with other requirements.
- **Verifiable**: Testers can confirm if it's met.

Examples:

- "The task list displays all tasks belonging to the current user, sorted by due date ascending" (specific, testable)
- "The task list should work well" (too vague)

## Review Checks

- **Frontmatter**: All fields present and valid:
  - `id`: must be unique across all features (check against sibling summaries). Flag any duplicates.
  - `title`: non-empty string
  - `status`: allowed values are `draft`, `review`, `approved`, `in_development`, `under_test`, `released`.
  - `importance`: allowed values are `low`, `medium`, `high`, `critical`.
  - `type`: non-empty string (e.g., `functional`, `infrastructure`, or `bug-fix`)
  - `tags`: array of strings (can be empty)
- **Sections**: All sections are optional, but flag as a Suggestion any section that would strengthen the document given its `type` and scope. The recognized sections are:
  - Intent
  - Context & Background (Problem Statement, User Stories, Personas, Dependencies)
  - Decisions
  - Scope (In Scope, Out of Scope)
  - Functional Requirements (see detailed rules below)
  - Non-Functional Requirements (see detailed rules below)
  - Constraints
  - UI/UX Specs
  - Risks & Assumptions
  - Acceptance Criteria (see detailed rules below)
- **Functional requirements**: Each has an ID, description, and priority. IDs must be unique — flag any duplicates. Requirements must be specific enough that two developers would implement the same behavior from the description alone.
- **Non-functional requirements**: Must include a measurable threshold (e.g., "loads in < 200ms" not "should be fast"). Flag any requirement that lacks a concrete metric.
- **Requirement quality**: Every functional and non-functional requirement must be:
  - **Unambiguous**: Only one possible interpretation. Flag vague terms (e.g., "appropriate", "quickly", "properly") and propose a specific rewrite.
  - **Complete**: Covers inputs, outputs, error conditions, and edge cases relevant to its scope. Flag any requirement that omits details another developer would need to implement the same behavior.
  - **Consistent**: No contradictions with other requirements in the same document or in dependency features. Flag any conflicts.
  - **Verifiable**: Can be confirmed with a concrete pass/fail check. Flag any requirement that relies on subjective judgment and propose a measurable rewrite.
- **Acceptance criteria**: Acceptance criteria are the contract between the specification and the implementation. They should focus on what needs to be done (not how), define the specific behaviors and outcomes the software must provide, and consider edge cases (empty data, concurrent updates, missing dependencies). Cover all functional requirements and all measurable non-functional requirements. Each criterion must reference the requirement ID it validates (e.g., `[F-01]`). Flag any criterion that cannot be traced to a requirement, and any requirement (functional or non-functional) with no corresponding criterion. Each criterion is testable — meaning it can be verified with a concrete pass/fail check without subjective judgment. If not, flag it and propose a testable rewrite.
- **Scope**: Boundaries are explicit. Nothing in "In scope" contradicts "Out of scope". No implicit scope (things that seem assumed but not stated).
- **Dependencies**: All listed and accurate. No unlisted dependencies implied by the requirements.
- **Decisions**: If present, verify each row has a non-empty rationale. Choices must not contradict the technical reference docs (architecture, tech-stack, conventions). Flag decisions that duplicate or contradict decisions in dependency features.
- **Unexpected sections**: If `requirements.md` contains sections not in the expected list above, flag them as a Warning — they may indicate scope creep or content that belongs in a different file.
