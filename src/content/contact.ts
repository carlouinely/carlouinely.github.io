import { site } from '~src/site'

/**
 * The closing block's copy. The availability label opens it as a sentence rather
 * than being restated in fresh words, so the hero badge and the closing ask can
 * never drift apart. The invitation after it answers the two reasons a visitor
 * reaches the bottom of a page: they are hiring, or they want to talk about the
 * work they just read.
 */
export const contact = {
  ask: `${site.availability}. Tell me what you're hiring for, or just say hello.`,
} as const
