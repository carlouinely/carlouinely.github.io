import { loadProjects, type Project, type ProjectModule } from '~src/content/projects'

// Every Project file is imported eagerly so the whole catalogue is available to
// the home page and to each Case Study route on both client and server.
const modules = import.meta.glob('~projects/*.mdx', { eager: true }) as Record<
  string,
  ProjectModule
>

export const projects: Project[] = loadProjects(modules)

/** The Projects the home page surfaces: the loader's Highlights, in order. */
export const highlights: Project[] = projects.filter((project) => project.highlight)

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/** The Projects immediately before and after `slug` in Project order. */
export function adjacentProjects(slug: string): {
  previous: Project | undefined
  next: Project | undefined
} {
  const position = projects.findIndex((project) => project.slug === slug)
  return {
    previous: position > 0 ? projects[position - 1] : undefined,
    next: position >= 0 && position < projects.length - 1 ? projects[position + 1] : undefined,
  }
}
