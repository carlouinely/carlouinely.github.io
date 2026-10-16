import type { ComponentType } from 'react'

/**
 * Props an MDX body accepts. `components` maps the element names a body uses to
 * the components that render them, so a Case Study body carries no imports from
 * `src/` and content stays independent of the source tree.
 */
export type CaseStudyBodyProps = {
  components?: Record<string, unknown>
}

/**
 * One compiled MDX module, as imported from `projects/*.mdx`: the rendered
 * Case Study body plus the frontmatter `remark-mdx-frontmatter` exports beside it.
 */
export type ProjectModule = {
  default: ComponentType<CaseStudyBodyProps>
  frontmatter?: unknown
}

/**
 * A validated Project. Optional frontmatter fields are normalised to explicit
 * defaults here so no consumer ever handles `undefined`.
 */
export type Project = {
  slug: string
  title: string
  summary: string
  tag: string
  year: number
  order: number
  featured: boolean
  thumbnail: string | null
  stack: string[]
  repo: string | null
  live: string | null
  credit: string | null
  CaseStudyBody: ComponentType<CaseStudyBodyProps>
}

const REQUIRED_FIELDS = ['title', 'summary', 'tag', 'year', 'order'] as const

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}

function contentPath(path: string): string {
  return path.replace(/^\/+/, '')
}

function requiredString(data: Record<string, unknown>, field: string, file: string): string {
  const value = data[field]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Content error in ${file}: required frontmatter field "${field}" must be a non-empty string`,
    )
  }
  return value
}

function requiredNumber(data: Record<string, unknown>, field: string, file: string): number {
  const value = data[field]
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(
      `Content error in ${file}: required frontmatter field "${field}" must be a number`,
    )
  }
  return value
}

function optionalString(data: Record<string, unknown>, field: string): string | null {
  const value = data[field]
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

function toProject(path: string, module: ProjectModule): Project {
  const file = contentPath(path)
  const { frontmatter } = module

  if (typeof frontmatter !== 'object' || frontmatter === null || Array.isArray(frontmatter)) {
    throw new Error(`Content error in ${file}: expected a YAML frontmatter block`)
  }

  const data = frontmatter as Record<string, unknown>
  for (const field of REQUIRED_FIELDS) {
    const value = data[field]
    if (value === undefined || value === null || value === '') {
      throw new Error(`Content error in ${file}: missing required frontmatter field "${field}"`)
    }
  }

  return {
    slug: basename(file).replace(/\.mdx$/, ''),
    title: requiredString(data, 'title', file),
    summary: requiredString(data, 'summary', file),
    tag: requiredString(data, 'tag', file),
    year: requiredNumber(data, 'year', file),
    order: requiredNumber(data, 'order', file),
    featured: data.featured === true,
    thumbnail: optionalString(data, 'thumbnail'),
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    repo: optionalString(data, 'repo'),
    live: optionalString(data, 'live'),
    credit: optionalString(data, 'credit'),
    CaseStudyBody: module.default,
  }
}

/**
 * Build the Project list from a slug-to-module map. Pure: it reads only the map
 * it is given, never the filesystem. Files named with a leading `_` (templates,
 * drafts) are skipped; the slug comes from the filename; required frontmatter is
 * validated with an error naming the file and field; the result is sorted by
 * `order` and normalised so no optional field stays `undefined`.
 */
export function loadProjects(modules: Record<string, ProjectModule>): Project[] {
  return Object.entries(modules)
    .filter(([path]) => !basename(path).startsWith('_'))
    .map(([path, module]) => toProject(path, module))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
}
