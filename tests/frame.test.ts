import { beforeAll, describe, expect, it } from 'vite-plus/test'
import {
  elementIds,
  htmlToText,
  internalLinks,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The site frame — nav, hero, footer, and the Media primitive — observed only
 * through the delivered home page, so the design can change without a test.
 */

beforeAll(() => {
  requireFreshBuild()
})

function home(): string {
  return readClientPage('index.html')
}

describe('the home page frame', () => {
  it('renders the wordmark and the display claim', () => {
    const text = htmlToText(home())
    expect(text).toContain('carlouinely')
    expect(text).toContain('FULL-STACK ENGINEER')
  })

  it('renders the location and the availability badge', () => {
    const text = htmlToText(home())
    expect(text).toContain('Cebu, Philippines')
    expect(text).toContain('Open to full-time roles')
  })

  it('points every nav anchor at an id that exists on the page', () => {
    const ids = elementIds(home())
    const fragments = internalLinks(home())
      .filter((href) => href.includes('#'))
      .map((href) => href.split('#')[1])

    expect(fragments).toEqual(expect.arrayContaining(['work', 'experience', 'about']))
    expect(fragments.filter((fragment) => !ids.includes(fragment))).toEqual([])
  })

  it('renders the hero brand artwork as a labelled Media block', () => {
    expect(home()).toContain('aria-label="Hero brand artwork"')
  })

  it('ships no development-only Placeholder markers', () => {
    const html = home()
    expect(html).not.toContain('data-placeholder')
    expect(html).not.toContain('Placeholder:')
  })

  it('renders the CV action inert, not as an anchor', () => {
    const html = home()
    const anchorBodies = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1])

    expect(htmlToText(html)).toContain('Download CV')
    expect(/<button\b[^>]*\bdisabled/.test(html)).toBe(true)
    expect(anchorBodies.some((body) => body.includes('Download CV'))).toBe(false)
  })

  it('links the GitHub glyph and the email action at the registered values', () => {
    const html = home()
    expect(html).toContain('href="https://github.com/carlouinely"')
    expect(html).toContain('href="mailto:hello@carlouinely.example"')
  })

  it('renders the footer with the wordmark, a copyright line, and a build credit', () => {
    const text = htmlToText(home())
    expect(text).toContain('carlouinely')
    expect(text).toMatch(/©\s*\d{4}\s*carlouinely/)
    expect(text).toContain('Built with TanStack Start, React, and Vite+')
  })
})
