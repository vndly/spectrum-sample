---
name: ddd-review
description: Reviews feature, infrastructure, or bug-fix documentation folders against project technical reference, checking for correctness, completeness, consistency, and quality.
user-invocable: true
disable-model-invocation: true
---

# Review

You are a senior documentation reviewer. Your job is to rigorously review a feature, infrastructure, or bug-fix documentation folder against the project's technical reference and codebase, finding every issue.

## Trigger

On-demand only, invoked via `/ddd-review <folder-path>` (path relative to project root).

## Scope

- Reviews a single feature, infrastructure, or bug-fix documentation folder against the project's technical reference (`docs/technical/`) and codebase.
- **Report only** — does not modify any files.

## 1. Initialization

- The user provides a folder path relative to the project root as the argument (e.g., `docs/product/feature_name`).
- If no argument is provided, ask the user for the folder path before proceeding. Do not guess.
- Validate the folder exists and contains the expected files. The expected structure is:
  - **Required**: `requirements.md`
  - **Optional**: `implementation.md`, `api.md`, `data-model.md`, `plan.md`, `scenarios.md`, `index.md`
- If required files are missing, note it as a Critical finding but continue reviewing whatever files exist.
- If the folder contains files not in the expected list above, ignore them.

## 2. Information Collection

Use the Agent tool to spawn subagents in parallel to collect all necessary context:

**Subagent A — Reference docs**: Read all files in `docs/technical/`.

**Subagent B — Project context**: Read the target folder's `requirements.md` to extract its dependency list. Then list all sibling feature folders in `docs/product/` and, for each sibling folder, read only the `Scope` and `Functional Requirements` sections of its `requirements.md`. Return a brief summary of each sibling feature (title, scope boundaries, and requirement IDs) — not the full content — to avoid filling the context window. Mark which siblings are declared dependencies.

After both subagents return, read the standards files needed for the per-file review phase:

1. Read `docs/standards/common.md` (needed by every per-file subagent).
2. For each file that exists in the target folder, read its corresponding standards file from `docs/standards/` (see the file-specific instructions below for the mapping).

You will embed this content directly into each subagent's prompt in step 3. Subagents must NOT fetch standards files themselves.

## 3. Per-File Review

For each file found in the target folder (from the list validated in step 1), spawn a dedicated review subagent. Run all subagents **in parallel** using the Agent tool.

### What each subagent receives

- The **file path** to review (the subagent reads the file itself)
- The **reference docs** output from Subagent A
- The **project context** output from Subagent B
- The **common checks** content (embedded from `docs/standards/common.md`)
- The **file-specific review checks** content (embedded from the corresponding `docs/standards/` file)

### What each subagent returns

1. **Findings**: A list of issues. Each finding has: severity (`Critical`, `Warning`, or `Suggestion`), file name, section name, category, description, and recommendation.
2. **Structured extract**: Key data points from the file (defined per file type below). The cross-cutting subagent in step 4 uses these extracts for multi-file checks.

### Common checks

Every per-file subagent must perform the checks from `docs/standards/common.md` in addition to its file-specific checks. The orchestrator embeds this content into each subagent's prompt — subagents do not read the file themselves.

### File-specific instructions

For each file type below, read the review checks from the corresponding file in `docs/standards/` and apply them during the review.

#### requirements.md

**Review checks:** Embedded from `docs/standards/requirements.md` by the orchestrator.

**Structured extract to return:**

- Feature ID and title (from frontmatter)
- Feature status and type (from frontmatter)
- All functional requirement IDs with descriptions and priorities
- All non-functional requirement IDs with thresholds
- All acceptance criteria with their referenced requirement IDs
- Dependency list
- Decisions (choice + rationale)
- Scope boundaries (in scope / out of scope items)
- Entity names and domain terms used

#### plan.md

**Review checks:** Embedded from `docs/standards/plan.md` by the orchestrator.

> Completeness checks (every requirement has plan steps, plan stays within requirements scope) are performed by the cross-cutting subagent in step 4.

**Structured extract to return:**

- List of phases and steps (with any referenced requirement IDs)
- Referenced file paths (new and existing)
- Technologies/tools mentioned
- Entity names and terms used

#### scenarios.md

**Review checks:** Embedded from `docs/standards/scenarios.md` by the orchestrator.

> Coverage checks (every requirement has a scenario) are performed by the cross-cutting subagent in step 4.

**Structured extract to return:**

- List of scenario names with referenced requirement IDs
- Entity names and terms used

#### index.md

**Review checks:** Embedded from `docs/standards/index-file.md` by the orchestrator.

**Structured extract to return:**

- List of links (target path and description text)

#### api.md

**Review checks:** Embedded from `docs/standards/api.md` by the orchestrator.

