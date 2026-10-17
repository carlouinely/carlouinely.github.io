import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { site } from '~src/site'
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

/** The primary nav landmark, from `<nav` through `</nav>`. */
function primaryNav(): string {
  const match = home().match(/<nav\b[^>]*aria-label="Primary"[^>]*>[\s\S]*?<\/nav>/)
  if (!match) throw new Error('The home page has no primary nav.')
  return match[0]
}

/** The menu panel, from the `id` the trigger controls through its closing list tag. */
function menuPanel(id: string): string {
  const nav = primaryNav()
  const start = nav.indexOf(`id="${id}"`)
  const end = nav.indexOf('</ul>', start)
  if (start === -1 || end === -1) throw new Error(`Could not find the menu panel "${id}".`)
  return nav.slice(start, end)
}

/** The collapsed-menu trigger, and the panel id it controls. */
function menuTrigger(): { html: string; controls: string } {
  const html = primaryNav().match(/<button\b[^>]*aria-controls="[^"]+"[^>]*>/)?.[0] ?? ''
  const controls = html.match(/aria-controls="([^"]+)"/)?.[1] ?? ''
  if (!html || !controls) throw new Error('The primary nav has no menu trigger.')
  return { html, controls }
}

/** The footer landmark through to the end of the page body. */
function footerRegion(): string {
  const html = home()
  const start = html.indexOf('<footer')
  const end = html.indexOf('</body>')
  if (start === -1 || end === -1 || end < start) throw new Error('The home page has no footer.')
  return html.slice(start, end)
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

    expect(fragments).toEqual(expect.arrayContaining(['work', 'experience', 'about', 'how-i-work']))
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

  it("renders the sections in the order About me, How I work, Things I've built, Where I've worked, Let's talk", () => {
    const html = home()
    const order = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1])

    expect(order).toEqual(['about', 'how-i-work', 'work', 'experience', 'contact'])
    expect(html.indexOf('aria-label="Hero brand artwork"')).toBeLessThan(html.indexOf('id="about"'))
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

  it('renders the footer with the wordmark, a copyright line, and exactly five entry points', () => {
    const html = home()
    const text = htmlToText(html)
    expect(text).toContain('carlouinely')
    expect(text).toMatch(/©\s*\d{4}\s*carlouinely/)

    const footer = footerRegion()
    expect(footer.match(/<a\b/g) ?? []).toHaveLength(5)

    const links = internalLinks(footer)
    expect(links).toContain('/projects')
    expect(links).toContain('/#about')
    expect(links).toContain('/#experience')
    expect(footer).toContain(`href="mailto:${site.email}"`)
    expect(footer).toContain(`href="${site.github}"`)
  })

  it('ships no build credit in the footer', () => {
    expect(htmlToText(footerRegion())).not.toContain('Built with')
  })
})

describe('the responsive nav', () => {
  it('collapses below the medium breakpoint behind a trigger that controls the panel', () => {
    const { html, controls } = menuTrigger()
    expect(html).toContain('aria-expanded="false"')
    expect(primaryNav()).toContain(`id="${controls}"`)
  })

  it('names the collapsed links and the Projects Index in the panel', () => {
    const links = internalLinks(menuPanel(menuTrigger().controls))
    for (const href of ['/#about', '/#how-i-work', '/#work', '/#experience', '/projects']) {
      expect(links).toContain(href)
    }
  })

  it('keeps the CV action outside the panel so it stays visible', () => {
    expect(menuPanel(menuTrigger().controls)).not.toContain('Download CV')
    expect(primaryNav()).toContain('Download CV')
  })

  it('gives the trigger an accessible name', () => {
    expect(menuTrigger().html).toMatch(/aria-label="[^"]+"/)
  })
})
