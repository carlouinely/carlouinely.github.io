import { Link } from '@tanstack/react-router'
import { Media } from '~src/components/Media'
import { projects } from '~src/content/index'
import type { Project } from '~src/content/projects'

/** The only differences between a featured card and an ordinary one. */
const featuredLayout = {
  article: 'md:col-span-2',
  link: 'md:grid md:grid-cols-2 md:items-center md:gap-40',
  kind: 'ember',
  ratio: '2 / 1',
  body: '',
} as const

const cardLayout = {
  article: undefined,
  link: '',
  kind: 'image',
  ratio: '16 / 10',
  body: 'mt-24',
} as const

/**
 * One Project card. The featured Project spans both grid columns and leads with
 * a wider Ember media block; every other card is a single-column Limestone card.
 * The whole card is the link to its Case Study, so the target is the same
 * wherever a visitor clicks.
 */
function ProjectCard({ project }: { project: Project }) {
  const layout = project.featured ? featuredLayout : cardLayout

  return (
    <article data-featured={project.featured || undefined} className={layout.article}>
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className={`group flex h-full flex-col rounded-cards bg-limestone p-40 ${layout.link}`}
      >
        {/* TODO(placeholder): add a `thumbnail` to each Project once real screenshots exist. See PLACEHOLDERS.md. */}
        <Media
          kind={layout.kind}
          ratio={layout.ratio}
          src={project.thumbnail ?? undefined}
          label={`${project.title} thumbnail`}
        />

        <div className={layout.body}>
          <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
            {project.tag}
          </p>
          <h3 className="mt-16 font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase">
            {project.title}
          </h3>
          <p className="mt-16 font-dm-sans text-body text-obsidian">{project.summary}</p>
          <p className="mt-16 font-dm-sans text-body-sm text-obsidian underline">View case study</p>
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
    </section>
  )
}
