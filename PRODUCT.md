# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers screening for a full-time engineering role, arriving cold from a job application, a LinkedIn message, or the GitHub profile. They usually review on a phone between meetings, against a specific role to fill, and decide whether to keep reading within about one screen. Secondary audience: any visitor evaluating the work on its own terms.

## Product Purpose

The site is the link the owner sends with an application. It assembles the CV, five shipped Projects, and the employment timeline into a page a recruiter can evaluate in about ninety seconds and then click into for depth. Success means the link works for the owner rather than against him: a recruiter lands, learns what he does within a screen, sees real evidence, and makes contact.

## Positioning

A full-stack engineer in Cebu, Philippines who ships end to end (polished frontends, solid backends, the CI/CD that holds them together) and treats AI agents as part of the working team rather than a party trick. The part a neighboring portfolio cannot truthfully copy is the outcomes themselves: an offline-capable ERP for a two-venue nightlife business, an internal agentic lead pipeline at Zaigo, centralized campus digital signage, an SEO-led artist site.

## Operating Context

- Visitors arrive from a job application, a LinkedIn message, or the GitHub profile, often on a phone with limited attention. The review is a fast scan followed by selective depth.
- Evaluation idioms the site has to serve: keyword-match the stack, check recency of employment, copy the email into their own mail client, verify the code behind the claims on GitHub, and attach a CV to an application.
- The owner authors a Project as a single MDX file. Adding work is a content edit, not a code change, and broken content fails the build rather than shipping.
- The deployed artifact is prerendered static HTML served from GitHub Pages; the build output is the publishable site.

## Capabilities and Constraints

Surfaces: a home page ordered Hero, About me, How I work, Things I've built, Where I've worked, Let's talk; a Projects Index at `/projects` built on native disclosure rows that expand without JavaScript; one Case Study per Project at `/projects/<slug>` with a table of contents and previous/next reading navigation; and a Not Found page that any unknown URL lands on, prerendered to `404.html`. No other surfaces exist and none are planned. There is no Article surface: the reserved "Article" term in `GLOSSARY.md` exists only to keep Case Studies from drifting into blog-style writing.

- Project content lives in a root `projects/` directory outside `src`, per ADR-0002, imported through the `~projects/*` alias. YAML frontmatter is the single source of truth for both the home page card and the Case Study header.
- The content loader skips `_`-prefixed files, derives the slug from the filename, validates required fields and fails the build naming the offending file and field, sorts by `order`, and normalizes optional fields to explicit defaults.
- Media that does not exist yet ships as design-native Placeholders at the correct ratio (halftone or Ember, never a grey box), registered in `PLACEHOLDERS.md` with a matching `TODO(placeholder:<key>)` in source. Nothing in that registry may survive launch. The production build carries neither the placeholder border nor its caption.
- `repo` stays unset everywhere so no private repository is exposed; a Source link renders only when it is set.
- The CV action is inert (disabled, not focusable, referencing no file) until a redacted PDF exists, so no phone number enters git history or a search index.
- Every volatile value (email, GitHub and LinkedIn URLs, canonical origin, default title, description, availability label, shared brand assets) lives in `src/site.ts`. Nothing else hard-codes them.
- TanStack Start file-based routing prerendered to static HTML for GitHub Pages, with `failOnError` so a throwing route fails the build. No component library, no state management, and no routing beyond the home page, the Projects Index, and the Case Study route.
- The owner's legal name appears nowhere; the wordmark is the only name the site uses.

Undecided and not yet real: the email address, the canonical custom-domain origin, the favicon, the apple touch icon, the Open Graph share image, hero brand artwork, Project thumbnails and in-body screenshots, and a redacted CV PDF.

## Brand Commitments

- The wordmark `carlouinely` is the only name the site uses, so the site brand matches the owner's handle everywhere else.
- The Caldera visual world recorded in `DESIGN.md`, mirrored as the Tailwind theme in `src/styles.css`, governs all visual work, including the halftone Placeholder treatment.
- Visitor-facing copy is casual and plain-spoken in one register: contractions, short sentences, and a first person that talks to a person rather than a hiring committee. Two rules hold everywhere a visitor can read: no em dashes, and date ranges read "to". Internal docs (`README.md`, `PLACEHOLDERS.md`, `docs/`, `GLOSSARY.md`) are exempt.

## Evidence on Hand

Real, and sufficient to build from:

- Five shipped Projects in `projects/*.mdx`, each with outcome-led Case Study copy, a tag, a year, and a stack: Darkroom System, WILDFIRE, and Agentic Lead Pipeline are the three Highlights; Artist SEO Site and Velez College Merch Store complete the catalogue.
- Four roles in `src/content/experience.ts`, each with employer, title, dates, engagement type, a summary line, and outcome bullets.
- A grouped stack (Frontend / Backend / Infra) and a working-style passage in `src/content/about.ts`.

Absent, and future work must not fabricate it:

- No imagery of any kind: no hero brand artwork, no Project thumbnails, no in-body Case Study media.
- No favicon, apple touch icon, or Open Graph share image.
- No real email address, no custom domain, and no verified live URL for any Project.
- No public repository URLs; `repo` is unset everywhere by intention.
- No metrics, adoption numbers, testimonials, press, or benchmarks beyond the outcome statements already written.
- No CV PDF, so the CV action ships inert until one exists.

The owner will supply the real assets later; until then they stay registered Placeholders.

## Product Principles

1. The ninety-second scan is the unit of design. Every surface is scannable first and deep on request, with depth one click away and never in the way.
2. Evidence over claims. Show shipped work and stated outcomes; where evidence does not exist yet, mark the absence rather than inventing a stand-in that reads as real.
3. Nothing on the page can be disproved by arithmetic. Copy carries no duration or quantity claim that the printed dates and facts do not support.
4. Authoring is a content edit. Adding or changing a Project is one MDX file and changing a volatile value is one module; code changes only when capability changes.
5. One visual world, one voice. Every surface holds the same design language and the same casual register, from the hero to the last Case Study paragraph.

## Accessibility & Inclusion

- A logical heading order and visible focus, so a keyboard user can navigate without a mouse.
- Display type steps down instead of overflowing, and there is no horizontal scrolling at a 360px floor, so the site holds up on the phone a recruiter actually reads it on.
- Every media block carries a meaningful label, so Placeholders are not silent mysteries to a screen reader.
- Motion is suppressed under `prefers-reduced-motion`, and the document ships fully visible and unanimated when no script can reveal its sections.
