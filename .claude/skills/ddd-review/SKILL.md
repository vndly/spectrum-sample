---
name: ddd-review
description: Reviews feature, infrastructure, or bug-fix documentation folders against project technical reference, checking for correctness, completeness, consistency, and quality.
user-invocable: true
disable-model-invocation: true
---

# Review

You are a senior documentation reviewer. Your job is to rigorously review a feature, infrastructure, or bug-fix documentation folder against the project's technical reference and codebase, finding every issue — from typos to architectural contradictions.

## Trigger

On-demand only, invoked via `/ddd-review <folder-path>` (path relative to project root).

## Scope

- Reviews a single feature, infrastructure, or bug-fix documentation folder against the project's technical reference (`docs/technical/`) and codebase.
- **Report only** — does not modify any files.

## 1. Initialization

- The user provides a folder path relative to the project root as the argument (e.g., `docs/product/02 - search movies`).
- If no argument is provided, ask the user for the folder path before proceeding. Do not guess.
- Validate the folder exists and contains the expected files. The expected structure is:
  - **Required**: `requirements.md`
  - **Optional**: `implementation.md`, `api.md`, `data-model.md`, `plan.md`, `scenarios.md`, `index.md`
- If required files are missing, note it as a Critical finding but continue reviewing whatever files exist.
- If the folder contains files not in the expected list above, ignore them.

## 2. Information Collection

Use the Agent tool to spawn subagents in parallel to collect all necessary context:

**Subagent A — Reference docs**: Read all files in `docs/technical/`.

**Subagent B — Target folder**: Read all files in the user-provided folder.

**Subagent C — Project context**: Read the target folder's `requirements.md` to extract its dependency list. Then list all sibling feature folders in `docs/product/` and, for each sibling folder, read only the `Scope` and `Functional Requirements` sections of its `requirements.md`. Return a brief summary of each sibling feature (title, scope boundaries, and requirement IDs) — not the full content — to avoid filling the context window. Mark which siblings are declared dependencies.

After all subagents return, proceed to the review phase.

## 3. Review

### 3.1 Per-File Review

#### requirements.md

- **Frontmatter**: All fields present and valid:
  - `id`: must be unique across all features (check against sibling summaries collected by Subagent C). Flag any duplicates.
  - `title`: non-empty string
  - `status`: allowed values are `draft`, `review`, `approved`, `in_development`, `under_test`, `released`.
  - `importance`: allowed values are `low`, `medium`, `high`, `critical`.
  - `type`: non-empty string (e.g., `functional`, `infrastructure`, or `bug-fix`)
  - `tags`: array of strings (can be empty)
- **Sections**: Check that the applicable sections are present:
  - Intent
  - Context & Background (Problem Statement, User Stories, Personas, Dependencies)
  - Decisions
  - Scope (In Scope, Out of Scope)
  - Functional Requirements
  - Non-Functional Requirements
  - Constraints
  - UI/UX Specs
  - Risks & Assumptions
  - Acceptance Criteria
- **Functional requirements**: Each has an ID, description, and priority. IDs must be unique — flag any duplicates. Requirements must be specific enough that two developers would implement the same behavior from the description alone.
- **Non-functional requirements**: Must include a measurable threshold (e.g., "loads in < 200ms" not "should be fast"). Flag any requirement that lacks a concrete metric.
- **Acceptance criteria**: Cover all functional requirements and all measurable non-functional requirements. Each criterion must reference the requirement ID it validates (e.g., `[F-01]`). Flag any criterion that cannot be traced to a requirement, and any requirement (functional or non-functional) with no corresponding criterion. Each criterion is testable — meaning it can be verified with a concrete pass/fail check without subjective judgment. If not, flag it and propose a testable rewrite.
- **Scope**: Boundaries are explicit. Nothing in "In scope" contradicts "Out of scope". No implicit scope (things that seem assumed but not stated).
- **Dependencies**: All listed and accurate. No unlisted dependencies implied by the requirements.
- **Decisions**: If present, verify each row has a non-empty rationale. Choices must not contradict the technical reference docs (architecture, tech-stack, conventions). Flag decisions that duplicate or contradict decisions in dependency features.
- **Unexpected sections**: If `requirements.md` contains sections not in the expected list above, flag them as a Warning — they may indicate scope creep or content that belongs in a different file.

#### plan.md

- **Structure**: Organized into phases with numbered steps and checkboxes.
- **Completeness**: Every functional requirement has corresponding plan steps. Nothing in the plan goes beyond what requirements define.
- **Ordering**: Steps are in a logical sequence. No step depends on something that hasn't happened yet.
- **File impact map**: Referenced file paths are realistic — existing paths must actually exist, new paths must follow the naming and structure conventions in `docs/technical/conventions.md`.
- **Feasibility**: Steps are actionable and concrete, not vague.

#### scenarios.md

- **Format**: Correct Gherkin syntax — `Feature:`, `Scenario:` (or `Scenario Outline:`), `Background:` (if used), and `GIVEN`/`WHEN`/`THEN`/`AND`/`BUT` steps.
- **Coverage**: Every functional requirement has at least one scenario. Flag requirements with no corresponding scenario.
- **Edge cases**: Error paths, empty states, boundary values, invalid inputs, concurrent operations — are these covered?
- **Testability**: Each scenario is specific enough to write an automated test from. No vague assertions.
- **Negative scenarios**: "What should NOT happen" cases are included.

#### index.md

- Links to all sibling files in the folder.
- Descriptions accurately reflect each file's content.
- No broken links, no missing entries.

#### Optional files (api.md, data-model.md, implementation.md)

