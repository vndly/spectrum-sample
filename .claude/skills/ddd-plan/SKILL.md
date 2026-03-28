---
name: ddd-plan
description: Creates a plan.md and scenarios/ folder for a feature by analyzing requirements.md against project standards and technical reference, validating consistency, and refining interactively with the user.
user-invocable: true
disable-model-invocation: true
---

# Plan

You are a senior software architect. Your job is to produce a complete, standards-compliant `plan.md` and `scenarios/` folder for a feature by analyzing its requirements against the project's technical reference and standards, validating consistency, and refining interactively with the user.

## Trigger

On-demand only, invoked via `/ddd-plan <folder-path>` (path relative to project root).

## Scope

- Creates `plan.md` and `scenarios/` (with `.feature` files and `index.md`) inside a single feature documentation folder.
- Validates requirements completeness and consistency before generating artifacts.
- Interactively refines the plan and scenarios with the user before writing files.
- Hands off to `/ddd-review` for formal review of the finished artifacts.

## 1. Initialization

- The user provides a folder path relative to the project root as the argument (e.g., `docs/changes/01b - scaffolding - i18n keys`).
- If no argument is provided, ask the user for the folder path before proceeding. Do not guess.
- Validate the folder exists. If it does not, STOP with an error.
- Validate that `requirements.md` exists in the folder. If it does not, STOP with an error.
- **Check for existing artifacts**: If `plan.md` or `scenarios/` already exist in the folder, use `AskUserQuestion` to ask the user how to proceed:
  - **Header**: "Existing Artifacts"
  - **Question**: List which artifacts already exist (`plan.md`, `scenarios/`, or both).
  - **Options**:
    1. **Resume** — "Refine the existing plan and scenarios"
    2. **Overwrite** — "Start fresh, discarding existing content"
    3. **Abort** — "Cancel"
  - If **Resume**: read the existing `plan.md` and/or `scenarios/*.feature` files as the starting drafts. Run steps 2 (Context Loading) and 3 (Validation & Challenge) as normal. Then skip steps 4–5 (draft generation — existing drafts are used instead) and run step 6 (Cross-Validation) against the existing drafts. Proceed to step 7 (Interactive Refinement) with the existing drafts and any cross-validation findings.
  - If **Overwrite**: proceed as if the artifacts do not exist (existing files will be overwritten in step 8).
  - If **Abort**: STOP.

## 2. Context Loading

Use the Agent tool to spawn **four subagents in parallel** to collect all necessary context:

**Subagent A — Technical reference**: Read all files in `docs/technical/` (`architecture.md`, `conventions.md`, `testing.md`, `security.md`, `tech-stack.md`, `ui-ux.md`, `api.md`, `data-model.md`). Return the full content of each file.

**Subagent B — Feature docs & dependency plans**: Read `requirements.md` from the target folder. Extract its dependency list. For each declared dependency, locate its folder (in `docs/product/` or `docs/changes/`) and read its `plan.md` if it exists. Return:

- **Requirements**: feature ID, title, status, type, importance, all functional requirement IDs with descriptions and priorities, all non-functional requirements with thresholds, all acceptance criteria, scope boundaries (in scope / out of scope), decisions, dependencies, risks and assumptions.
- **Dependency plans**: For each dependency that has a `plan.md`, return the list of phases and steps (summaries only, not full content) — enough to verify ordering and avoid conflicts.

**Subagent C — Standards**: Read the following files and return their full content:

- `docs/standards/plan.md`
- `docs/standards/scenarios.md`
- `docs/standards/common.md`

**Subagent D — Sibling features**: List all sibling feature folders in `docs/product/` and `docs/changes/`. For each folder that contains a `plan.md`, read only the phase names, step summaries, and any referenced requirement IDs. Return a brief summary of each sibling's plan (feature title, phases, step count, technologies introduced) — not the full content.

## 3. Validation & Challenge

Performed by the orchestrator directly — no subagents. This is a critical gate before plan generation. Analyze the requirements against the technical reference and standards, looking for issues that would make planning impossible or produce a flawed plan.

### Checks

1. **Requirements completeness**: Functional requirements must be precise, complete, and unambiguous enough to derive atomic implementation steps. Flag requirements that are vague, missing acceptance criteria, or lack enough detail to plan against.
2. **Technical consistency**: Requirements must not contradict the technical reference docs. Check against architecture boundaries, tech stack constraints, security guidelines, API patterns, data model schemas, UI/UX guidelines, and conventions. Flag any conflict.
3. **Dependency availability**: If `requirements.md` declares dependencies on other features, verify those features exist and have plans. If a dependency has no `plan.md`, warn that ordering cannot be validated. If a dependency's plan introduces infrastructure or patterns this feature relies on, note it.
4. **Scope clarity**: "In Scope" and "Out of Scope" must be clear enough to determine what the plan should and should not include. Flag ambiguous boundaries.
5. **Acceptance criteria testability**: Every acceptance criterion must be concrete enough to derive at least one scenario. Flag criteria that are vague, subjective, or untestable.
6. **Cross-feature conflicts**: Check against sibling features (Subagent D) for overlapping scope, duplicate work, or contradictory approaches.

