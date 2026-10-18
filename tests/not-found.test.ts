import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { siteUrl } from '~src/site'
import {
  htmlToText,
  internalLinks,
  pageExists,
  readBuiltFile,
  requireFreshBuild,
} from './built-output'

/**
 * The Not Found page, observed through the build the static host publishes.
 * GitHub Pages serves `404.html` for any unknown path, so the page is asserted
 * where a visitor actually meets it rather than at a `/404` route.
 */

beforeAll(() => {
  requireFreshBuild()
})

function notFound(): string {
  return readBuiltFile('404.html')
}

describe('the Not Found page', () => {
  it('ships a 404.html the static host can serve for an unknown URL', () => {
    expect(pageExists('/404')).toBe(true)
  })

  it('names the page and gives the visitor the two ways back', () => {
    const html = notFound()
    const text = htmlToText(html)

    expect(text).toContain('404')
    expect(text).toContain('Page not found')
    expect(internalLinks(html)).toEqual(expect.arrayContaining(['/', '/projects']))
  })

  it('asks search engines not to index a missing URL', () => {
    const html = notFound()
    expect(html).toContain('name="robots"')
    expect(html).toContain('noindex')
  })

  it('gives the page one h1 and no em dash, like every page here', () => {
    const html = notFound()
    expect(html.match(/<h1\b/g) ?? []).toHaveLength(1)
    expect(html).not.toContain('\u2014')
    expect(html).not.toContain('&mdash;')
  })

  it('stays out of the sitemap', () => {
    expect(readBuiltFile('sitemap.xml')).not.toContain(siteUrl('/404'))
  })
})
