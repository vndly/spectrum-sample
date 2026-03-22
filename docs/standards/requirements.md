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

### Frontmatter

All fields present and valid:

- `id`: must be unique across all features (check against sibling summaries). Flag any duplicates.
- `title`: non-empty string
- `status`: allowed values are `draft`, `review`, `approved`, `in_development`, `under_test`, `released`.
- `importance`: allowed values are `low`, `medium`, `high`, `critical`.
- `type`: non-empty string (e.g., `functional`, `infrastructure`, or `bug-fix`)
- `tags`: array of strings (can be empty)

### Sections

All sections listed below are optional, but flag as a Suggestion any section that would strengthen the document given its `type` and scope. Flag any section not in this list as a Warning — it may indicate scope creep or content that belongs in a different file.

#### Intent

A concise statement of what the feature aims to achieve and why it matters. Should capture the high-level goal without diving into implementation details. Flag if the intent is vague or could apply to multiple unrelated features.

#### Context & Background

Provides the backstory needed to understand the feature. May include the following subsections:

- **Problem Statement**: The specific problem being solved.
- **User Stories**: Narratives describing who benefits and how (e.g., "As a [persona], I want [goal] so that [benefit]").
- **Personas**: The target users or actors involved.
- **Dependencies**: All dependency features must be listed and accurate. Flag any unlisted dependencies implied by the requirements.

#### Decisions

If present, must be a table with columns `Decision | Choice | Rationale`. Each row must have a non-empty rationale. Choices must not contradict the project's technical reference docs (architecture, tech-stack, conventions). Flag decisions that duplicate or contradict decisions in dependency features.

#### Scope

Must contain two subsections: **In Scope** and **Out of Scope**. Boundaries must be explicit. Flag if:

- Anything in "In Scope" contradicts "Out of Scope".
- Scope is implicit — things that seem assumed but are not stated.

#### Functional Requirements

Presented as a table with columns `ID | Requirement | Description | Priority`.

- **Requirement**: A short label or name.
- **Description**: The full specification — specific enough that two developers would implement the same behavior from the description alone.
- **ID**: Must be unique within the document and use a feature-specific prefix (e.g., `S-01` for Setup, `SC-01` for Scaffolding). Flag duplicates or missing prefixes.
- **Priority**: Allowed values are `P0` (must have), `P1` (should have), `P2` (nice to have). Flag missing or non-standard priorities.

#### Non-Functional Requirements

Must be organized into named subsections that group related concerns (e.g., Responsive Design, Performance, Accessibility, Testing). Each subsection contains bullet points with concrete, measurable thresholds (e.g., "loads in < 200 ms", not "should be fast"). Flag any requirement that lacks a concrete metric or any flat list of NFRs without subsection grouping.

#### Constraints

Technical, business, or regulatory constraints that limit how the feature can be implemented — for example, browser support targets, third-party API rate limits, compliance mandates, or budget/timeline boundaries. Each constraint should be specific and actionable. Flag vague constraints (e.g., "must be cost-effective") and propose a concrete rewrite.

#### UI/UX Specs

Visual and interaction specifications for user-facing features. May include layout descriptions, component behavior, responsive breakpoints, accessibility notes, or references to design mockups. Flag any spec that is too vague to implement consistently (e.g., "should look good on mobile") and propose a measurable alternative.

#### Risks & Assumptions

- **Risks**: Known threats to successful delivery — technical unknowns, third-party reliability, scope creep potential. Each risk should include likelihood, impact, and a mitigation strategy.
- **Assumptions**: Conditions believed to be true but not yet verified. Flag assumptions that contradict known project state or dependency features.

#### Acceptance Criteria

The contract between the specification and the implementation. Acceptance criteria define the specific behaviors and outcomes the software must provide, focusing on *what* needs to be done, not *how*.

- Each criterion is a markdown checkbox (`- [ ]`) describing a single verifiable outcome.
- Must be testable with a concrete pass/fail check — no subjective judgment. Flag untestable criteria and propose a rewrite.
- Must cover all functional requirements and all measurable non-functional requirements. Flag any requirement with no corresponding criterion.
- Should consider edge cases: empty data, concurrent updates, missing dependencies.

### Requirement Quality

Every functional and non-functional requirement must satisfy the quality criteria defined in Writing Guidelines above (Unambiguous, Complete, Consistent, Verifiable). During review, additionally flag:

- Vague terms (e.g., "appropriate", "quickly", "properly") — propose a specific rewrite.
- Missing details another developer would need to implement the same behavior.
- Contradictions with other requirements in the same document or in dependency features.
- Subjective judgment that cannot be confirmed with a concrete pass/fail check — propose a measurable rewrite.

## Standards Compliance

Requirements must be consistent with the project's technical reference docs. Flag any requirement that contradicts or ignores these sources:

- **Architecture**: Proposed components, files, or data flows must respect the layer boundaries in `docs/technical/architecture.md`. Flag requirements that imply cross-layer imports or misplaced files.
- **Security**: Requirements introducing new user inputs, external integrations, storage keys, or API token handling must align with the defenses in `docs/technical/security.md`. Flag requirements that expand the attack surface without documenting mitigations.
- **UI/UX**: Requirements describing visual behavior must follow `docs/technical/ui-ux.md`. Flag deviations with no justification.
- **Data model**: Requirements that add or modify persisted data must match the schemas in `docs/technical/data-model.md`. Flag schema mismatches.
- **API**: Requirements referencing external API calls must use the endpoints, parameters, and error-handling behavior documented in `docs/technical/api.md`. Flag undocumented endpoint usage.
- **Conventions**: Requirements must not contradict the coding conventions in `docs/technical/conventions.md`. Flag requirements that assume different patterns without justification.
- **Testing**: Requirements specifying test strategies, coverage expectations, or mocking approaches must align with `docs/technical/testing.md`. Flag contradictions with the defined testing patterns.
- **Tech stack**: Requirements must only assume technologies listed in `docs/technical/tech-stack.md`, or explicitly justify new ones.