### Outcomes

- **Critical issues found** (requirements too vague to plan, architectural contradictions, missing dependencies that block planning): STOP. Present all critical issues to the user using `AskUserQuestion`. Challenge the approach — explain why each issue would lead to a flawed plan and what needs to be resolved. Ask the user to fix the requirements or clarify before retrying.
- **Warnings found** (minor ambiguities, soft conflicts, missing optional info): Present the warnings to the user and proceed. Note any assumptions you will make during planning and ask the user to confirm or correct them before continuing.
- **Clean** (no issues): Proceed to step 4.

## 4. Plan Draft

Generate a complete `plan.md` draft. Do **not** write the file yet — hold it in memory for refinement.

### Drafting rules

- Follow the structure and quality standards defined in `docs/standards/plan.md` exactly.
- **Phases**: Organize into logical phases. Each phase must be independently verifiable — the project must not be left in a broken state between phases. The last phase must be a verification phase.
- **Test-first order**: Include a testing phase before the implementation phase. Tests are written first (derived from scenarios), run to confirm failure, then implementation follows. The testing phase may be split across multiple phases if the plan has distinct implementation stages.
- **Atomic steps**: Each step must be small enough to complete in one pass but not trivially small. Steps must be actionable and concrete — include enough detail (props, types, behavior, config values, file paths) that two developers would produce the same result.
- **Checkboxes**: Every step has a `- [ ]` checkbox for progress tracking.
- **Scenario traceability**: Each test step must list the scenario IDs it covers (e.g., `covering: SC-04-01, SC-04-02`). Tests for implementation details not tied to a specific scenario are marked as `(implementation detail)`.
- **Dependency management**: Steps that install packages must specify version ranges.
- **Rollback safety**: Destructive steps must note a rollback path.
- **Dependency ordering**: If the feature depends on other features, ensure plan steps do not assume infrastructure or patterns that are introduced by dependency plans in a later phase. Reference dependency plan outputs where relevant.
- **Standards compliance**: Every step must respect the project's technical reference docs — architecture boundaries, conventions, security guidelines, tech stack, UI/UX patterns, API patterns, data model schemas, and testing patterns.
- **Scope discipline**: Every functional requirement must map to at least one step. No step may introduce work outside the defined scope.
- **Verification phase**: The final phase must list concrete, runnable pass/fail checks (e.g., `npm run test`, `npm run build`, `npm run check`). No vague checks like "verify it works."

## 5. Scenarios Draft

Generate a complete `scenarios/` folder draft. Do **not** write files yet — hold them in memory for refinement.

### Drafting rules

- Follow the structure and quality standards defined in `docs/standards/scenarios.md` exactly.
- **One `.feature` file per functional requirement**: File named `{requirement-id}.feature` (e.g., `SC-01a-01.feature`).
- **Gherkin syntax**: Correct `Feature:`, `Scenario:` (or `Scenario Outline:`), `Background:`, and `Given`/`When`/`Then`/`And`/`But` steps.
- **Scenario IDs**: Every scenario has a stable ID in the format `{requirement-id}-{nn}` (e.g., `SC-04-01`). The ID appears at the start of the scenario name.
- **Moderate depth**: For each requirement, cover:
  - Happy path (primary expected behavior)
  - Key error paths (most likely failure modes)
  - Important edge cases (boundary values, empty states)
  - Use `Scenario Outline:` with `Examples:` tables for data variation instead of duplicating scenarios
  - Use `Background:` to deduplicate shared `Given` steps within a file
  - Do NOT exhaustively cover every dimension (every locale, every viewport, every network state). Cover the most critical dimensions and leave exhaustive expansion for the review cycle.
- **Step quality**: Steps must be atomic (one action or assertion each), consistent in phrasing across scenarios, and assert observable outcomes — not implementation details.
- **Precondition completeness**: `Given` steps must fully describe the starting state. No implicit setup.
- **Independence**: Scenarios must not depend on execution order or state from other scenarios.

### Scenario index

Also draft a `scenarios/index.md` listing all `.feature` files with their feature names and scenario counts.

## 6. Cross-Validation

After drafting both plan and scenarios, perform an alignment check. This catches issues before presenting to the user, avoiding a wasted review cycle.

### Checks

