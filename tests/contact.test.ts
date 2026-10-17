import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { site } from '~src/site'
import {
  footerRegion,
  htmlToText,
  internalLinks,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The closing block, observed through the delivered home page. The contact ask
 * lives in the footer rather than in a section of the page body, so this reads
 * the footer landmark. The email is asserted against the site constant rather
 * than a literal, so swapping a Placeholder for a real value stays a one-line
 * change. Nothing here depends on classes or DOM structure.
 */

beforeAll(() => {
  requireFreshBuild()
})

function home(): string {
  return readClientPage('index.html')
}

/** The closing block: from the footer landmark to the end of the page body. */
function closing(): string {
  return footerRegion(home())
}

/** Every anchor in the closing block, in document order. */
function anchors(): string[] {
  return [...closing().matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((match) => match[1] ?? '')
}

describe('the closing block', () => {
  it('closes the page after the last section', () => {
    expect(home().indexOf('id="contact"')).toBeGreaterThan(home().indexOf('id="experience"'))
  })

  it('carries the ask, the address, and the CV action', () => {
    const text = htmlToText(closing())
    expect(text).toContain("Let's talk")
    expect(text).toContain(site.email)
    expect(text).toContain('Download CV')
  })

  it("makes the address a mailto link that opens the visitor's own client", () => {
    const region = closing()
    expect(htmlToText(region)).toContain(site.email)
    expect(region).toContain(`href="mailto:${site.email}"`)
  })

  it('offers the address as its only link, so nothing competes with the ask', () => {
    expect(anchors()).toEqual([`mailto:${site.email}`])
    expect(internalLinks(closing())).toEqual([])
  })

  it('carries the CV action, which references no CV file', () => {
    const region = closing()
    expect(htmlToText(region)).toContain('Download CV')
    expect(region).not.toMatch(/href=["'][^"']*\.pdf/i)
  })
})
