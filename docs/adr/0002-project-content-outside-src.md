# Project content lives outside `src`

Project pages are authored as MDX in a root `projects/` directory rather than under `src/`, and imported through the `~projects/*` path alias. The content and the code that renders it change for different reasons and at different rates, so they are kept physically separate: editing a Case Study is a content edit, not a source edit, and it should not require a reader to navigate a source tree. `src/` stays code-only.
