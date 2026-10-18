import { Link } from '@tanstack/react-router'
import { ArrowGlyph } from '~src/components/glyphs'
import { Media } from '~src/components/Media'
import { highlights } from '~src/content/index'
import type { Project } from '~src/content/projects'

/**
 * The lead Project: the section's one card, and the only place a Project
 * thumbnail keeps hero-scale weight. Title and thumbnail share the card the way
 * the hero's claim shares its row with the artwork, so the lead reads as the
 * highlight while the titles below it stay compact. The whole card is the link
 * to the Case Study, so the target is the same wherever a visitor clicks, and
 * the thumbnail leans in a hair under the pointer.
 */
function LeadCard({ project }: { project: Project }) {
  return (
    <article>
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="group grid gap-24 rounded-cards bg-limestone p-24 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-x-40 md:p-40"
      >
        <div>
          <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
            {project.tag}
          </p>
          <h3 className="mt-16 font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase transition-colors group-hover:text-ember lg:text-heading-2xl">
            {project.title}
          </h3>
          <p className="mt-16 font-dm-sans text-body text-obsidian">{project.summary}</p>
          <p className="mt-24 flex items-center gap-8 font-dm-sans text-body text-obsidian">
            <span className="underline">Read the case study</span>
            <ArrowGlyph className="arrow-nudge" />
          </p>
        </div>

        {/* The clip holds the thumbnail's hover lean inside the card's own
            radius, so the picture never breaks the surface it sits in. */}
        {/* TODO(placeholder:project-thumbnails): add a `thumbnail` to each Project once real screenshots exist. See PLACEHOLDERS.md. */}
        <div className="overflow-hidden rounded-cards">
          <Media
            className="media-zoom"
            kind="image"
            ratio="16 / 9"
            src={project.thumbnail ?? undefined}
            label={`${project.title} thumbnail`}
          />
        </div>
      </Link>
    </article>
  )
}

/**
 * A supporting Highlight: a compact row on the page canvas, its thumbnail
 * reduced to a chip and the dotted rule above it the same one the rest of the
 * page divides with. Only the title carries display type, so the rows scan as
 * one list under the lead card instead of competing with it. The rows step in
 * from the left as they arrive, matching the rule that opens each one.
 *
 * The title holds a rail from the large breakpoint up rather than a share of
 * the row. Split by fraction it took more width than any title needed, and the
 * eye crossed a handspan of empty page between a name and its summary.
 */
function HighlightRow({ project }: { project: Project }) {
  return (
    <article>
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-16 gap-y-8 py-16 md:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.3fr)_auto] md:gap-x-24 md:py-20 lg:grid-cols-[auto_minmax(0,17rem)_minmax(0,1fr)_auto]"
      >
        <div className="w-64 self-center md:w-72">
          <Media
            kind="image"
            ratio="1 / 1"
            radius="small"
            src={project.thumbnail ?? undefined}
            label={`${project.title} thumbnail`}
          />
        </div>

        <div className="min-w-0 md:col-start-2">
          <h3 className="font-pp-neue-corp-compact text-subheading font-regular tracking-heading text-obsidian uppercase transition-colors group-hover:text-ember md:text-heading">
            {project.title}
          </h3>
          <div className="mt-8 flex items-center gap-12">
            <span className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
              {project.tag}
            </span>
            <span className="font-system-sans-serif text-caption text-obsidian">
              {project.year}
            </span>
          </div>
        </div>

        <p className="col-span-2 col-start-2 font-dm-sans text-body-sm text-obsidian md:col-span-1 md:col-start-3 md:row-start-1">
          {project.summary}
        </p>

        <ArrowGlyph className="arrow-nudge col-start-3 row-start-1 self-center text-obsidian transition-colors group-hover:text-ember md:col-start-4" />
      </Link>
    </article>
  )
}

/**
 * The home page's work section: the Highlights, in the order the loader
 * produces, led by the first as a card and followed by the rest as compact rows
 * that link to their Case Studies. The "See everything I've built" action sits
 * in the heading row so it is on screen the moment the section is, and the
 * section itself stays short enough to read in one pass. Marking a Project as a
 * Highlight is a content edit under `projects/`, never a change here.
 */
export function Work() {
  const [lead, ...supporting] = highlights

  return (
    <section id="work" aria-label="Things I've built" data-reveal className="page-shell page-block">
      <div className="flex flex-wrap items-center justify-between gap-x-24 gap-y-16">
        <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
          Things I&apos;ve built
        </h2>

        <a
          href="/projects"
          className="action-pill action-pill--primary w-full justify-center gap-8 sm:w-auto"
        >
          See everything I&apos;ve built
          <ArrowGlyph className="arrow-nudge" />
        </a>
      </div>

      {lead ? (
        <div className="page-head">
          <LeadCard project={lead} />
        </div>
      ) : null}

      {supporting.length > 0 ? (
        <ul className="page-gap flex flex-col" data-stagger="row">
          {supporting.map((project, index) => (
            <li key={project.slug} data-row={index > 0 ? '' : undefined}>
              <HighlightRow project={project} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
