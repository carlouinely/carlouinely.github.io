import { Link } from '@tanstack/react-router'
import { Media } from '~src/components/Media'
import { projects } from '~src/content/index'
import type { Project } from '~src/content/projects'

/**
 * One Project card. The whole card is the link to its Case Study, so the target
 * is the same wherever a visitor clicks.
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article>
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="group flex h-full flex-col rounded-cards bg-limestone p-40"
      >
        {/* TODO(placeholder:project-thumbnails): add a `thumbnail` to each Project once real screenshots exist. See PLACEHOLDERS.md. */}
        <Media
          kind="image"
          ratio="16 / 10"
          src={project.thumbnail ?? undefined}
          label={`${project.title} thumbnail`}
        />

        <div className="mt-24">
          <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
            {project.tag}
          </p>
          <h3 className="mt-16 font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase">
            {project.title}
          </h3>
          <p className="mt-16 font-dm-sans text-body text-obsidian">{project.summary}</p>
          <p className="mt-16 font-dm-sans text-body-sm text-obsidian underline">
            Read the case study
          </p>
        </div>
      </Link>
    </article>
  )
}

/**
 * The home page's work section: every Project, in frontmatter order, as a card
 * that links to its Case Study. Adding, removing, or reordering a Project is a
 * content edit under `projects/`, never a change here.
 */
export function Work() {
  return (
    <section id="work" aria-label="Things I've built" className="mx-auto max-w-page px-24 py-48">
      <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
        Things I&apos;ve built
      </h2>

      <div className="mt-40 grid gap-24 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-40">
        <a href="/projects" className="font-dm-sans text-body text-obsidian underline">
          See everything I&apos;ve built
        </a>
      </div>
    </section>
  )
}
