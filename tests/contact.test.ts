import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { site } from '~src/site'
import { footerRegion, htmlToText, readClientPage, requireFreshBuild } from './built-output'

/**
 * The closing block, observed through the delivered home page. The contact ask
 * and the site map live in one footer rather than in a section of the page body
 * plus a footer, so this reads the footer landmark. Both volatile values (the
 * email and the GitHub URL) are asserted against the site constants rather than
 * literals, so swapping a Placeholder for a real value stays a one-line change.
 * Nothing here depends on classes or DOM structure.
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

describe('the closing block', () => {
  it('closes the page after the last section', () => {
    expect(home().indexOf('id="contact"')).toBeGreaterThan(home().indexOf('id="experience"'))
  })

  it('carries the heading, the address, the GitHub link, and the CV action', () => {
    const text = htmlToText(closing())
    expect(text).toContain("Let's talk")
    expect(text).toContain(site.email)
    expect(text).toContain('Download CV')
    expect(closing()).toContain(`href="${site.github}"`)
  })

  it("makes the address a mailto link that opens the visitor's own client", () => {
    const region = closing()
    expect(htmlToText(region)).toContain(site.email)
    expect(region).toContain(`href="mailto:${site.email}"`)
  })

  it('carries the CV action, which references no CV file', () => {
    const region = closing()
    expect(htmlToText(region)).toContain('Download CV')
    expect(region).not.toMatch(/href=["'][^"']*\.pdf/i)
  })
})
