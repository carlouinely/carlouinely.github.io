import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowGlyph, BackArrowGlyph, ChevronGlyph } from '~src/components/glyphs'
import { Media } from '~src/components/Media'
import { ToolGlyph } from '~src/components/toolGlyphs'
import { projects } from '~src/content/index'
import type { Project } from '~src/content/projects'
import { pageHead } from '~src/meta'
import { projectsIndex } from '~src/site'

export const Route = createFileRoute('/projects/')({
  head: () =>
    pageHead({
      title: projectsIndex.title,
      description: projectsIndex.description,
      path: '/projects',
    }),
  component: ProjectsIndex,
})

/** A year and the Projects shipped in it, in Project order. */
type YearGroup = { year: number; projects: Project[] }

/**
 * The catalogue as year chapters, newest first. Grouping is derived from the
 * Project list rather than authored, so a Project added in a new year creates
 * its own chapter and the order of a chapter follows the loader's `order`.
 */
function groupByYear(list: Project[]): YearGroup[] {
  const byYear = new Map<number, Project[]>()
  for (const project of list) {
    const group = byYear.get(project.year)
    if (group) group.push(project)
    else byYear.set(project.year, [project])
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, group]) => ({ year, projects: group }))
}

/** The few words a Project count reads as: "1 project", "2 projects". */
function projectCount(count: number): string {
  return count === 1 ? '1 project' : `${count} projects`
}

/**
 * One Project as a native disclosure. The face carries the four facts a visitor
 * scans for, each in its own zone: a halftone thumbnail, the title, a labelled
 * Type pill, and a labelled stack. The body carries the summary and the link
 * into the Case Study. A `<details>` expands in the prerendered HTML with no
 * JavaScript, so the catalogue works without scripts.
 */
function ProjectRow({ project }: { project: Project }) {
  return (
    <details className="group">
      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-16 gap-y-16 py-20 [&::-webkit-details-marker]:hidden md:gap-x-24 md:py-24">
        <div className="w-72 md:row-span-2 md:w-96 lg:w-128">
          {/* TODO(placeholder:project-thumbnails): add a `thumbnail` to each Project once real screenshots exist. See PLACEHOLDERS.md. */}
          <Media
            className="media-zoom"
            kind="image"
            ratio="4 / 3"
            radius="small"
            src={project.thumbnail ?? undefined}
            label={`${project.title} thumbnail`}
          />
        </div>

        <h3 className="font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase transition-colors group-hover:text-ember">
          {project.title}
        </h3>

        {/* One row's facets. The kind of build holds a fixed column, so every
            stack starts on the same edge however wide its tag is, and the two
            share a baseline from the medium breakpoint up. On small screens
            they take the full row under the title. */}
        <div className="col-span-3 col-start-1 row-start-2 grid grid-cols-1 gap-y-12 md:col-span-1 md:col-start-2 md:grid-cols-[10rem_minmax(0,1fr)] md:items-baseline md:gap-x-32 md:gap-y-0">
          <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-body-sm text-obsidian">
            {project.tag}
          </p>

          <ul className="flex flex-wrap items-center gap-x-12 gap-y-4 font-dm-sans text-body-sm text-obsidian">
            {project.stack.map((tool) => (
              <li key={tool} className="inline-flex items-center gap-4">
                <ToolGlyph tool={tool} className="size-[1.25em] shrink-0" />
                {tool}
              </li>
            ))}
          </ul>
        </div>

        {/* The chevron stays the last thing in the row, so a stack mark is
            never mistaken for it. */}
        <ChevronGlyph className="col-start-3 row-start-1 mt-4 shrink-0 justify-self-end transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>

      {/* The body aligns under the title it belongs to, on the widths where the
          thumbnail has already stepped up to its own column. */}
      <div className="pb-24 md:pl-[7.5rem] lg:pl-[9.5rem]">
        <p className="max-w-[var(--measure-prose)] font-dm-sans text-body text-obsidian">
          {project.summary}
        </p>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-16 inline-flex items-center gap-8 font-dm-sans text-body text-obsidian transition-colors hover:text-ember"
        >
          <span className="underline">Read the case study</span>
          <ArrowGlyph className="arrow-nudge" />
        </Link>
      </div>
    </details>
  )
}

/**
 * One year chapter: a full-width dotted rule, the year and its Project count in
 * the left rail from the large breakpoint up, and the Projects to the right.
 * The rail puts the date beside its work the way the employment timeline puts a
 * role's dates beside it, so the catalogue reads as a history rather than a
 * stack of rows.
 */
function YearChapter({ group }: { group: YearGroup }) {
  const { year, projects: list } = group

  return (
    <section id={`year-${year}`} data-reveal className="page-break">
      <div data-rule className="border-t-[1.5px] border-dotted border-obsidian" />

      <div className="mt-20 grid gap-y-16 lg:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] lg:gap-x-40">
        <div className="lg:pt-24">
          <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
            {year}
          </h2>
          <p className="mt-4 font-system-sans-serif text-caption text-obsidian uppercase">
            {projectCount(list.length)}
          </p>
        </div>

        <ul className="flex flex-col" data-stagger="row">
          {list.map((project, index) => (
            <li key={project.slug} data-row={index > 0 ? '' : undefined}>
              <ProjectRow project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * The Projects Index: every Project from the loader, chaptered by year and
 * scannable as a catalogue of specimens. Adding, removing, or reordering a
 * Project is a content edit under `projects/`, never a change here.
 */
function ProjectsIndex() {
  const chapters = groupByYear(projects)

  return (
    <main className="page-shell page-block">
      <div className="flex flex-wrap items-center justify-between gap-x-24 gap-y-16">
        <h1 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase md:text-heading-2xl">
          Projects
        </h1>

        {/* A visitor reaches the Index from the home page's Work section, so the
            way back sits in the title row, where this site puts a page action,
            rather than above the heading as a label of its own. */}
        <a
          href="/"
          className="action-pill action-pill--quiet w-full justify-center gap-8 sm:w-auto"
        >
          <BackArrowGlyph />
          Back to home
        </a>
      </div>

      <div className="page-head flex flex-wrap justify-between gap-x-24 gap-y-8 [align-items:last_baseline]">
        <p className="max-w-[var(--measure-prose)] font-dm-sans text-body text-obsidian">
          {projectsIndex.description}
        </p>

        {/* The chapters are visible, but a listing that will grow earns its own
            way to jump straight to a year. */}
        <nav aria-label="Projects by year" className="flex flex-wrap items-center gap-x-12 gap-y-8">
          <p className="font-system-sans-serif text-caption text-obsidian uppercase">By year</p>
          {chapters.map(({ year }) => (
            <a
              key={year}
              href={`#year-${year}`}
              aria-label={`Projects from ${year}`}
              className="font-dm-sans text-body-sm text-obsidian underline-offset-2 transition-colors hover:text-ember hover:underline"
            >
              {year}
            </a>
          ))}
        </nav>
      </div>

      {chapters.map((group) => (
        <YearChapter key={group.year} group={group} />
      ))}
    </main>
  )
}
