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
 * removing, or reordering a Project never needs a test change.
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

describe('the work section', () => {
  it('renders one card per Project, in the order the loader produces', () => {
    expect(cards()).toHaveLength(projects.length)

    const positions = projects.map((project) => workRegion().indexOf(project.title))
    expect(positions.every((position) => position !== -1)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it('presents the featured Project as the wide card', () => {
    const featured = projects.filter((project) => project.featured)
    expect(featured).toHaveLength(1)

    const featuredCards = cards().filter((html) => html.includes('data-featured'))
    expect(featuredCards).toHaveLength(1)
    expect(featuredCards[0]).toContain(featured[0].title)
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

  it('renders no repository or live link on a card', () => {
    for (const card of cards()) {
      expect(card).not.toMatch(/href=["']https?:/i)
    }
  })
})

describe('the Case Studies behind the work grid', () => {
  it.each(projects.map((project) => [project.title, project] as const))(
    'renders the header for %s',
    (_title, project) => {
      const text = htmlToText(readClientPage(`projects/${project.slug}/index.html`))
      expect(text).toContain(project.title)
      expect(text).toContain(project.summary)
    },
  )
})
