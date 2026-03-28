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
- After review, the user triages each finding interactively. Findings marked **Fix** are applied directly to the documentation files. Findings marked **Skip** are preserved in the final report. Findings marked **Ignore** are discarded entirely and excluded from the final report.

## 1. Initialization

- The user provides a folder path relative to the project root as the argument (e.g., `docs/product/feature_name`).
- If no argument is provided, ask the user for the folder path before proceeding. Do not guess.
- Validate the folder exists and contains the expected files. The expected structure is:
  - **Required**: `requirements.md`
  - **Optional**: `implementation.md`, `api.md`, `data-model.md`, `plan.md`, `scenarios/` (`.feature` files and `index.md`), `index.md`
- If required files are missing, note it as a Critical finding but continue reviewing whatever files exist.
- If the folder contains files not in the expected list above, ignore them.
- **Status update**: Read the `status` field from the target folder's `requirements.md` frontmatter. If the current status is `draft`, `approved`, or `planned`, update it to `review`. If the status is `in_development`, `under_test`, or `released`, do not change it — the review is informational only for features past the approval stage.

## 2. Information Collection

Use the Agent tool to spawn subagents in parallel to collect all necessary context:

**Subagent A — Reference docs**: Read all files in `docs/technical/`.

**Subagent B — Project context**: Read the target folder's `requirements.md` to extract its dependency list. Then list all sibling feature folders in both `docs/product/` and `docs/changes/` (excluding the folder being reviewed). For each sibling folder, read only the `Scope` and `Functional Requirements` sections of its `requirements.md`. Return a brief summary of each sibling feature (title, scope boundaries, and requirement IDs) — not the full content — to avoid filling the context window. Mark which siblings are declared dependencies.

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

#### scenarios/

The `scenarios/` folder contains one `.feature` file per requirement. Spawn a single subagent that reads all `.feature` files in the folder and reviews them together. If `scenarios/index.md` exists, also review it using the `index.md` review checks (from `docs/standards/index-file.md`).

**Review checks:** Embedded from `docs/standards/scenarios.md` by the orchestrator. For `scenarios/index.md`, also embed `docs/standards/index-file.md`.

> Coverage checks (every requirement has a scenario) are performed by the cross-cutting subagent in step 4.

**Structured extract to return:**

- List of `.feature` files with their Feature names
- List of scenario IDs and names with referenced requirement IDs
- Entity names and terms used
- `scenarios/index.md` links and descriptions (if present)

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
- **Internal cross-references**: Verify that requirement IDs referenced in other files (`plan.md`, `scenarios/`, acceptance criteria) actually exist in `requirements.md`. Flag any dangling references.
- **Plan completeness**: Every functional requirement has corresponding plan steps. Nothing in the plan goes beyond what requirements define.
- **Scenarios coverage**: Every functional requirement has at least one scenario. Flag requirements with no corresponding scenario.
- **Acceptance criteria ↔ scenarios traceability**: Every acceptance criterion should have at least one corresponding scenario in `scenarios/`, and every scenario should map to at least one acceptance criterion. Flag gaps in either direction.
- **Plan ↔ scenarios alignment**: Plan steps that produce user-visible behavior should have corresponding scenario coverage. Scenarios that assume functionality not addressed by any plan step should be flagged.
- **Scenario ↔ test traceability**: Every scenario ID in `scenarios/` must be referenced by at least one test step in the plan's testing phase. Flag orphan scenarios (defined but never referenced by a test). Flag test steps that lack both scenario references and an `(implementation detail)` justification.
- **Implementation alignment**: If `implementation.md` exists, verify it aligns with the plan and requirements. No contradictions between implementation approach and architectural constraints.
- **Cross-feature conflicts**: No overlap or contradiction with other features in `docs/product/` or `docs/changes/` (using project context from Subagent B).
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

## 5. Report Assembly

Assemble the findings from all subagent outputs: merge findings from per-file subagents (step 3) and the cross-cutting subagent (step 4), and deduplicate any overlapping findings. Do **not** present the report yet — it will be rendered after triage (step 8). Keep the assembled findings, ideas, and suggestions in memory for use in steps 6–8.

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
- Be specific — cite the exact text and the reference doc or code that contradicts it.
- Every finding must have a recommendation. Do not flag something without saying what to do.
- Do not flag stylistic preferences or subjective opinions — only actionable issues.
- If a section has no findings, omit it from the report.
- If the documentation is excellent and has no issues, say so clearly.

## 6. Triage

Present each finding to the user for triage using `AskUserQuestion`, ordered by priority: all Critical findings first, then Warnings, then Suggestions.

### Pre-triage

Before item-by-item triage, present a summary of findings by severity and offer batch operations using `AskUserQuestion`:

