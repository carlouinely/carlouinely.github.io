import { createFileRoute, notFound } from '@tanstack/react-router'
import { Media } from '~src/components/Media'
import { findProject } from '~src/content/index'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    if (!findProject(params.slug)) throw notFound()
  },
  component: CaseStudy,
})

function CaseStudy() {
  const { slug } = Route.useParams()
  const project = findProject(slug)
  // The loader has already thrown `notFound()` for an unknown slug.
  if (!project) return null

  const { CaseStudyBody } = project

  return (
    <main>
      <article>
        <header>
          <p>
            {project.tag} · {project.year}
          </p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          {project.credit ? <p>In collaboration with {project.credit}</p> : null}
        </header>
        <div className="prose">
          <CaseStudyBody components={{ Media }} />
        </div>
      </article>
    </main>
  )
}
