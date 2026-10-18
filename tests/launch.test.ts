import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { findProject, projects } from '~src/content/index'
import type { Project } from '~src/content/projects'
import { projectsIndex, site, siteUrl } from '~src/site'
import {
  builtPages,
  htmlToText,
  pageExists,
  readBuiltFile,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The shareable and indexable surface of the built site: one distinct title and
 * description per route, a canonical URL from the site constants, the Open Graph
 * tags crawlers read, and the installed/favicon assets they point at. Every
 * expectation is read from the source of truth — `site` or Project frontmatter —
 * and pages are enumerated from the build itself, so a new route fails here
 * until it is given metadata.
 */

type Page = {
  /** The route path, as it appears in canonical and Open Graph URLs. */
  path: string
  html: string
  expected: { title: string; description: string }
}

function expectedFor(path: string): { title: string; description: string } {
  if (path === '/') return { title: site.defaultTitle, description: site.description }
  if (path === '/projects') {
    return { title: projectsIndex.title, description: projectsIndex.description }
  }

  const project = findProject(path.replace(/^\/projects\//, ''))
  if (!project) {
    throw new Error(
      `No metadata expectation for the built route ${path}. Add one to tests/launch.test.ts.`,
    )
  }
  return { title: `${project.title} | ${site.wordmark}`, description: project.summary }
}

function pages(): Page[] {
  return builtPages().map((page) => ({ ...page, expected: expectedFor(page.path) }))
}

function head(html: string): string {
  const start = html.indexOf('<head>')
  const end = html.indexOf('</head>')
  if (start === -1 || end === -1) throw new Error('The page is missing a <head> element.')
  return html.slice(start + '<head>'.length, end)
}

function tags(html: string, name: string): Array<Record<string, string>> {
  const attributes: Array<Record<string, string>> = []
  for (const tag of html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? []) {
    const attrs: Record<string, string> = {}
    for (const match of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) {
      attrs[match[1].toLowerCase()] = match[2]
    }
    attributes.push(attrs)
  }
  return attributes
}

function title(html: string): string {
  const match = html.match(/<title>([^<]*)<\/title>/)
  return match ? htmlToText(match[1]) : ''
}

function metaDescriptions(html: string): string[] {
  return tags(head(html), 'meta')
    .filter((meta) => meta.name === 'description')
    .map((meta) => htmlToText(meta.content ?? ''))
}

type JsonLd = { '@type'?: string; [key: string]: unknown }

/** Every JSON-LD block in a page, parsed. */
function jsonLd(html: string): JsonLd[] {
  return [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]) as JsonLd)
}

/** The Project a Case Study route was built from. */
function projectFor(path: string): Project {
  const project = findProject(path.replace(/^\/projects\//, ''))
  if (!project) throw new Error(`No Project for the built route ${path}.`)
  return project
}

/** The content of the first meta tag keyed by `property` or `name`, or an empty string. */
function metaContent(html: string, key: string): string {
  const meta = tags(head(html), 'meta').find((tag) => tag.property === key || tag.name === key)
  return meta ? htmlToText(meta.content ?? '') : ''
}

function canonical(html: string): string {
  const link = tags(head(html), 'link').find((tag) => tag.rel === 'canonical')
  return link?.href ?? ''
}

function headingLevels(html: string): number[] {
  return [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]))
}

/** Every `role="img"`/`img`/`video` without a name a screen reader can use. */
function unlabelledMedia(html: string): string[] {
  const offenders: string[] = []

  for (const tag of html.match(/<[^>]*\brole="img"[^>]*>/gi) ?? []) {
    if (!/aria-label="[^"]+"/.test(tag) && !/aria-labelledby="[^"]+"/.test(tag)) offenders.push(tag)
  }
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (!/\balt="[^"]+"/.test(tag)) offenders.push(tag)
  }
  for (const tag of html.match(/<video\b[^>]*>/gi) ?? []) {
    if (!/aria-label="[^"]+"/.test(tag)) offenders.push(tag)
  }

  return offenders
}

beforeAll(() => {
  requireFreshBuild()
})

