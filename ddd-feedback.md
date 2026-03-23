# DDD Framework Feedback

Its main challenges are around handling small changes (where the process overhead may not be justified) and managing document staleness after shipping.

DDD could incorporate TDD within the implementation phase. Currently the framework does not prescribe how the AI agent writes tests during implementation, which is a gap.

Heavy Process for Small Changes:
The minimum document set (requirements + plan + scenarios) is appropriate for features with dozens of functional requirements. But for a bug fix that changes one line, or a quick UI tweak, writing formal requirements with frontmatter, a phased plan, and Gherkin scenarios is disproportionate overhead. The framework does not distinguish between change sizes or provide a lightweight path for trivial changes.

## Improvement Suggestions

### 1. Add a Lightweight Path for Small Changes

Define a threshold (e.g., changes touching fewer than 3 files, bug fixes with a clear root cause) below which the full document pipeline is optional. A "quick change" template might require only a brief description, the files affected, and a single acceptance criterion. This preserves the spirit of documentation without the overhead.

## Document Ordering

The current ordering — requirements, then plan, then scenarios — is mostly sound, but there is a valid argument for generating scenarios before or alongside the plan.

**Alternative order (requirements -> scenarios -> plan):** Generating scenarios first would force the team to think about validation before implementation, more aligned with BDD and TDD principles. Edge cases discovered during scenario writing would be available when the plan is generated, potentially producing a more robust plan.

**Practical note:** In the current workflow, both plan and scenarios are generated from requirements in the same step, so the ordering is somewhat moot — they are produced together. However, the review process should check that scenarios influenced the plan, not just that they are consistent with it.

## Human-AI Collaboration Model

The collaboration model is well-designed: humans own the requirements and all approval decisions; the AI handles generation and mechanical review. This avoids the failure mode of fully autonomous AI development (where the AI builds the wrong thing) while leveraging AI for the tasks it does well (applying standards consistently, generating comprehensive scenarios, reviewing against checklists).

One concern: the framework relies heavily on the team's ability to review AI-generated documents and catch semantic errors. As documents become more complex, this review burden grows. The standards and review skills help, but they cannot substitute for domain understanding. Teams adopting this framework should invest in document review skills as a core competency.

## Scalability Concerns

### Document Volume

As the project grows, `product/` will accumulate many feature folders. Navigation and cross-referencing become harder. The index files help, but searching for "where did we decide X?" across dozens of feature folders is cumbersome. A search-friendly format or cross-referencing tool would help.

### Context Window Limits

The AI agent's ability to ingest all documents depends on context window size. A project with 50 features, each with 6 documents, produces 300+ documents. Not all of these fit in a single context window. The framework should document a prioritization strategy (e.g., always include the change folder + technical reference; include product documents only when referenced as dependencies).

### Standards Maintenance

As standards evolve, previously shipped features may not conform to current standards. Re-reviewing old documents against new standards could generate noise. The framework should clarify whether standards are versioned or whether `product/` documents are expected to conform to the standards that were current when they shipped.

### Multi-Person Teams

The framework is currently optimized for a single developer working with an AI agent. In a multi-person team, document ownership, review assignments, and conflict resolution need additional process. Who reviews the requirements? Can two team members work on overlapping changes simultaneously? These questions are not yet addressed.
