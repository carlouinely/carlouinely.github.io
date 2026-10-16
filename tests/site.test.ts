import { beforeAll, describe, expect, it } from 'vite-plus/test'
import {
  htmlToText,
  internalLinks,
  pageExists,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The suite reads the real prerendered site in `dist/client`, not fixtures.
 * It asserts only what a visitor can observe — rendered text, links, page
 * existence — so the whole design language can change without a test changing.
 */

const SLUG = 'darkroom-system'
const CASE_STUDY = `projects/${SLUG}/index.html`

beforeAll(() => {
  requireFreshBuild()
})

describe('home page', () => {
  it('links to the Case Study at its slug', () => {
    const links = internalLinks(readClientPage('index.html'))
    expect(links).toContain(`/projects/${SLUG}`)
  })

  it('resolves every internal link to a built page', () => {
    const broken = internalLinks(readClientPage('index.html')).filter((href) => !pageExists(href))
    expect(broken).toEqual([])
  })

  it('produces no page and no link for the _-prefixed template', () => {
    const links = internalLinks(readClientPage('index.html'))
    expect(links.some((href) => href.includes('_template'))).toBe(false)
    expect(pageExists('/projects/_template')).toBe(false)
  })
})

describe('the Darkroom System Case Study', () => {
  it('exists in the built output at its slug', () => {
    expect(pageExists(`/projects/${SLUG}`)).toBe(true)
  })

  it('renders its frontmatter title and summary in the header', () => {
    const text = htmlToText(readClientPage(CASE_STUDY))
    expect(text).toContain('Darkroom System')
    expect(text).toContain('A film photography workflow')
  })

  it('renders its MDX body as prose', () => {
    const text = htmlToText(readClientPage(CASE_STUDY))
    expect(text).toContain('Why a darkroom in the browser')
    expect(text).toContain('Density readings stay attached to the frame')
  })

  it('renders the body link to the source repository', () => {
    const html = readClientPage(CASE_STUDY)
    expect(html).toContain('href="https://github.com/carlouinely/darkroom-system"')
  })

  it('credits DEVGO Studio in the header metadata', () => {
    const text = htmlToText(readClientPage(CASE_STUDY))
    expect(text).toContain('DEVGO Studio')
  })
})