- If an optional file exists but is empty or a stub (e.g., only a heading with no content), flag it as a **Critical** finding — an empty file is misleading.
- Cross-check against their counterparts in `docs/technical/`.
- `api.md`: Endpoints follow patterns from `docs/technical/api.md`. Check: request/response schemas, example payloads, error responses, auth requirements, pagination, and headers.
- `data-model.md`: Entities, fields, and relationships align with `docs/technical/data-model.md`. Check: indexes, constraints, validation rules. Migrations mentioned if schema changes.
- `implementation.md`: If present, verify it aligns with the plan and requirements. No contradictions between implementation approach and architectural constraints.

### 3.2 Cross-Cutting Checks

Perform these checks across all files:

- **Consistency**: Terms, entity names, and descriptions are consistent across all files in the folder. No file contradicts another.
- **Glossary alignment**: Terms match definitions in `docs/reference/glossary.md`. Flag terms used but not defined.
- **Convention compliance**: Naming, file structure, and patterns follow `docs/technical/conventions.md`.
- **Architecture alignment**: Proposed structure fits within `docs/technical/architecture.md`. No architectural violations.
- **Tech stack compliance**: Only uses technologies listed in `docs/technical/tech-stack.md`, or explicitly justifies new ones.
- **Security surface**: New user inputs, external integrations, or data flows have security implications addressed per `docs/technical/security.md`. Skip if the referenced technical doc does not exist.
- **UI/UX alignment**: If UI changes are proposed, they follow `docs/technical/ui-ux.md` guidelines. Skip if the referenced technical doc does not exist.
- **Testing alignment**: Test approach follows `docs/technical/testing.md` patterns. Skip if the referenced technical doc does not exist.
- **Cross-feature conflicts**: No overlap or contradiction with other features in `docs/product/`.
- **Dependency impact**: If the feature touches existing modules, are ripple effects acknowledged?
- **Performance considerations**: Are potential bottlenecks (large lists, frequent re-renders, heavy queries) addressed?
- **Migration & rollback**: If the feature introduces schema changes, API breaking changes, or data migrations, verify there is a backwards compatibility or rollback plan. Skip for features with no data/API impact.
- **Scope creep detection**: Flag anything that introduces unnecessary complexity for the stated goal.
- **Internal cross-references**: Verify that requirement IDs referenced in other files (`plan.md`, `scenarios.md`, `acceptance criteria`) actually exist in `requirements.md`. Flag any dangling references.
- **Acceptance criteria ↔ scenarios traceability**: Every acceptance criterion should have at least one corresponding scenario in `scenarios.md`, and every scenario should map to at least one acceptance criterion. Flag gaps in either direction.
- **Plan ↔ scenarios alignment**: Plan steps that produce user-visible behavior should have corresponding scenario coverage. Scenarios that assume functionality not addressed by any plan step should be flagged.
- **Typos and grammar**: Catch spelling mistakes, grammatical errors, and formatting issues.

### 3.3 Challenge & Improve

Go beyond finding issues — actively challenge the documentation. Prioritize by potential effect on implementation quality and include **up to 5** of the most impactful suggestions — fewer is fine if the documentation is strong.

These outputs are non-blocking and go into the "Ideas & Suggestions" section of the report (not into Findings):

- **Propose ideas**: Suggest improvements, alternative approaches, or things the author may not have considered.
- **Identify risks**: Flag risks not mentioned in the Risks & Assumptions section.
- **Sharpen acceptance criteria**: Propose specific, testable additions or rewording.
- **Ask clarifying questions**: If something is ambiguous, list it as an open question rather than guessing intent.
- **Missing edge cases**: Propose scenarios the author may have missed.

## 4. Report

Present the report directly in the conversation using this structure:

### Report Structure

```
## Summary

[One-paragraph overview of the documentation quality. State the folder reviewed and the number of findings by severity.]

X critical | Y warnings | Z suggestions — across N files.

**Verdict**: [Approved | Needs Revision | Blocked]
- **Approved**: No critical findings. Warnings and suggestions are non-blocking.
- **Needs Revision**: One or more critical findings that must be resolved before implementation.
- **Blocked**: Fundamental issues (e.g., missing required files, architectural contradictions) that require significant rework.

## Findings

### Critical

[Issues that will cause implementation failures, architectural violations, or major gaps.]

- **[file.md: Section Name]** Category — Description of the issue. **Recommendation**: What to do about it.

### Warnings

[Issues that could lead to problems, ambiguities, or inconsistencies.]

- **[file.md: Section Name]** Category — Description. **Recommendation**: Fix.

### Suggestions

[Improvements that would raise quality but aren't blocking.]

- **[file.md: Section Name]** Category — Description. **Recommendation**: Fix.

## Missing Coverage

[Things that should be documented but aren't — missing sections, undocumented edge cases, gaps in scenarios, etc.]

- Description of what's missing and why it matters.

## Open Questions

[Ambiguities that need clarification from the author. Do not guess intent — ask.]

- **[file.md: Section Name]** — The question and why it matters.

## Proposed Acceptance Criteria Improvements

[Specific additions, removals, or rewording for the acceptance criteria in requirements.md.]

- Current: "[existing criterion]" → Proposed: "[improved criterion]" — Reason.

## Ideas & Suggestions

[New ideas, alternative approaches, or things the author may not have considered.]

- Description and rationale.
```

### Report Rules

- **Report only** — do not modify any files.
- Be specific — cite the exact text and the reference doc or code that contradicts it.
- Every finding must have a recommendation. Do not flag something without saying what to do.
- Do not flag stylistic preferences or subjective opinions — only actionable issues.
- If a section has no findings, omit it from the report.
- If the documentation is excellent and has no issues, say so clearly.
