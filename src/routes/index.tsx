import { Link, createFileRoute } from '@tanstack/react-router'
import { About } from '~src/components/About'
import { Experience } from '~src/components/Experience'
import { Hero } from '~src/components/Hero'
import { projects } from '~src/content/index'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <Hero />

      {/* Section landmarks the nav anchors resolve to. Work carries the interim
          Project list until the Project cards land. */}
      <section id="work" aria-label="Things I've built" className="mx-auto max-w-page px-24 py-48">
        <ul>
          {projects.map((project) => (
            <li key={project.slug}>
              <Link to="/projects/$slug" params={{ slug: project.slug }}>
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Experience />
      <About />
    </main>
  )
}
