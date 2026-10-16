import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { projects } from '~src/content/index'
import {
  htmlToText,
  internalLinks,
  pageExists,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The Projects Index at `/projects`, observed through the built output. The
 * expected rows come from the content loader, so adding, removing, or
 * reordering a Project never needs a test change. Each row is a native
 * disclosure, so expansion is asserted through the HTML the crawler receives
 * rather than through a script.
 */

beforeAll(() => {
  requireFreshBuild()
})

function index(): string {
  return readClientPage('projects/index.html')
}

/** The rendered disclosure rows, in document order, each bounded by `</details>`. */
function rows(): string[] {
  return [...index().matchAll(/<details\b[\s\S]*?<\/details>/g)].map((match) => match[0])
}

function rowFor(title: string): string {
  return rows().find((html) => html.includes(title)) ?? ''
}

describe('the Projects Index', () => {
  it('is prerendered at /projects', () => {
    expect(pageExists('/projects')).toBe(true)
  })

  it('renders one native disclosure per Project, collapsed by default', () => {
    const html = index()
    expect(rows()).toHaveLength(projects.length)
    expect(html.match(/<details\b/g) ?? []).toHaveLength(projects.length)
    expect(html.match(/<summary\b/g) ?? []).toHaveLength(projects.length)
    expect(html.match(/<details\b[^>]*\sopen\b/g) ?? []).toEqual([])
  })

  it('shows the title, tag, year, and stack of every Project on its row', () => {
    const text = htmlToText(index())
    for (const project of projects) {
      expect(text).toContain(project.title)
      expect(text).toContain(project.tag)
      expect(text).toContain(String(project.year))
      for (const tool of project.stack) expect(text).toContain(tool)
    }
  })

  it('keeps the summary and the Case Study link inside the disclosure body', () => {
    for (const project of projects) {
      const row = rowFor(project.title)
      expect(htmlToText(row)).toContain(project.summary)
      expect(internalLinks(row)).toContain(`/projects/${project.slug}`)
    }
  })

  it('links every Case Study to a page that exists, so the crawler reaches them', () => {
    const links = internalLinks(index())
    for (const project of projects) {
      expect(links).toContain(`/projects/${project.slug}`)
      expect(pageExists(`/projects/${project.slug}`)).toBe(true)
    }
  })

  it('carries the site footer with its entry points', () => {
    const html = index()
    expect(html).toContain('<footer')
    expect(internalLinks(html)).toContain('/projects')
    expect(htmlToText(html)).not.toContain('Built with')
  })
})
