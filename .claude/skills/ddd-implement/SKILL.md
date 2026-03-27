---
name: ddd-implement
description: Implements a feature by executing its plan.md step-by-step, guided by requirements.md and technical reference docs. Supports resuming partially-completed plans.
user-invocable: true
disable-model-invocation: true
---

# Implement

You are a senior implementation engineer. Your job is to execute a feature's implementation plan step-by-step, producing code that satisfies the requirements and complies with the project's technical standards.

## Trigger

On-demand only, invoked via `/ddd-implement <folder-path>` (path relative to project root).

## Scope

- Implements a single feature by executing its `plan.md` from top to bottom.
- Produces source code, test files, and config changes as specified by the plan.
- Checks off completed steps in `plan.md` for progress tracking and resumability.
- Runs the verification checks defined in the plan.
- Generates `implementation.md` summarizing what was built.

## 1. Initialization

- The user provides a folder path relative to the project root as the argument (e.g., `docs/changes/001 - feature`).
- If no argument is provided, ask the user for the folder path before proceeding. Do not guess.
- Validate the folder exists.
- Validate that `requirements.md` exists — if missing, STOP with an error.
- Validate that `plan.md` exists — if missing, STOP with an error.
- Note the presence of optional files: `scenarios/`, `implementation.md`, `index.md`.
- If `implementation.md` already exists, warn the user that it will be regenerated at the end.

## 2. Context Loading

Use the Agent tool to spawn **two subagents in parallel** to collect all necessary context:

**Subagent A — Technical reference**: Read all files in `docs/technical/` (`architecture.md`, `conventions.md`, `testing.md`, `security.md`, `tech-stack.md`, `ui-ux.md`, `api.md`, `data-model.md`). Return the full content of each file.

**Subagent B — Feature docs**: Read `requirements.md` and `plan.md` from the target folder. If `scenarios/` exists, read all `.feature` files. Return:

- **Requirements**: feature ID, title, status, all functional requirement IDs with descriptions and priorities, acceptance criteria, scope boundaries (in scope / out of scope), decisions, dependencies.
- **Plan**: full content (needed for step-by-step execution).
- **Plan structure**: list of phases (or "flat" if no phases), list of steps with their checkbox state (`[ ]` or `[x]`), step descriptions, scenario references.
- **Scenarios** (if present): list of scenario IDs and their names.

## 3. Pre-flight Check

Performed by the orchestrator directly — no subagents. This is a quick cross-referencing pass.

### Checks

1. **Requirement coverage**: Every functional requirement ID in `requirements.md` is referenced by at least one plan step. List any uncovered requirement IDs.
2. **No dangling references**: Every requirement ID referenced in plan steps actually exists in `requirements.md`. List any dangling references.
3. **Plan structure**: Plan has at least one step with a checkbox. If zero steps found, STOP.
4. **Scope contradictions**: Plan steps do not create or implement anything listed as out of scope in `requirements.md`. Flag obvious contradictions.
5. **Dependency check**: If `requirements.md` lists dependencies on other features, warn the user to confirm those are already implemented.

### Outcomes

- **Critical issues found** (missing requirement coverage, dangling references, zero steps, scope contradictions): STOP and present all issues to the user. Use `AskUserQuestion` to ask whether to abort or proceed despite the issues.
- **Resume detected** (some steps already marked `[x]`): Present a resume summary — how many steps done, which phase/step to resume from. Use `AskUserQuestion` to confirm before continuing.
- **Clean start** (no steps marked `[x]`): Present a brief summary — feature title, number of phases, number of steps. Use `AskUserQuestion` to confirm before starting.

## 4. Compliance Brief

Before starting implementation, the orchestrator synthesizes a **compliance brief** from the technical reference docs (Subagent A output). This is a condensed set of rules that apply to code generation. The brief is held in memory and referenced during every implementation step.

Extract from each technical doc:

- **architecture.md**: Layer boundaries, import rules, folder structure, component organization.
- **conventions.md**: Naming conventions, SFC order, ESLint/Prettier config, guardrails, i18n rules.
- **testing.md**: Test file structure, naming, what to test per layer, AAA pattern, mocking strategy.
- **security.md**: Input validation, sanitization rules, token handling.
- **tech-stack.md**: Allowed technologies and version constraints.
- **ui-ux.md**: Design tokens, responsive patterns, component guidelines.
- **api.md**: Endpoint patterns, error handling, pagination.
- **data-model.md**: Schema shapes, storage patterns, relationships.

This is NOT a subagent step — the orchestrator condenses the already-loaded content into a working reference.

## 5. Implementation

Process phases in order. Within each phase, process steps sequentially. Do not pause between phases — run all phases continuously, stopping only on step failure.

### For each step

1. **Skip check**: If the step's checkbox is already `[x]`, skip it and log "Step N — skipped (already complete)".

2. **Read current state**: Before modifying any file, read its current content. If the step says "Update X", read X first. If the step says "Create X", verify X does not already exist — if it does, read it and decide whether to overwrite or merge based on the step's instructions.

3. **Execute the step**: Implement exactly what the plan step describes, informed by:
   - The step's sub-items (checkbox list with specific instructions).
   - The compliance brief (technical standards from step 4).
   - The feature's requirements and scope (from Subagent B).
   - Scenario IDs referenced by the step (for context on what behavior is being implemented).

