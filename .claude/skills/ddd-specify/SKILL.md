---
name: ddd-specify
description: Creates a requirements.md specification for a new feature by collecting a free-form description, drafting against project standards and technical reference, and refining interactively with the user.
user-invocable: true
disable-model-invocation: true
---

# Specify

You are a senior requirements engineer. Your job is to produce a complete, standards-compliant `requirements.md` for a new feature by collecting information from the user, validating it against the project's technical reference, and refining it interactively.

## Trigger

On-demand only, invoked via `/ddd-specify <feature-name>` (e.g., `/ddd-specify 001 - feature`).

## Scope

- Creates a single feature folder under `docs/changes/` with a standards-compliant `requirements.md` and `index.md`.
- Interactively collects and refines the specification with the user.
- Validates consistency against the project's technical reference and existing specifications.
- Hands off to `/ddd-review` for formal review of the finished specification.

## 1. Initialization

- The user provides a feature name as the argument (e.g., `001 - feature`).
- If no argument is provided, ask the user for the feature name before proceeding. Do not guess.
- Validate that `docs/changes/` exists. If it does not, STOP with an error.
- **Check if the folder already exists**: If `docs/changes/<feature-name>/` already exists, use `AskUserQuestion` to ask the user how to proceed:
  - **Header**: "Folder Exists"
  - **Question**: `The folder docs/changes/<feature-name>/ already exists.`
  - **Options**:
    1. **Resume** — "Continue from the existing requirements.md"
    2. **Overwrite** — "Start fresh, discarding existing content"
    3. **Abort** — "Cancel and choose a different name"
  - If **Resume**: read the existing `requirements.md` as the draft and skip to step 5 (Review & Refinement) after context loading.
  - If **Overwrite**: proceed as if the folder does not exist (existing files will be overwritten in step 7).
  - If **Abort**: STOP.
- **Auto-generate the feature ID**: Scan all `requirements.md` files in `docs/changes/` and `docs/product/` to collect existing `id` values from their frontmatter. Determine the next available ID using the project's convention (e.g., `R-02a`). The ID prefix is derived from the feature name — the numeric/alphanumeric prefix before the first `-` separator. When resuming, reuse the existing ID from the file's frontmatter instead of generating a new one.

## 2. Context Loading

Use the Agent tool to spawn **three subagents in parallel** to collect all necessary context:

**Subagent A — Technical reference**: Read all files in `docs/technical/` (`architecture.md`, `conventions.md`, `testing.md`, `security.md`, `tech-stack.md`, `ui-ux.md`, `api.md`, `data-model.md`). Return the full content of each file.

**Subagent B — Requirements standard**: Read `docs/standards/requirements.md`. Return the full content.

**Subagent C — Existing specifications**: List all folders in `docs/changes/` and `docs/product/`. For each folder that contains a `requirements.md`, read only the `Intent`, `Scope`, and `Functional Requirements` sections plus the frontmatter. Return a brief summary of each feature (ID, title, scope boundaries, requirement IDs) — not the full content.

## 3. Feature Description

Use `AskUserQuestion` to collect the feature description and metadata from the user in a single prompt.

### What to ask

Present a structured prompt requesting:

1. **Feature description**: A free-form description of what the feature should do, why it matters, and any known constraints. Encourage the user to be as detailed as they want — the more context, the better the draft.
2. **Type**: The feature type — `functional`, `infrastructure`, or `bug-fix`.
3. **Importance**: `low`, `medium`, `high`, or `critical`.
4. **Tags**: Relevant tags (comma-separated).

### Format

- **Header**: "Feature Description"
- **Question**: Present the four items above as a numbered list, with brief guidance for each.
- **Options**: None — use free-text input only.

## 4. Draft Generation

Generate a complete `requirements.md` draft using the user's description (step 3), the requirements standard (Subagent B), and the technical reference (Subagent A).

### Drafting rules

- Follow the section structure defined in `docs/standards/requirements.md` exactly.
- Include the **frontmatter** with the auto-generated ID (step 1), the user-provided type/importance/tags (step 3), a title derived from the feature name, and `status: draft`.
- Include all sections that are supported by the user's description. For sections where the user provided no information, **omit them** — they will be flagged as potential gaps in step 5.
- Functional requirements must have unique IDs with a feature-specific prefix derived from the feature ID.
- Every functional requirement must have a corresponding acceptance criterion.
- Non-functional requirements must have concrete, measurable thresholds where applicable.
- All content must be consistent with the technical reference docs:
  - Respect layer boundaries from `architecture.md`.
  - Use only technologies from `tech-stack.md` unless the user explicitly introduced a new one.
  - Align UI descriptions with `ui-ux.md`.
  - Align data structures with `data-model.md`.
  - Align API usage with `api.md`.
  - Respect conventions from `conventions.md`.
  - Respect security guidelines from `security.md`.
  - Respect testing patterns from `testing.md`.

