# Plot Twisted

- /plan:

i want to implement a new skill in this document. this skill is called ddd-plan. this skill should:

- in the same way the skill ddd-review starts, either receive a folder path or ask for one
- form that folder, read the file: requirements.md (you can read others too but that's mandatory) and understand the requirements and acceptance criteria
- read all the files in the folder "docs/standards" to know how to construct the plan.md and how other files should be structured
- read all the files in the folder "docs/technical" to understand the technical constraints and requirements of the project
- search for any critical or very important error, inconsistency or similar. if one is found, interrupt the skill and inform the user about the problem. challenge the approach and ask the user in case something is not clear
- if no problem is found, proceed to implement the plan.md file, which should include a comprehensive implementation plan based on the requirements and acceptance criteria. The plan should be structured in a way that allows for easy tracking of progress and updates as needed. use the file "docs/standards/plan.md" as a template for the structure and content of the plan.md file. The plan should include specific, atomic actions that can be implemented in the next step, and should document the how and in what order. The plan should also include checkboxes that can be updated while implementing. Tasks should be as precise as possible. Ther requiements must be precise, complete, and unambiguous enough to generate the plan. If not, ask the user for clarification.
- the skill should also generate a scenarios folder. The scenarios should be consistent with the plan.md file and the requirements.md file. see examples of other "scenarios" folder in the project to understand how to structure the scenarios and what they should include.

what do you think?  
do you think we should add more steps?
ask me if not clear

- ask Claude to review all the ddd skills as a whole

- After implementing all the skills, and a few features. Review all the skill to see if they can be improved.

- /test or /validate or /verify: tests if a requirement is working as expected. Should this also check for bugs? The goal is to ensure that the software meets all specified requirements. Verifies that the software functions as expected based on requirements. The test command should ask the agent if the current implementation takes into account all the acceptance criteria scenarios. This skill should read requirements.md and scenarios folder, then inspect the actual codebase to verify that documented behaviors are implemented.

- Add skills to ensure that when some files change, we need to update some others (e.g. indexes). Think about other skills to add.

- What actual ui/ux are we going to use?
