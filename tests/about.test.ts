import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { htmlToText, readClientPage, requireFreshBuild } from './built-output'

/**
 * The About section, observed through the delivered home page. The summary,
 * stack, working-style prose, degree, and the labelled portrait Placeholder are
 * asserted as a visitor reads them.
 */

beforeAll(() => {
  requireFreshBuild()
})

/** The About landmark and everything after it on the home page. */
function aboutRegion(): string {
  const html = readClientPage('index.html')
  const start = html.indexOf('id="about"')
  if (start === -1) throw new Error('Could not find the About landmark on the home page.')
  return html.slice(start)
}

/** The text of every paragraph in the About region, in document order. */
function paragraphs(): string[] {
  return [...aboutRegion().matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) =>
    htmlToText(match[1]),
  )
}

describe('the About section', () => {
  it('renders the summary with no duration claim', () => {
    const summary = paragraphs()[0] ?? ''
    expect(summary).toContain('Full-stack engineer')
    expect(summary).not.toMatch(/\b\d+\+?\s*years?\b/i)
    expect(summary).not.toMatch(/\byears of experience\b/i)
  })

  it('groups the stack into Frontend, Backend, and Infra', () => {
    const text = htmlToText(aboutRegion())
    for (const group of ['Frontend', 'Backend', 'Infra']) expect(text).toContain(group)
    for (const tool of [
      'TypeScript',
      'JavaScript',
      'React',
      'TanStack',
      'Next.js',
      'ShadCN',
      'Drizzle ORM',
      'Better Auth',
      'Postgres',
      'Docker',
      'Vite+',
    ]) {
      expect(text).toContain(tool)
    }
  })

  it('renders "How I work" as prose covering the toolchain and the environment', () => {
    const text = htmlToText(aboutRegion())
    expect(text).toContain('How I work')
    for (const term of ['DeepSeek', 'OpenCode Go', 'Pi Coding Agent', 'agent skills', 'MCP']) {
      expect(text).toContain(term)
    }
    for (const term of ['Fedora Linux', 'NeoVim', 'Zed']) expect(text).toContain(term)

    const prose = paragraphs().filter((paragraph) => /DeepSeek|Fedora Linux/.test(paragraph))
    expect(prose.join(' ')).toContain('DeepSeek')
    expect(prose.join(' ')).toContain('Fedora Linux')
  })

  it('states the degree in a single line', () => {
    const text = htmlToText(aboutRegion())
    expect(text).toContain('University of San Carlos')
    expect(text).toContain('Information Technology')
    expect(text.match(/University of San Carlos/g)).toHaveLength(1)
  })

  it('renders the portrait as a labelled Media Placeholder', () => {
    expect(aboutRegion()).toContain('aria-label="Portrait"')
  })
})
