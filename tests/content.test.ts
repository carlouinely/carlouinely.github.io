import { describe, expect, it } from 'vite-plus/test'
import { loadProjects, type ProjectModule } from '~src/content/projects'
import { projects } from '~src/content/index'

/**
 * The Project content loader, at its pure seam: a slug-to-module map in, a
 * normalised Project list out. The shipped-content checks below pin the field
 * set the built pages rely on, without reaching into the loader's internals.
 */

const REQUIRED = {
  title: 'A Project',
  summary: 'A one-line outcome a recruiter can scan.',
  tag: 'Web App',
  year: 2025,
  order: 1,
} as const

function moduleWith(frontmatter: Record<string, unknown>): ProjectModule {
  return { default: () => null, frontmatter }
}

describe('the Project loader', () => {
  it('normalises highlight to a boolean that defaults to false', () => {
    const [unmarked] = loadProjects({ 'a-project.mdx': moduleWith(REQUIRED) })
    const [marked] = loadProjects({
      'a-project.mdx': moduleWith({ ...REQUIRED, highlight: true }),
    })

    expect(unmarked.highlight).toBe(false)
    expect(marked.highlight).toBe(true)
  })

  it('keeps repo optional and normalises it to null when unset', () => {
    const [unset] = loadProjects({ 'a-project.mdx': moduleWith(REQUIRED) })
    const [set] = loadProjects({
      'a-project.mdx': moduleWith({ ...REQUIRED, repo: 'https://example.com/source' }),
    })

    expect(unset.repo).toBeNull()
    expect(set.repo).toBe('https://example.com/source')
  })

  it('does not expose featured or live', () => {
    const [project] = loadProjects({
      'a-project.mdx': moduleWith({
        ...REQUIRED,
        featured: true,
        live: 'https://example.com/deployed',
      }),
    })

    expect(project).not.toHaveProperty('featured')
    expect(project).not.toHaveProperty('live')
  })

  it('normalises the body outline to heading ids and text, defaulting to empty', () => {
    const outline = [{ id: 'a-section', text: 'A section' }]
    const [marked] = loadProjects({
      'a-project.mdx': { ...moduleWith(REQUIRED), outline },
    })
    const [unmarked] = loadProjects({ 'a-project.mdx': moduleWith(REQUIRED) })

    expect(marked.outline).toEqual(outline)
    expect(unmarked.outline).toEqual([])
  })
})

describe('the shipped Projects', () => {
  it('marks exactly Darkroom System, WILDFIRE, and Agentic Lead Pipeline as Highlights', () => {
    const highlights = projects
      .filter((project) => project.highlight)
      .map((project) => project.slug)
    expect(new Set(highlights)).toEqual(
      new Set(['darkroom-system', 'wildfire', 'agentic-lead-pipeline']),
    )
  })

  it('leaves repo unset on every Project', () => {
    expect(projects.every((project) => project.repo === null)).toBe(true)
  })

  it('exposes the section headings of every Case Study body', () => {
    for (const project of projects) expect(project.outline.length).toBeGreaterThan(0)
  })
})
