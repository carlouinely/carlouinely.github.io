import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Media } from '~src/components/Media'
import { StackList } from '~src/components/StackList'
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

/**
 * One labelled fact in the Case Study masthead: the micro-label above the value
 * it names. Reading label above value is what lets a recruiter scan the opening
 * instead of parsing a sentence, and it is where the Project's stack finally
 * appears inside the article.
 */
function Fact({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="font-system-sans-serif text-caption text-obsidian uppercase">{label}</dt>
      <dd className="mt-8 font-dm-sans text-body text-obsidian">{children}</dd>
    </div>
  )
}

/**
 * The Case Study masthead: the title and its summary centred as one statement,
 * then the Project's facts along the page's dotted rule. The tag, year, client,
 * and stack used to trail the title as one run-on line; as labelled facts they
 * read as a spec sheet instead, and the stack reaches the article rather than
 * living only on the Projects Index. A `repo` that is set adds the one link the
 * masthead carries.
 */
function CaseStudyHeader({ project }: { project: Project }) {
  return (
    <header>
      <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
        <h1 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase md:text-heading-2xl">
          {project.title}
        </h1>

        <p className="page-head max-w-[var(--measure-prose)] font-dm-sans text-body md:text-body-lg text-obsidian">
          {project.summary}
        </p>
      </div>

      <dl className="page-head flex flex-wrap items-start gap-x-16 gap-y-24 border-t-[1.5px] border-dotted border-obsidian pt-24 sm:gap-x-32 lg:gap-x-40">
        <Fact label="Type" className="min-w-[5rem] flex-1">
          <span className="inline-block w-fit rounded-pills bg-sulfur px-12 py-4 text-body-sm">
            {project.tag}
          </span>
        </Fact>

        <Fact label="Year" className="min-w-[5rem] flex-1">
          {project.year}
        </Fact>

        {project.credit ? (
          <Fact label="Client" className="min-w-[6rem] flex-1">
            {project.credit}
          </Fact>
        ) : null}

        {project.stack.length > 0 ? (
          <Fact label="Stack" className="min-w-[16rem] flex-[2]">
            <StackList stack={project.stack} />
          </Fact>
        ) : null}

        {project.repo ? (
          <Fact label="Source" className="min-w-[5rem] flex-1">
            <a href={project.repo} className="underline hover:text-ember">
              Repository
            </a>
          </Fact>
        ) : null}
      </dl>
    </header>
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
              className="mt-8 block font-dm-sans text-body-lg text-obsidian underline underline-offset-2 hover:text-ember"
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
              className="mt-8 block font-dm-sans text-body-lg text-obsidian underline underline-offset-2 hover:text-ember"
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
        <CaseStudyHeader project={project} />

        <div className="page-break">
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
