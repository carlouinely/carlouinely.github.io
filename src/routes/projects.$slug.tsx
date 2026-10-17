import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Media } from '~src/components/Media'
import { adjacentProjects, findProject } from '~src/content/index'
import type { Project } from '~src/content/projects'
import { articleStructuredData, breadcrumbStructuredData, jsonLd, pageHead } from '~src/meta'
import { site } from '~src/site'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    if (!findProject(params.slug)) throw notFound()
  },
  head: ({ params }) => {
    const project = findProject(params.slug)
    if (!project) return {}

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
      <span className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
        {project.tag}
      </span>
      <span className="font-system-sans-serif text-caption text-obsidian">{project.year}</span>
      {project.credit ? (
        <span className="font-system-sans-serif text-caption text-obsidian">
          with {project.credit}
        </span>
      ) : null}
      {project.repo ? (
        <a href={project.repo} className="font-dm-sans text-caption text-obsidian underline">
          Source
        </a>
      ) : null}
    </p>
  )
}

/**
 * The table of contents, built from the body's level-2 headings. It reads as one
 * strip above the prose rather than a sticky rail: a rail would sit in the path
 * of the in-body figures, which span the article's full width.
 */
function TableOfContents({ outline }: { outline: Project['outline'] }) {
  if (outline.length === 0) return null

  return (
    <nav aria-label="On this page" className="page-break">
      <p className="font-system-sans-serif text-caption text-obsidian uppercase">On this page</p>
      <ol className="mt-12 flex flex-wrap gap-x-24 gap-y-8">
        {outline.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="font-dm-sans text-body-sm text-obsidian underline underline-offset-2 hover:text-ember"
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
 * The previous, next, and back-to-Index links that close a Case Study. The
 * Index and the home page are the two ways up from a Project, so they share the
 * middle slot and leave Previous and Next on the ends.
 */
function ReadingNavigation({ project }: { project: Project }) {
  const { previous, next } = adjacentProjects(project.slug)

  return (
    <nav
      aria-label="Project navigation"
      className="page-break mx-auto flex max-w-[52rem] flex-wrap items-baseline justify-between gap-x-24 gap-y-16 border-t-[1.5px] border-dotted border-obsidian pt-24"
    >
      {previous ? (
        <Link
          to="/projects/$slug"
          params={{ slug: previous.slug }}
          className="font-dm-sans text-body text-obsidian underline"
        >
          Previous: {previous.title}
        </Link>
      ) : (
        <span />
      )}
      <span className="flex flex-wrap items-baseline justify-center gap-x-24 gap-y-8">
        {/* Plain anchors, so neither is marked as the page you are already on. */}
        <a href="/projects" className="font-dm-sans text-body text-obsidian underline">
          All projects
        </a>
        <a href="/" className="font-dm-sans text-body text-obsidian underline">
          Home
        </a>
      </span>
      {next ? (
        <Link
          to="/projects/$slug"
          params={{ slug: next.slug }}
          className="font-dm-sans text-body text-obsidian underline"
        >
          Next: {next.title}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

/**
 * The Case Study at its slug: a centred header, a wide lead media block, then
 * the prose body beside a table of contents, closed by reading navigation.
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

        <TableOfContents outline={outline} />

        {/* The prose runs the article's width so an in-body figure can match the
            lead image; the measure lives on its running text instead. */}
        <div className="prose page-gap min-w-0">
          <CaseStudyBody components={{ Media }} />
        </div>

        <ReadingNavigation project={project} />
      </article>
    </main>
  )
}
