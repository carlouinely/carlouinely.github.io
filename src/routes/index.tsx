import { Link, createFileRoute } from '@tanstack/react-router'
import { projects } from '~src/content/index'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <h1>carlouinely</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link to="/projects/$slug" params={{ slug: project.slug }}>
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
