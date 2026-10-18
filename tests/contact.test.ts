import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { contact } from '~src/content/contact'
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
 * the footer landmark. The email and the line above it are asserted against the
 * site constants rather than literals, so swapping a Placeholder for a real
 * value stays a one-line change. Nothing here depends on classes or DOM
 * structure.
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

  it('carries the ask, the line that supports it, and the address', () => {
    const text = htmlToText(closing())
    expect(text).toContain("Let's talk")
    expect(text).toContain(contact.ask)
    expect(text).toContain(site.email)
  })

  it("makes the address a mailto link that opens the visitor's own client", () => {
    const region = closing()
    expect(htmlToText(region)).toContain(site.email)
    expect(region).toContain(`href="mailto:${site.email}"`)
  })

  it('keeps the address the ask, with the profiles the only other links', () => {
    expect(anchors()).toEqual([`mailto:${site.email}`, site.github, site.linkedin])
    expect(internalLinks(closing())).toEqual([])
  })

  it('leaves the CV action to the hero, so the footer closes on contact alone', () => {
    const region = closing()
    expect(htmlToText(region)).not.toContain('Download CV')
    expect(region).not.toMatch(/href=["'][^"']*\.pdf/i)
  })
})
