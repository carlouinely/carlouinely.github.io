/**
 * The owner's location, kept structured so the hero copy and the Person
 * structured data can never disagree about where they are.
 */
const address = { locality: 'Cebu', country: 'Philippines' } as const

/**
 * Every volatile site value lives here. Swapping the wordmark, email, GitHub
 * URL, canonical origin, title, description, availability label, or shared
 * brand asset is a one-file edit; nothing else hard-codes them.
 */
export const site = {
  /** The brand name, and the only name the site uses. */
  wordmark: 'carlouinely',

  role: 'Full-Stack Engineer',

  location: `${address.locality}, ${address.country}`,

  address,

  // TODO(placeholder:email): replace with a real, deliverable address before launch.
  // The address on the current CV must never enter git history. See PLACEHOLDERS.md.
  email: 'hello@carlouinely.example',

  github: 'https://github.com/carlouinely',

  linkedin: 'https://www.linkedin.com/in/carlouinely',

  // TODO(placeholder:origin): replace with the custom domain's origin once it exists. See PLACEHOLDERS.md.
  origin: 'https://carlouinely.github.io',

  defaultTitle: 'carlouinely | Full-Stack Engineer',

  description:
    "Full-stack engineer in Cebu, Philippines. I build web apps end to end and I'm open to full-time work.",

  availability: 'Open to full-time roles',

  /** The university the About copy names, for the Person structured data. */
  alumniOf: 'University of San Carlos',

  /** The browser chrome colour, matching the Pumice page background. */
  themeColor: '#e2e2df',

  /** Shared brand assets referenced from the document head. */
  assets: {
    // TODO(placeholder:favicon): replace with a real mark. See PLACEHOLDERS.md.
    favicon: '/favicon.svg',
    // TODO(placeholder:apple-touch-icon): replace with a real 180px square. See PLACEHOLDERS.md.
    appleTouchIcon: '/apple-touch-icon.png',
    // TODO(placeholder:open-graph-image): replace with a real share image. See PLACEHOLDERS.md.
    openGraphImage: '/og-image.png',
    // Declared in the head so crawlers can lay out a share card without fetching it.
    openGraphImageWidth: 1200,
    openGraphImageHeight: 630,
  },
} as const

/**
 * The Projects Index at `/projects` is a distinct indexed surface, so its title
 * and description live beside the rest of the volatile site values rather than
 * being hand-written in the route and the metadata test separately.
 */
export const projectsIndex = {
  title: `Projects | ${site.wordmark}`,
  description:
    "Every project I've built, newest first, with the kind of build it is, the stack behind it, and a link to the full case study.",
} as const

/** The absolute URL for a site path, for canonical and Open Graph tags. */
export function siteUrl(path = '/'): string {
  return `${site.origin.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
