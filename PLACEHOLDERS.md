# Placeholders

Every stand-in currently shipped in place of a real value or asset. This is the
launch checklist: nothing in this file should survive going live. Each entry is
also marked with a `TODO` comment where it appears in source.

| Placeholder                   | Where it lives                                            | What replaces it                                                                    |
| ----------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Email address                 | `src/site.ts` (`site.email`)                              | A real, deliverable address. The current CV's address must never enter git history. |
| Canonical origin              | `src/site.ts` (`site.origin`)                             | The custom domain's origin, once one is configured.                                 |
| Hero brand artwork            | `src/components/Hero.tsx` (the `Media` block)             | Real brand artwork, by adding a `src` to the `Media` prop.                          |
| About portrait                | `src/components/About.tsx` (the `Media` block)            | A real duotone portrait, by adding a `src` to the `Media` prop.                     |
| Project thumbnails            | `projects/*.mdx` (`thumbnail`)                            | Real screenshots, by adding a `thumbnail` to each Project.                          |
| WILDFIRE dashboard screenshot | `projects/wildfire.mdx` (inline `Media`)                  | A real screenshot of the signage dashboard.                                         |
| Generated mockup email        | `projects/agentic-lead-pipeline.mdx` (inline `Media`)     | A real screenshot of a mockup the pipeline generated.                               |
| Artist site homepage          | `projects/artist-seo-site.mdx` (inline `Media`)           | A real screenshot of the launched site.                                             |
| Merch store storefront        | `projects/velez-college-merch-store.mdx` (inline `Media`) | A real screenshot of the storefront.                                                |
| CV action (inert)             | `src/components/CvAction.tsx`                             | A redacted CV PDF, turning the disabled control into a real link.                   |