1. **Requirement → plan coverage**: Every functional requirement in `requirements.md` has at least one plan step. Flag uncovered requirements.
2. **Requirement → scenario coverage**: Every functional requirement has at least one scenario in `scenarios/`. Flag uncovered requirements.
3. **Plan → scenario traceability**: Every test step in the plan references scenario IDs that exist in the drafted scenarios. Flag dangling references.
4. **Scenario → plan alignment**: Every scenario tests behavior that is addressed by at least one plan step. Flag orphan scenarios (scenarios for behavior no plan step implements).
5. **Acceptance criteria → scenario mapping**: Every acceptance criterion in `requirements.md` has at least one corresponding scenario. Flag gaps.
6. **Scope consistency**: No plan step or scenario introduces work outside the defined scope. Flag out-of-scope items.
7. **Internal consistency**: Terms, entity names, and file paths are consistent between the plan and scenarios. Flag discrepancies.

### On issues found

Do not interrupt — collect all issues and include them as flagged items when presenting to the user in step 7. The user will address them during refinement.

## 7. Interactive Refinement

Present the complete draft (plan + scenarios) to the user for review. This step is mandatory — always perform at least one refinement round, even if everything looks clean.

### What to present

Use `AskUserQuestion` with a comprehensive prompt containing:

1. **Plan draft**: The complete `plan.md` content.
2. **Scenarios summary**: For each `.feature` file, list the feature name, scenario IDs, and scenario names. Include full Gherkin content only for complex or non-obvious scenarios — summarize straightforward ones.
3. **Cross-validation results**: Any issues found in step 6, presented as flagged items with recommendations.
4. **Follow-up questions**, grouped into:
   - **Gaps**: Requirements or acceptance criteria with weak plan coverage or missing scenarios. Explain what's missing and propose additions.
   - **Ambiguities**: Points where the requirements could be interpreted in multiple ways. State the interpretation used in the draft and ask the user to confirm or correct.
   - **Design decisions**: Choices made during planning that the user should validate — step ordering, technology choices, testing strategy, granularity trade-offs.
   - **Assumptions**: Any assumptions made about the implementation approach, especially around areas where the requirements were silent. List each assumption and ask the user to confirm.
   - **Suggestions**: Optional improvements — additional steps, scenarios, or edge cases that would strengthen the plan.

### Format

- **Header**: "Plan & Scenarios Review"
- **Question**: The drafts followed by the numbered follow-up questions.
- **Options**: None — use free-text input only.

### After the user responds

- Apply the user's feedback to both the plan and scenarios drafts.
- If the user's responses introduce **significant changes** (new requirements coverage, reordering of phases, scope changes, or new scenarios), do **one more refinement round** on the affected areas only. Use the same format but only include the changed sections and new questions.
- If the changes are minor (wording tweaks, confirmations, small additions), proceed directly to step 8.

## 8. Write Files

### 8.1 Write plan.md

Write the final `plan.md` to the target folder.

### 8.2 Write scenarios

Create the `scenarios/` folder in the target folder (if it does not already exist). Write each `.feature` file. Write `scenarios/index.md`, then apply the `audit-index` skill to format it.

### 8.3 Update folder index

If the target folder has an `index.md`, update it to include entries for `plan.md` and `scenarios/`. Then apply the `audit-index` skill to format it. If no `index.md` exists, create one listing all files in the folder, then apply the `audit-index` skill.

### 8.4 Format

Run `npm run format` to ensure consistent formatting across all written files.

## 9. Handoff to Review

Run `/ddd-review <folder-path>` to perform a formal review of the new artifacts.

Before running, inform the user:

> The plan and scenarios have been written. Running `/ddd-review` to validate them against project standards.

## Rules

- **Never guess requirements**: If the requirements are insufficient to derive a plan step or scenario, flag it in step 3 or step 7. Do not invent requirements.
- **Standards are the source of truth**: The structure, naming, and quality criteria from `docs/standards/plan.md` and `docs/standards/scenarios.md` override any other convention.
- **Technical docs constrain the plan**: Every plan step must be consistent with the project's technical reference. If a requirement conflicts with the technical docs, flag it — do not silently override the technical docs.
- **One refinement round minimum**: Always present the draft and ask follow-up questions (step 7), even if the requirements seem complete. There are always design decisions, ordering choices, or edge cases worth surfacing.
- **Atomic steps by default**: Every plan step must be atomic — completable in one pass, specific enough that two developers would produce the same result. Do not offer coarse-grained alternatives.
- **Moderate scenario depth**: Cover happy paths, key error paths, and important edge cases. Use Scenario Outlines for data variation. Do not exhaustively cover every dimension — leave that for the review cycle.
- **Scope discipline**: Do not add plan steps or scenarios for work outside the defined scope. Suggest out-of-scope improvements in step 7, but only include them if the user agrees.
- **Format after writing**: After writing all files (step 8), run `npm run format` to ensure consistent formatting.
