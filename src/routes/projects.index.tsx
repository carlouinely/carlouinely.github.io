import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronGlyph } from '~src/components/glyphs'
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
        <span className="font-dm-sans text-body-sm text-obsidian">{project.stack.join(' · ')}</span>
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
    <main className="mx-auto max-w-page px-24 py-48">
      <h1 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase md:text-heading-2xl">
        Projects
      </h1>
      <p className="mt-16 font-dm-sans text-body text-obsidian">{projectsIndex.description}</p>

      <div className="mt-40 flex flex-col gap-16">
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </div>
    </main>
  )
}
