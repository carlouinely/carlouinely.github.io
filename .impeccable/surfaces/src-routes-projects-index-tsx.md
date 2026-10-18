---
version: 1
slug: 'src-routes-projects-index-tsx'
primary_target: 'src/routes/projects.index.tsx'
related_targets: []
---

# Projects Index

**Scope.** The catalogue at `/projects` (`src/routes/projects.index.tsx`). The home page's "Things I've built" section, each Case Study, and the Caldera world are out of scope.

**Mode.** Read. A recruiter scanning a body of work, deciding what to open.

**Audience and job.** A hiring manager on a phone between meetings, keyword-matching the stack and checking recency. The index is the reference beside the home page's pitch: it must be complete, ordered, and scannable in one pass, with depth one click away. It answers "what is this, when was it made, and what was it built with" for every Project without the visitor reading a paragraph.

**Constraints.** Native `<details>` disclosure that expands without JavaScript; prerendered static HTML; content is the single source of truth, so grouping is derived, never authored; no imagery exists, so thumbnails ship as design-native halftone Placeholders; one `<h1>` and no skipped heading levels; no horizontal scroll at 360px; Caldera tokens only.

## Direction contract

THESIS: The index is a dated catalogue, not a stack of identical cards. Years are the chapters and each Project is a specimen row where the kind of build, the stack, and the title each get their own zone instead of running together in one wrapped metadata line. It refuses the flat list where every Project looks the same and year, tag, and stack are indistinguishable.

OWN-WORLD: Caldera. Pumice canvas; display type (PP Neue Corp Compact) for the page title, the year chapters, and the Project titles; the kind of build as a Sulfur pill in a fixed column and the stack as a mark-and-name list on the same baseline, both unlabelled; halftone Placeholder thumbnails; 1.5px dotted Obsidian rules as the chapter and row separators; Ember only on hover; pills for the one action; no shadows.

STORY: The visitor sees how much has shipped and when, reads four facts per Project (kind, year, stack, title), and opens the one worth their time. The page reads as evidence of a working engineer rather than a gallery of self-description.

FIRST VIEWPORT: The `Projects` display title on the gutter with `Back to home` as a quiet pill opposite; the description and a `By year` jump nav sharing the next line; then the first chapter: a full-width dotted rule, the year in display type with its Project count, and the newest Project as a specimen row with a halftone thumbnail, its title, its Type pill in a fixed column, and its stack on the same baseline.

FORM: Year chaptered specimen index. Position 1 of the structures considered (1. year chapters, 2. flat facet list, 3. filter bar). No seed reference is recorded because this is an ordinary extension of the established world and the skill runs no direction roll for a local extension; there is no roll output to cite.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
