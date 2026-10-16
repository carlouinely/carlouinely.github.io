import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { htmlToText, readClientPage, requireFreshBuild } from './built-output'

/**
 * The Experience section, observed through the delivered home page. The card
 * copy is asserted as text a recruiter reads; nothing here depends on classes,
 * component names, or prop shapes.
 */

beforeAll(() => {
  requireFreshBuild()
})

/** The employer, title, dates, engagement, and one outcome from the real history. */
const CARDS = [
  {
    employer: 'DEVGO Studio',
    title: 'Software Engineer',
    dates: ['Mar 2024 – Aug 2025', 'Mar 2026 – present'],
    engagement: 'Freelance',
    outcome: 'offline-capable ERP',
  },
  {
    employer: 'Zaigo',
    title: 'Software Engineer',
    dates: ['Sep 2025 – Feb 2026'],
    engagement: 'Full-time',
    outcome: 'long-term retainer',
  },
  {
    employer: 'Project 11 Advertising',
    title: 'DevOps Engineer',
    dates: ['May 2025 – Aug 2025'],
    engagement: 'Freelance',
    outcome: 'monitoring',
  },
  {
    employer: 'Velez College Supreme Student Council',
    title: 'WordPress Developer',
    dates: ['Sep 2024 – Oct 2024'],
    engagement: 'Freelance',
    outcome: 'e-commerce platform',
  },
] as const

/** The Experience landmark and everything up to the next section. */
function experienceRegion(): string {
  const html = readClientPage('index.html')
  const start = html.indexOf('id="experience"')
  const end = html.indexOf('id="about"')
  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      'Could not find the Experience landmark before the About landmark on the home page.',
    )
  }
  return html.slice(start, end)
}

/** The rendered cards, in document order. */
function cards(): string[] {
  return experienceRegion()
    .split(/(?=<article\b)/)
    .slice(1)
}

describe('the Experience section', () => {
  it('renders one card per engagement', () => {
    expect(cards()).toHaveLength(CARDS.length)
  })

  it('lists the engagements in reverse-chronological order', () => {
    const html = home()
    const positions = CARDS.map((card) => html.indexOf(card.employer))
    expect(positions.every((position) => position !== -1)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it.each(CARDS.map((card) => [card.employer, card] as const))(
    'shows employer, title, dates, engagement, and outcome bullets for %s',
    (_employer, card) => {
      const cardHtml = cards().find((html) => html.includes(card.employer))
      expect(cardHtml, `a card for ${card.employer}`).toBeDefined()

      const text = htmlToText(cardHtml ?? '')
      expect(text).toContain(card.employer)
      expect(text).toContain(card.title)
      for (const date of card.dates) expect(text).toContain(date)
      expect(text).toContain(card.engagement)
      expect(text).toContain(card.outcome)

      const bullets = (cardHtml ?? '').match(/<li\b/g) ?? []
      expect(bullets.length).toBeGreaterThanOrEqual(2)
    },
  )

  it('presents DEVGO Studio once, merged across both engagement periods', () => {
    const text = htmlToText(experienceRegion())
    expect(text.match(/DEVGO Studio/g)).toHaveLength(1)

    const devgo = cards().find((html) => html.includes('DEVGO Studio')) ?? ''
    const devgoText = htmlToText(devgo)
    expect(devgoText).toContain('Mar 2024 – Aug 2025')
    expect(devgoText).toContain('Mar 2026 – present')
    expect(devgoText).toContain('Freelance')
  })

  it('tags Zaigo as full-time and the other engagements as freelance', () => {
    const zaigo = cards().find((html) => html.includes('Zaigo')) ?? ''
    expect(htmlToText(zaigo)).toContain('Full-time')
    expect(htmlToText(zaigo)).not.toContain('Freelance')

    for (const card of CARDS.filter((card) => card.engagement === 'Freelance')) {
      const html = cards().find((entry) => entry.includes(card.employer)) ?? ''
      expect(htmlToText(html)).toContain('Freelance')
    }
  })
})

function home(): string {
  return readClientPage('index.html')
}
