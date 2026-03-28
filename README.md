# Plot Twisted

- ask Claude to review all the ddd skills as a whole

- After implementing all the skills, and a few features. Review all the skill to see if they can be improved.

- /test or /validate or /verify: tests if a requirement is working as expected. Should this also check for bugs? The goal is to ensure that the software meets all specified requirements. Verifies that the software functions as expected based on requirements. The test command should ask the agent if the current implementation takes into account all the acceptance criteria scenarios. This skill should read requirements.md and scenarios folder, then inspect the actual codebase to verify that documented behaviors are implemented. Add an explicit "exploratory testing" step in the validation phase. After confirming all predefined scenarios pass, a human (or AI) spends a fixed time trying to break the implementation in ways the scenarios didn't anticipate. Any discoveries get added as new scenarios retroactively. Also, encourage negative scenarios in the scenario document — not just "what should happen" but "what should the system do when given input nobody expected."

- Add skills to ensure that when some files change, we need to update some others (e.g. indexes). Think about other skills to add.

- What actual ui/ux are we going to use?
