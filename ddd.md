# Document Driven Development (DDD)

Document Driven Development (DDD) is a development framework where every code change — whether a new feature, a bug fix, or an infrastructure task — begins with a curated set of documents produced in a specific order. An AI coding agent then ingests those documents and generates the implementation.

These documents include implementation plans, validation scenarios, API contracts, data models, and post-implementation records. Together they form a comprehensive paper trail that governs the full lifecycle of a change, from idea to shipped code.

The core thesis is simple: **the quality of AI-generated code is directly proportional to the quality of the documents it ingests.** By investing in well-structured, reviewed, and standards-compliant documents, the team controls the output rather than hoping for good results from vague prompts.

## Why DDD?

AI coding agents produce inconsistent results when given ad-hoc instructions. The same prompt phrased differently can yield fundamentally different implementations. DDD solves this by replacing ad-hoc prompting with a structured document pipeline.

**Structured context produces better output.** When the AI agent receives detailed requirements, a phased implementation plan, and validation scenarios — all reviewed against project standards — it generates code that reflects the team's intent rather than its own assumptions.

**Shared understanding before code.** Documents force the team to articulate what they want, why they want it, and how they will validate it — before any code is written. Ambiguities surface during document review, not during code review.

**Cheap iteration.** Catching problems in documents takes minutes to fix. Catching them in code takes hours to debug and refactor. DDD shifts iteration to the cheapest possible phase.

**Auditability.** Every decision, requirement, trade-off, and scope boundary is captured in documents. When someone asks "why was it built this way?" months later, the answer is in the document trail, not in someone's memory.

**Living memory.** The document set for each change serves as a permanent record. When the team revisits a feature, the full reasoning — not just the code — is preserved.

## Document Types

DDD defines six document types, produced in a specific order. The first three are required for every change; the remaining three are used when the change warrants them.

### Required Documents

#### 1. Requirements (`requirements.md`)

Defines what the system must do and why. This is the starting point for every change.

- **Purpose**: Capture the intent, scope, functional requirements, non-functional requirements, constraints, and acceptance criteria for a change.
- **When produced**: First. The team starts here.
- **Who produces it**: The team, with AI assistance. The AI helps structure and draft; the team reviews and refines.
- **Key sections**: Intent, context and background, decisions (choice + rationale), scope boundaries (in/out), functional requirements table, non-functional requirements, acceptance criteria.

#### 2. Plan (`plan.md`)

A phased, step-by-step implementation plan that the AI agent will follow to write code.

- **Purpose**: Break the requirements into concrete, ordered implementation steps. Each step should be specific enough that two developers (or agents) following the plan independently would produce the same result.
- **When produced**: After requirements are reviewed and approved.
- **Who produces it**: The AI agent, from the requirements. The team reviews and refines.
- **Key sections**: Phases with numbered steps and checkboxes, file paths, dependencies between steps, verification phase, testing phase.

#### 3. Scenarios (`scenarios.md`)

Validation scenarios in Gherkin format that define the observable behaviors the implementation must satisfy.

- **Purpose**: Define the contract between requirements and implementation in a testable format. Cover happy paths, error paths, edge cases, and boundary values.
- **When produced**: After requirements are reviewed, typically alongside the plan.
- **Who produces it**: The AI agent, from the requirements. The team reviews and refines.
- **Key sections**: Feature blocks, scenarios grouped by requirement, scenario outlines with data tables for variations.

### Optional Documents

#### 4. API Specification (`api.md`)

Documents the API endpoints, request/response schemas, error handling, and authentication relevant to the change.

- **When to include**: When the change introduces or modifies API interactions.
- **Who produces it**: The team or AI agent, depending on whether the API is being designed or documented.

#### 5. Data Model (`data-model.md`)

Documents data structures, schemas, relationships, indexes, and constraints relevant to the change.

- **When to include**: When the change introduces or modifies persisted data structures.
- **Who produces it**: The team or AI agent.

#### 6. Implementation Record (`implementation.md`)

Post-implementation record documenting what was actually built, including files created or modified, key decisions, deviations from the plan, and verification results.

- **When to include**: After implementation is complete.
- **Who produces it**: The AI agent, after writing the code. This document closes the loop — it records what happened, not what was planned.

## Directory Structure

DDD organizes documents into directories that reflect the lifecycle of a change.

