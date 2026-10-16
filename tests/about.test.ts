import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { toolGlyphs } from '~src/components/toolGlyphs'
import { about } from '~src/content/about'
import {
  homeSection,
  htmlToText,
  readClientPage,
  requireFreshBuild,
  toolMarkBefore,
} from './built-output'

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
    expect(summary).toMatch(/full-stack engineer/i)
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

  it('states the degree in the summary', () => {
    const summary = paragraphs()[0] ?? ''
    expect(summary).toContain('BSIT')
    expect(summary).toContain('University of San Carlos')
    expect(summary.match(/University of San Carlos/g)).toHaveLength(1)
  })

  it('renders the portrait as a labelled Media Placeholder', () => {
    expect(aboutRegion()).toContain('aria-label="Portrait"')
  })
})

/** The stack list items of the About section, each bounded by `</li>`. */
function stackItems(): string[] {
  return [...homeSection('about', 'work').matchAll(/<li\b[\s\S]*?<\/li>/g)].map((match) => match[0])
}

describe('the About stack marks', () => {
  it('shows a mark for React and none for the combined TypeScript / JavaScript label', () => {
    const itemFor = (tool: string) => stackItems().find((item) => htmlToText(item) === tool) ?? ''

    expect(toolMarkBefore(itemFor('React'), 'React')).toMatch(/aria-hidden="true"/)
    // No single mark represents both languages, so the combined label stays text-only.
    expect(toolMarkBefore(itemFor('TypeScript / JavaScript'), 'TypeScript / JavaScript')).toBeNull()
  })

  it('renders a decorative currentColor mark beside every tool that has one, and the name alone otherwise', () => {
    const items = stackItems()
    for (const group of about.stack) {
      for (const tool of group.tools) {
        const item = items.find((html) => htmlToText(html) === tool)
        expect(item, `Expected a stack item for "${tool}".`).toBeTruthy()

        const mark = toolMarkBefore(item ?? '', tool)
        if (toolGlyphs[tool]) {
          expect(mark, `Expected a mark before "${tool}".`).not.toBeNull()
          expect(mark).toContain('aria-hidden="true"')
          expect(mark).toContain('focusable="false"')
          expect(mark).toContain('fill="currentColor"')
        } else {
          expect(mark, `Expected no mark before "${tool}".`).toBeNull()
        }

        // The mark adds no text of its own; the name is the whole label.
        expect(htmlToText(item ?? '')).toBe(tool)
      }
    }
  })
})
