import { loadProjects, type Project, type ProjectModule } from '~src/content/projects'

// Every Project file is imported eagerly so the whole catalogue is available to
// the home page and to each Case Study route on both client and server.
const modules = import.meta.glob('~projects/*.mdx', { eager: true }) as Record<
  string,
  ProjectModule
>

export const projects: Project[] = loadProjects(modules)

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