| Directory    | Purpose                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `roadmap/`   | Future changes not yet started. Each item is a high-level description of a planned feature or improvement, ordered by priority.                        |
| `changes/`   | In-progress change requests. When the team decides to start working on a roadmap item, it moves here and the team begins creating its document set.    |
| `product/`   | Completed changes. Moved here from `changes/` when the team accepts the implementation.                                                                |
| `standards/` | Review checklists for each document type. These govern how documents are written and reviewed.                                                         |
| `technical/` | Application-level rules. These govern how the application is built.                                                                                    |
| `reference/` | Project context: product vision, glossary, setup guide, deployment instructions. Useful for onboarding and for the AI agent to understand the project. |

## Workflow

The DDD workflow has five phases. Each phase has clear inputs, outputs, and quality gates.

### Phase A: Specification

1. **Create requirements** — The team drafts `requirements.md` for a new change, placing it in a new subdirectory under `changes/`. An AI skill can assist with structuring the document: defining intent, scope boundaries, functional requirements, and acceptance criteria.
2. **Review requirements** — The team uses a review skill to validate the requirements against the project's technical reference. The skill produces a structured report with findings by severity (Critical, Warning, Suggestion).
3. **Refine requirements** — The team iterates on the requirements based on review findings until satisfied.

### Phase B: Planning

4. **Generate plan and scenarios** — The team instructs the AI agent to generate `plan.md` and `scenarios.md` from the approved requirements. The agent reads the requirements and technical reference to produce implementation steps and validation scenarios.
5. **Review plan and scenarios** — The team uses the review skill on the full folder to check plan completeness (every requirement has implementation steps), scenario coverage (every requirement has validation scenarios), and cross-document consistency.
6. **Refine plan and scenarios** — The team iterates until the documents are consistent and complete.

### Phase C: Implementation

7. **Implement** — The team instructs the AI agent to implement the change. The agent reads all documents in the change folder plus the technical reference and writes the code. After implementation, the agent generates `implementation.md` documenting what was built.
8. **Code review** — The team uses a code review skill to audit the changed files against the project's technical reference.

### Phase D: Validation

9. **Test** — The team validates the implementation against the scenarios in `scenarios.md`. This may involve manual verification, automated test generation from scenarios, or a combination.

### Phase E: Completion

10. **Complete** — When satisfied, the team moves the change folder from `changes/` to `product/`, updates status metadata, and updates index files.

## Standards

DDD enforces document quality through a two-tier review system. Common checks apply to every document regardless of type, ensuring baseline quality across the entire set. File-specific checks add validation rules tailored to each document type.

### Mechanical Enforcement

Standards are not enforced by convention alone. AI-powered review skills read the standards and systematically check every document against them. The review skill produces a structured report with numbered findings, severities, and recommendations — eliminating the "we should have caught that" problem.

## Principles

Seven principles guide the framework:

1. **Documents before code.** No code is written until the document set is reviewed and approved. The investment in documents pays for itself by preventing rework.

2. **Precise over vague.** Every requirement must be unambiguous, complete, consistent, and verifiable. The "two-developer test" is the bar: a requirement or plan step should be specific enough that two developers following it independently would produce the same result.

3. **AI as collaborator, human as curator.** The AI agent generates and reviews documents, but the human team makes all approval decisions. The AI handles volume and consistency; the human handles intent and judgment.

4. **Iterate cheaply.** Catch problems in documents (minutes to revise) rather than in code (hours to refactor). The document pipeline is designed so that the most expensive mistakes are caught at the cheapest phase.

5. **End-to-end traceability.** Every requirement traces forward to plan steps, validation scenarios, and acceptance criteria. Every implementation detail traces back to a requirement. The review system checks these traces mechanically.

6. **Standards-enforced quality.** Document quality is checked mechanically, not left to human judgment alone. Common checks plus file-specific checks ensure that every document meets a consistent quality bar.

7. **Separation of concerns.** Rules about documents (standards) are separate from rules about the application (technical reference). The framework itself can evolve independently from the application it governs.

## Tooling

DDD is tool-agnostic in principle but benefits greatly from AI-powered automation. The current implementation uses skills to automate four key functions:

- **Document creation** — An AI skill acts as a technical writer, helping the team draft and structure documents according to standards.
- **Document review** — A review skill spawns parallel sub-agents to check each document against common and file-specific standards, then performs cross-cutting checks for multi-document consistency.
- **Code review** — After implementation, a code review skill audits changed files against the project's technical reference across multiple specialized areas.
- **Index formatting** — An index formatting skill ensures that index files follow a consistent structure, staying in sync with the filesystem.

These skills can be implemented with any AI coding agent that supports custom commands or extensions. The key requirement is that the skills have access to both the document standards and the project's technical reference so they can perform mechanical enforcement.
