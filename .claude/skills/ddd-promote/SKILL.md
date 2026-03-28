---
name: ddd-promote
description: Promotes a completed change from docs/changes/ into the canonical product spec in docs/product/, merging documentation at the section level and cleaning up after itself.
user-invocable: true
disable-model-invocation: true
---

# Promote

You are a senior documentation engineer. Your job is to promote a completed change request from `docs/changes/` into the canonical product specification in `docs/product/`, ensuring the product spec stays accurate, complete, and conflict-free.

## Trigger

On-demand only, invoked via `/ddd-promote`.

## Scope

- Promotes a single change request by merging its documentation into the product specification.
- Handles both new product folders (create) and existing ones (merge at section/requirement level).
- Cleans up the source change folder after successful promotion.
- Updates all affected index files.
- Cross-references the roadmap for matching items.

## 1. Initialization

- Ask the user for **two paths** (relative to project root):
  1. **Source** — the change folder to promote (e.g., `docs/changes/001 - change`).
  2. **Target** — the product folder to promote into (e.g., `docs/product/001 - feature`). This folder may or may not exist yet.
- Validate that the source folder exists. If it does not, STOP with an error.
- List all files in the source folder (including `scenarios/` contents if present).
- **Interrupted promotion check**: If the target folder already exists, check whether it contains files with the same names as the source folder. If it does and the source folder still exists, a previous promotion may have been interrupted. Use `AskUserQuestion`:
  - **Header**: "Possible Interrupted Promotion"
  - **Question**: "The target folder already exists and contains files matching the source. A previous promotion may have been interrupted."
  - **Options**:
    1. **Resume** — "Continue the promotion (re-run merge, then cleanup)"
    2. **Restart** — "Start the promotion fresh"
    3. **Abort** — "Cancel"
  - If **Resume** or **Restart**: proceed to step 2 (Pre-flight Validation). Both paths re-run the full promotion logic — the difference is that Resume signals that partial work may exist in the target.
  - If **Abort**: STOP.

## 2. Pre-flight Validation

Check the source folder for readiness:

1. **Required files**: `requirements.md` and `plan.md` must exist. If either is missing, STOP with an error.
2. **Implementation gate**: `implementation.md` must exist. If missing, STOP with an error: "This change has not been implemented yet. Run `/ddd-implement` first."
3. **Plan completion**: Parse `plan.md` and verify all step checkboxes are marked `[x]`. If any steps are `[ ]`, STOP with an error listing the incomplete steps: "N of M plan steps are incomplete. Run `/ddd-implement` to complete implementation first."
4. **Status gate**: Read the `status` field from `requirements.md` frontmatter. If status is not `under_test`, STOP with an error: "Feature must be fully implemented and verified before promotion. Current status: {status}."
5. **Verification check**: Read `implementation.md` and locate the Testing/Verification section. If no verification results are present or if results show failures, warn the user. Use `AskUserQuestion`:
   - **Header**: "Verification Warning"
   - **Question**: "No passing verification results found in implementation.md. The implementation may not have been fully verified."
   - **Options**:
     1. **Proceed** — "Continue with promotion anyway"
     2. **Abort** — "Cancel and verify first"
6. **Inventory**: Note the presence of optional files: `scenarios/`, `index.md`, `api.md`, `data-model.md`. These will be carried forward during promotion.

Present a summary to the user:

```
## Pre-flight Summary

**Source**: [source path]
**Target**: [target path] — [exists | will be created]

**Files to promote**:
- requirements.md
- plan.md
- implementation.md
- [optional files found]

**Mode**: [Create | Merge]
```

Use `AskUserQuestion` to confirm before proceeding:

- **Header**: "Promote"
- **Question**: The pre-flight summary above.
- **Options**:
  1. **Proceed** — "Continue with promotion"
  2. **Abort** — "Cancel"

### Pre-Promotion Verification

After the user confirms "Proceed", re-run the plan's verification commands. Code may have changed since implementation, so re-verification is the default.

Use `AskUserQuestion`:

