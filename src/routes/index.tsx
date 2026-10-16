import { Link, createFileRoute } from '@tanstack/react-router'
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
          Project list until the Project cards land; Experience and About are
          filled by their own tickets. */}
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

      <section id="experience" aria-label="Experience" />
      <section id="about" aria-label="About" />
    </main>
  )
}
