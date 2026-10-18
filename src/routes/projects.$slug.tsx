import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Media } from '~src/components/Media'
import { adjacentProjects, findProject } from '~src/content/index'
import type { Project } from '~src/content/projects'
import {
  articleStructuredData,
  breadcrumbStructuredData,
  jsonLd,
  notFoundHead,
  pageHead,
} from '~src/meta'
import { site } from '~src/site'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    if (!findProject(params.slug)) throw notFound()
  },
  head: ({ params }) => {
    const project = findProject(params.slug)
    if (!project) return notFoundHead()

    return {
      ...pageHead({
        title: `${project.title} | ${site.wordmark}`,
        description: project.summary,
        path: `/projects/${project.slug}`,
        ogType: 'article',
      }),
      scripts: [jsonLd(breadcrumbStructuredData(project)), jsonLd(articleStructuredData(project))],
    }
  },
  component: CaseStudy,
})

/** The tagged meta row above the title, with a Source link only when `repo` is set. */
function HeaderMeta({ project }: { project: Project }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
      <span className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-body-sm text-obsidian">
        {project.tag}
      </span>
      <span className="font-dm-sans text-body-sm text-obsidian">{project.year}</span>
      {project.credit ? (
        <span className="font-dm-sans text-body-sm text-obsidian">with {project.credit}</span>
      ) : null}
      {project.repo ? (
        <a href={project.repo} className="font-dm-sans text-body-sm text-obsidian underline">
          Source
        </a>
      ) : null}
    </p>
  )
}

/**
 * The contents rail. It names the body's level-2 headings and takes the reading
 * frame's left column, where it sticks for the length of the article so the
 * section list is still in reach halfway down. Below the rail breakpoint the
 * frame stacks and it reads as the group above the prose.
 */
function TableOfContents({ outline }: { outline: Project['outline'] }) {
  if (outline.length === 0) return null

  return (
    <nav aria-label="On this page" className="reading-rail">
      <p className="font-system-sans-serif text-caption text-obsidian uppercase">On this page</p>
      <ol className="mt-8 flex flex-col gap-4">
        {outline.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="block py-4 font-dm-sans text-body-sm leading-body text-obsidian transition-colors hover:text-ember"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * The reading navigation. The two directions a reader can keep going sit at the
 * ends of the reading column, each as the constant label above the Project it
 * leads to, so the pair reads as one row. The two ways up from the article
 * follow on their own line a size down, where they cannot compete with the
 * direction a reader is most likely to take.
 */
function ReadingNavigation({ project }: { project: Project }) {
  const { previous, next } = adjacentProjects(project.slug)

  return (
    <nav
      aria-label="Project navigation"
      className="page-break mx-auto w-full max-w-[var(--measure-prose)] border-t-[1.5px] border-dotted border-obsidian pt-24"
    >
      <div className="grid gap-x-24 gap-y-24 sm:grid-cols-2">
        {previous ? (
          <div>
            <p className="font-system-sans-serif text-caption text-obsidian uppercase">Previous</p>
            <Link
              to="/projects/$slug"
              params={{ slug: previous.slug }}
              aria-label={`Previous Project: ${previous.title}`}
              className="mt-8 block font-dm-sans text-body text-obsidian underline underline-offset-2 hover:text-ember"
            >
              {previous.title}
            </Link>
          </div>
        ) : (
          <span />
        )}

        {next ? (
          <div className="sm:text-right">
            <p className="font-system-sans-serif text-caption text-obsidian uppercase">Next</p>
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              aria-label={`Next Project: ${next.title}`}
              className="mt-8 block font-dm-sans text-body text-obsidian underline underline-offset-2 hover:text-ember"
            >
              {next.title}
            </Link>
          </div>
        ) : (
          <span />
        )}
      </div>

      <div className="page-gap flex flex-wrap items-center gap-x-24 gap-y-8">
        {/* Plain anchors, so neither is marked as the page you are already on. */}
        <a
          href="/projects"
          className="font-dm-sans text-body-sm text-obsidian underline underline-offset-2 hover:text-ember"
        >
          Back to projects
        </a>
        <a
          href="/"
          className="font-dm-sans text-body-sm text-obsidian underline underline-offset-2 hover:text-ember"
        >
          Back to home
        </a>
      </div>
    </nav>
  )
}

/**
 * The Case Study at its slug: a centred header, a wide lead media block, then
 * the prose body inside the reading frame, closed by reading navigation.
 */
function CaseStudy() {
  const { slug } = Route.useParams()
  const project = findProject(slug)
  // The loader has already thrown `notFound()` for an unknown slug.
  if (!project) return null

  const { CaseStudyBody, outline } = project

  return (
    <main className="page-block">
      {/* The padding sits on the capped article, not on the full-width main, so
          the article's own edges land on the page grid the nav and footer use
          instead of 24px outside it. */}
      <article className="page-shell">
        <header className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <HeaderMeta project={project} />
          {/* The tag and the year belong to the title, so they keep the group gap; the summary is body copy and takes the heading gap. */}
          <h1 className="page-gap font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase md:text-heading-2xl">
            {project.title}
          </h1>
          <p className="page-head font-dm-sans text-body text-obsidian">{project.summary}</p>
        </header>

        <div className="page-head">
          {/* TODO(placeholder:project-thumbnails): add a `thumbnail` to each Project once real screenshots exist. See PLACEHOLDERS.md. */}
          <Media
            kind="image"
            ratio="16 / 9"
            src={project.thumbnail ?? undefined}
            label={`${project.title} lead image`}
          />
        </div>

        <div className="reading-frame page-break">
          <TableOfContents outline={outline} />

          {/* The prose keeps the reading column's measure, and an in-body figure
              takes that same measure, so nothing in the body can run under the
              rail or read as loud as the lead image. */}
          <div className="prose reading-column min-w-0">
            <CaseStudyBody components={{ Media }} />
          </div>
        </div>

        <ReadingNavigation project={project} />
      </article>
    </main>
  )
}
