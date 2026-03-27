# Plot Twisted

- What actual ui/ux are we going to use?
- What's the benefit of implementation.md?
- One file per scenario
- Add option to ignore an issue in the review command

Commands

- /specify or /document: This command transforms a simple feature description (the user-prompt) into a complete, structured specification with automatic repository management. This command should read documents like mission.md and stuff like that to understand the broader idea of the app. It should read existing specs to check for inconsistencies or to know that also other specs might change as a consequence of this new spec. The agent should ensure each spec file follows a template. You and the AI brainstorm in a chat. Research agents gather critical context throughout the documentation process, investigating technical options, performance implications, and organizational constraints. AI analyzes documentation for ambiguity, contradictions, and gaps as an ongoing process. Link Figma mockups. Should document the why and the what. This command could take as an input a folder in the roadmap. It should then remove it from the roadmap and create a folder in the changes folder.

- /review: DONE

- /plan: Once a feature specification exists, this command creates a comprehensive implementation plan. The agent should keep challenging the approach and asking the user in case something is not clear. This should output a list of tasks that can be implemented in the next step. Tasks should be as precise as possible. Use checkboxes that can be updated while implementing. Add as a rule that all features need to have unit tests (in code) and e2e tests (as scenarios). Specifications must be precise, complete, and unambiguous enough to generate working systems. Create specific, atomic actions. Should document the how and in what order. This skill should generate the plan.md and scenarios.md. These two should be consistent with each other.

- /implement: this command reads the specs and the plan and implements it. It can receive a full plan document and implement all tasks in it or be instructed to implement only a specific task/s

- /test or /validate or /verify: tests if a requirement is working as expected. Should this also check for bugs? The goal is to ensure that the software meets all specified requirements. Verifies that the software functions as expected based on requirements. The test command should ask the agent if the current implementation takes into account all the acceptance criteria scenarios. This skill should read requirements.md and scenarios.md, then inspect the actual codebase to verify that documented behaviors are implemented.

- /finalize: this command merges a finished change request with the corresponding specifications (or creates one if it doesn’t exist)

- Add skills to ensure that when some files change, we need to update some others (e.g. indexes). Think about other skills to add.
