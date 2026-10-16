import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { projects } from '~src/content/index'
import {
  cardsIn,
  homeSection,
  htmlToText,
  internalLinks,
  pageExists,
  readClientPage,
  requireFreshBuild,
} from './built-output'

/**
 * The work section and the Case Studies behind it, observed through the built
 * output. The expected Projects come from the content loader, so adding,
 * removing, or reordering a Project never needs a test change; each Case Study
 * still needs a body assertion in `CASE_STUDY`, and the coverage test fails
 * until one is added.
 */

beforeAll(() => {
  requireFreshBuild()
})

/** The work landmark and everything up to the next section. */
function workRegion(): string {
  return homeSection('work', 'experience')
}

/** The rendered cards, in document order. */
function cards(): string[] {
  return cardsIn(workRegion())
}

function cardFor(title: string): string {
  return cards().find((html) => html.includes(title)) ?? ''
}

/**
 * What each Case Study must prove in the built page: a section heading and a
 * distinctive sentence from its MDX body, and the label of its inline media
 * Placeholder when it has one. Keyed by slug so the coverage test below fails
 * when a Project is added without a body assertion.
 */
type CaseStudyExpectation = {
  body: readonly string[]
  media?: string
}

const CASE_STUDY: Record<string, CaseStudyExpectation> = {
  'darkroom-system': {
    body: ['Why a darkroom in the browser', 'Density readings stay attached to the frame'],
  },
  wildfire: {
    body: [
      'Announcements used to move one screen at a time',
      'Reusing the hardware a campus already owns',
    ],
    media: 'WILDFIRE dashboard screenshot',
  },
  'agentic-lead-pipeline': {
    body: ['Cold outreach starts with the list', 'The mockup is the first contact'],
    media: 'Generated mockup email',
  },
  'artist-seo-site': {
    body: ['A portfolio search engines could not read', 'Structure before keyword lists'],
    media: 'Artist site homepage',
  },
  'velez-college-merch-store': {
    body: ['Merch sold by hand', 'Choosing a stack students could maintain'],
    media: 'Merch store storefront',
  },
}

/** Every Case Study with inline media: its slug and its Placeholder label. */
const CASE_STUDY_MEDIA = Object.entries(CASE_STUDY).flatMap(([slug, expectation]) =>
  expectation.media ? [[slug, expectation.media] as const] : [],
)

function caseStudyHtml(slug: string): string {
  return readClientPage(`projects/${slug}/index.html`)
}

function caseStudyText(slug: string): string {
  return htmlToText(caseStudyHtml(slug))
}

describe('the work section', () => {
  it('renders one card per Project, in the order the loader produces', () => {
    expect(cards()).toHaveLength(projects.length)

    const positions = projects.map((project) => workRegion().indexOf(project.title))
    expect(positions.every((position) => position !== -1)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it('links every card to a Case Study that exists in the built output', () => {
    for (const project of projects) {
      expect(internalLinks(cardFor(project.title))).toContain(`/projects/${project.slug}`)
      expect(pageExists(`/projects/${project.slug}`)).toBe(true)
    }
  })

  it('renders each thumbnail as a Placeholder until a real image exists', () => {
    for (const project of projects) {
      const card = cardFor(project.title)
      if (project.thumbnail) {
        expect(card).toContain(`src="${project.thumbnail}"`)
      } else {
        expect(card).toContain(`aria-label="${project.title} thumbnail"`)
      }
    }
  })

  it('renders no repository link on a card', () => {
    for (const card of cards()) {
      expect(card).not.toMatch(/href=["']https?:/i)
    }
  })
})

describe('the Case Studies behind the work grid', () => {
  it('has a body assertion for every Project', () => {
    const uncovered = projects.map((project) => project.slug).filter((slug) => !CASE_STUDY[slug])
    expect(uncovered).toEqual([])
  })

  it.each(projects.map((project) => [project.title, project] as const))(
    'renders the header for %s',
    (_title, project) => {
      const text = caseStudyText(project.slug)
      expect(text).toContain(project.title)
      expect(text).toContain(project.summary)
    },
  )

  it.each(projects.map((project) => [project.title, project] as const))(
    'renders the body text of %s',
    (_title, project) => {
      const text = caseStudyText(project.slug)
      for (const phrase of CASE_STUDY[project.slug]?.body ?? []) expect(text).toContain(phrase)
    },
  )

  it.each(CASE_STUDY_MEDIA)(
    'renders the inline media of %s as a labelled Placeholder in the production build',
    (slug, label) => {
      const html = caseStudyHtml(slug)
      expect(html).toContain('role="img"')
      expect(html).toContain(`aria-label="${label}"`)
      expect(html).not.toContain('data-placeholder')
    },
  )
})