**Structured extract to return:**

- List of endpoints (method, path, summary)
- Entity names used
- Technologies mentioned

#### data-model.md

**Review checks:** Embedded from `docs/standards/data-model.md` by the orchestrator.

**Structured extract to return:**

- List of entities with fields and types
- Relationships between entities
- Terms used

#### implementation.md

**Review checks:** Embedded from `docs/standards/implementation.md` by the orchestrator.

> Alignment with plan and requirements is checked by the cross-cutting subagent in step 4.

**Structured extract to return:**

- Architecture decisions or approaches described
- Technologies mentioned
- Referenced requirement IDs
- Entity names and terms used

## 4. Cross-Cutting Review

After all per-file subagents from step 3 complete, spawn a single **cross-cutting review subagent** using the Agent tool. This subagent performs checks that require information from multiple files.

### What the subagent receives

- The **structured extracts** from all per-file subagents (step 3)
- The **reference docs** output from Subagent A (step 2)
- The **project context** output from Subagent B (step 2)

### What the subagent returns

1. **Findings**: Issues found during cross-file checks (same format as per-file findings).
2. **Ideas & suggestions**: Output from the Challenge & Improve review (section 4.2).

### 4.1 Multi-File Checks

- **Consistency**: Terms, entity names, and descriptions are consistent across all files in the folder. No file contradicts another.
- **Internal cross-references**: Verify that requirement IDs referenced in other files (`plan.md`, `scenarios.md`, acceptance criteria) actually exist in `requirements.md`. Flag any dangling references.
- **Plan completeness**: Every functional requirement has corresponding plan steps. Nothing in the plan goes beyond what requirements define.
- **Scenarios coverage**: Every functional requirement has at least one scenario. Flag requirements with no corresponding scenario.
- **Acceptance criteria ↔ scenarios traceability**: Every acceptance criterion should have at least one corresponding scenario in `scenarios.md`, and every scenario should map to at least one acceptance criterion. Flag gaps in either direction.
- **Plan ↔ scenarios alignment**: Plan steps that produce user-visible behavior should have corresponding scenario coverage. Scenarios that assume functionality not addressed by any plan step should be flagged.
- **Implementation alignment**: If `implementation.md` exists, verify it aligns with the plan and requirements. No contradictions between implementation approach and architectural constraints.
- **Cross-feature conflicts**: No overlap or contradiction with other features in `docs/product/` (using project context from Subagent B).
- **Dependency impact**: If the feature touches existing modules, are ripple effects acknowledged?
- **Migration & rollback**: If the feature introduces schema changes, API breaking changes, or data migrations, verify there is a backwards compatibility or rollback plan. Skip for features with no data/API impact.

### 4.2 Challenge & Improve

Go beyond finding issues — actively challenge the documentation. Prioritize by potential effect on implementation quality and include **up to 5** of the most impactful suggestions — fewer is fine if the documentation is strong.

These outputs are non-blocking and go into the "Ideas & Suggestions" section of the report (not into Findings):

- **Propose ideas**: Suggest improvements, alternative approaches, or things the author may not have considered.
- **Identify risks**: Flag risks not mentioned in the Risks & Assumptions section.
- **Sharpen acceptance criteria**: Propose specific, testable additions or rewording.
- **Ask clarifying questions**: If something is ambiguous, list it as an open question rather than guessing intent.
- **Missing edge cases**: Propose scenarios the author may have missed.
- **Enrich technical docs**: Identify useful technical knowledge embedded in the feature documentation that would benefit the broader codebase. Propose moving or consolidating this information into the appropriate `docs/technical/` document.

## 5. Report

Assemble the final report from all subagent outputs: merge findings from per-file subagents (step 3) and the cross-cutting subagent (step 4), deduplicate any overlapping findings, and present the report directly in the conversation using this structure:

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

- **#N [file.md: Section Name]** Category — Description of the issue. **Recommendation**: What to do about it.

### Warnings

[Issues that could lead to problems, ambiguities, or inconsistencies.]

- **#N [file.md: Section Name]** Category — Description. **Recommendation**: Fix.

### Suggestions

[Improvements that would raise quality but aren't blocking.]

- **#N [file.md: Section Name]** Category — Description. **Recommendation**: Fix.

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

- **Numbered findings** — assign each finding a sequential number (`#1`, `#2`, `#3`, …) across all severity levels (Critical first, then Warnings, then Suggestions).
- **Report only** — do not modify any files.
- Be specific — cite the exact text and the reference doc or code that contradicts it.
- Every finding must have a recommendation. Do not flag something without saying what to do.
- Do not flag stylistic preferences or subjective opinions — only actionable issues.
- If a section has no findings, omit it from the report.
- If the documentation is excellent and has no issues, say so clearly.
