# Plot Twisted

- What actual ui/ux are we going to use?
- What's the benefit of implementation.md?
- After implementing all the skills, and a few features. Review all the skill to see if they can be improved.

Commands

- /specify:

i want to implement a new skill in this document. this skill is called ddd-specify.
this skill should:

- ask for the name of the feature (e.g. "001 - feature")
- create a folder under "docs/changes" with the name of the feature
- create in the new folder a file called `requirements.md`
- read the standard documentation for that file from "docs/standards/requirements.md"
- read the technical documentation of the project in "docs/technical" to understand the technical context of the project
- for each section and subsection in the standard documentation, it should ask the user to provide the information
- check if the information provided by the user is consistent with the technical documentation and with the rest of the information provided. If not, it should ask the user to clarify or update the information.
- after collecting the information from the user, write the file `requirements.md` following its standards
- as a last step, run the skill `ddd-review` providing the newly created folder to run a review of the created specification

what do you think?
do you think this skill should perform additional actions/steps?
ask me if not clear

- /review: DONE

- /plan: Once a feature specification exists, this command creates a comprehensive implementation plan. The agent should keep challenging the approach and asking the user in case something is not clear. This should output a list of tasks that can be implemented in the next step. Tasks should be as precise as possible. Use checkboxes that can be updated while implementing. Add as a rule that all features need to have unit tests (in code) and e2e tests (as scenarios). Specifications must be precise, complete, and unambiguous enough to generate working systems. Create specific, atomic actions. Should document the how and in what order. This skill should generate the plan.md and scenarios folder. These two should be consistent with each other.

- /implement: DONE

- /test or /validate or /verify: tests if a requirement is working as expected. Should this also check for bugs? The goal is to ensure that the software meets all specified requirements. Verifies that the software functions as expected based on requirements. The test command should ask the agent if the current implementation takes into account all the acceptance criteria scenarios. This skill should read requirements.md and scenarios folder, then inspect the actual codebase to verify that documented behaviors are implemented.

- /finalize:

i want to implement a new skill in this document. this skill is called ddd-finalize.
this skill should:

- ask for the name of the change (e.g. "001 - feature")
- check that folder exits and read all the files inside of it
- the goal of this skill is to merge the change request with the current specifications of the app (located in "docs/product").
- if there is no folder with the name of the change in the folder "docs/products", it should create one with the name of the change and move the files from the change request to the new folder.
- if there is already a folder with the name of the change in the folder "docs/products", it should read the files in that folder and check and merge them with the files in the change request. If there are any conflicts, it should ask the user to clarify or update the information.

propose other names for this skill. I am not sure if "finalize" is the best name for it.
what do you think?
do you think this skill should perform additional actions/steps?
ask me if not clear

- Add skills to ensure that when some files change, we need to update some others (e.g. indexes). Think about other skills to add.
