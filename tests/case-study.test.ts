import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { projects } from '~src/content/index'
import {
  elementIds,
  htmlToText,
  internalLinks,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The Case Study reading layout, observed in the built output: a table of
 * contents that matches the body's section headings, a lead media block, and
 * the reading navigation. Expected Projects come from the content loader, so
 * adding or reordering a Project never needs a test change here.
 */

beforeAll(() => {
  requireFreshBuild()
})

function caseStudy(slug: string): string {
  return readClientPage(`projects/${slug}/index.html`)
}

/** The region inside the `nav` carrying an accessible name, or an empty string. */
function nav(html: string, label: string): string {
  return (
    html.match(new RegExp(`<nav\\b[^>]*aria-label="${label}"[^>]*>[\\s\\S]*?</nav>`))?.[0] ?? ''
  )
}

/** The Case Study article, from `<article>` to `</article>`. */
function article(html: string): string {
  return html.match(/<article\b[\s\S]*?<\/article>/)?.[0] ?? ''
}

/** The article's header, from `<header>` to `</header>`. */
function header(html: string): string {
  return article(html).match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? ''
}

/** Every level-2 section of a page: its id and its rendered text. */
function sections(html: string): Array<{ id: string; text: string }> {
  return [...html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map((match) => ({
    id: match[1] ?? '',
    text: htmlToText(match[2] ?? ''),
  }))
}

/** Every link in a region: its href and its rendered text. */
function links(html: string): Array<{ href: string; text: string }> {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => ({
    href: match[1] ?? '',
    text: htmlToText(match[2] ?? ''),
  }))
}

function projectAt(slug: string) {
  const position = projects.findIndex((project) => project.slug === slug)
  return {
    previous: position > 0 ? projects[position - 1] : undefined,
    next: position < projects.length - 1 ? projects[position + 1] : undefined,
  }
}

describe('the Case Study header', () => {
  it.each(projects.map((project) => [project.title, project] as const))(
    'renders the tag, year, and credit of %s in a centred header',
    (_title, project) => {
      const text = htmlToText(header(caseStudy(project.slug)))
      expect(text).toContain(project.title)
      expect(text).toContain(project.summary)
      expect(text).toContain(project.tag)
      expect(text).toContain(String(project.year))
      if (project.credit) expect(text).toContain(project.credit)
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'renders no Source link for %s while repo is unset',
    (_title, project) => {
      expect(project.repo).toBeNull()
      const head = header(caseStudy(project.slug))
      expect(head).not.toMatch(/href=["']https?:/i)
      expect(htmlToText(head)).not.toContain('Source')
    },
  )
})

describe('the Case Study lead media', () => {
  it.each(projects.map((project) => [project.title, project] as const))(
    'renders a wide lead media block for %s from the thumbnail placeholder',
    (_title, project) => {
      const html = caseStudy(project.slug)
      if (project.thumbnail) {
        expect(html).toContain(`src="${project.thumbnail}"`)
      } else {
        expect(html).toContain(`aria-label="${project.title} lead image"`)
        expect(html).toContain('role="img"')
      }
    },
  )
})

describe('the Case Study table of contents', () => {
  it.each(projects.map((project) => [project.title, project] as const))(
    'lists the section headings of %s in a table of contents that links to them',
    (_title, project) => {
      const html = caseStudy(project.slug)
      const contents = nav(html, 'On this page')
      expect(contents).not.toBe('')

      const sectionList = sections(html)
      expect(sectionList.length).toBeGreaterThan(0)

      const entries = links(contents)
      expect(entries.map((entry) => entry.href)).toEqual(
        sectionList.map((section) => `#${section.id}`),
      )
      expect(entries.map((entry) => entry.text)).toEqual(sectionList.map((section) => section.text))
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'gives every section heading of %s an id a visitor can jump to',
    (_title, project) => {
      const html = caseStudy(project.slug)
      const ids = elementIds(html)
      for (const section of sections(html)) expect(ids).toContain(section.id)
    },
  )
})

describe('the reading navigation', () => {
  it.each(projects.map((project) => [project.title, project] as const))(
    'links %s to the previous and next Project and back to the Index',
    (_title, project) => {
      const readingNav = nav(caseStudy(project.slug), 'Project navigation')
      expect(readingNav).not.toBe('')

      const hrefs = internalLinks(readingNav)
      const { previous, next } = projectAt(project.slug)
      if (previous) expect(hrefs).toContain(`/projects/${previous.slug}`)
      if (next) expect(hrefs).toContain(`/projects/${next.slug}`)
      expect(hrefs).toContain('/projects')
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'offers the way back to the home page from %s',
    (_title, project) => {
      const readingNav = nav(caseStudy(project.slug), 'Project navigation')
      expect(internalLinks(readingNav)).toContain('/')
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'names the way up from %s, rather than leaving the destination to the link',
    (_title, project) => {
      const text = htmlToText(nav(caseStudy(project.slug), 'Project navigation'))
      expect(text).toContain('Back to projects')
      expect(text).toContain('Back to home')
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'gives every direction in the navigation of %s an accessible name beyond the Project title',
    (_title, project) => {
      const readingNav = nav(caseStudy(project.slug), 'Project navigation')
      const { previous, next } = projectAt(project.slug)
      if (previous) expect(readingNav).toContain(`aria-label="Previous Project: ${previous.title}"`)
      if (next) expect(readingNav).toContain(`aria-label="Next Project: ${next.title}"`)
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'does not mark the Index link as the current page of %s',
    (_title, project) => {
      const readingNav = nav(caseStudy(project.slug), 'Project navigation')
      const indexLink = readingNav.match(/<a\b[^>]*href="\/projects"[^>]*>/)?.[0] ?? ''

      expect(indexLink).not.toBe('')
      expect(indexLink).not.toContain('aria-current')
    },
  )
})

describe('the prose layer', () => {
  it('renders figures with captions, blockquotes, and horizontal rules in the Case Study bodies', () => {
    const pages = projects.map((project) => caseStudy(project.slug))
    expect(pages.some((html) => /<figure\b[\s\S]*?<figcaption\b/.test(html))).toBe(true)
    expect(pages.some((html) => html.includes('<blockquote'))).toBe(true)
    expect(pages.some((html) => html.includes('<hr'))).toBe(true)
  })
})
