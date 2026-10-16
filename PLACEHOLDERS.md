# Placeholders

Every stand-in currently shipped in place of a real value or asset. This is the
launch checklist: nothing in this file should survive going live. Each row has a
stable `key`; that key also appears in source as a `TODO(placeholder:<key>)`
comment, and a test reconciles the two so a `TODO` without a row, or a row
without a `TODO`, fails the suite.

| Key                   | Placeholder                   | Where it lives                                                                                          | What replaces it                                                                    |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `email`               | Email address                 | `src/site.ts` (`site.email`)                                                                            | A real, deliverable address. The current CV's address must never enter git history. |
| `origin`              | Canonical origin              | `src/site.ts` (`site.origin`)                                                                           | The custom domain's origin, once one is configured.                                 |
| `favicon`             | Favicon                       | `public/favicon.svg` (referenced by `src/site.ts`)                                                      | A real mark.                                                                        |
| `apple-touch-icon`    | Apple touch icon              | `public/apple-touch-icon.png` (referenced by `src/site.ts`)                                             | A real 180×180 square.                                                              |
| `open-graph-image`    | Open Graph image              | `public/og-image.png` (referenced by `src/site.ts`)                                                     | A real 1200×630 share image.                                                        |
| `hero-artwork`        | Hero brand artwork            | `src/components/Hero.tsx` (the `Media` block)                                                           | Real brand artwork, by adding a `src` to the `Media` prop.                          |
| `portrait`            | About portrait                | `src/components/About.tsx` (the `Media` block)                                                          | A real duotone portrait, by adding a `src` to the `Media` prop.                     |
| `project-thumbnails`  | Project thumbnails            | `projects/*.mdx` (`thumbnail`), marked in `src/components/Work.tsx` and `src/routes/projects.$slug.tsx` | Real screenshots, by adding a `thumbnail` to each Project.                          |
| `wildfire-screenshot` | WILDFIRE dashboard screenshot | `projects/wildfire.mdx` (inline `Media`)                                                                | A real screenshot of the signage dashboard.                                         |
| `mockup-email`        | Generated mockup email        | `projects/agentic-lead-pipeline.mdx` (inline `Media`)                                                   | A real screenshot of a mockup the pipeline generated.                               |
| `artist-homepage`     | Artist site homepage          | `projects/artist-seo-site.mdx` (inline `Media`)                                                         | A real screenshot of the launched site.                                             |
| `merch-storefront`    | Merch store storefront        | `projects/velez-college-merch-store.mdx` (inline `Media`)                                               | A real screenshot of the storefront.                                                |
| `cv-action`           | CV action (inert)             | `src/components/CvAction.tsx`                                                                           | A redacted CV PDF, turning the disabled control into a real link.                   |