- **Header**: "Verification"
- **Question**: "Re-running the plan's verification commands to ensure tests still pass. You can skip this if you've just verified manually."
- **Options**:
  1. **Verify** — "Run verification commands from plan.md's verification phase (recommended)"
  2. **Skip** — "I've already verified, proceed without re-running"

If **Verify**: parse `plan.md`'s verification phase and execute all runnable commands (e.g., `npm run test`, `npm run build`). If any fail, present the failures and ask whether to proceed anyway or abort. If all pass, continue to step 3.
If **Skip**: continue to step 3.

## 3. Context Loading

Use the Agent tool to spawn subagents **in parallel**:

**Subagent A — Source docs**: Read all files in the source folder (including all files in `scenarios/` if it exists). Return the full content of each file.

**Subagent B — Target docs** (only if target folder exists): Read all files in the target folder (including all files in `scenarios/` if it exists). Return the full content of each file.

**Subagent C — Roadmap**: Read all files in `docs/roadmap/`. Return the filename and title of each roadmap item.

## 4. Promotion

Branch based on whether the target folder exists.

### 4.1 Create Mode (target does not exist)

1. Create the target folder.
2. Copy all files from the source folder into the target folder.
3. Update the `status` field in the target's `requirements.md` frontmatter from `draft` (or whatever it is) to `released`.
4. If `scenarios/` exists in the source, create the `scenarios/` subfolder in the target and copy all `.feature` files.

No merge logic needed — this is a straightforward transfer.

### 4.2 Merge Mode (target already exists)

This is the core of the skill. Each file type is merged at the **section/requirement level**, not by replacing whole files.

#### General merge rules

- **Additive by default**: New sections, requirements, scenarios, and plan steps from the source are added to the target.
- **Conflict detection**: When the source and target define the same section or requirement (matched by heading or ID), compare their content. If they differ, flag it as a conflict.
- **Conflict resolution**: Present each conflict to the user using `AskUserQuestion`:
  - **Header**: "Conflict"
  - **Question**: Show the section heading/requirement ID, the target version (current), and the source version (incoming). Keep both versions concise — trim to the relevant diff if sections are long.
  - **Options**:
    1. **Combine both** — "Merge both versions together"
    2. **Keep target** — "Keep the existing product version"
    3. **Use source** — "Replace with the incoming change version"
    4. **Manual** — "I'll provide a merged version"
  - If the user picks **Manual**, use `AskUserQuestion` to ask them to provide the merged content.

#### File-specific merge strategies

**requirements.md**:

- Merge frontmatter: update `status` to `released`. Preserve the target's `id` and `title`. If tags differ, union them.
- Merge sections by heading (`## Intent`, `## Context & Background`, `## Decisions`, `## Scope`, `## Functional Requirements`, `## Non-Functional Requirements`, `## Acceptance Criteria`).
- For `## Functional Requirements` and `## Non-Functional Requirements`: merge at the individual requirement level (matched by requirement ID). New IDs are appended. Matching IDs with different content trigger a conflict.
- For `## Decisions`: append new rows to the table. If a decision with the same name exists, trigger a conflict.
- For `## Scope`: union the in-scope and out-of-scope lists. Flag contradictions (same item in both).
- For `## Acceptance Criteria`: append new criteria. If a criterion references the same requirement IDs and describes the same condition, trigger a conflict.

**plan.md**:

- Append new phases and steps from the source after the target's existing phases.
- If the source defines steps in a phase that already exists in the target (matched by phase heading), append the new steps at the end of that phase.
- Do not remove or modify existing steps in the target.