describe('per-route metadata', () => {
  it('covers every built route: the home page, the Projects Index, and every Project', () => {
    const routes = builtPages().map((page) => page.path)
    expect(routes).toContain('/')
    expect(routes).toContain('/projects')
    for (const project of projects) expect(routes).toContain(`/projects/${project.slug}`)
    expect(routes).toHaveLength(projects.length + 2)
  })

  it('gives every built route a distinct title', () => {
    const titles = pages().map((page) => title(page.html))
    expect(titles).toEqual(pages().map((page) => page.expected.title))
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('gives every route a distinct description, with Case Studies from frontmatter', () => {
    const pageDescriptions = pages().map((page) => metaDescriptions(page.html))
    expect(pageDescriptions).toEqual(pages().map((page) => [page.expected.description]))
    expect(new Set(pageDescriptions.flat()).size).toBe(pageDescriptions.length)
  })

  it('points every route at its own canonical URL from the site constants', () => {
    expect(pages().map((page) => canonical(page.html))).toEqual(
      pages().map((page) => siteUrl(page.path)),
    )
  })

  it('mirrors the title and description into the Open Graph tags', () => {
    for (const page of pages()) {
      expect(metaContent(page.html, 'og:title')).toBe(page.expected.title)
      expect(metaContent(page.html, 'og:description')).toBe(page.expected.description)
      expect(metaContent(page.html, 'og:url')).toBe(siteUrl(page.path))
    }
  })

  it('gives every route the full social metadata set', () => {
    for (const page of pages()) {
      const ogType = page.path.startsWith('/projects/') ? 'article' : 'website'

      expect(metaContent(page.html, 'og:type')).toBe(ogType)
      expect(metaContent(page.html, 'og:image')).toBe(siteUrl(site.assets.openGraphImage))
      expect(metaContent(page.html, 'og:image:width')).toBe(String(site.assets.openGraphImageWidth))
      expect(metaContent(page.html, 'og:image:height')).toBe(
        String(site.assets.openGraphImageHeight),
      )
      expect(metaContent(page.html, 'og:image:alt')).toBe(`${site.wordmark} | ${site.role}`)
      expect(metaContent(page.html, 'twitter:card')).toBe('summary_large_image')
      expect(metaContent(page.html, 'twitter:title')).toBe(page.expected.title)
      expect(metaContent(page.html, 'twitter:description')).toBe(page.expected.description)
      expect(metaContent(page.html, 'theme-color')).toBe(site.themeColor)
    }
  })
})

describe('the share and install surface', () => {
  it('references a favicon and an apple-touch-icon that resolve in the build', () => {
    for (const page of pages()) {
      const links = tags(head(page.html), 'link')
      expect(links.find((link) => link.rel === 'icon')?.href).toBe(site.assets.favicon)
      expect(links.find((link) => link.rel === 'apple-touch-icon')?.href).toBe(
        site.assets.appleTouchIcon,
      )
    }

    expect(pageExists(site.assets.favicon)).toBe(true)
    expect(pageExists(site.assets.appleTouchIcon)).toBe(true)
  })

  it('points the Open Graph image at a registered asset that resolves in the build', () => {
    const image = siteUrl(site.assets.openGraphImage)
    for (const page of pages()) {
      expect(metaContent(page.html, 'og:image')).toBe(image)
    }

    expect(pageExists(new URL(image).pathname)).toBe(true)
  })
})

describe('structured data', () => {
  it('describes the owner as a Person on the home page', () => {
    const person = jsonLd(readClientPage('index.html')).find((block) => block['@type'] === 'Person')

    expect(person).toBeDefined()
    expect(person?.['@context']).toBe('https://schema.org')
    expect(person?.name).toBe(site.wordmark)
    expect(person?.jobTitle).toBe(site.role)
    expect(person?.url).toBe(siteUrl('/'))
    expect(person?.address).toEqual(
      expect.objectContaining({ '@type': 'PostalAddress', addressCountry: site.address.country }),
    )
    expect(person?.alumniOf).toEqual(
      expect.objectContaining({ '@type': 'CollegeOrUniversity', name: site.alumniOf }),
    )
    expect(person?.sameAs).toContain(site.github)
    expect(person?.sameAs).toContain(site.linkedin)
  })

  it('describes every Case Study with a BreadcrumbList and an Article', () => {
    for (const page of pages().filter((candidate) => candidate.path.startsWith('/projects/'))) {
      const project = projectFor(page.path)
      const blocks = jsonLd(page.html)
      const breadcrumb = blocks.find((block) => block['@type'] === 'BreadcrumbList')
      const article = blocks.find((block) => block['@type'] === 'Article')

      expect(breadcrumb?.itemListElement).toEqual([
        expect.objectContaining({ position: 1, item: siteUrl('/') }),
        expect.objectContaining({ position: 2, item: siteUrl('/projects') }),
        expect.objectContaining({ position: 3, item: siteUrl(page.path) }),
      ])

      expect(article?.headline).toBe(project.title)
      expect(article?.description).toBe(project.summary)
      expect(article?.mainEntityOfPage).toBe(siteUrl(page.path))
    }
  })
})

describe('the discoverability files', () => {
  it('lists exactly the shipped routes in the sitemap, from the site origin', () => {
    const locations = [...readBuiltFile('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    )

    expect(locations).toEqual(builtPages().map((page) => siteUrl(page.path)))
  })

  it('points robots.txt at the sitemap', () => {
    const robots = readBuiltFile('robots.txt')

    expect(robots).toContain('User-agent: *')
    expect(robots).toContain(`Sitemap: ${siteUrl('/sitemap.xml')}`)
  })
})

describe('the identity link', () => {
  it('marks every GitHub link as the owner with rel="me"', () => {
    for (const page of pages()) {
      const github = tags(page.html, 'a').filter((anchor) => anchor.href === site.github)

      expect(github.length).toBeGreaterThan(0)
      for (const anchor of github) {
        expect((anchor.rel ?? '').split(/\s+/)).toContain('me')
      }
    }
  })
})

describe('document structure', () => {
  it('gives every page one h1 and a heading order that never skips a level', () => {
    for (const page of pages()) {
      const levels = headingLevels(page.html)
      expect(levels.filter((level) => level === 1)).toHaveLength(1)
      expect(levels[0]).toBe(1)
      levels.forEach((level, index) => {
        if (index > 0) expect(level - levels[index - 1]).toBeLessThanOrEqual(1)
      })
    }
  })

  it('gives every image a name a screen reader can use', () => {
    expect(
      (readClientPage('index.html').match(/<[^>]*\brole="img"/gi) ?? []).length,
    ).toBeGreaterThan(0)
    for (const page of pages()) {
      expect(unlabelledMedia(page.html)).toEqual([])
    }
  })
})
