import { Link, createFileRoute } from '@tanstack/react-router'
import { BackArrowGlyph, ChevronGlyph } from '~src/components/glyphs'
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

/**
 * One Project as a native disclosure. The always-visible summary carries the
 * identity of the work (title, tag, year, stack); the body carries the summary
 * and the link into the Case Study. A `<details>` expands in the prerendered
 * HTML with no JavaScript, so the catalogue works without scripts.
 */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <details
      className="group rounded-cards bg-limestone"
      data-reveal
      style={{ transitionDelay: `${Math.min(index, 4) * 60}ms` }}
    >
      <summary className="flex cursor-pointer flex-wrap items-center gap-x-16 gap-y-8 p-24">
        <h2 className="font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase transition-colors group-hover:text-ember">
          {project.title}
        </h2>
        <span className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
          {project.tag}
        </span>
        <span className="font-system-sans-serif text-caption text-obsidian">{project.year}</span>
        <span className="flex flex-wrap items-center gap-x-12 gap-y-4 font-dm-sans text-body-sm text-obsidian">
          {project.stack.map((tool) => (
            <span key={tool} className="inline-flex items-center gap-4">
              <ToolGlyph tool={tool} className="shrink-0" />
              {tool}
            </span>
          ))}
        </span>
        <ChevronGlyph className="ml-auto transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>

      <div className="px-24 pb-24">
        <p className="font-dm-sans text-body text-obsidian">{project.summary}</p>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-16 inline-block font-dm-sans text-body text-obsidian underline"
        >
          Read the case study
        </Link>
      </div>
    </details>
  )
}

/**
 * The Projects Index: every Project from the loader as a compact row that
 * expands in place. Adding, removing, or reordering a Project is a content edit
 * under `projects/`, never a change here.
 */
function ProjectsIndex() {
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

      <p className="page-head font-dm-sans text-body text-obsidian">{projectsIndex.description}</p>

      <div className="page-gap page-stack">
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </div>
    </main>
  )
}