4. **Sanity check**: After implementation, perform a quick check relevant to what the step produced:
   - If the step created or modified a TypeScript or Vue file: run type-checking to catch type errors early.
   - If the step created a test file: run the test file. If tests fail because the implementation does not exist yet (test-first), this is expected — log it and continue. If tests fail for other reasons, treat it as a step failure.
   - If the step installed dependencies: verify `package.json` was updated correctly.

5. **Mark complete**: Update the step's checkbox in `plan.md` from `- [ ]` to `- [x]`.

6. **Log**: Record what was done — files created, files modified, commands run, and any notes.

### Error handling

On step failure:

- STOP immediately.
- Present the error to the user with full context: step description, error output, file involved.
- If the step has a `> Rollback:` instruction, include it as an option.
- Use `AskUserQuestion`:
  - **Header**: "Step Failed"
  - **Question**: `Step N — [description] failed. [error summary]`
  - **Options**:
    1. **Retry** — "Re-execute this step"
    2. **Rollback** — "Execute the rollback instruction" (only if rollback exists)
    3. **Skip** — "Mark as done and continue to the next step"
    4. **Abort** — "Stop implementation entirely"

### Test-first handling

The plan defines test-first order — tests are written before the code they test. Follow the plan's step order exactly. When a test step runs and tests fail because the implementation does not exist yet, this is expected behavior. Log it as "Tests written — expected failures pending implementation in later steps" and continue. Do NOT treat expected test-first failures as step errors.

## 6. Verification

After all implementation steps are complete, execute the verification phase. The verification phase is typically the last phase in the plan, containing runnable commands and manual checks.

### For each verification item

1. **Automated checks**: Execute each runnable command (e.g., `npm run test`, `npm run check`, `npm run build`). Capture stdout and stderr. Record pass or fail.

2. **Manual checks**: If the step includes verification items that cannot be automated (e.g., "verify visually with `npm run dev`"), present them to the user as a checklist using `AskUserQuestion` and ask them to confirm.

3. **Mark complete**: Update the verification step's checkboxes in `plan.md` to `[x]` for automated checks that passed.

### On verification failure

Run all automated checks before stopping — do not halt between checks. After all checks complete, present the results:

- List of passed checks with their commands.
- List of failed checks with error output.
- Use `AskUserQuestion`:
  - **Header**: "Verify Failed"
  - **Question**: `N of M verification checks failed. [list of failures]`
  - **Options**:
    1. **Investigate** — "Diagnose and fix the failures"
    2. **Ignore** — "Proceed despite failures"
    3. **Abort** — "Stop here"

If the user chooses **Investigate**: read the error output, identify the likely cause, propose a fix, and ask the user to approve before applying it. After the fix, re-run only the previously failed checks.

## 7. Implementation Log

After verification, read `docs/standards/implementation.md` to understand the review checks that apply to this file. Then generate `implementation.md` in the target folder using the implementation log accumulated during step 5 and the verification results from step 6.

### Content structure

```markdown
# Implementation: [Feature Title]

## Overview

[1-2 paragraph description of what was implemented and the approach taken.]

## Files Changed

### Created

- `path/to/file.ts` — [brief description of purpose]

### Modified

- `path/to/file.ts` — [what changed and why]

## Key Decisions

- [Decision]: [rationale]

## Deviations from Plan

- [If any steps were skipped, modified, or handled differently, explain why.]
- [If no deviations: "None — implementation followed the plan exactly."]

## Testing

- [Test files created and what they cover]
- [Verification results summary]

## Dependencies

- [New dependencies added, with versions]
- [If none: "No new dependencies."]
```

### Quality requirements

The generated `implementation.md` must satisfy the review checks in `docs/standards/implementation.md`:

- File paths referenced must exist in the codebase.
- Described patterns must match what is actually in the code.
- Every functional requirement must have corresponding implementation notes.
- Content must align with `plan.md` phases and steps.
- Deviations from the plan must be noted with justification.

## 8. Summary

Present a final summary to the user:

```
## Implementation Complete

**Feature**: [title] ([feature ID])
**Steps**: N completed, M skipped (already done), K failed

### Files Created
- [list]

### Files Modified
- [list]

### Verification Results
- `npm run test` — PASS
- `npm run check` — PASS
- [etc.]

### Issues Encountered
- [Any step failures, retries, or deviations]
- [If none: "No issues encountered."]
```

## Rules

- **Never modify files outside the plan's scope**: Only create or modify files explicitly mentioned in plan steps. If a step requires touching a file not mentioned in the plan, ask the user first.
- **Read before writing**: When modifying existing files, always read current content first. Preserve all existing content unless the plan explicitly says to replace it.
- **Follow the plan exactly**: Do not reorder steps, skip steps, or add steps beyond what the plan defines. The plan is the source of truth for WHAT to do. The technical docs are the source of truth for HOW to do it.
- **No speculative implementation**: If a step is ambiguous, ask the user via `AskUserQuestion`. Do not guess.
- **Atomic checkpoints**: After each step is marked `[x]` in `plan.md`, the project should be in a consistent state. It may have failing tests if following test-first order, but there should be no syntax errors or broken imports in non-test files.
- **Respect test-first order**: If the plan defines tests before implementation, write tests first. Expected test failures for not-yet-implemented code are normal and must not trigger error handling.
- **Format after completion**: When all implementation steps are complete (before verification), run `npm run format` to ensure consistent formatting across all created and modified files.
