import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { cardsIn, homeSection, htmlToText, readClientPage, requireFreshBuild } from './built-output'

/**
 * The Experience section, observed through the delivered home page. The entry
 * copy is asserted as text a recruiter reads; nothing here depends on classes,
 * component names, or prop shapes.
 */

beforeAll(() => {
  requireFreshBuild()
})

/** The employer, title, dates, engagement, and one outcome from the real history. */
const ENTRIES = [
  {
    employer: 'DEVGO Studio',
    title: 'Software Engineer',
    dates: ['Mar 2024 to Aug 2025', 'Mar 2026 to now'],
    engagement: 'Freelance',
    outcome: 'offline-capable ERP',
  },
  {
    employer: 'Zaigo',
    title: 'Software Engineer',
    dates: ['Sep 2025 to Feb 2026'],
    engagement: 'Full-time',
    outcome: 'long-term retainer',
  },
  {
    employer: 'Project 11 Advertising',
    title: 'DevOps Engineer',
    dates: ['May 2025 to Aug 2025'],
    engagement: 'Freelance',
    outcome: 'monitoring',
  },
  {
    employer: 'Velez College Supreme Student Council',
    title: 'WordPress Developer',
    dates: ['Sep 2024 to Oct 2024'],
    engagement: 'Freelance',
    outcome: 'e-commerce platform',
  },
] as const

/** The Experience landmark and everything up to the next section. */
function experienceRegion(): string {
  return homeSection('experience', 'contact')
}

/** The rendered timeline entries, in document order. */
function entries(): string[] {
  return cardsIn(experienceRegion())
}

describe('the Experience section', () => {
  it('renders one entry per engagement', () => {
    expect(entries()).toHaveLength(ENTRIES.length)
  })

  it('lists the engagements in reverse-chronological order', () => {
    const html = home()
    const positions = ENTRIES.map((entry) => html.indexOf(entry.employer))
    expect(positions.every((position) => position !== -1)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it.each(ENTRIES.map((entry) => [entry.employer, entry] as const))(
    'shows employer, title, dates, engagement, and outcome bullets for %s',
    (_employer, entry) => {
      const entryHtml = entries().find((html) => html.includes(entry.employer))
      expect(entryHtml, `an entry for ${entry.employer}`).toBeDefined()

      const text = htmlToText(entryHtml ?? '')
      expect(text).toContain(entry.employer)
      expect(text).toContain(entry.title)
      for (const date of entry.dates) expect(text).toContain(date)
      expect(text).toContain(entry.engagement)
      expect(text).toContain(entry.outcome)

      const bullets = (entryHtml ?? '').match(/<li\b/g) ?? []
      expect(bullets.length).toBeGreaterThanOrEqual(2)
    },
  )

  it('presents DEVGO Studio once, merged across both engagement periods', () => {
    const text = htmlToText(experienceRegion())
    expect(text.match(/DEVGO Studio/g)).toHaveLength(1)

    const devgo = entries().find((html) => html.includes('DEVGO Studio')) ?? ''
    const devgoText = htmlToText(devgo)
    expect(devgoText).toContain('Mar 2024 to Aug 2025')
    expect(devgoText).toContain('Mar 2026 to now')
    expect(devgoText).toContain('Freelance')
  })

  it('tags Zaigo as full-time and the other engagements as freelance', () => {
    const zaigo = entries().find((html) => html.includes('Zaigo')) ?? ''
    expect(htmlToText(zaigo)).toContain('Full-time')
    expect(htmlToText(zaigo)).not.toContain('Freelance')

    for (const entry of ENTRIES.filter((entry) => entry.engagement === 'Freelance')) {
      const html = entries().find((candidate) => candidate.includes(entry.employer)) ?? ''
      expect(htmlToText(html)).toContain('Freelance')
    }
  })
})

function home(): string {
  return readClientPage('index.html')
}
