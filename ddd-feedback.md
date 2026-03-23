# DDD Framework Feedback

Its main challenges are around handling small changes (where the process overhead may not be justified) and managing document staleness after shipping.

DDD could incorporate TDD within the implementation phase. Currently the framework does not prescribe how the AI agent writes tests during implementation, which is a gap.

Heavy Process for Small Changes:
The minimum document set (requirements + plan + scenarios) is appropriate for features with dozens of functional requirements. But for a bug fix that changes one line, or a quick UI tweak, writing formal requirements with frontmatter, a phased plan, and Gherkin scenarios is disproportionate overhead. The framework does not distinguish between change sizes or provide a lightweight path for trivial changes.

## Improvement Suggestions

### 1. Add a Lightweight Path for Small Changes

Define a threshold (e.g., changes touching fewer than 3 files, bug fixes with a clear root cause) below which the full document pipeline is optional. A "quick change" template might require only a brief description, the files affected, and a single acceptance criterion. This preserves the spirit of documentation without the overhead.