- **Header**: "Triage"
- **Question**: `N critical | M warnings | K suggestions. You can batch-process entire severity levels or triage individually.`
- **Options**:
  1. **Triage individually** — "Review each finding one by one"
  2. **Fix all warnings** — "Auto-fix all warnings, triage critical and suggestions individually"
  3. **Fix all suggestions** — "Auto-fix all suggestions, triage critical and warnings individually"
  4. **Skip all suggestions** — "Skip all suggestions, triage critical and warnings individually"
  5. **Ignore all suggestions** — "Discard all suggestions, triage critical and warnings individually"

Apply the user's batch choice to the relevant severity levels, then proceed with item-by-item triage for the remaining findings. If a severity level has no findings, omit its batch options. The user may combine batch choices where applicable (e.g., fix all warnings AND fix all suggestions).

### How to present

- Process findings in batches of up to **4 at a time**.
- Each question in the batch corresponds to one finding. Format the question as:
  - **Header**: The severity (e.g., `Critical`, `Warning`, `Suggestion`) — max 12 chars.
  - **Question**: `#N [file.md: Section] — Description of the issue. Recommendation: What to do about it.`
  - **Options**:
    1. **Fix** — "Apply the recommendation automatically"
    2. **Skip** — "Acknowledge but do not fix now"
    3. **Ignore** — "Discard this finding entirely"
    4. **Discuss** — "I have questions or want to refine this"
  - The built-in "Other" option is always available for custom input.
- Continue presenting batches until all findings have been triaged.
- After all findings are triaged, briefly summarize the decisions: how many marked Fix, Skip, Ignore, and Discuss.

## 7. Discuss & Fix

After triage is complete, process the user's decisions in the following order:

### 7.1 Discuss

For each finding the user marked **Discuss** (in finding order):

- Present the finding in full (description, context, recommendation).
- Actively engage in a conversation about it: ask clarifying questions, offer alternative approaches, or refine the recommendation based on the user's input.
- At the end of the discussion, ask the user for a final decision on the finding: **Fix** (with the agreed-upon resolution), **Skip**, **Ignore**, or provide a custom action.

### 7.2 Fix

After all discussions are resolved, collect every finding marked **Fix** (both from initial triage and from resolved discussions). Apply all fixes at once, since changes may interact with each other. When fixing:

- Edit the documentation files directly to resolve each finding.
- Follow the recommendation for each finding, adjusted by any discussion outcomes.
- After applying all fixes, briefly list what was changed and in which files.

## 8. Final Report

Re-render the report from step 5, incorporating the triage and fix outcomes:

- **Remove** all findings that were marked **Fix** (they have been resolved).
- **Remove** all findings that were marked **Ignore** — these are fully discarded as if they were never found.
- **Keep** all findings that were marked **Skip** — these remain in the report as a record of acknowledged-but-deferred issues.
- **Move** any findings that were marked **Discuss** and then resolved to **Fix** or **Ignore** out of the report. If a discussed finding was ultimately **Skipped**, keep it in the report.
- Add an **Open Discussion** section for any findings from Discuss that resulted in a custom action or open-ended outcome rather than a Fix, Skip, or Ignore.
- Update the **Summary** counts and **Verdict** to reflect only the remaining (unresolved) findings.

Present the final report using the Report Structure defined in step 5.

### Status Update

After presenting the final report, update the `status` field in the target folder's `requirements.md` frontmatter based on the verdict:

- If the verdict is **Approved** and the current status is `review`: update status to `approved`.
- If the verdict is **Needs Revision** or **Blocked**: leave status as `review`. The feature must be re-reviewed after fixes are applied.
- If the current status is `in_development`, `under_test`, or `released`: do not change the status regardless of verdict.

## Rules

- **Standards and technical docs are authoritative**: When feature documentation conflicts with `docs/standards/` or `docs/technical/`, the standards and technical docs are the source of truth. Flag the conflict — do not silently accept the feature doc's version.
- **No fix scope creep**: When applying fixes (step 7.2), only address findings the user triaged as **Fix**. Do not make additional changes, improvements, or reformatting beyond what was agreed upon.
- **Read before fixing**: Always read the current file content before editing. Fixes may interact with each other — apply them against the latest state, not a stale snapshot.
- **Severity discipline**: **Critical** = will cause implementation failures, architectural violations, or missing required content. **Warning** = could lead to problems, ambiguities, or inconsistencies. **Suggestion** = would improve quality but is not blocking. Do not inflate or deflate severity.
- **Evidence-based findings only**: Every finding must cite the specific text in the reviewed file and the reference doc or standard that contradicts it. Do not flag subjective preferences or stylistic opinions.
- **Status transitions are conditional**: Only update `requirements.md` status for features in `draft`, `approved`, or `planned` state. Never regress status for features in `in_development`, `under_test`, or `released` — those reviews are informational only.
- **Format after fixes**: After applying fixes (step 7.2), run `npm run format` to ensure consistent formatting across all modified files.
