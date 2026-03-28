# Documentation Driven Development (DDD)

DDD is a structured but flexible development framework where every code change begins with documentation — not code. A curated set of documents governs the full lifecycle of a change, from idea to shipped code, transforming chaotic software development into a systematic, repeatable methodology that consistently delivers results aligned with your vision.

## Motivation

### The knowledge problem

**Trapped knowledge.** Knowledge lives in people's heads and leaves when they do.
**Fragmented documentation.** Documentation is written after the fact (if at all), often buried where nobody reads nor updates it, or scattered across wikis, issue trackers, and chat messages — where design decisions are debated and forgotten.
**Ambiguous requirements.** Requirements are interpreted differently by different developers.

### The consequences

**Silent technical debt.** Debt accumulates silently — nobody documents the trade-offs or constraints that justify it.
**Missing validation contract.** Test cases are written after implementation, shaped by what the code does rather than what it should do — so tests pass even when behavior is wrong.
**Onboarding by archaeology.** New developers have to reverse-engineer intent from code.

## Principles

### Foundation

**Documentation, not the code, becomes the primary artifact.** Documentation is the source that generates implementation. Code is an expression of that documentation in a particular language and framework — not the other way around. Documents are dual-audience: structured enough for machines to process, human-friendly enough for developers to actually maintain. This moves the lingua franca of development to a higher level, making the work accessible to anyone, not just those fluent in the codebase.

**Documents before code.** No code is written until the document set is reviewed and approved. Documents force the team to articulate what they want, why they want it, and how they will validate it — surfacing ambiguities during document review, not code review. This ensures that developers, testers, designers, and managers share the same understanding of what to build, preventing assumptions and misalignments before they reach code.

**Single source of truth.** For any given concern, exactly one document is authoritative. Knowledge is externalized into documents, not trapped in individuals — a team member leaving doesn't create a knowledge vacuum, and new developers get up to speed by reading the document set rather than reverse-engineering code.

### Quality & Process

**Precise over vague.** Every requirement must be unambiguous, complete, consistent, and verifiable. The "two-developer test" is the bar: a requirement or plan step should be specific enough that two developers following it independently would produce the same result. This extends to AI agents — given the same document set, any competent agent should produce substantially similar output.

**Standards-enforced quality.** Document quality is checked mechanically, not left to human judgment alone. AI systematically checks every document — eliminating the "we should have caught that" problem. Because quality is enforced at the document level before code exists, the methodology helps ensure the software meets user needs and business goals, not just technical standards.

**Iterate cheaply.** The document pipeline is ordered so that the most expensive mistakes are caught at the cheapest phase. Problems caught in documents take minutes to fix; problems caught in code take hours to debug and refactor. If a design can't survive document review, it won't survive production — kill bad ideas before they become bad code.

### Collaboration

**Humans curate, AI execute.** AI generates and reviews documents, but the team makes all approval decisions. AI handles volume and consistency; the team handles intent and judgment. This shifts the developer's focus from writing repetitive code to understanding edge cases, defining interactions, and validating system behavior.

**Structured context produces better output.** AI produces inconsistent results when given ad-hoc instructions — the same task described differently can yield fundamentally different implementations. The quality of output is directly proportional to the quality of the documents that inform it. When an AI receives detailed requirements, a phased implementation plan, and validation scenarios — all reviewed against project standards — it produces work that reflects the team's intent rather than its own assumptions.
