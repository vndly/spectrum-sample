# Workflow

The DDD workflow has five phases. Each phase has clear inputs, outputs, and quality gates.

## Phase A: Specification

1. **Create requirements** — The team drafts `requirements.md` for a new change, placing it in a new subdirectory under `changes/`. An AI skill can assist with structuring the document: defining intent, scope boundaries, functional requirements, and acceptance criteria.
2. **Review requirements** — The team uses a review skill to validate the requirements against the project's standards and technical reference. The skill produces a structured report with findings by severity (Critical, Warning, Suggestion).
3. **Refine requirements** — The team iterates on the requirements based on review findings until satisfied.

## Phase B: Planning

4. **Generate plan and scenarios** — The team instructs the AI agent to generate `plan.md` and `scenarios.md` from the approved requirements. The agent reads the requirements and technical reference to produce implementation steps and validation scenarios.
5. **Review plan and scenarios** — The team uses the review skill on the full folder to check plan completeness (every requirement has implementation steps), scenario coverage (every requirement has validation scenarios), and cross-document consistency.
6. **Refine plan and scenarios** — The team iterates until the documents are consistent and complete.

## Phase C: Implementation

7. **Implement (test-first)** — The team instructs the AI agent to implement the change. The agent reads all documents in the change folder plus the technical reference and follows a test-first cycle. After implementation, the agent generates `implementation.md` documenting what was built.
8. **Code review** — The team uses a code review skill to audit the changed files against the project's technical reference.

## Phase D: Completion

9. **Complete** — When satisfied, the team moves the change folder from `changes/` to `product/`, updates status metadata, updates index files, and updates any existing `product/` documents affected by the change (e.g., a bug fix that alters behavior documented in a previously shipped feature).