**scenarios/** (`.feature` files):

- New `.feature` files (not present in target) are copied into the target's `scenarios/` folder.
- If a `.feature` file with the same name exists in both, merge at the scenario level: new `Scenario:` blocks are appended. If a scenario with the same name exists, trigger a conflict.
- After merging all `.feature` files, regenerate `scenarios/index.md` to reflect the combined set of scenarios. Apply the `audit-index` skill to format it.

**implementation.md**:

- Merge the `## Files Changed` section: union the created/modified file lists.
- Append new entries to `## Key Decisions`.
- Append new entries to `## Deviations from Plan`.
- Append new entries to `## Testing` and `## Dependencies`.
- For `## Overview`: if content differs, trigger a conflict — the user should write a combined overview.

**api.md** and **data-model.md**:

- Merge at the section heading level. New sections are appended. Sections with the same heading trigger a conflict if content differs.

**index.md**:

- Will be regenerated in step 6, so skip merging this file.

#### After merge

Present a merge summary:

```
## Merge Summary

**Sections added**: [count]
**Sections updated** (via conflict resolution): [count]
**Conflicts resolved**: [count] (N kept target, M used source, K manual)
**Files added**: [list of new files]
```

### 4.3 Post-Merge Consistency Check

After the merge completes (in Merge mode) or files are written (in Create mode), verify the combined target is internally consistent:

1. **Dangling references**: All requirement IDs referenced in `plan.md`, `scenarios/`, and `implementation.md` must exist in the target's `requirements.md`. Flag any dangling references.
2. **Duplicate IDs**: No duplicate requirement IDs, scenario IDs, or decision names across the merged content.
3. **Scope contradictions**: No item appears in both "In Scope" and "Out of Scope" in the merged `requirements.md`.
4. **Term consistency**: Entity names and domain terms are consistent across all files in the target folder.

If any issues are found, present them to the user using `AskUserQuestion`:

- **Header**: "Post-Merge Issues"
- **Question**: List each issue with context.
- **Options**:
  1. **Fix** — "Resolve these issues before continuing"
  2. **Proceed** — "Continue despite these issues"
  3. **Abort** — "Cancel the promotion"

If the user chooses **Fix**: address each issue interactively (ask the user for resolution on ambiguous items). If **Proceed**: continue to cleanup. If **Abort**: STOP — do not delete the source folder (target may have been modified).

## 5. Cleanup

After successful promotion:

1. Delete the entire source folder from `docs/changes/` (including all files and subdirectories).
2. Confirm deletion to the user: "Deleted [source path]."

## 6. Index Update

Update the affected index files:

1. If `docs/product/index.md` exists, add an entry for the promoted feature (if not already present) and invoke the `audit-index` skill to reformat it.
2. If `docs/changes/index.md` exists, remove the entry for the deleted source folder and invoke the `audit-index` skill to reformat it.
3. If a new `index.md` was created or needs to be created in the target folder, invoke the `audit-index` skill on it.

## 7. Roadmap Cross-Reference

Check `docs/roadmap/` for a roadmap item that matches the promoted feature (match by title, ID, or keyword overlap with the target folder name).

- If a match is found, present it to the user: "Roadmap item [filename] appears to match this feature. Would you like to update it?"
  - If yes, add a link to the product folder and mark the relevant deliverable as complete.
  - If no, skip.
- If no match is found, inform the user: "No matching roadmap item found. Skipping."

## 8. Summary

Present a final summary:

```
## Promotion Complete

**Source**: [source path] — deleted
**Target**: [target path] — [created | updated]

### Files Promoted
- [list of files in target folder]

### Index Updates
- [list of index files updated]

### Roadmap
- [roadmap update summary or "No matching item found"]
```

## Rules

- **Never modify files outside scope**: Only modify files in the source folder, target folder, index files, and roadmap files. Do not touch any other files.
- **Read before writing**: Always read current file content before modifying. Preserve existing content unless a merge decision says otherwise.
- **Atomic operation**: If any step fails after files have been written to the target, do NOT delete the source folder. Only delete the source after all target writes succeed.
- **No guessing**: If a merge conflict is ambiguous, always ask the user. Do not silently pick a side.
- **Preserve IDs**: Never change requirement IDs, scenario IDs, or feature IDs during promotion. The target's IDs take precedence if there is a collision.
- **Status update**: Always set the `status` field in the promoted `requirements.md` to `released`.
- **Format after completion**: After all promotion steps are complete (after index updates), run `npm run format` to ensure consistent formatting across all created and modified files.
