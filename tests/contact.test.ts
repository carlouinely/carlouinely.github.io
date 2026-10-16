import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { site } from '~src/site'
import { homeSectionUntil, htmlToText, readClientPage, requireFreshBuild } from './built-output'

/**
 * The contact strip, observed through the delivered home page. Both volatile
 * values (the email and the GitHub URL) are asserted against the site
 * constants rather than literals, so swapping a Placeholder for a real value
 * stays a one-line change. Nothing here depends on classes or DOM structure.
 */

beforeAll(() => {
  requireFreshBuild()
})

function home(): string {
  return readClientPage('index.html')
}

/** The contact landmark through to the end of the page body. */
function contactRegion(): string {
  return homeSectionUntil('contact', '</main>')
}

describe('the contact strip', () => {
  it('closes the page after the About section', () => {
    expect(home().indexOf('id="contact"')).toBeGreaterThan(home().indexOf('id="about"'))
  })

  it('carries the heading, the email, the GitHub link, and the CV action', () => {
    const text = htmlToText(contactRegion())
    expect(text).toContain("Let's talk")
    expect(text).toContain(site.email)
    expect(text).toContain('Download CV')
    expect(contactRegion()).toContain(`href="${site.github}"`)
  })

  it('renders the registered email as plain text, not a mailto link', () => {
    const region = contactRegion()
    expect(htmlToText(region)).toContain(site.email)
    expect(region).not.toContain('mailto:')
  })

  it('carries the CV action, which references no CV file', () => {
    const region = contactRegion()
    expect(htmlToText(region)).toContain('Download CV')
    expect(region).not.toMatch(/href=["'][^"']*\.pdf/i)
  })
})