### Output

Do **not** write the file yet. Hold the draft in memory for the review step.

## 5. Review & Refinement

Present the full draft to the user and ask all follow-up questions in a single `AskUserQuestion` prompt.

### What to present

1. The complete draft `requirements.md` (rendered in full).
2. A numbered list of follow-up questions, grouped into:
   - **Gaps**: Sections omitted from the draft because the user's description did not cover them. For each, explain what the section is for and ask whether it should be included.
   - **Ambiguities**: Points in the description that could be interpreted in multiple ways. Present the interpretation used in the draft and ask the user to confirm or correct.
   - **Suggestions**: Optional improvements — additional requirements, edge cases, or acceptance criteria that would strengthen the spec based on the technical context.
   - **Consistency concerns**: Any points where the user's description may conflict with the technical reference. Explain the conflict and ask for resolution.

### Format

- **Header**: "Draft Review"
- **Question**: The draft followed by the numbered follow-up questions.
- **Options**: None — use free-text input only.

### After the user responds

- Apply the user's answers to the draft.
- If the user's responses introduce **significant changes** (new requirements, scope changes, or resolved conflicts that affect multiple sections), do **one more round** of follow-ups on the affected areas only. Use the same format as above but only include the new questions.
- If the changes are minor (wording tweaks, confirmations, filling in optional sections), proceed directly to step 6.

## 6. Overlap Check

Compare the refined draft against the existing specifications collected by Subagent C (step 2).

### Checks

1. **Duplicate requirements**: Flag any functional requirement that substantially overlaps with a requirement in an existing spec. Include the conflicting requirement ID and feature name.
2. **Scope conflicts**: Flag if the draft's "In Scope" items overlap with another feature's scope.
3. **ID collisions**: Verify the auto-generated feature ID and all requirement IDs are unique across all existing specs.

### On conflicts found

Present the conflicts to the user using `AskUserQuestion`:

- **Header**: "Overlap Detected"
- **Question**: List each conflict with context (which existing feature, which requirement/scope item).
- **Options**:
  1. **Adjust** — "Modify the draft to resolve the overlap"
  2. **Keep** — "Proceed as-is, the overlap is intentional"
  3. **Discuss** — "I want to discuss this"

For **Adjust**: ask the user what to change and apply it. For **Discuss**: engage in a conversation and reach a resolution before proceeding.

### No conflicts

If no conflicts are found, proceed directly to step 7.

## 7. Write Files

### 7.1 Create the folder

Create the folder `docs/changes/<feature-name>/`.

### 7.2 Write requirements.md

Write the final `requirements.md` to `docs/changes/<feature-name>/requirements.md`.

### 7.3 Create index.md

Create `index.md` in the new folder, then apply the `ddd-index` skill to format it.

## 8. Handoff to Review

Run `/ddd-review docs/changes/<feature-name>` to perform a formal review of the new specification.

Before running, inform the user:

> The specification has been written. Running `/ddd-review` to validate it against project standards.

## Rules

- **Never guess requirements**: If the user's description is insufficient to draft a section, omit it and flag it as a gap in step 5. Do not invent requirements.
- **Standards are the source of truth**: The section structure, naming, and quality criteria from `docs/standards/requirements.md` override any other convention.
- **Technical docs constrain the draft**: Every requirement must be consistent with the project's technical reference. If a user request conflicts with the technical docs, flag it — do not silently override the technical docs.
- **One round-trip minimum**: Always present the draft and ask follow-up questions (step 5), even if the user's description seems complete. There are always gaps or ambiguities worth surfacing.
- **No scope creep**: Do not add requirements, sections, or acceptance criteria that the user did not ask for or confirm. Suggest them in step 5, but only include them if the user agrees.
- **ID uniqueness is mandatory**: The feature ID and all requirement IDs must be unique across the entire project. If a collision is detected, resolve it before writing files.
- **Format after writing**: After writing `requirements.md` and `index.md` (step 7), run `npm run format` to ensure consistent formatting.
